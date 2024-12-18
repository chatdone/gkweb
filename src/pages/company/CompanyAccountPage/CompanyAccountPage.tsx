import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Card,
  Space,
  Typography,
  Button,
  Modal,
  Skeleton,
  Grid,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { head } from 'lodash-es';
import { useNavigate } from 'react-router-dom';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';

import CompanyAccountForm, {
  FormValues,
  companyAccountFormFragments,
} from './CompanyAccountForm';
import styles from './CompanyAccountPage.module.less';

import { useAppStore } from '@/stores/useAppStore';
import { useResponsiveStore } from '@/stores/useResponsiveStores';

import { navigateHomePage } from '@/navigation';

import i18n from '@/i18n';

import {
  CompanyMemberType,
  CompanyAccountPageQuery,
  CompanyAccountPageQueryVariables,
  DeleteCompanyMutation,
  DeleteCompanyMutationVariables,
  SetDefaultCompanyMutation,
  SetDefaultCompanyMutationVariables,
  UpdateCompanyInfoMutation,
  UpdateCompanyInfoMutationVariables,
  UpdateCompanyTimezoneMutation,
  UpdateCompanyTimezoneMutationVariables,
  UploadCompanyProfileImageMutation,
  UploadCompanyProfileImageMutationVariables,
} from 'generated/graphql-types';

const CompanyAccountPage = () => {
  const navigate = useNavigate();

  const {
    currentUser,
    activeCompany,
    reloadUser,
    setActiveCompany,
    getCurrentMember,
  } = useAppStore();
  const { isMobile } = useResponsiveStore();

  const currentMember = getCurrentMember();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    CompanyAccountPageQuery,
    CompanyAccountPageQueryVariables
  >(companyAccountPageQuery, {
    variables: {
      companyId: activeCompany?.id as string,
    },
    skip: !activeCompany?.id,
  });
  const [mutateUpdateCompanyInfo, { loading: mutateUpdateCompanyInfoLoading }] =
    useMutation<UpdateCompanyInfoMutation, UpdateCompanyInfoMutationVariables>(
      updateCompanyInfoMutation,
    );
  const [
    mutateUpdateCompanyTimezone,
    { loading: mutateUpdateCompanyTimezoneLoading },
  ] = useMutation<
    UpdateCompanyTimezoneMutation,
    UpdateCompanyTimezoneMutationVariables
  >(updateCompanyTimezoneMutation);
  const [mutateSetDefaultCompany, { loading: mutateSetDefaultCompanyLoading }] =
    useMutation<SetDefaultCompanyMutation, SetDefaultCompanyMutationVariables>(
      setDefaultCompanyMutation,
    );
  const [
    mutateUploadCompanyProfileImage,
    { loading: mutateUploadCompanyProfileImageLoading },
  ] = useMutation<
    UploadCompanyProfileImageMutation,
    UploadCompanyProfileImageMutationVariables
  >(uploadCompanyProfileImageMutation);
  const [mutateDeleteCompany] = useMutation<
    DeleteCompanyMutation,
    DeleteCompanyMutationVariables
  >(deleteCompanyMutation);

  const isLoading = !queryData;

  const canEdit = currentMember?.type === CompanyMemberType.Admin;

  const handleOpenDeleteCompanyConfirmation = () => {
    Modal.confirm({
      title: 'Delete Company',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this company?
        </div>
      ),
      okText: 'Confirm',
      okButtonProps: {
        style: {
          background: '#d6001c',
        },
      },
      onOk: handleDeleteCompany,
    });
  };

  const handleUpdateCompany = async (values: FormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      let shouldRefetch = false;

      const res = await mutateUpdateCompanyInfo({
        variables: {
          companyId: activeCompany?.id,
          input: {
            name: values.name.trim(),
            description: values.description.trim(),
            address: values.address?.trim(),
            email: values.email?.trim(),
            phone: values.contactNo?.trim(),
            website: values.websiteUrl?.trim(),
            registrationCode: values.registrationCode?.trim(),
          },
        },
      });

      if (!res.errors) {
        shouldRefetch = true;
      } else {
        Message.error(i18n.t('errors.requestError'));
      }

      const setDefaultCompanyRes = await mutateSetDefaultCompany({
        variables: {
          companyId: values.defaultCompany ? activeCompany.id : null,
        },
      });

      if (!setDefaultCompanyRes.errors) {
        shouldRefetch = true;
      } else {
        Message.error(i18n.t('errors.requestError'));
      }

      if (values.timezone) {
        const updateCompanyTimezoneRes = await mutateUpdateCompanyTimezone({
          variables: {
            companyId: activeCompany.id,
            timezone: values.timezone,
          },
        });

        if (!updateCompanyTimezoneRes.errors) {
          shouldRefetch = true;
        } else {
          Message.error(i18n.t('errors.requestError'));
        }
      }

      if (values.logo && typeof values.logo === 'object') {
        const uploadProfileImageRes = await mutateUploadCompanyProfileImage({
          variables: {
            companyId: activeCompany.id,
            attachment: values.logo,
          },
        });

        if (!uploadProfileImageRes.errors) {
          shouldRefetch = true;
        } else {
          Message.error(i18n.t('errors.requestError'));
        }
      }

      if (shouldRefetch) {
        Message.success('The company has been successfully updated', {
          title: 'Success',
        });

        refetchQuery();
        reloadUser();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCompany = async () => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateDeleteCompany({
        variables: {
          companyId: activeCompany.id,
        },
      });

      if (!res.errors) {
        await reloadUser();

        const firstCompany = head(currentUser?.companies);
        setActiveCompany(firstCompany || null);

        firstCompany?.slug && navigateHomePage(navigate, firstCompany.slug);
      } else {
        Message.error(i18n.t('errors.requestError'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Setting',
          },
          {
            name: 'Company',
          },
          {
            name: 'Account',
          },
        ]}
      />

      <Space className={styles.wrapper} direction="vertical" size={20}>
        <Card className={styles['account-card']}>
          {isMobile ? (
            <Typography.Paragraph className={styles['card-title']}>
              Company Account
            </Typography.Paragraph>
          ) : (
            <Skeleton
              className={styles['created-by-skeleton']}
              text={{ rows: 1 }}
              loading={isLoading}
            >
              <Typography.Paragraph className={styles['created-by']}>
                Created by {queryData?.company?.createdBy?.name} (
                {queryData?.company?.createdBy?.email}){' '}
                {dayjs(queryData?.company?.createdAt).format(
                  'DD MMM YYYY, hh:mma',
                )}
              </Typography.Paragraph>
            </Skeleton>
          )}

          <CompanyAccountForm
            company={queryData?.company}
            user={queryData?.currentUser}
            canEdit={canEdit}
            loading={
              mutateUpdateCompanyInfoLoading ||
              mutateUpdateCompanyTimezoneLoading ||
              mutateSetDefaultCompanyLoading ||
              mutateUploadCompanyProfileImageLoading
            }
            onSubmit={handleUpdateCompany}
          />
        </Card>

        {canEdit && (
          <Card className={styles['delete-company-card']}>
            <Grid.Row
              className={styles.container}
              justify="space-between"
              align="center"
            >
              <div>
                <Typography.Paragraph className={styles.title}>
                  Delete company permanently
                </Typography.Paragraph>

                <Typography.Paragraph className={styles.descriptions}>
                  You are proceeding to delete all the information and files of
                  the company permanently. This deletion is irreversible.
                </Typography.Paragraph>
              </div>

              <Button
                className={styles['theme-button']}
                onClick={handleOpenDeleteCompanyConfirmation}
              >
                Delete company
              </Button>
            </Grid.Row>
          </Card>
        )}
      </Space>
    </>
  );
};

