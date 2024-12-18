import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Card,
  Dropdown,
  Menu,
  Space,
  Table,
  Tooltip,
  Typography,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { head } from 'lodash-es';
import { useState } from 'react';
import { MdAdd, MdMoreVert, MdOutlineInfo } from 'react-icons/md';

import {
  AddMemberModal,
  ContentHeader,
  EmptyContent,
  TableMultiSelectActionBar,
} from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import DedocoInfoCard from './DedocoInfoCard';
import styles from './DedocoInfoPage.module.less';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';
import { alphabeticalSort } from '@/utils/sorter.utils';

import Icons from '@/assets/icons';

import { ArrayElement, SelectOption } from '@/types';

import {
  PackageTypes,
  DedocoInfoPageQueryQuery,
  DedocoInfoPageQueryQueryVariables,
  AssignSubscriptionQuantityToMemberMutation,
  AssignSubscriptionQuantityToMemberMutationVariables,
  RemoveSubscriptionQuantityFromMemberMutation,
  RemoveSubscriptionQuantityFromMemberMutationVariables,
} from 'generated/graphql-types';

type QueryCompanyMember = ArrayElement<
  NonNullable<DedocoInfoPageQueryQuery['company']>['members']
>;

const DedocoInfoPage = () => {
  const { activeCompany } = useAppStore();

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<DedocoInfoPageQueryQuery, DedocoInfoPageQueryQueryVariables>(
    dedocoInfoPageQuery,
    {
      variables: {
        companyId: activeCompany?.id as string,
      },
      skip: !activeCompany?.id,
    },
  );
  const [mutateAddMemberToDedoco, { loading: mutateAddMemberToDedocoLoading }] =
    useMutation<
      AssignSubscriptionQuantityToMemberMutation,
      AssignSubscriptionQuantityToMemberMutationVariables
    >(assignSubscriptionQuantityToMemberMutation);
  const [mutateRemoveSubscriptionQuantityFromMember] = useMutation<
    RemoveSubscriptionQuantityFromMemberMutation,
    RemoveSubscriptionQuantityFromMemberMutationVariables
  >(removeSubscriptionQuantityFromMemberMutation);

  const [selectedRows, setSelectedRows] = useState<QueryCompanyMember[]>([]);

  const modalState = {
    addMember: useDisclosure(),
    upgrade: useDisclosure(),
    unsubscribe: useDisclosure(),
  };

  const handleUpdateSelectedRows = (selectedRows: QueryCompanyMember[]) => {
    setSelectedRows(selectedRows);
  };

  const handleClearSelectedRows = () => {
    setSelectedRows([]);
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

  const handleOpenRemoveMembersConfirmation = () => {
    if (selectedRows.length === 0) {
      return;
    }

    Modal.confirm({
      title: 'Remove Members',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to remove these members?
        </div>
      ),
      onOk: async () => {
        for (const member of selectedRows) {
          await handleRemoveSubscriptionQuantityFromMember(member);
        }

        handleClearSelectedRows();
      },
    });
  };

  const handleRemoveSubscriptionQuantityFromMember = async (
    member: QueryCompanyMember,
  ) => {
    const dedocoSub = getDedocoPackage();
    if (!member?.id || !dedocoSub?.productId) {
      return;
    }

    try {
      const res = await mutateRemoveSubscriptionQuantityFromMember({
        variables: {
          companyMemberId: member.id,
          stripeProductId: dedocoSub.productId,
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

  const handleAddDedocoUsers = async (memberIds: string[]) => {
    const stripeProductId = getStripeProductId();
    if (!activeCompany?.id || !stripeProductId) {
      return;
    }

    try {
      for (const id of memberIds) {
        const res = await mutateAddMemberToDedoco({
          variables: {
            companyMemberId: id,
            stripeProductId,
          },
        });

        if (res.errors) {
          Message.error(getErrorMessage(res.errors), {
            title: 'Failed to add user to dedoco',
          });
        }

        refetchQuery();

        modalState.addMember.onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getWhitelistedMembers = () => {
    if (!queryData?.company?.activeSubscription) {
      return [];
    } else {
      const dedocoSub = head(
        queryData?.company?.activeSubscription.filter((sub) => {
          return sub?.type === 'DEDOCO';
        }),
      );
      return dedocoSub?.whiteListedMembers
        ?.companyMembers as QueryCompanyMember[];
    }
  };

  const getStripeProductId = (): string | undefined => {
    if (!queryData?.company?.activeSubscription) {
      return;
    }
    const dedocoSub = head(
      queryData?.company?.activeSubscription.filter((sub) => {
        return sub?.type === 'DEDOCO';
      }),
    );

    return dedocoSub?.package?.productId as string;
  };

  const getCompanyMemberOptions = (): SelectOption[] => {
    const dedocoSub = getDedocoPackage();
    if (
      !queryData?.company?.members ||
      !dedocoSub?.whiteListedMembers?.companyMembers
    ) {
      return [];
    }

    return queryData.company.members
      .filter((member) => {
        return !dedocoSub.whiteListedMembers?.companyMembers?.some(
          (whitelistMember) => whitelistMember?.id === member?.id,
        );
      })
      .map((member) => ({
        label: member?.user?.name || member?.user?.email,
        value: member?.id as string,
        extra: member?.user,
      }));
  };

  const getDedocoPackage = () => {
    if (!queryData?.company?.activeSubscription) {
      return;
    }

    return queryData.company.activeSubscription.find(
      (sub) => sub?.type === PackageTypes.Dedoco,
    );
  };

  const columns: ColumnProps<QueryCompanyMember>[] = [
    {
      title: 'Name',
      dataIndex: 'user.name',
      sorter: alphabeticalSort('user.name'),
    },
    {
      title: 'Email',
      dataIndex: 'user.email',
      sorter: alphabeticalSort('user.email'),
    },
    {
      title: 'Contact',
      dataIndex: 'user.contactNo',
    },
    {
      title: 'Action',
      width: 80,
      render: (col, item) => {
        const handleClickMenuItem = (key: string) => {
          if (key === 'remove') {
            handleOpenRemoveMemberConfirmation(item);
          }
        };

        return (
          <Dropdown
            position="br"
            droplist={
              <Menu onClickMenuItem={handleClickMenuItem}>
                <Menu.Item key="remove">Remove</Menu.Item>
              </Menu>
            }
          >
            <Button icon={<MdMoreVert />} type="text" />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Setting',
          },
          {
            name: 'Integration',
            path: '/settings/integrations',
          },
          {
            name: 'Dedoco',
          },
        ]}
      />

      <Space className={styles.wrapper} direction="vertical">
        <DedocoInfoCard dedocoPackage={getDedocoPackage()} />

        <Card className={styles['whitelist-card']}>
          <Space direction="vertical" size={15}>
            <Space>
              <Typography.Paragraph className={styles['card-title']}>
                Whitelisted Member
              </Typography.Paragraph>

              <Tooltip
                position="bl"
                content="To allows member to access this payment method."
              >
                <MdOutlineInfo className={styles['tooltip-icon']} />
              </Tooltip>
            </Space>

            <Button
              className={styles['theme-button']}
              icon={<MdAdd />}
              onClick={modalState.addMember.onOpen}
            >
              Add Member
            </Button>

            <div>
              {selectedRows.length > 0 && (
                <TableMultiSelectActionBar
                  numberOfRows={selectedRows.length}
                  suffix="members"
                  onDeselectAll={handleClearSelectedRows}
                  actions={[
                    <Button
                      type="text"
                      size="small"
                      onClick={handleOpenRemoveMembersConfirmation}
                    >
                      Remove
                    </Button>,
                  ]}
                />
              )}

              <Table
                loading={queryLoading}
                showHeader={selectedRows.length === 0}
                columns={columns}
                data={getWhitelistedMembers()}
                rowSelection={{
                  selectedRowKeys: selectedRows.map(
                    (member) => member?.id as string,
                  ),
                  onChange: (_, selectedRows) =>
                    handleUpdateSelectedRows(selectedRows),
                }}
                border={false}
                pagination={false}
                noDataElement={
                  <EmptyContent
                    iconSrc={Icons.saveAProblemBackup}
                    title="Add member here to begin using this feature"
                    subtitle="There are no members added here."
                    showInfoIcon={false}
                  />
                }
              />
            </div>
          </Space>
        </Card>
      </Space>

      <AddMemberModal
        visible={modalState.addMember.visible}
        onCancel={modalState.addMember.onClose}
        loading={mutateAddMemberToDedocoLoading}
        companyMemberOptions={getCompanyMemberOptions()}
        onSubmit={handleAddDedocoUsers}
      />
    </>
  );
};

const dedocoInfoPageQuery = gql`
  query DedocoInfoPageQuery($companyId: ID!) {
    company(id: $companyId) {
      id
      activeSubscription {
        id
        type
        signatureQuota
        price
        endDate
        productId
        whiteListedMembers {
          total
          assigned
          companyMembers {
            id
            user {
              name
              email
              contactNo
            }
          }
        }
        package {
          id
          title
          signatureQuota
          productId
        }
        subscriptionPackagePrice {
          id
          currency
        }
      }
      members {
        id
        user {
          name
          email
          id
        }
      }
    }
  }
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

export default DedocoInfoPage;
