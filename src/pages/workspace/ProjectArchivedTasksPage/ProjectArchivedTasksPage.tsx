import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Dropdown,
  Input,
  Menu,
  Pagination,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { escapeRegExp, flatten } from 'lodash-es';
import { useState } from 'react';
import { MdKeyboardBackspace, MdMoreVert } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import DuplicateProjectModal, {
  FormValues as DuplicateProjectFormValues,
} from '@/components/AppLayout/TaskSubNav/DuplicateProjectModal';
import EditProjectModal, {
  FormValues as ProjectFormValues,
} from '@/components/AppLayout/TaskSubNav/EditProjectModal';
import Message from '@/components/Message';
import Modal from '@/components/Modal';
import MoveProjectModal, {
  FormValues as MoveProjectFormValues,
} from '@/components/MoveProjectModal';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

import { getErrorMessage } from '@/utils/error.utils';
import { getStatusesUpdate, getVisibilityUpdate } from '@/utils/task.utils';

import { navigateProjectPage } from '@/navigation';

import { ArrayElement, SelectOption } from '@/types';

import {
  ProjectVisibility,
  RemoveFromProjectVisibilityWhitelistInput,
  AddToProjectVisibilityWhitelistInput,
  ProjectArchivedTasksPageQuery,
  ProjectArchivedTasksPageQueryVariables,
  EditProjectSettingsMutation,
  EditProjectSettingsMutationVariables,
  EditProjectStatusMutation,
  EditProjectStatusMutationVariables,
  AddToVisibilityWhitelistProjectMutation,
  AddToVisibilityWhitelistProjectMutationVariables,
  RemoveFromVisibilityWhitelistProjectMutation,
  RemoveFromVisibilityWhitelistProjectMutationVariables,
  CreateProjectStatusMutation,
  CreateProjectStatusMutationVariables,
  DeleteProjectStatusesMutation,
  DeleteProjectStatusesMutationVariables,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
  SetProjectVisibilityMutation,
  SetProjectVisibilityMutationVariables,
  DeleteProjectsMutation,
  DeleteProjectsMutationVariables,
  MoveProjectsToWorkspaceMutation,
  MoveProjectsToWorkspaceMutationVariables,
  UnarchiveTasksMutation,
  UnarchiveTasksMutationVariables,
  CopyProjectMutation,
  CopyProjectMutationVariables,
} from 'generated/graphql-types';

type QueryTask = ArrayElement<
  NonNullable<ProjectArchivedTasksPageQuery['project']>['tasks']
>;

type QueryTaskChildTask = ArrayElement<NonNullable<QueryTask>['childTasks']>;

const ProjectArchivedTasksPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { activeCompany } = useAppStore();
  const { activeWorkspace, workspaces, reload } = useWorkspaceStore();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    ProjectArchivedTasksPageQuery,
    ProjectArchivedTasksPageQueryVariables
  >(projectArchivedTaskPageQuery, {
    variables: {
      companyId: activeCompany?.id as string,
      projectId: projectId as string,
    },
    skip: !activeCompany?.id || !projectId,
  });
  const [mutateEditProjectSettings] = useMutation<
    EditProjectSettingsMutation,
    EditProjectSettingsMutationVariables
  >(editProjectSettingsMutation);
  const [mutateEditProjectStatus] = useMutation<
    EditProjectStatusMutation,
    EditProjectStatusMutationVariables
  >(editProjectStatusMutation);
  const [mutateUpdateProject] = useMutation<
    UpdateProjectMutation,
    UpdateProjectMutationVariables
  >(updateProjectMutation);
  const [mutateDeleteProjects] = useMutation<
    DeleteProjectsMutation,
    DeleteProjectsMutationVariables
  >(deleteProjectsMutation);
  const [mutateCreateProjectStatus] = useMutation<
    CreateProjectStatusMutation,
    CreateProjectStatusMutationVariables
  >(createProjectStatusMutation);
  const [mutateDeleteProjectStatuses] = useMutation<
    DeleteProjectStatusesMutation,
    DeleteProjectStatusesMutationVariables
  >(deleteProjectStatusesMutation);
  const [mutateAddToVisibilityWhitelistProject] = useMutation<
    AddToVisibilityWhitelistProjectMutation,
    AddToVisibilityWhitelistProjectMutationVariables
  >(addToVisibilityWhitelistProjectMutation);
  const [mutateRemoveFromVisibilityWhitelistProject] = useMutation<
    RemoveFromVisibilityWhitelistProjectMutation,
    RemoveFromVisibilityWhitelistProjectMutationVariables
  >(removeFromVisibilityWhitelistProjectMutation);
  const [mutateSetProjectVisibility] = useMutation<
    SetProjectVisibilityMutation,
    SetProjectVisibilityMutationVariables
  >(setProjectVisibilityMutation);
  const [
    mutateMoveProjectsToWorkspace,
    { loading: mutateMoveProjectsToWorkspaceLoading },
  ] = useMutation<
    MoveProjectsToWorkspaceMutation,
    MoveProjectsToWorkspaceMutationVariables
  >(moveProjectsToWorkspaceMutation);
  const [mutateCopyProject, { loading: mutateCopyProjectLoading }] =
    useMutation<CopyProjectMutation, CopyProjectMutationVariables>(
      copyProjectMutation,
    );
  const [mutateUnarchiveTasks] = useMutation<
    UnarchiveTasksMutation,
    UnarchiveTasksMutationVariables
  >(unarchiveTasksMutation);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [unarchivingTaskIds, setUnarchivingTaskIds] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [updateProjectLoading, setUpdateProjectLoading] =
    useState<boolean>(false);

  const modalState = {
    project: useDisclosure(),
    move: useDisclosure(),
    duplicate: useDisclosure(),
  };

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleUpdatePageIndex = (pageNumber: number) => {
    setPageIndex(pageNumber);
  };

  const handleBack = () => {
    if (!activeCompany?.slug || !projectId) {
      return;
    }

    navigateProjectPage({
      navigate,
      companySlug: activeCompany.slug,
      projectId,
    });
  };

  const handleClickMenuItem = (key: string) => {
    if (key === 'edit') {
      modalState.project.onOpen();
    } else if (key === 'move') {
      modalState.move.onOpen();
    } else if (key === 'duplicate') {
      modalState.duplicate.onOpen();
    } else if (key === 'delete') {
      handleOpenDeleteProjectConfirmation();
    }
  };

  const handleOpenDeleteProjectConfirmation = () => {
    Modal.confirmV2({
      title: 'Delete Project',
      content: 'Do you want to delete this project?',
      okText: 'Delete Project',
      onConfirm: async () => {
        await handleDeleteProject();
      },
    });
  };

  const handleUpdateProject = async (values: ProjectFormValues) => {
    if (!projectId) {
      return;
    }

    setUpdateProjectLoading(true);

    try {
      const columns = values.properties.reduce(
        (prev, property) => ({ ...prev, [property]: true }),
        {},
      );

      const res = await mutateUpdateProject({
        variables: {
          input: {
            projectId,
            name: values.name.trim(),
            ownerIds: values.ownerIds,
          },
        },
      });

      await handleUpdateProjectVisibility(values.visibility);
      await handleEditProjectSettings(columns, false);
      await handleUpdateProjectStatuses(values.statuses);

      if (!res.errors) {
        reload();
        refetchQuery();

        modalState.project.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update project',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateProjectLoading(false);
    }
  };

  const handleEditProjectSettings = async (
    columns: EditProjectSettingsMutationVariables['input']['columns'],
    shouldRefetch = true,
  ) => {
    if (!projectId) {
      return;
    }

    try {
      const res = await mutateEditProjectSettings({
        variables: {
          input: {
            projectId,
            columns,
          },
        },
      });

      if (!res.errors) {
        shouldRefetch && refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to edit project settings',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProjectStatuses = async (
    statuses: ProjectFormValues['statuses'],
  ) => {
    if (!projectId) {
      return;
    }

    try {
      const { newStatusesToCreate, statusesToUpdate, statusesToDelete } =
        getStatusesUpdate(queryData?.project?.projectStatuses, statuses);

      const createRes = await Promise.all(
        newStatusesToCreate.map((status) =>
          mutateCreateProjectStatus({
            variables: {
              input: {
                projectId,
                name: status.name.trim(),
                color: status.color,
                notify: status.notify,
              },
            },
          }),
        ),
      );

      const updateRes = await Promise.all(
        statusesToUpdate.map((status) =>
          mutateEditProjectStatus({
            variables: {
              input: {
                projectStatusId: status.id as string,
                name: status.name.trim(),
                color: status.color,
                notify: status.notify,
              },
            },
          }),
        ),
      );

      if (statusesToDelete.length) {
        const deleteStatusIds = statusesToDelete.map(
          (status) => status?.id as string,
        );

        await handleDeleteProjectStatuses(deleteStatusIds);
      }

      if (createRes.some((res) => res.errors)) {
        Message.error('Failed to create one or more project status');
      }

      if (updateRes.some((res) => res.errors)) {
        Message.error('Failed to update one or more project status');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProjectVisibility = async (
    visibility: ProjectFormValues['visibility'],
  ) => {
    if (!projectId) {
      return;
    }

    try {
      let res;

      // @ts-ignore
      if (queryData?.project?.visibility !== visibility.type) {
        res = await mutateSetProjectVisibility({
          variables: {
            input: {
              projectId,
              visibility: visibility.type,
            },
          },
        });
      }

      if (visibility.type === ProjectVisibility.Specific) {
        const { add, remove } = getVisibilityUpdate(
          {
            teamIds:
              queryData?.project?.visibilityWhitelist?.teams?.map(
                (team) => team?.id as string,
              ) || [],
            memberIds:
              queryData?.project?.visibilityWhitelist?.members?.map(
                (member) => member?.id as string,
              ) || [],
          },
          {
            teamIds: visibility.teamIds || [],
            memberIds: visibility.memberIds || [],
          },
        );

        if (add.teamIds.length || add.memberIds.length) {
          await handleAddToVisibilityWhitelistProject({
            projectId,
            teamIds: add.teamIds,
            memberIds: add.memberIds,
          });
        }

        if (remove.teamIds.length || remove.memberIds.length) {
          await handleRemoveFromVisibilityWhitelistProject({
            projectId,
            teamIds: remove.teamIds,
            memberIds: remove.memberIds,
          });
        }
      }

      if (res?.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to set project visibility',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProjectStatuses = async (projectStatusIds: string[]) => {
    try {
      const res = await mutateDeleteProjectStatuses({
        variables: {
          input: {
            projectStatusIds,
          },
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete project statuses',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToVisibilityWhitelistProject = async (
    input: AddToProjectVisibilityWhitelistInput,
  ) => {
    try {
      const res = await mutateAddToVisibilityWhitelistProject({
        variables: {
          input,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add member(s) to project visibility whitelist',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFromVisibilityWhitelistProject = async (
    input: RemoveFromProjectVisibilityWhitelistInput,
  ) => {
    try {
      const res = await mutateRemoveFromVisibilityWhitelistProject({
        variables: {
          input,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add member(s) to project visibility whitelist',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoveProject = async (values: MoveProjectFormValues) => {
    if (!projectId || !queryData?.project?.workspace?.id) {
      return;
    }

    try {
      const res = await mutateMoveProjectsToWorkspace({
        variables: {
          input: {
            projectIds: [projectId],
            sourceWorkspaceId: queryData.project.workspace.id,
            destinationWorkspaceId: values.workspaceId,
          },
        },
      });

      if (!res.errors) {
        reload();

        modalState.move.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to move project to another workspace',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDuplicateProject = async (values: DuplicateProjectFormValues) => {
    if (!projectId) {
      return;
    }

    try {
      const res = await mutateCopyProject({
        variables: {
          input: {
            projectId,
            targetWorkspaceId: values.workspaceId,
          },
        },
      });

      if (!res.errors) {
        reload();

        modalState.duplicate.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to duplicate project',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId) {
      return;
    }

    try {
      const res = await mutateDeleteProjects({
        variables: {
          input: {
            projectIds: [projectId],
          },
        },
      });

      if (!res.errors) {
        reload();

        navigate(`/${activeCompany?.slug}/workspaces`);
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete project',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnarchiveTask = async (task: QueryTask) => {
    if (!task?.id) {
      return;
    }

    setUnarchivingTaskIds((prev) => [...prev, task?.id as string]);

    try {
      const res = await mutateUnarchiveTasks({
        variables: {
          input: {
            task_ids: [task.id],
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to unarchive task',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUnarchivingTaskIds((prev) => prev.filter((id) => id !== task?.id));
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

  const getWorkspaceOptions = (): SelectOption[] => {
    const selectableWorkspaces = workspaces.filter(
      (workspace) => workspace?.id !== activeWorkspace?.id,
    );

    return selectableWorkspaces.map((workspace) => ({
      label: workspace?.name,
      value: workspace?.id as string,
    }));
  };

  const getDuplicateProjectWorkspaceOptions = (): SelectOption[] => {
    const otherWorkspaces = workspaces.filter(
      (workspace) => workspace?.id !== queryData?.project?.workspace?.id,
    );

    const otherWorkspaceOptions = otherWorkspaces.map((workspace) => ({
      label: workspace?.name,
      value: workspace?.id as string,
    }));

    return [
      {
        label: 'Same workspace',
        value: queryData?.project?.workspace?.id as string,
      },
      ...otherWorkspaceOptions,
    ];
  };

  const getCompanyTeamOptions = (): SelectOption[] => {
    if (!queryData?.companyTeams) {
      return [];
    }

    return queryData.companyTeams.map((team) => ({
      label: team?.title,
      value: team?.id as string,
    }));
  };

  const getVisibleTasks = () => {
    if (!queryData?.project?.tasks) {
      return [];
    }

    let tasks = queryData.project.tasks.filter((task) => task?.archived);
    let subtasks = flatten(
      queryData.project.tasks.map((task) =>
        task?.childTasks?.filter((task) => task?.archived),
      ),
    );

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      tasks = tasks.filter((task) => task?.name?.match(regex));
      subtasks = subtasks.filter((task) => task?.name?.match(regex));
    }

    return [...tasks, ...subtasks];
  };

  return (
    <>
      <div className="bg-white">
        <div className="flex h-14 items-center pt-4">
          <h1 className="flex-1 text-black">{queryData?.project?.name}</h1>

          <Dropdown
            trigger="click"
            position="br"
            droplist={
              <Menu onClickMenuItem={handleClickMenuItem}>
                <Menu.Item key="edit">Edit project</Menu.Item>
                <Menu.Item key="move">Move project</Menu.Item>
                <Menu.Item key="duplicate">Duplicate project</Menu.Item>
                <hr />
                <Menu.Item key="delete">Delete project</Menu.Item>
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

        <div className="px-5 pt-4">
          <span
            className="cursor-pointer text-gray-400 hover:text-brand-500"
            onClick={handleBack}
          >
            <MdKeyboardBackspace className="align-[-2px]" /> Back
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-300 px-5 pb-2">
          <h2 className="p-0">Archives</h2>

          <div>
            <Input.Search
              className="min-w-[200px]"
              allowClear
              placeholder="Enter keyword to search"
              value={searchKeyword}
              onChange={handleUpdateSearchKeyword}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-3">
          <div className="divide-y divide-gray-200 rounded border border-gray-200">
            {getVisibleTasks()
              ?.slice(pageIndex - 1, (pageIndex - 1) * 10 + 10)
              ?.map((task) => (
                <div key={task?.id} className="flex bg-white p-3">
                  <div className="flex-1 pr-3">
                    <div>
                      <b>{task?.name}</b> (
                      {(task as QueryTask)?.group?.name ||
                        (task as QueryTaskChildTask)?.parentTask?.group?.name}
                      )
                    </div>

                    <div>
                      {task?.archivedBy?.name || task?.archivedBy?.email}{' '}
                      <span className="text-gray-500">
                        {dayjs(task?.archivedAt).fromNow()}
                      </span>
                    </div>
                  </div>

                  <Button
                    loading={unarchivingTaskIds.some(
                      (taskId) => taskId === task?.id,
                    )}
                    onClick={() => handleUnarchiveTask(task as QueryTask)}
                  >
                    Restore
                  </Button>
                </div>
              ))}
          </div>

          <Pagination
            className="mt-4"
            total={getVisibleTasks().length}
            current={pageIndex}
            onChange={handleUpdatePageIndex}
          />
        </div>
      </div>

      <EditProjectModal
        visible={modalState.project.visible}
        onCancel={modalState.project.onClose}
        loading={updateProjectLoading}
        project={queryData?.project}
        companyTeamOptions={getCompanyTeamOptions()}
        companyMemberOptions={getCompanyMemberOptions()}
        onUpdate={handleUpdateProject}
      />

      <MoveProjectModal
        visible={modalState.move.visible}
        onCancel={modalState.move.onClose}
        loading={mutateMoveProjectsToWorkspaceLoading}
        workspaceOptions={getWorkspaceOptions()}
        onSubmit={handleMoveProject}
      />

      <DuplicateProjectModal
        visible={modalState.duplicate.visible}
        onCancel={modalState.duplicate.onClose}
        loading={mutateCopyProjectLoading}
        workspaceOptions={getDuplicateProjectWorkspaceOptions()}
        onSubmit={handleDuplicateProject}
      />
    </>
  );
};

const projectArchivedTaskPageQuery = gql`
  query ProjectArchivedTasksPage($companyId: ID!, $projectId: ID!) {
    companyTeams(companyId: $companyId) {
      id
      title
    }
    project(id: $projectId) {
      id
      name
      visibility
      workspace {
        id
      }
      projectSettings {
        columns
      }
      projectStatuses {
        id
        color
        name
        notify
      }
      owners {
        companyMember {
          id
          user {
            id
          }
        }
      }
      visibilityWhitelist {
        teams {
          id
        }
        members {
          id
        }
      }
      tasks {
        id
        name
        archived
        archivedAt
        archivedBy {
          id
          email
          name
        }
        group {
          id
          name
        }
        childTasks {
          id
          name
          archived
          archivedAt
          archivedBy {
            id
            email
            name
          }
          parentTask {
            id
            group {
              id
              name
            }
          }
        }
      }
      createdBy {
        id
      }
    }
  }
`;

const updateProjectMutation = gql`
  mutation UpdateProject($input: ProjectUpdateInput!) {
    updateProject(input: $input) {
      id
    }
  }
`;

const editProjectSettingsMutation = gql`
  mutation EditProjectSettings($input: ProjectSettingsEditInput!) {
    editProjectSettings(input: $input) {
      columns
    }
  }
`;

const createProjectStatusMutation = gql`
  mutation CreateProjectStatus($input: CreateProjectStatusInput!) {
    createProjectStatus(input: $input) {
      id
    }
  }
`;

const editProjectStatusMutation = gql`
  mutation EditProjectStatus($input: ProjectStatusEditInput!) {
    editProjectStatus(input: $input) {
      id
    }
  }
`;

const deleteProjectStatusesMutation = gql`
  mutation DeleteProjectStatuses($input: DeleteProjectStatusInput!) {
    deleteProjectStatuses(input: $input) {
      id
    }
  }
`;

const addToVisibilityWhitelistProjectMutation = gql`
  mutation AddToVisibilityWhitelistProject(
    $input: AddToProjectVisibilityWhitelistInput!
  ) {
    addToVisibilityWhitelistProject(input: $input) {
      id
    }
  }
`;

const removeFromVisibilityWhitelistProjectMutation = gql`
  mutation RemoveFromVisibilityWhitelistProject(
    $input: RemoveFromProjectVisibilityWhitelistInput!
  ) {
    removeFromVisibilityWhitelistProject(input: $input) {
      id
    }
  }
`;

const setProjectVisibilityMutation = gql`
  mutation SetProjectVisibility($input: SetProjectVisibilityInput!) {
    setProjectVisibility(input: $input) {
      id
    }
  }
`;

const deleteProjectsMutation = gql`
  mutation DeleteProjects($input: DeleteProjectsInput!) {
    deleteProjects(input: $input) {
      id
    }
  }
`;

const moveProjectsToWorkspaceMutation = gql`
  mutation MoveProjectsToWorkspace($input: MoveProjectsToWorkspaceInput!) {
    moveProjectsToWorkspace(input: $input) {
      id
    }
  }
`;

const unarchiveTasksMutation = gql`
  mutation UnarchiveTasks($input: UnarchiveTaskInput!) {
    unarchiveTasks(input: $input) {
      id
    }
  }
`;

const copyProjectMutation = gql`
  mutation CopyProject($input: CopyProjectInput!) {
    copyProject(input: $input) {
      id
    }
  }
`;

export default ProjectArchivedTasksPage;