const companyAccountPageQuery = gql`
  query CompanyAccountPage($companyId: ID!) {
    company(id: $companyId) {
      ...CompanyAccountFormCompanyFragment
      createdAt
      createdBy {
        id
        name
        email
      }
    }
    currentUser {
      ...CompanyAccountFormUserFragment
    }
  }
  ${companyAccountFormFragments.company}
  ${companyAccountFormFragments.user}
`;

const updateCompanyInfoMutation = gql`
  mutation UpdateCompanyInfo($companyId: ID!, $input: UpdateCompanyInfoInput!) {
    updateCompanyInfo(companyId: $companyId, input: $input) {
      id
    }
  }
`;

const updateCompanyTimezoneMutation = gql`
  mutation UpdateCompanyTimezone($companyId: ID!, $timezone: String!) {
    updateCompanyTimezone(companyId: $companyId, timezone: $timezone)
  }
`;

const uploadCompanyProfileImageMutation = gql`
  mutation UploadCompanyProfileImage($companyId: ID!, $attachment: Upload!) {
    uploadCompanyProfileImage(companyId: $companyId, attachment: $attachment) {
      id
    }
  }
`;

const setDefaultCompanyMutation = gql`
  mutation SetDefaultCompany($companyId: ID) {
    setDefaultCompany(companyId: $companyId) {
      id
    }
  }
`;

const deleteCompanyMutation = gql`
  mutation DeleteCompany($companyId: ID!) {
    deleteCompany(companyId: $companyId) {
      id
    }
  }
`;

export default CompanyAccountPage;
