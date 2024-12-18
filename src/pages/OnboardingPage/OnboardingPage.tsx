import { gql, useQuery, useMutation } from '@apollo/client';
import { Space, Steps, Typography, Form, Spin } from '@arco-design/web-react';
import type { PaymentMethod } from '@stripe/stripe-js';
import dayjs from 'dayjs';
import { sortBy } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Message from '@/components/Message';

import styles from './OnboardingPage.module.less';
import StepOneForm from './StepOneForm';
import StepThreeForm from './StepThreeForm ';
import StepTwoForm from './StepTwoForm';

import { useAppStore } from '@/stores/useAppStore';

import { UrlService } from '@/services';

import { getErrorMessage } from '@/utils/error.utils';

import { navigateWorkspacePage } from '@/navigation';

import Icons from '@/assets/icons';

import Configs from '@/configs';

import {
  CompanyMemberType,
  SubscriptionPriceInterval,
  OnboardingPageQuery,
  OnboardingPageQueryVariables,
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  OnboardingCreateCompanyMutation,
  OnboardingCreateCompanyMutationVariables,
  UpdateCompanyTimezoneMutation,
  UpdateCompanyTimezoneMutationVariables,
  AddMemberToCompanyMutation,
  AddMemberToCompanyMutationVariables,
  UpdateUserOnboardingMutation,
  UpdateUserOnboardingMutationVariables,
  StartSubscriptionMutation,
  StartSubscriptionMutationVariables,
  CreateCompanyPaymentMethodMutation,
  CreateCompanyPaymentMethodMutationVariables,
} from 'generated/graphql-types';

const Step = Steps.Step;

// Reference
type FormValues = {
  name: string;
  email: string;
  contactNo: string;

  companyName: string;
  companyTimezone: string;
  companyDescription: string;

  packageId: string;
  subscriptionInterval: 'month' | 'year';
  subscriptionTrial?: boolean;
  skipSubscription?: boolean;

  paymentMethod?: PaymentMethod;
  promoCode?: string;

  skipInvite?: boolean;
  inviteMembers: { email: string; role: CompanyMemberType }[];
};

