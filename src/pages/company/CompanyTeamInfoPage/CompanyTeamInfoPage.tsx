import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Button,
  Card,
  Dropdown,
  Input,
  Menu,
  Space,
  Table,
  Typography,
  Grid,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { useState } from 'react';
import { MdAdd, MdMoreVert, MdSearch, MdVerified } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import {
  ContentHeader,
  AddMemberModal,
  addMemberModalFragment,
  TableMultiSelectActionBar,
} from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import BulkAddMemberModal from './BulkAddMemberModal';
import styles from './CompanyTeamInfoPage.module.less';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';

import type { ArrayElement, SelectOption } from '@/types';

import {
  CompanyMemberReferenceImageStatus,
  CompanyTeamInfoPageBulkUploadMembersMutation,
  CompanyTeamInfoPageBulkUploadMembersMutationVariables,
  CompanyTeamInfoPageQuery,
  CompanyTeamInfoPageQueryVariables,
  RemoveMemberFromCompanyTeamMutation,
  RemoveMemberFromCompanyTeamMutationVariables,
  UpdateCompanyTeamInfoMutation,
  UpdateCompanyTeamInfoMutationVariables,
  CompanyMemberType,
} from 'generated/graphql-types';

type QueryCompanyMember = ArrayElement<
  NonNullable<CompanyTeamInfoPageQuery['companyTeam']>['members']
>;

