import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Card,
  Space,
  Descriptions,
  Typography,
  Button,
  Skeleton,
  Tag,
} from '@arco-design/web-react';
import bytes from 'bytes';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ContentHeader,
  StatusTag,
  AddMemberModal,
  addMemberModalFragment,
} from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import BasicTypeCard from './BasicTypeCard';
import styles from './CompanySubscriptionInfoPage.module.less';
import EditSubscriptionDrawer, {
  FormValues as EditFormValues,
} from './EditSubscriptionDrawer';
import UnsubscribePlanModal from './UnsubscribePlanModal';
import WhitelistedMemberCard from './WhitelistedMemberCard';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { formatToCurrency, getCurrencyCode } from '@/utils/currency.utils';
import { getErrorMessage } from '@/utils/error.utils';
import {
  getFinalPrice,
  getBasicSubscriptionStorageSize,
} from '@/utils/subscription.utils';

import { navigateCompanySubscriptionInfoPage } from '@/navigation';

import type { ArrayElement, SelectOption } from '@/types';

import {
  PackageTypes,
  CompanySubscriptionInfoPageQuery,
  CompanySubscriptionInfoPageQueryVariables,
  AssignSubscriptionQuantityToMemberMutation,
  AssignSubscriptionQuantityToMemberMutationVariables,
  RemoveSubscriptionQuantityFromMemberMutation,
  RemoveSubscriptionQuantityFromMemberMutationVariables,
  EditPackageQuantityMutation,
  EditPackageQuantityMutationVariables,
  RemovePackagesFromSubscriptionMutation,
  RemovePackagesFromSubscriptionMutationVariables,
  SwitchSubscriptionPackageMutation,
  SwitchSubscriptionPackageMutationVariables,
  CancelAllSubscriptionsMutation,
  CancelAllSubscriptionsMutationVariables,
  SubscriptionStatuses,
} from 'generated/graphql-types';

type QueryCompanyMember = ArrayElement<
  NonNullable<
    NonNullable<
      CompanySubscriptionInfoPageQuery['companySubscription']
    >['whiteListedMembers']
  >['companyMembers']
>;

