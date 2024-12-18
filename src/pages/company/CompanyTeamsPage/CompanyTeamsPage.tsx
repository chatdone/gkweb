import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Button,
  Card,
  Dropdown,
  Input,
  Menu,
  Space,
  Table,
  SelectProps,
  Grid,
  Typography,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { escapeRegExp } from 'lodash-es';
import { useState } from 'react';
import { MdAdd, MdMoreVert, MdSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { ContentHeader, Avatar } from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import styles from './CompanyTeamsPage.module.less';
import EditTeamModal, {
  FormValues,
  editTeamModalFragment,
} from './EditTeamModal';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';
import { countSort } from '@/utils/sorter.utils';

import {
  navigateCompanySubscriptionsPage,
  navigateCompanyTeamInfoPage,
} from '@/navigation';

import type { ArrayElement } from '@/types';

import {
  CompanyMemberType,
  CompanyTeamsPageQuery,
  CompanyTeamsPageQueryVariables,
  CreateCompanyTeamMutation,
  CreateCompanyTeamMutationVariables,
  UpdateCompanyTeamInfoMutation,
  UpdateCompanyTeamInfoMutationVariables,
  DeleteCompanyTeamMutation,
  DeleteCompanyTeamMutationVariables,
} from 'generated/graphql-types';

type QueryCompanyTeam = ArrayElement<
  NonNullable<CompanyTeamsPageQuery['company']>['teams']
>;

const CompanyTeamPage = () => {
  const navigate = useNavigate();

  const { activeCompany, getCurrentMember } = useAppStore();

  const currentMember = getCurrentMember();

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<CompanyTeamsPageQuery, CompanyTeamsPageQueryVariables>(
    companyTeamsPageQuery,
    {
      variables: {
        companyId: activeCompany?.id as string,
      },
      skip: !activeCompany?.id,
    },
  );
  const [mutateCreateTeam, { loading: mutateCreateTeamLoading }] = useMutation<
    CreateCompanyTeamMutation,
    CreateCompanyTeamMutationVariables
  >(createCompanyTeamMutation);
  const [mutateUpdateTeam, { loading: mutateUpdateTeamLoading }] = useMutation<
    UpdateCompanyTeamInfoMutation,
    UpdateCompanyTeamInfoMutationVariables
  >(updateCompanyTeamInfoMutation);
  const [mutateDeleteTeam] = useMutation<
    DeleteCompanyTeamMutation,
    DeleteCompanyTeamMutationVariables
  >(deleteCompanyTeamMutation);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [editTeam, setEditTeam] = useState<QueryCompanyTeam>();

  const { visible, onClose, onOpen } = useDisclosure();

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleEditTeam = (team: QueryCompanyTeam) => {
    setEditTeam(team);

    onOpen();
  };

  const handleCloseModal = () => {
    setEditTeam(undefined);

    onClose();
  };

  const handleViewTeam = async (team: QueryCompanyTeam) => {
    if (!team?.id || !activeCompany?.slug) {
      return;
    }

    navigateCompanyTeamInfoPage({
      navigate,
      companySlug: activeCompany.slug,
      teamId: team.id,
    });
  };

  const handleBeforeAddTeam = () => {
    if (activeCompany?.currentSubscription?.teamQuota === 0) {
      Modal.info({
        title: 'Reached Plan Limit',
        content:
          currentMember?.type === CompanyMemberType.Admin
            ? 'You have reached your quota for number of teams, please upgrade your plan.'
            : 'You have reached your quota for number of teams, please upgrade your plan or contact your admin',
        okText:
          currentMember?.type === CompanyMemberType.Admin
            ? 'Upgrade Plan'
            : undefined,
        onConfirm: () => {
          activeCompany?.slug &&
            navigateCompanySubscriptionsPage({
              navigate,
              companySlug: activeCompany.slug,
            });
        },
      });
    } else {
      onOpen();
    }
  };

  const handleOpenDeleteTeamConfirmation = (team: QueryCompanyTeam) => {
    Modal.confirm({
      title: 'Delete Team',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this team?
        </div>
      ),
      onOk: async () => {
        await handleDeleteTeam(team);
      },
    });
  };

  const handleCreateTeam = async (values: FormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      // TODO: camel case
      const res = await mutateCreateTeam({
        variables: {
          companyId: activeCompany.id,
          input: {
            title: values.name.trim(),
            memberIds: values.memberIds,
            member_ids: values.memberIds,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create team',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTeam = async (values: FormValues) => {
    if (!editTeam?.id) {
      return;
    }

    try {
      const newMemberIds = values.memberIds.filter(
        (id) => !editTeam.members?.some((member) => member?.id === id),
      );

      // TODO: camel case
      const res = await mutateUpdateTeam({
        variables: {
          companyTeamId: editTeam.id,
          input: {
            title: values.name.trim(),
            memberIds: newMemberIds,
            member_ids: newMemberIds,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update team',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTeam = async (team: QueryCompanyTeam) => {
    if (!team?.id) {
      return;
    }

    try {
      const res = await mutateDeleteTeam({
        variables: {
          teamId: team.id,
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete team',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCompanyMemberOptions = (): SelectProps['options'] => {
    if (!queryData?.company?.members) {
      return [];
    }

    return queryData.company.members.map((member) => ({
      label: member?.user?.name || member?.user?.email,
      value: member?.id as string,
    }));
  };

  const columns: ColumnProps<QueryCompanyTeam>[] = [
    {
      title: 'Team Name',
      dataIndex: 'title',
      width: 180,
    },
    {
      title: 'Members',
      render: (col, item) => {
        return (
          <Space>
            {item?.members?.slice(0, 13).map((member) => (
              <Avatar
                key={member?.id}
                size={32}
                imageSrc={member?.user?.profileImage}
                name={member?.user?.name || member?.user?.email}
              />
            ))}

            {item?.members && item.members.length > 13 && (
              <Avatar size={32} name={`+${item.members.length - 13}`} />
            )}
          </Space>
        );
      },
    },
    {
      title: 'Total Member',
      dataIndex: 'members.length',
      width: 140,
      align: 'center',
      sorter: countSort('members.length'),
    },
    {
      title: 'Action',
      width: 80,
      render: (col, item) => {
        const handleClickMenuItem = (key: string) => {
          if (key === 'view') {
            handleViewTeam(item);
          } else if (key === 'edit') {
            handleEditTeam(item);
          } else if (key === 'delete') {
            handleOpenDeleteTeamConfirmation(item);
          }
        };

        return (
          <Dropdown
            position="br"
            droplist={
              <Menu
                onClick={(e) => e.stopPropagation()}
                onClickMenuItem={handleClickMenuItem}
              >
                <Menu.Item key="view" onClick={(e) => e.stopPropagation()}>
                  View
                </Menu.Item>
                <Menu.Item key="edit" onClick={(e) => e.stopPropagation()}>
                  Edit
                </Menu.Item>
                <Menu.Item
                  className={styles['delete-txt']}
                  key="delete"
                  onClick={(e) => e.stopPropagation()}
                >
                  Delete
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

  const getData = (): QueryCompanyTeam[] => {
    let data = queryData?.company?.teams || [];

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      data = data.filter((team) =>
        team?.members?.some(
          (member) =>
            member?.user?.name?.match(regex) ||
            member?.user?.email?.match(regex),
        ),
      );
    }

    return data;
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
          },
        ]}
      />

      <Card className={styles.wrapper}>
        <Space direction="vertical" size={20}>
          <div>
            <Typography.Paragraph className={styles.title}>
              Team
            </Typography.Paragraph>

            <Grid.Row justify="space-between">
              <div>
                {currentMember?.type !== CompanyMemberType.Member && (
                  <Button
                    className={styles['theme-btn']}
                    icon={<MdAdd />}
                    onClick={handleBeforeAddTeam}
                  >
                    Add Team
                  </Button>
                )}
              </div>

              <Input
                style={{ width: 437 }}
                suffix={<MdSearch />}
                placeholder="Search by name or email"
                value={searchKeyword}
                onChange={handleUpdateSearchKeyword}
              />
            </Grid.Row>
          </div>

          <Table
            loading={queryLoading}
            data={getData()}
            columns={columns}
            border={false}
            pagination={false}
            scroll={{ x: 1000 }}
            onRow={(record) => ({
              onClick: () => handleViewTeam(record),
            })}
          />
        </Space>
      </Card>

      <EditTeamModal
        visible={visible}
        onCancel={handleCloseModal}
        loading={mutateCreateTeamLoading || mutateUpdateTeamLoading}
        onCreate={handleCreateTeam}
        onUpdate={handleUpdateTeam}
        companyMemberOptions={getCompanyMemberOptions()}
        companyTeam={editTeam}
      />
    </>
  );
};

const companyTeamsPageQuery = gql`
  query CompanyTeamsPage($companyId: ID!) {
    company(id: $companyId) {
      id
      teams {
        id
        title
        members {
          id
          user {
            id
            email
            name
            profileImage
          }
        }
      }
      members {
        ...EditTeamModalFragment
      }
    }
  }
  ${editTeamModalFragment}
`;

const createCompanyTeamMutation = gql`
  mutation CreateCompanyTeam($companyId: ID!, $input: CreateCompanyTeamInput!) {
    createCompanyTeam(companyId: $companyId, input: $input) {
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

const deleteCompanyTeamMutation = gql`
  mutation DeleteCompanyTeam($teamId: ID!) {
    deleteCompanyTeam(teamId: $teamId) {
      id
    }
  }
`;

export default CompanyTeamPage;