const OnboardingPage = () => {
  const navigate = useNavigate();

  const { currentUser, reloadUser, activeCompany, returnTo, setReturnTo } =
    useAppStore();

  const { data: queryData } = useQuery<
    OnboardingPageQuery,
    OnboardingPageQueryVariables
  >(onboardingPageQuery);
  const [mutateUpdateProfile] = useMutation<
    UpdateProfileMutation,
    UpdateProfileMutationVariables
  >(updateProfileMutation);
  const [mutateCreateCompany] = useMutation<
    OnboardingCreateCompanyMutation,
    OnboardingCreateCompanyMutationVariables
  >(createCompanyMutation);
  const [mutateUpdateCompanyTimezone] = useMutation<
    UpdateCompanyTimezoneMutation,
    UpdateCompanyTimezoneMutationVariables
  >(updateCompanyTimezoneMutation);
  const [mutateAddMemberToCompany] = useMutation<
    AddMemberToCompanyMutation,
    AddMemberToCompanyMutationVariables
  >(addMemberToCompanyMutation);
  const [mutateUpdateUserOnboarding] = useMutation<
    UpdateUserOnboardingMutation,
    UpdateUserOnboardingMutationVariables
  >(updateUserOnboardingMutation);
  const [mutateStartSubscription] = useMutation<
    StartSubscriptionMutation,
    StartSubscriptionMutationVariables
  >(startSubscriptionMutation);
  const [mutateCreateCompanyPaymentMethod] = useMutation<
    CreateCompanyPaymentMethodMutation,
    CreateCompanyPaymentMethodMutationVariables
  >(createCompanyPaymentMethodMutation);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const isInvitePic = currentUser?.signUpData?.inviteType === 'pic';

  const createdCompanyRef =
    useRef<OnboardingCreateCompanyMutation['createCompany']>();

  const [form] = Form.useForm();

  useEffect(() => {
    if (
      dayjs(currentUser?.createdAt).isSameOrBefore(Configs.v3ReleaseDate) ||
      (dayjs(currentUser?.createdAt).isAfter(Configs.v3ReleaseDate) &&
        currentUser?.onboarding?.hasCompletedOnboarding)
    ) {
      if (currentUser?.companies?.length && activeCompany?.slug) {
        navigateWorkspacePage({
          navigate,
          companySlug: activeCompany.slug,
          workspaceId: 'DEFAULT_WORKSPACE',
          isNewCompany: true,
        });
      } else {
        navigate('/external/shared');
      }
    }
  }, []);

  const handleBack = (field: string) => {
    form.setFieldValue(field, false);

    setCurrentStep((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isInvitePic) {
      const allValues = form.getFields();

      handleSubmitForm(allValues);

      return;
    }

    form.validate().then((value) => {
      if (currentStep < 2) {
        setCurrentStep((prev) => prev + 1);
      } else {
        if (currentStep === 2) {
          const allValues = form.getFields();

          handleSubmitForm(allValues);
        } else if (currentStep === 3) {
          handleAddMembersToCompany(value.inviteMembers);
        }
      }
    });
  };

  const handleSkip = (field: string) => {
    form.setFieldValue(field, true);

    if (currentStep === 2) {
      const value = form.getFields();

      handleSubmitForm(value);
    } else if (currentStep === 3) {
      if (returnTo) {
        navigate(returnTo);
        setReturnTo(undefined);
      } else {
        createdCompanyRef.current?.slug &&
          navigateWorkspacePage({
            navigate,
            companySlug: createdCompanyRef.current?.slug,
            workspaceId: 'DEFAULT_WORKSPACE',
            isNewCompany: true,
          });
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleViewTermsAndConditions = () => {
    UrlService.openTermsAndConditions();
  };

  const handleViewPrivacyPolicy = () => {
    UrlService.openPrivacyPolicy();
  };

  const handleSubmitForm = async (values: any) => {
    setLoading(true);
    const {
      name,
      contactNo,
      companyName,
      companyTimezone,
      companyDescription,
      paymentMethod,
      skipSubscription,
      subscriptionInterval,
      packageId,
    } = values;
    try {
      await handleUpdateUserProfile({
        name: name,
        contactNo: contactNo,
      });

      let createCompanyRes;

      if (companyName && companyTimezone) {
        createCompanyRes = await handleCreateCompany({
          name: companyName,
          description: companyDescription,
        });

        if (createCompanyRes?.createCompany?.id) {
          const companyId = createCompanyRes.createCompany.id;

          await handleUpdateCompanyTimezone({
            companyId,
            timezone: companyTimezone,
          });

          if (paymentMethod) {
            await handleCreateCompanyPaymentMethod({
              companyId,
              paymentMethodId: paymentMethod.id,
            });
          }

          if (!skipSubscription) {
            handleStartSubscription({
              companyId,
              interval: subscriptionInterval,
              packageId: packageId,
            });
          }

          createdCompanyRef.current = createCompanyRes.createCompany;
        }
      }

      await handleUpdateUserOnboarding();

      reloadUser();

      if (isInvitePic) {
        if (returnTo) {
          navigate(returnTo);
          setReturnTo(undefined);
        } else {
          navigate('/external/shared');
        }
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserProfile = async (input: {
    name: string;
    contactNo: string;
  }) => {
    try {
      // TODO: camel case
      const res = await mutateUpdateProfile({
        variables: {
          input: {
            name: input.name,
            contact_no: input.contactNo,
            // contactNo: input.contactNo
          },
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update user profile',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCompany = async (input: {
    name: string;
    description: string;
  }) => {
    try {
      const res = await mutateCreateCompany({
        variables: {
          input: {
            name: input.name,
            description: input.description,
          },
        },
      });

      if (!res.errors) {
        return res.data;
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create company',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCompanyTimezone = async (input: {
    companyId: string;
    timezone: string;
  }) => {
    try {
      const res = await mutateUpdateCompanyTimezone({
        variables: {
          companyId: input.companyId,
          timezone: input.timezone,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update company timezone',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCompanyPaymentMethod = async (input: {
    companyId: string;
    paymentMethodId: string;
  }) => {
    try {
      const res = await mutateCreateCompanyPaymentMethod({
        variables: {
          input: {
            companyId: input.companyId,
            stripePaymentMethodId: input.paymentMethodId,
          },
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create company payment method',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartSubscription = async (input: {
    companyId: string;
    interval: string;
    packageId: string;
  }) => {
    try {
      const res = await mutateStartSubscription({
        variables: {
          input: {
            companyId: input.companyId,
            interval:
              input.interval === 'month'
                ? SubscriptionPriceInterval.Month
                : SubscriptionPriceInterval.Year,
            packageId: input.packageId,
          },
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to upgrade subscription',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMembersToCompany = async (
    inviteMembers: {
      email: string;
      role: CompanyMemberType;
    }[],
  ) => {
    if (!createdCompanyRef.current?.id) {
      return;
    }

    setLoading(true);

    try {
      for (const member of inviteMembers) {
        const res = await mutateAddMemberToCompany({
          variables: {
            companyId: createdCompanyRef.current.id,
            input: {
              email: member.email,
              type: member.role,
            },
          },
        });

        if (res.errors) {
          Message.error(getErrorMessage(res.errors), {
            title: `Failed to invite ${member.email} to company`,
          });
        }
      }

      reloadUser();

      createdCompanyRef.current?.slug &&
        navigateWorkspacePage({
          navigate,
          companySlug: createdCompanyRef.current.slug,
          workspaceId: 'DEFAULT_WORKSPACE',
          isNewCompany: true,
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserOnboarding = async () => {
    try {
      const res = await mutateUpdateUserOnboarding({
        variables: {
          payload: { hasCompletedOnboarding: true },
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: `Failed to update user onboarding`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const allPackages = useMemo(() => {
    if (!queryData?.subscriptionPackagesV2) {
      return [];
    }

    //sort packages by sequences;
    const sortedPackages = sortBy(
      queryData?.subscriptionPackagesV2,
      'sequence',
    );

    const firstThreePackages = sortedPackages.slice(0, 3);

    return firstThreePackages;
  }, [queryData?.subscriptionPackagesV2]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Space direction="vertical" align="center" size={50}>
          <img className={styles.logo} src={Icons.logoHorizontal} alt="logo" />

          <Space
            className={styles['title-container']}
            direction="vertical"
            size={0}
          >
            <Typography.Title>Welcome to GoKudos</Typography.Title>

            <Typography.Text>
              Ready to get started? Here are some great first step to setup your
              account.
            </Typography.Text>
          </Space>

          {!queryData ? (
            <Spin size={25} />
          ) : (
            <div className={styles['steps-form']}>
              {isInvitePic ? (
                <div className={styles['section-title']}>Basic Information</div>
              ) : (
                <Steps
                  className={styles.steps}
                  type="navigation"
                  current={currentStep}
                >
                  <Step title="Basic Information" />
                  <Step title="Plan & Package" />
                  <Step title="Invites" />
                </Steps>
              )}

              <Form
                form={form}
                labelAlign="left"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                initialValues={{
                  email: currentUser?.email,
                  companyDescription: '',
                  subscriptionInterval: 'month',
                  packageId: 'free',
                  inviteMembers: [
                    {
                      email: '',
                      role: '',
                    },
                  ],
                }}
              >
                {currentStep === 1 && (
                  <StepOneForm
                    loading={loading}
                    isInvitedPic={isInvitePic}
                    confirmTxt={isInvitePic ? 'Done' : 'Next'}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 2 && (
                  <StepTwoForm
                    form={form}
                    loading={loading}
                    subscriptionPackages={allPackages}
                    onNext={handleNext}
                    onBack={() => handleBack('skipSubscription')}
                    onSkip={() => handleSkip('skipSubscription')}
                  />
                )}

                {currentStep === 3 && (
                  <StepThreeForm
                    loading={loading}
                    onNext={handleNext}
                    onSkip={() => handleSkip('skipInvite')}
                  />
                )}
              </Form>
            </div>
          )}
        </Space>
      </div>

      <div className={styles.footer}>
        <Typography.Paragraph>
          © 2022 GoKudos Sdn Bhd.{' '}
          <Typography.Text
            className={styles['text-btn']}
            underline
            onClick={handleViewTermsAndConditions}
          >
            Terms of Service
          </Typography.Text>{' '}
          |{' '}
          <Typography.Text
            className={styles['text-btn']}
            underline
            onClick={handleViewPrivacyPolicy}
          >
            Privacy Policy
          </Typography.Text>
        </Typography.Paragraph>
      </div>
    </div>
  );
};

const onboardingPageQuery = gql`
  query OnboardingPage {
    subscriptionPackages {
      id
      title
      type
      emailQuota
      whatsappQuota
      packagePrices {
        id
        price
        currency
        interval
      }
    }
    subscriptionPackagesV2 {
      id
      name
      sequence
      products {
        id
        prices {
          amount
          interval
        }
      }
    }
  }
`;

const updateProfileMutation = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
    }
  }
`;

const createCompanyMutation = gql`
  mutation OnboardingCreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      slug
    }
  }
`;

const updateCompanyTimezoneMutation = gql`
  mutation UpdateCompanyTimezone($companyId: ID!, $timezone: String!) {
    updateCompanyTimezone(companyId: $companyId, timezone: $timezone)
  }
`;

const addMemberToCompanyMutation = gql`
  mutation AddMemberToCompany(
    $companyId: ID!
    $input: AddMemberToCompanyInput!
  ) {
    addMemberToCompany(companyId: $companyId, input: $input) {
      id
    }
  }
`;

const updateUserOnboardingMutation = gql`
  mutation UpdateUserOnboarding($payload: JSON) {
    updateUserOnboarding(payload: $payload) {
      id
    }
  }
`;

const createCompanyPaymentMethodMutation = gql`
  mutation CreateCompanyPaymentMethod(
    $input: CreateCompanyPaymentMethodInput!
  ) {
    createCompanyPaymentMethod(input: $input) {
      isDefault
    }
  }
`;

const startSubscriptionMutation = gql`
  mutation StartSubscription($input: StartSubscriptionInput!) {
    startSubscription(input: $input) {
      id
    }
  }
`;

export default OnboardingPage;