const CompanySubscriptionInfoPage = () => {
  const navigate = useNavigate();
  const { subscriptionId } = useParams();

  const { activeCompany } = useAppStore();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    CompanySubscriptionInfoPageQuery,
    CompanySubscriptionInfoPageQueryVariables
  >(companySubscriptionInfoPageQuery, {
    variables: {
      subscriptionId: subscriptionId as string,
      companyId: activeCompany?.id as string,
    },
    skip: !subscriptionId || !activeCompany?.id,
  });
  const [mutateAssignSubscriptionQuantityToMember] = useMutation<
    AssignSubscriptionQuantityToMemberMutation,
    AssignSubscriptionQuantityToMemberMutationVariables
  >(assignSubscriptionQuantityToMemberMutation);
  const [mutateRemoveSubscriptionQuantityFromMember] = useMutation<
    RemoveSubscriptionQuantityFromMemberMutation,
    RemoveSubscriptionQuantityFromMemberMutationVariables
  >(removeSubscriptionQuantityFromMemberMutation);
  const [
    mutateEditPackageQuantity,
    { loading: mutateEditPackageQuantityLoading },
  ] = useMutation<
    EditPackageQuantityMutation,
    EditPackageQuantityMutationVariables
  >(editPackageQuantityMutation);
  const [
    mutateRemovePackagesFromSubscription,
    { loading: mutateRemovePackagesFromSubscriptionLoading },
  ] = useMutation<
    RemovePackagesFromSubscriptionMutation,
    RemovePackagesFromSubscriptionMutationVariables
  >(removePackagesFromSubscriptionMutation);
  const [mutateSwitchSubscriptionPackage] = useMutation<
    SwitchSubscriptionPackageMutation,
    SwitchSubscriptionPackageMutationVariables
  >(switchSubscriptionPackageMutation);
  const [
    mutateCancelAllSubscription,
    { loading: mutateCancelAllSubscriptionLoading },
  ] = useMutation<
    CancelAllSubscriptionsMutation,
    CancelAllSubscriptionsMutationVariables
  >(cancelAllSubscriptionsMutation);

  const [addMembersLoading, setAddMembersLoading] = useState<boolean>(false);

  const loading = !queryData;

  const disclosureState = {
    addMember: useDisclosure(),
    edit: useDisclosure(),
    unsubscribe: useDisclosure(),
  };

  const handleBeforeAddMember = (memberIds: string[]) => {
    if (
      queryData?.companySubscription?.type ===
      PackageTypes.ProjectManagementTool
    ) {
      const selectedMembers = queryData.company?.members?.filter(
        (member) => member?.id && memberIds.includes(member.id),
      );

      const membersWithNoHourlyRate = selectedMembers?.filter(
        (member) => !member?.hourlyRate,
      );

      if (membersWithNoHourlyRate?.length) {
        disclosureState.addMember.onClose();

        handleOpenAddMembersWithNoHourlyRateConfirmation(memberIds);
      } else {
        handleAssignMembersToSubscriptionQuantity(memberIds);
      }
    } else {
      handleAssignMembersToSubscriptionQuantity(memberIds);
    }
  };

  const handleOpenAddMembersWithNoHourlyRateConfirmation = (
    memberIds: string[],
  ) => {
    Modal.confirm({
      style: { width: 500 },
      title: 'Add Member(s)',
      content: (
        <div style={{ textAlign: 'center' }}>
          <Typography.Paragraph>
            There are member(s) without an hourly rate. Would you like to
            proceed?
          </Typography.Paragraph>
          <div>
            *Note: Hourly rate is needed to calculate the project cost. You may
            add the hourly rate through Members settings page.
          </div>
        </div>
      ),
      onOk: async () => {
        await handleAssignMembersToSubscriptionQuantity(memberIds);
      },
    });
  };

  const handleOpenRemoveMemberConfirmation = (member: QueryCompanyMember) => {
    Modal.confirm({
      title: 'Remove Member',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to remove this member?
        </div>
      ),
      onOk: async () => {
        await handleRemoveSubscriptionQuantityFromMember(member);
      },
    });
  };

  const handleOpenRemoveMembersConfirmation = (
    members: QueryCompanyMember[],
    callback: () => void,
  ) => {
    Modal.confirm({
      title: 'Remove Members',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to remove these members?
        </div>
      ),
      onOk: async () => {
        for (const member of members) {
          await handleRemoveSubscriptionQuantityFromMember(member);
        }

        callback();
      },
    });
  };

  const handleOpenUnsubscribeConfirmation = () => {
    if (
      queryData?.companySubscription?.type === PackageTypes.Basic &&
      queryData.company?.activeSubscription?.some(
        (sub) =>
          sub?.type === PackageTypes.ProjectManagementTool && !sub.cancelDate,
      )
    ) {
      Modal.info({
        title: 'Unable to unsubscribe',
        content: (
          <div style={{ textAlign: 'center' }}>
            Please unsubscribe Project Management Tool before unsubscribe this
            plan.
          </div>
        ),
      });
    } else {
      disclosureState.unsubscribe.onOpen();
    }
  };

  const handleSwitchPackageConfirmation = (priceId: string) => {
    Modal.confirm({
      title: 'Switch Plan',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to switch to this plan?
        </div>
      ),
      onOk: async () => {
        await handleSwitchSubscriptionPackage(priceId);
      },
    });
  };

  const handleReloadPageWithNewSubscription = (subscriptionId: string) => {
    if (!activeCompany?.slug) {
      return;
    }

    navigateCompanySubscriptionInfoPage({
      navigate,
      companySlug: activeCompany.slug,
      subscriptionId,
    });
  };

  const handleUnsubscribe = () => {
    if (hasOnlyOneActiveSubscription()) {
      handleCancelAllSubscriptions();
    } else {
      handleRemovePackageFromSubscription();
    }
  };

  const handleAssignMembersToSubscriptionQuantity = async (
    memberIds: string[],
  ) => {
    if (!queryData?.companySubscription?.productId) {
      return;
    }

    setAddMembersLoading(true);

    try {
      for (const id of memberIds) {
        const res = await mutateAssignSubscriptionQuantityToMember({
          variables: {
            companyMemberId: id,
            stripeProductId: queryData.companySubscription?.productId as string,
          },
        });

        if (res.errors) {
          Message.error(getErrorMessage(res.errors), {
            title: 'Failed to add member',
          });
        }
      }

      refetchQuery();

      disclosureState.addMember.onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setAddMembersLoading(false);
    }
  };

  const handleRemoveSubscriptionQuantityFromMember = async (
    member: QueryCompanyMember,
  ) => {
    if (!member?.id || !queryData?.companySubscription?.productId) {
      return;
    }

    try {
      const res = await mutateRemoveSubscriptionQuantityFromMember({
        variables: {
          companyMemberId: member.id,
          stripeProductId: queryData.companySubscription.productId,
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to remove member',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemovePackageFromSubscription = async () => {
    if (
      queryData?.companySubscription?.cancelDate ||
      !queryData?.companySubscription?.id ||
      !activeCompany?.id
    ) {
      return;
    }

    try {
      const res = await mutateRemovePackagesFromSubscription({
        variables: {
          companyId: activeCompany.id,
          companySubscriptionIds: [queryData.companySubscription.id],
        },
      });

      if (!res.errors) {
        Message.success('Successfully unsubscribed plan', {
          title: 'Success',
        });

        refetchQuery();

        disclosureState.unsubscribe.onClose();
        disclosureState.edit.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to unsubscribe plan',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditPackageQuantity = async (values: EditFormValues) => {
    if (!activeCompany?.id || !queryData?.companySubscription?.id) {
      return;
    }

    try {
      const res = await mutateEditPackageQuantity({
        variables: {
          companyId: activeCompany.id,
          companySubscriptionId: queryData.companySubscription.id,
          quantity: values.quantity,
        },
      });

      if (!res.errors) {
        Message.success('Successfully updated the plan quota', {
          title: 'Success',
        });

        refetchQuery();

        disclosureState.edit.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to edit plan quota',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwitchSubscriptionPackage = async (priceId: string) => {
    if (!activeCompany?.id || !queryData?.companySubscription?.id) {
      return;
    }

    try {
      const res = await mutateSwitchSubscriptionPackage({
        variables: {
          companyId: activeCompany.id,
          companySubscriptionId: queryData.companySubscription.id,
          switchSubscriptionPackageInput: {
            package_price_id: priceId,
            packagePriceId: priceId,
            quantity: 1,
          },
        },
      });

      if (!res.errors) {
        Message.success('Successfully switched plan', {
          title: 'Success',
        });

        if (res.data?.switchSubscriptionPackage?.id) {
          handleReloadPageWithNewSubscription(
            res.data.switchSubscriptionPackage.id,
          );
        }
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to switch plan',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelAllSubscriptions = async () => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateCancelAllSubscription({
        variables: {
          companyId: activeCompany.id,
        },
      });

      if (!res.errors) {
        Message.success('Successfully unsubscribed plan', {
          title: 'Success',
        });

        refetchQuery();

        disclosureState.unsubscribe.onClose();
        disclosureState.edit.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to unsubscribe plan',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getFormattedPackageTitle = () => {
    if (!queryData?.companySubscription?.packageTitle) {
      return '-';
    }

    let title = queryData.companySubscription.packageTitle.replace('Omni', '');

    if (queryData.companySubscription.cancelDate) {
      title += ' (Unsubscribed)';
    }

    return title;
  };

  const getPriceInfo = () => {
    if (
      !queryData?.companySubscription?.price ||
      !queryData.companySubscription.quantity ||
      !queryData.companySubscription.subscriptionPackagePrice?.currency
    ) {
      return '-';
    }

    const currencyCode = getCurrencyCode(
      queryData.companySubscription.subscriptionPackagePrice.currency,
    );

    let output = `${currencyCode} ${formatToCurrency(
      getFinalPrice(queryData.companySubscription),
    )}`;

    if (
      queryData.companySubscription.type ===
        PackageTypes.ProjectManagementTool ||
      queryData.companySubscription.type === PackageTypes.TimeAttendance
    ) {
      output += ` (${currencyCode} ${formatToCurrency(
        queryData.companySubscription.price,
      )} per user)`;
    }

    return output;
  };

  const getCompanyMemberOptions = (): SelectOption[] => {
    if (
      !queryData?.company?.members ||
      !queryData.companySubscription?.whiteListedMembers?.companyMembers
    ) {
      return [];
    }

    return queryData.company.members
      .filter((member) => {
        return !queryData.companySubscription?.whiteListedMembers?.companyMembers?.some(
          (whitelistMember) => whitelistMember?.id === member?.id,
        );
      })
      .map((member) => ({
        label: member?.user?.name || member?.user?.email,
        value: member?.id as string,
        extra: member?.user,
      }));
  };

  const getUsage = () => {
    if (queryData?.companySubscription?.type === PackageTypes.Basic) {
      return getStorageUsage();
    } else if (queryData?.companySubscription?.type === PackageTypes.Dedoco) {
      return getDedocoUsage();
    }

    return getQuantityUsage();
  };

  const getStorageUsage = () => {
    const usedStorage = bytes.format(
      queryData?.companyStorage?.totalUsageInKB || 0,
    );

    const totalStorage = bytes.format(
      getBasicSubscriptionStorageSize(
        queryData?.companySubscription?.packageTitle,
      ),
    );

    return `${usedStorage}/ ${totalStorage}`;
  };

  const getQuantityUsage = () => {
    const used =
      queryData?.companySubscription?.whiteListedMembers?.assigned || 0;

    const total =
      queryData?.companySubscription?.whiteListedMembers?.total || 0;

    return `${used}/ ${total}`;
  };

  const getDedocoUsage = () => {
    const total = queryData?.companySubscription?.package?.signatureQuota || 0;
    const used = total - (queryData?.companySubscription?.signatureQuota || 0);

    return `${used}/ ${total}`;
  };

  const hasOnlyOneActiveSubscription = () => {
    if (!queryData?.company?.activeSubscription) {
      return false;
    }

    return (
      queryData.company.activeSubscription.filter((sub) => !sub?.cancelDate)
        .length === 1
    );
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
            name: 'Subscription',
            path: '/settings/company/subscriptions',
          },
          {
            name: getFormattedPackageTitle(),
          },
        ]}
        rightElement={
          queryData?.companySubscription?.type === PackageTypes.Basic &&
          !queryData.companySubscription.cancelDate && (
            <Button
              className={styles['unsubscribe-btn']}
              onClick={handleOpenUnsubscribeConfirmation}
            >
              Unsubscribe
            </Button>
          )
        }
      />

      <Space className={styles.wrapper} direction="vertical">
        <Card className={styles['info-card']}>
          <Descriptions
            title={
              <Space>
                <Typography.Text className={styles.title}>
                  Plan Information
                </Typography.Text>

                {!queryData?.companySubscription?.cancelDate &&
                  queryData?.companySubscription?.type !==
                    PackageTypes.Basic && (
                    <Button type="text" onClick={disclosureState.edit.onOpen}>
                      Edit
                    </Button>
                  )}
              </Space>
            }
            column={2}
            colon=" :"
            data={[
              {
                label: 'Plan',
                value: (
                  <Space>
                    <Typography.Text>
                      {getFormattedPackageTitle()}
                    </Typography.Text>

                    {queryData?.companySubscription?.status ===
                      SubscriptionStatuses.Trial && (
                      <StatusTag mode="blue">Trial</StatusTag>
                    )}
                  </Space>
                ),
              },
              {
                label: 'Usage/Quota',
                value: loading ? <Skeleton text={{ rows: 1 }} /> : getUsage(),
              },
              {
                label: 'Price',
                value: getPriceInfo(),
              },
              {
                label: 'Renewal Date',
                value: queryData?.companySubscription?.endDate
                  ? dayjs(queryData.companySubscription.endDate).format(
                      'DD MMMM YYYY',
                    )
                  : '-',
              },
            ]}
          />
        </Card>

        {!queryData ? (
          <Card />
        ) : queryData?.companySubscription?.type === PackageTypes.Basic ? (
          <BasicTypeCard
            companySubscription={queryData.companySubscription}
            subscriptionPackages={queryData.subscriptionPackages}
            onSwitchPackage={handleSwitchPackageConfirmation}
          />
        ) : (
          <WhitelistedMemberCard
            companySubscription={queryData?.companySubscription}
            onAdd={disclosureState.addMember.onOpen}
            onRemoveMember={handleOpenRemoveMemberConfirmation}
            onRemoveMembers={handleOpenRemoveMembersConfirmation}
          />
        )}
      </Space>

      <AddMemberModal
        visible={disclosureState.addMember.visible}
        onCancel={disclosureState.addMember.onClose}
        loading={addMembersLoading}
        companyMemberOptions={getCompanyMemberOptions()}
        nameExtra={(option) => {
          const member = queryData?.company?.members?.find(
            (member) => member?.id === option.value,
          );
          const hasHourlyRate = !!(member?.hourlyRate && member.hourlyRate > 0);

          if (
            queryData?.companySubscription?.type !==
            PackageTypes.ProjectManagementTool
          ) {
            return null;
          }

          return !hasHourlyRate && <Tag>No hourly rate</Tag>;
        }}
        onSubmit={handleBeforeAddMember}
      />

      <EditSubscriptionDrawer
        visible={disclosureState.edit.visible}
        onCancel={disclosureState.edit.onClose}
        companySubscription={queryData?.companySubscription}
        loading={mutateEditPackageQuantityLoading}
        onUnsubscribe={handleOpenUnsubscribeConfirmation}
        onUpdate={handleEditPackageQuantity}
        onRemoveWhitelistedMember={handleRemoveSubscriptionQuantityFromMember}
      />

      <UnsubscribePlanModal
        visible={disclosureState.unsubscribe.visible}
        onCancel={disclosureState.unsubscribe.onClose}
        companySubscription={queryData?.companySubscription}
        loading={
          mutateRemovePackagesFromSubscriptionLoading ||
          mutateCancelAllSubscriptionLoading
        }
        onSubscribe={handleUnsubscribe}
      />
    </>
  );
};

const companySubscriptionInfoPageQuery = gql`
  query CompanySubscriptionInfoPage($subscriptionId: ID!, $companyId: ID!) {
    companySubscription(subscriptionId: $subscriptionId) {
      id
      packageTitle
      interval
      price
      endDate
      quantity
      type
      productId
      cancelDate
      status
      signatureQuota
      whiteListedMembers {
        total
        assigned
        companyMembers {
          id
          user {
            id
            email
            name
            contactNo
            profileImage
          }
        }
      }
      subscriptionPackagePrice {
        id
        currency
      }
      discount {
        id
        coupon {
          id
          percentOff
          amountOff
        }
      }
      package {
        id
        signatureQuota
      }
    }
    company(id: $companyId) {
      id
      members {
        ...AddMemberModalFragment
      }
      activeSubscription {
        id
        type
        cancelDate
      }
    }
    companyStorage(companyId: $companyId) {
      totalUsageInKB
    }
    subscriptionPackages {
      id
      title
      type
      packagePrices {
        id
        currency
        price
        interval
      }
    }
  }
  ${addMemberModalFragment}
`;

const assignSubscriptionQuantityToMemberMutation = gql`
  mutation AssignSubscriptionQuantityToMember(
    $companyMemberId: ID!
    $stripeProductId: String!
  ) {
    assignSubscriptionQuantityToMember(
      companyMemberId: $companyMemberId
      stripeProductId: $stripeProductId
    ) {
      id
    }
  }
`;

const removeSubscriptionQuantityFromMemberMutation = gql`
  mutation RemoveSubscriptionQuantityFromMember(
    $companyMemberId: ID!
    $stripeProductId: String!
  ) {
    removeSubscriptionQuantityFromMember(
      companyMemberId: $companyMemberId
      stripeProductId: $stripeProductId
    ) {
      id
    }
  }
`;

const editPackageQuantityMutation = gql`
  mutation EditPackageQuantity(
    $companyId: ID!
    $companySubscriptionId: ID!
    $quantity: Int!
  ) {
    editPackageQuantity(
      companyId: $companyId
      companySubscriptionId: $companySubscriptionId
      quantity: $quantity
    ) {
      id
    }
  }
`;

const removePackagesFromSubscriptionMutation = gql`
  mutation RemovePackagesFromSubscription(
    $companyId: ID!
    $companySubscriptionIds: [ID]!
  ) {
    removePackagesFromSubscription(
      companyId: $companyId
      companySubscriptionIds: $companySubscriptionIds
    ) {
      id
    }
  }
`;

const switchSubscriptionPackageMutation = gql`
  mutation SwitchSubscriptionPackage(
    $companyId: ID!
    $switchSubscriptionPackageInput: SwitchSubscriptionPackageInput!
    $companySubscriptionId: ID!
  ) {
    switchSubscriptionPackage(
      companyId: $companyId
      switchSubscriptionPackageInput: $switchSubscriptionPackageInput
      companySubscriptionId: $companySubscriptionId
    ) {
      id
    }
  }
`;

const cancelAllSubscriptionsMutation = gql`
  mutation CancelAllSubscriptions($companyId: ID!) {
    cancelAllSubscriptions(companyId: $companyId) {
      id
    }
  }
`;

export default CompanySubscriptionInfoPage;