const CompanyTeamInfoPage = () => {
  const { teamId } = useParams();

  const { activeCompany, getCurrentMember, reloadUser } = useAppStore();

  const currentMember = getCurrentMember();

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<CompanyTeamInfoPageQuery, CompanyTeamInfoPageQueryVariables>(
    companyTeamInfoPageQuery,
    {
      variables: {
        companyTeamId: teamId as string,
        companyId: activeCompany?.id as string,
      },
      skip: !teamId || !activeCompany?.id,
    },
  );

  const [mutateRemoveMemberFromCompanyTeam] = useMutation<
    RemoveMemberFromCompanyTeamMutation,
    RemoveMemberFromCompanyTeamMutationVariables
  >(removeMemberFromCompanyTeamMutation);
  const [mutateUpdateTeamInfo, { loading: mutateUpdateTeamInfoLoading }] =
    useMutation<
      UpdateCompanyTeamInfoMutation,
      UpdateCompanyTeamInfoMutationVariables
    >(updateCompanyTeamInfoMutation);
  const [mutateBulkUploadMembers] = useMutation<
    CompanyTeamInfoPageBulkUploadMembersMutation,
    CompanyTeamInfoPageBulkUploadMembersMutationVariables
  >(bulkUploadMembersMutation);

  const [bulkAddMemberLoading, setBulkAddMemberLoading] =
    useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<QueryCompanyMember[]>([]);

  const canEdit = currentMember?.type !== CompanyMemberType.Member;

  const disclosureState = {
    add: useDisclosure(),
    bulk: useDisclosure(),
  };

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
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
        await handleRemoveMemberFromCompanyTeam(member);
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
          await handleRemoveMemberFromCompanyTeam(member);
        }

        handleClearSelectedRows();
      },
    });
  };

  const handleAddMembers = async (memberIds: string[]) => {
    if (!teamId) {
      return;
    }

    // TODO: camel case
    const res = await mutateUpdateTeamInfo({
      variables: {
        companyTeamId: teamId,
        input: {
          memberIds: memberIds,
          member_ids: memberIds,
        },
      },
    });

    if (!res.errors) {
      refetchQuery();

      disclosureState.add.onClose();
    } else {
      Message.error(getErrorMessage(res.errors), {
        title: 'Failed to update team',
      });
    }
  };

  const handleBulkAddMember = async (file: File) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      setBulkAddMemberLoading(true);

      const bulkRes = await mutateBulkUploadMembers({
        variables: {
          companyId: activeCompany.id,
          attachment: file,
        },
      });

      if (!bulkRes.errors) {
        const bulkMembers =
          bulkRes.data?.bulkUploadMembers?.companyMembers || [];
        if (bulkMembers.length > 0) {
          await handleAddMembers(
            bulkMembers.map((member) => member?.id) as string[],
          );
        }

        if (
          bulkRes.data?.bulkUploadMembers?.duplicateEmails &&
          bulkRes.data.bulkUploadMembers.duplicateEmails > 0
        ) {
          Message.info(
            `Failed to add ${bulkRes.data.bulkUploadMembers.duplicateEmails} member(s) due to duplicate`,
          );
        }

        reloadUser();

        disclosureState.bulk.onClose();
      } else {
        Message.error(getErrorMessage(bulkRes.errors), {
          title: 'Failed to bulk add members',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBulkAddMemberLoading(false);
    }
  };

  const handleRemoveMemberFromCompanyTeam = async (
    member: QueryCompanyMember,
  ) => {
    if (!member?.id || !teamId) {
      return;
    }

    try {
      const res = await mutateRemoveMemberFromCompanyTeam({
        variables: {
          companyTeamId: teamId,
          teamMemberId: member.id,
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to remove member from the team',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCompanyMemberOptions = (): SelectOption[] => {
    if (!queryData?.company?.members || !queryData.companyTeam?.members) {
      return [];
    }

    return queryData.company.members
      .filter((member) => {
        return !queryData.companyTeam?.members?.some(
          (teamMember) => teamMember?.id === member?.id,
        );
      })
      .map((member) => ({
        label: member?.user?.name || member?.user?.email,
        value: member?.id as string,
        extra: member?.user,
      }));
  };

  const columns: ColumnProps<QueryCompanyMember>[] = [
    {
      title: 'Name',
      render: (col, item) => {
        return (
          <Space>
            <Typography.Text>{item?.user?.name}</Typography.Text>

            {item?.referenceImage?.status ===
              CompanyMemberReferenceImageStatus.Approved && (
              <MdVerified className={styles['verified-icon']} />
            )}
          </Space>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'user.email',
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
                <Menu.Item className={styles['delete-txt']} key="remove">
                  Remove from team
                </Menu.Item>
              </Menu>
            }
          >
            <Button icon={<MdMoreVert />} type="text" />
          </Dropdown>
        );
      },
    },
  ];

  const getData = (): QueryCompanyMember[] => {
    let data = queryData?.companyTeam?.members || [];

    if (searchKeyword) {
      const regex = new RegExp(searchKeyword, 'i');

      data = data.filter(
        (member) =>
          member?.user?.name?.match(regex) || member?.user?.email?.match(regex),
      );
    }

    return data;
  };

  const handleAddMember = () => {
    if (currentMember?.type === CompanyMemberType.Admin) {
      return disclosureState.add.onOpen();
    }
    const currentMemberInTeam = queryData?.companyTeam?.members?.find(
      (m) => m?.id === currentMember?.id,
    );

    if (currentMemberInTeam) {
      const isCurrentMemberManagerOfTeam =
        currentMemberInTeam?.type === CompanyMemberType.Manager;

      if (isCurrentMemberManagerOfTeam) {
        return disclosureState.add.onOpen();
      } else {
        Modal.error({
          title: 'No Permission',
          content: (
            <div className="text-center">
              You have no permission to add member to this team because you are
              not a manager of team{`"${queryData?.companyTeam?.title}"`},
              please ask your admin to add you into this team.
            </div>
          ),
        });
      }
    } else {
      return Modal.error({
        title: 'No Permission',
        okText: 'OK',
        content: (
          <div className="text-center">
            You have no permission to add member to this team because you are
            not a manager of team{`"${queryData?.companyTeam?.title}"`}, please
            ask your admin to add you into this team.
          </div>
        ),
      });
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
            name: 'Team',
            path: '/settings/company/teams',
          },
          {
            name: queryData?.companyTeam?.title || 'Loading',
          },
        ]}
      />

      <Grid.Row gutter={20} className={styles.wrapper} align="stretch">
        <Grid.Col>
          <Space className={styles['left-wrapper']} direction="vertical">
            <Card>
              <Space direction="vertical">
                <Typography.Text className={styles.title}>
                  Team Information
                </Typography.Text>

                <Grid.Row align="center">
                  <Grid.Col span={12}>
                    <Typography.Text className={styles['description-label']}>
                      Team name :{' '}
                    </Typography.Text>

                    <Typography.Text>
                      {queryData?.companyTeam?.title}
                    </Typography.Text>
                  </Grid.Col>

                  {/* <Grid.Col span={12}>
                    <Space>
                      <Typography.Text className={styles['description-label']}>
                        Team owner :{' '}
                      </Typography.Text>

                      <Select />
                    </Space>
                  </Grid.Col> */}
                </Grid.Row>
              </Space>
            </Card>

            <Card>
              <Space direction="vertical" size={20}>
                <Grid.Row justify="space-between">
                  <Typography.Text className={styles.title}>
                    Team Member
                  </Typography.Text>

                  <Input
                    style={{ width: 437 }}
                    suffix={<MdSearch />}
                    placeholder="Search by name or email"
                    value={searchKeyword}
                    onChange={handleUpdateSearchKeyword}
                  />
                </Grid.Row>

                <div>
                  {canEdit && (
                    <Space>
                      <Button
                        className={styles['theme-btn']}
                        icon={<MdAdd />}
                        onClick={handleAddMember}
                      >
                        Add Member
                      </Button>

                      <Button onClick={disclosureState.bulk.onOpen}>
                        Batch Import
                      </Button>
                    </Space>
                  )}
                </div>

                <div>
                  {selectedRows.length > 0 && (
                    <TableMultiSelectActionBar
                      numberOfRows={selectedRows.length}
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
                    showHeader={selectedRows.length === 0}
                    border={false}
                    columns={canEdit ? columns : columns.slice(0, -1)}
                    data={getData()}
                    loading={queryLoading}
                    pagination={false}
                    rowSelection={
                      canEdit
                        ? {
                            selectedRowKeys: selectedRows.map(
                              (member) => member?.id as string,
                            ),
                            onChange: (_, selectedRows) =>
                              handleUpdateSelectedRows(selectedRows),
                          }
                        : undefined
                    }
                    scroll={{}}
                  />
                </div>
              </Space>
            </Card>
          </Space>
        </Grid.Col>
      </Grid.Row>

      <AddMemberModal
        visible={disclosureState.add.visible}
        onCancel={disclosureState.add.onClose}
        onSubmit={handleAddMembers}
        loading={mutateUpdateTeamInfoLoading}
        companyMemberOptions={getCompanyMemberOptions()}
      />

      <BulkAddMemberModal
        visible={disclosureState.bulk.visible}
        onCancel={disclosureState.bulk.onClose}
        onSubmit={handleBulkAddMember}
        loading={bulkAddMemberLoading}
      />
    </>
  );
};

const companyTeamInfoPageQuery = gql`
  query CompanyTeamInfoPage($companyTeamId: ID!, $companyId: ID!) {
    companyTeam(id: $companyTeamId) {
      id
      title
      members {
        id
        type
        user {
          id
          email
          name
          profileImage
          contactNo
        }
        referenceImage {
          imageUrl
          status
        }
      }
    }
    company(id: $companyId) {
      id
      members {
        ...AddMemberModalFragment
      }
    }
  }
  ${addMemberModalFragment}
`;

const removeMemberFromCompanyTeamMutation = gql`
  mutation RemoveMemberFromCompanyTeam(
    $companyTeamId: ID!
    $teamMemberId: ID!
  ) {
    removeMemberFromCompanyTeam(
      companyTeamId: $companyTeamId
      teamMemberId: $teamMemberId
    ) {
      id
    }
  }
`;

const updateCompanyTeamInfoMutation = gql`
  mutation UpdateCompanyTeamInfo(
    $companyTeamId: ID!
    $input: UpdateCompanyTeamInfoInput!
  ) {
    updateCompanyTeamInfo(companyTeamId: $companyTeamId, input: $input) {
      id
    }
  }
`;

const bulkUploadMembersMutation = gql`
  mutation CompanyTeamInfoPageBulkUploadMembers(
    $companyId: ID!
    $attachment: Upload!
  ) {
    bulkUploadMembers(companyId: $companyId, attachment: $attachment) {
      companyMembers {
        id
      }
      duplicateEmails
    }
  }
`;

export default CompanyTeamInfoPage;
