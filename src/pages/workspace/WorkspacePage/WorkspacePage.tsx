import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Dropdown, Menu } from '@arco-design/web-react';
import { useState } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import Message from '@/components/Message';
import Modal from '@/components/Modal';

import SearchTaskModal, {
  FormValues as SearchTaskFormValues,
} from '../ProjectPage/SearchTaskModal';
import TableView from './TableView';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';

import {
  navigateProjectPage,
  navigateWorkspaceArchivedProjectsPage,
} from '@/navigation';

import { ArrayElement, SelectOption } from '@/types';

import {
  WorkspacePageQuery,
  WorkspacePageQueryVariables,
  EditProjectGroupMutation,
  EditProjectGroupMutationVariables,
  DeleteProjectGroupsMutation,
  DeleteProjectGroupsMutationVariables,
} from 'generated/graphql-types';

type QueryProject = ArrayElement<
  NonNullable<WorkspacePageQuery['workspace']>['projects']
>;

type QueryProjectGroup = ArrayElement<NonNullable<QueryProject>['groups']>;

// type QueryTask = ArrayElement<NonNullable<QueryProjectGroup>['tasks']>;

const WorkspacePage = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const { workspaceId } = useParams();

  const { activeCompany } = useAppStore();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    WorkspacePageQuery,
    WorkspacePageQueryVariables
  >(workspacePageQuery, {
    variables: {
      workspaceId: workspaceId as string,
    },
    skip: !workspaceId,
  });
  const [mutateEditProjectGroup] = useMutation<
    EditProjectGroupMutation,
    EditProjectGroupMutationVariables
  >(editProjectGroupMutation);
  const [mutateDeleteProjectGroups] = useMutation<
    DeleteProjectGroupsMutation,
    DeleteProjectGroupsMutationVariables
  >(deleteProjectGroupsMutation);

  // const [view, setView] = useState<string>('table');
  const [searchValues, setSearchValues] = useState<SearchTaskFormValues>();

  const modalState = {
    search: useDisclosure(),
  };

  const handleClickMenuItem = (key: string) => {
    if (!activeCompany?.slug || !workspaceId) {
      return;
    }

    if (key === 'archived') {
      navigateWorkspaceArchivedProjectsPage({
        navigate,
        companySlug: activeCompany.slug,
        workspaceId,
      });
    }
  };

  // const handleChangeTab = (key: string) => {
  //   setView(key);
  // };

  const handleSearch = (values: SearchTaskFormValues | undefined) => {
    setSearchValues(values);

    modalState.search.onClose();
  };

  // const handleViewTask = (task: QueryTask) => {
  //   if (!task?.id || !activeCompany?.slug) {
  //     return;
  //   }

  //   navigateTask({
  //     navigate,
  //     companySlug: activeCompany.slug,
  //     taskId: task.id,
  //     location,
  //   });
  // };

  const handleViewProjectGroup = (group: QueryProjectGroup) => {
    const project = queryData?.workspace?.projects?.find((project) =>
      project?.groups?.some((projectGroup) => projectGroup?.id === group?.id),
    );
    if (!project?.id || !activeCompany?.slug) {
      return;
    }

    navigateProjectPage({
      navigate,
      companySlug: activeCompany.slug,
      projectId: project.id,
    });
  };

  const handleOpenDeleteProjectConfirmation = (group: QueryProjectGroup) => {
    Modal.confirmV2({
      title: 'Delete Project Group',
      content:
        'Do you want to delete this project group? All its tasks will be deleted as well.',
      okText: 'Delete Project Group',
      onConfirm: async () => {
        await handleDeleteProjectGroup(group);
      },
    });
  };

  const handleUpdateProjectGroup = async (
    group: QueryProjectGroup,
    title: string,
  ) => {
    if (!group?.id) {
      return;
    }

    try {
      const res = await mutateEditProjectGroup({
        variables: {
          input: {
            projectGroupId: group.id,
            name: title,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to edit project group',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProjectGroup = async (group: QueryProjectGroup) => {
    if (!group?.id) {
      return;
    }

    try {
      const res = await mutateDeleteProjectGroups({
        variables: {
          input: {
            projectGroupIds: [group.id],
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete project group',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCompanyMemberOptions = (): SelectOption[] => {
    if (!activeCompany?.members) {
      return [];
    }

    return activeCompany.members.map((member) => ({
      label: member?.user?.name || member?.user?.email,
      value: member?.id as string,
      extra: {
        profileImage: member?.user?.profileImage,
      },
    }));
  };

  return (
    <>
      <div className="bg-white">
        <div className="flex h-14 items-center pt-4">
          <h1 className="flex-1 text-black">{queryData?.workspace?.name}</h1>

          <Dropdown
            trigger="click"
            position="br"
            droplist={
              <Menu onClickMenuItem={handleClickMenuItem}>
                <Menu.Item key="archived">View archived projects</Menu.Item>
              </Menu>
            }
          >
            <div className="pr-2">
              <Button className="px-2" type="text">
                <MdMoreVert className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </Dropdown>
        </div>

        {/* Delete this and enable the commented tabs below when ready to release the rest of the features */}
        <TableView
          workspace={queryData?.workspace}
          searchValues={searchValues}
          companyMemberOptions={getCompanyMemberOptions()}
          onSearch={modalState.search.onOpen}
          onUpdateSearch={handleSearch}
          onUpdateProjectGroup={handleUpdateProjectGroup}
          onDeleteProjectGroup={handleOpenDeleteProjectConfirmation}
          onViewProjectGroup={handleViewProjectGroup}
        />

        {/* <Tabs
          className={styles.tabs}
          activeTab={view}
          onChange={handleChangeTab}
        >
          <Tabs.TabPane key="table" title="Table">
            <TableView
              workspace={queryData?.workspace}
              searchValues={searchValues}
              companyMemberOptions={getCompanyMemberOptions()}
              onSearch={modalState.search.onOpen}
              onUpdateSearch={handleSearch}
              onUpdateProjectGroup={handleUpdateProjectGroup}
              onDeleteProjectGroup={handleOpenDeleteProjectConfirmation}
              onViewProjectGroup={handleViewProjectGroup}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            key="calendar"
            title={<Tooltip content="Coming soon">Calendar</Tooltip>}
            disabled
          >
            <CalendarView
              workspace={queryData?.workspace}
              searchValues={searchValues}
              companyMemberOptions={getCompanyMemberOptions()}
              onSearch={modalState.search.onOpen}
              onUpdateSearch={handleSearch}
              onViewTask={handleViewTask}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            key="timeline"
            title={<Tooltip content="Coming soon">Timeline</Tooltip>}
            disabled
          >
            <TimelineView
              searchValues={searchValues}
              companyMemberOptions={getCompanyMemberOptions()}
              onSearch={modalState.search.onOpen}
              onUpdateSearch={handleSearch}
              onView={handleViewTask}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            key="chart"
            title={<Tooltip content="Coming soon">Charts</Tooltip>}
            disabled
          >
            <ChartView workspace={queryData?.workspace} />
          </Tabs.TabPane>
        </Tabs> */}
      </div>

      <SearchTaskModal
        visible={modalState.search.visible}
        onCancel={modalState.search.onClose}
        companyMemberOptions={getCompanyMemberOptions()}
        onSearch={handleSearch}
      />
    </>
  );
};

const taskFragment = gql`
  fragment WorkspacePageTaskFragment on Task {
    id
    name
    archived
    startDate
    endDate
    priority
    projectStatus {
      id
      color
    }
    members {
      id
      companyMember {
        id
        user {
          id
          email
          name
          profileImage
        }
      }
    }
    pics {
      id
      pic {
        id
        name
      }
    }
    watchers {
      companyMember {
        id
        user {
          id
          email
          name
          profileImage
        }
      }
    }
    attachments {
      id
    }
    comments {
      id
    }
  }
`;

const workspacePageQuery = gql`
  query WorkspacePage($workspaceId: ID!) {
    workspace(id: $workspaceId) {
      id
      name
      projects {
        id
        name
        archived
        projectStatuses {
          id
          color
          name
        }
        groups {
          id
          name
          tasks {
            ...WorkspacePageTaskFragment
            childTasks {
              ...WorkspacePageTaskFragment
            }
          }
        }
      }
    }
  }
  ${taskFragment}
`;

const editProjectGroupMutation = gql`
  mutation EditProjectGroup($input: EditProjectGroupInput!) {
    editProjectGroup(input: $input) {
      id
    }
  }
`;

const deleteProjectGroupsMutation = gql`
  mutation DeleteProjectGroups($input: DeleteProjectGroupInput!) {
    deleteProjectGroups(input: $input) {
      id
    }
  }
`;

export default WorkspacePage;
