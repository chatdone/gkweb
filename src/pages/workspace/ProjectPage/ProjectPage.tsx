import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Dropdown, Menu, Spin, Tabs } from '@arco-design/web-react';
import { isEmpty, last } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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

import AddProjectGroupModal, {
  FormValues as ProjectGroupFormValues,
} from './AddProjectGroupModal';
import AddTaskModal, { FormValues as AddTaskFormValues } from './AddTaskModal';
import BillingView from './BillingView';
import CalendarView from './CalendarView';
import ChartView from './ChartView';
import CreateCustomColumnModal, {
  FormValues as CreateCustomFormValues,
} from './CreateCustomColumnModal';
import DuplicateSubtaskModal, {
  FormValues as DuplicateSubtaskFormValues,
} from './DuplicateSubtaskModal';
import DuplicateTaskModal, {
  FormValues as DuplicateTaskFormValues,
} from './DuplicateTaskModal';
import EditableProjectDescription from './EditableProjectDescription';
import ImportTaskModal from './ImportTaskModal';
import KanbanView from './KanbanView';
import MoveSubtaskModal, {
  FormValues as MoveSubtaskFormValues,
} from './MoveSubtaskModal';
import MoveTaskModal, {
  FormValues as MoveTaskFormValues,
} from './MoveTaskModal';
import styles from './ProjectPage.module.less';
import SearchTaskModal, {
  FormValues as SearchTaskFormValues,
} from './SearchTaskModal';
import TableView from './TableView';
import TimelineView from './TimelineView';

import { useDisclosure } from '@/hooks';
import useTaskMutations from '@/hooks/useTaskMutations';
import { useAppStore } from '@/stores/useAppStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

import { TemplateService } from '@/services';

import { formatToCurrency } from '@/utils/currency.utils';
import { getUTC } from '@/utils/date.utils';
import { getErrorMessage } from '@/utils/error.utils';
import { getStatusesUpdate, getVisibilityUpdate } from '@/utils/task.utils';

import { PRE_TASk_MODAL_EVENT } from '@/constants/windowEvent.constants';

import {
  navigateCompanySubscriptionsPage,
  navigateProjectArchivedTasksPage,
  navigateTask,
  navigateProjectTabsPage,
} from '@/navigation';

import { tagGroupFragment } from '@/fragments';

import { ArrayElement, SelectOption } from '@/types';

import {
  Timesheet,
  ProjectVisibility,
  TimesheetArchiveStatus,
  CompanyMemberType,
  TaskUpdateInput,
  AddToProjectVisibilityWhitelistInput,
  RemoveFromProjectVisibilityWhitelistInput,
  ProjectPageQuery,
  ProjectPageQueryVariables,
  EditProjectSettingsMutation,
  EditProjectSettingsMutationVariables,
  EditProjectStatusMutation,
  EditProjectStatusMutationVariables,
  CreateProjectGroupMutation,
  CreateProjectGroupMutationVariables,
  EditProjectGroupMutation,
  EditProjectGroupMutationVariables,
  CreateTaskMutation,
  CreateTaskMutationVariables,
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
  DeleteTasksMutation,
  DeleteTasksMutationVariables,
  ArchiveTasksMutation,
  ArchiveTasksMutationVariables,
  StopMemberActivityTrackerMutation,
  StopMemberActivityTrackerMutationVariables,
  MoveTasksMutation,
  MoveTasksMutationVariables,
  DuplicateTasksMutation,
  DuplicateTasksMutationVariables,
  CopyProjectMutation,
  CopyProjectMutationVariables,
  UpdateProjectsArchivedStateMutation,
  UpdateProjectsArchivedStateMutationVariables,
  ImportTasksMutation,
  ImportTasksMutationVariables,
  UpdateTaskParentMutation,
  UpdateTaskParentMutationVariables,
  ChangeTaskPositionMutation,
  ChangeTaskPositionMutationVariables,
  DeleteProjectGroupsMutation,
  DeleteProjectGroupsMutationVariables,
  MoveTaskToMemberProjectPageMutation,
  MoveTaskToMemberProjectPageMutationVariables,
  CreateCustomColumnForGroupProjectPageMutation,
  CreateCustomColumnForGroupProjectPageMutationVariables,
  ToggleCustomColumnProjectPageMutation,
  ToggleCustomColumnProjectPageMutationVariables,
  EditCustomColumnForGroupProjectPageMutation,
  EditCustomColumnForGroupProjectPageMutationVariables,
  DeleteCustomColumnForGroupProjectPageMutation,
  DeleteCustomColumnForGroupProjectPageMutationVariables,
  DeleteCustomColumnForGroupInput,
  EditCustomColumnForGroupInput,
  ReorderGroupMutationProjectPageMutation,
  ReorderGroupMutationProjectPageMutationVariables,
  AddCustomValueToProjectPageMutation,
  AddCustomValueToProjectPageMutationVariables,
} from 'generated/graphql-types';

type QueryTask = ArrayElement<
  NonNullable<ProjectPageQuery['project']>['tasks']
>;

type QueryTaskChildTask = ArrayElement<NonNullable<QueryTask>['childTasks']>;

type QueryTimesheet = ArrayElement<
  NonNullable<ProjectPageQuery['getTimesheetsByCompanyMember']>
>;

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { activeCompany, getCurrentMember, reloadUser } = useAppStore();
  const {
    workspaces,
    getWorkspaceProjectGroupOptions,
    getWorkspaceProjectOptions,
    getNotActiveWorkspaceOptions,
    reload,
  } = useWorkspaceStore();

  const companyMember = getCurrentMember();

  // const { socket, addSocketEventHandler } = useContext(SocketContext);

  // useEffect(() => {
  //   console.log(socket);
  // }, [socket]);

  const { data: queryData, refetch: refetchQuery } = useQuery<
    ProjectPageQuery,
    ProjectPageQueryVariables
  >(projectPageQuery, {
    variables: {
      projectId: projectId as string,
      companyId: activeCompany?.id as string,
      companyMemberId: companyMember?.id as string,
      filters: {
        archived: {
          status: TimesheetArchiveStatus.False,
        },
      },
    },
    skip: !projectId || !activeCompany?.id || !companyMember?.id,
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
  const [
    mutateCreateProjectGroup,
    { loading: mutateCreateProjectGroupLoading },
  ] = useMutation<
    CreateProjectGroupMutation,
    CreateProjectGroupMutationVariables
  >(createProjectGroupMutation);
  const [mutateEditProjectGroup] = useMutation<
    EditProjectGroupMutation,
    EditProjectGroupMutationVariables
  >(editProjectGroupMutation);
  const [mutateCreateTask, { loading: mutateCreateTaskLoading }] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(createTaskMutation);
  const [mutateDeleteTasks] = useMutation<
    DeleteTasksMutation,
    DeleteTasksMutationVariables
  >(deleteTasksMutation);
  const [mutateArchiveTasks] = useMutation<
    ArchiveTasksMutation,
    ArchiveTasksMutationVariables
  >(archiveTasksMutation);
  const [mutateOngoingActivityTracker] = useMutation<
    StopMemberActivityTrackerMutation,
    StopMemberActivityTrackerMutationVariables
  >(stopMemberActivityTrackerMutation);
  const [mutateMoveTasks, { loading: mutateMoveTasksLoading }] = useMutation<
    MoveTasksMutation,
    MoveTasksMutationVariables
  >(moveTasksMutation);
  const [mutateDuplicateTasks, { loading: mutateDuplicateTasksLoading }] =
    useMutation<DuplicateTasksMutation, DuplicateTasksMutationVariables>(
      duplicateTasksMutation,
    );
  const [mutateCopyProject, { loading: mutateCopyProjectLoading }] =
    useMutation<CopyProjectMutation, CopyProjectMutationVariables>(
      copyProjectMutation,
    );
  const [mutateUpdateProjectArchivedState] = useMutation<
    UpdateProjectsArchivedStateMutation,
    UpdateProjectsArchivedStateMutationVariables
  >(updateProjectArchivedState);
  const [mutateImportTasks, { loading: mutateImportTasksLoading }] =
    useMutation<ImportTasksMutation, ImportTasksMutationVariables>(
      importTasksMutation,
    );
  const [mutateUpdateTaskParent, { loading: mutateUpdateTaskParentLoading }] =
    useMutation<UpdateTaskParentMutation, UpdateTaskParentMutationVariables>(
      updateTaskParentMutation,
    );
  const [mutateChangeTaskPosition] = useMutation<
    ChangeTaskPositionMutation,
    ChangeTaskPositionMutationVariables
  >(changeTaskPositionMutation);
  const [mutateDeleteProjectGroups] = useMutation<
    DeleteProjectGroupsMutation,
    DeleteProjectGroupsMutationVariables
  >(deleteProjectGroupsMutation);

  const [mutateMoveTaskToMember] = useMutation<
    MoveTaskToMemberProjectPageMutation,
    MoveTaskToMemberProjectPageMutationVariables
  >(moveTaskToMemberMutation);

  const [mutateCreateCustomColumnForGroup] = useMutation<
    CreateCustomColumnForGroupProjectPageMutation,
    CreateCustomColumnForGroupProjectPageMutationVariables
  >(createCustomColumnForGroupMutation);

  const [mutateEditCustomColumnForGroup] = useMutation<
    EditCustomColumnForGroupProjectPageMutation,
    EditCustomColumnForGroupProjectPageMutationVariables
  >(editCustomColumnForGroupMutation);

  const [mutateDeleteCustomColumnForGroup] = useMutation<
    DeleteCustomColumnForGroupProjectPageMutation,
    DeleteCustomColumnForGroupProjectPageMutationVariables
  >(deleteCustomColumnForGroupMutation);

  const [mutateToggleCustomColumn] = useMutation<
    ToggleCustomColumnProjectPageMutation,
    ToggleCustomColumnProjectPageMutationVariables
  >(toggleCustomColumnMutation);

  const [mutateReorderGroups] = useMutation<
    ReorderGroupMutationProjectPageMutation,
    ReorderGroupMutationProjectPageMutationVariables
  >(reorderGroupMutation);

  const [mutateAddCustomValueToTask] = useMutation<
    AddCustomValueToProjectPageMutation,
    AddCustomValueToProjectPageMutationVariables
  >(addCustomValueToTaskMutation);

  const {
    updateTask: [updateTask],
    assignTaskTags: [assignTaskTags],
    deleteTaskTags: [deleteTaskTags],
    assignTaskPics: [assignTaskPics],
    removeTaskPics: [removeTaskPics],
    addTaskWatchers: [addTaskWatchers],
    removeTaskWatchers: [removeTaskWatchers],
    assignTaskMembers: [assignTaskMembers],
    deleteTaskMembers: [deleteTaskMembers],
    createRecurringTask: [createRecurringTask],
    updateRecurringTask: [updateRecurringTask],
    deleteRecurringTask: [deleteRecurringTask],
    startTimesheetEntry: [startTimesheetEntry],
    stopTimesheet: [stopTimesheet],
  } = useTaskMutations();

  const [view, setView] = useState<string>('table');
  const [searchValues, setSearchValues] = useState<SearchTaskFormValues>();
  const [selectedTasksToPerform, setSelectedTasksToPerform] =
    useState<(QueryTask | QueryTaskChildTask)[]>();
  const [updateProjectLoading, setUpdateProjectLoading] =
    useState<boolean>(false);
  const [subtaskParent, setSubtaskParent] = useState<QueryTask>();
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [selectedCustomColumn, setSelectedCustomColumn] = useState<{
    current: { attributeId: string; name: string; type: string };
  }>();

  const modalState = {
    project: useDisclosure(),
    group: useDisclosure(),
    customColumn: useDisclosure(),
    task: useDisclosure(),
    import: useDisclosure(),
    search: useDisclosure(),
    move: useDisclosure(),
    duplicate: useDisclosure(),
    moveTask: useDisclosure(),
    duplicateTask: useDisclosure(),
    moveSubtask: useDisclosure(),
    duplicateSubtask: useDisclosure(),
  };

  useEffect(() => {
    refetchQuery();

    if (location?.hash) {
      const hash = location?.hash.replace('#', '');
      const allowedHash = [
        'table',
        'kanban',
        'calendar',
        'timeline',
        'chart',
        'billing',
      ];

      if (allowedHash.includes(hash)) {
        setView(hash);
      }
    }
  }, [location]);

  useEffect(() => {
    if (location.key === 'pre-task-modal' && queryData) {
      window.dispatchEvent(new CustomEvent(PRE_TASk_MODAL_EVENT));
    }
  }, [queryData]);

  const handleChangeTab = (key: string) => {
    setView(key);
  };

  const handleBeforeAddTask = () => {
    if (activeCompany?.currentSubscription?.taskQuota === 0) {
      Modal.info({
        title: 'Reached Plan Limit',
        content:
          companyMember?.type === CompanyMemberType.Admin
            ? 'You have reached your quota for number of tasks, please upgrade your plan'
            : 'You have reached your quota for number of tasks, please upgrade your plan or contact your admin',
        okText:
          companyMember?.type === CompanyMemberType.Admin
            ? 'Upgrade Plan'
            : undefined,
        onConfirm: () => {
          activeCompany.slug &&
            navigateCompanySubscriptionsPage({
              navigate,
              companySlug: activeCompany.slug,
            });
        },
      });
    } else {
      modalState.task.onOpen();
    }
  };

  const handleBeforeAddSubtask = (task: QueryTask) => {
    if (activeCompany?.currentSubscription?.taskQuota === 0) {
      Modal.info({
        title: 'Reached Plan Limit',
        content:
          companyMember?.type === CompanyMemberType.Admin
            ? 'You have reached your quota for number of tasks, please upgrade your plan'
            : 'You have reached your quota for number of tasks, please upgrade your plan or contact your admin',
        okText:
          companyMember?.type === CompanyMemberType.Admin
            ? 'Upgrade Plan'
            : undefined,
        onConfirm: () => {
          activeCompany.slug &&
            navigateCompanySubscriptionsPage({
              navigate,
              companySlug: activeCompany.slug,
            });
        },
      });
    } else {
      handleAddSubtask(task);
    }
  };

  const handleSetMoveTasks = (tasks: QueryTask[]) => {
    setSelectedTasksToPerform(tasks);

    modalState.moveTask.onOpen();
  };

  const handleSetDuplicateTasks = (tasks: QueryTask[]) => {
    setSelectedTasksToPerform(tasks);

    modalState.duplicateTask.onOpen();
  };

  const handleSetDuplicateSubtasks = (subtasks: QueryTaskChildTask[]) => {
    setSelectedTasksToPerform(subtasks);

    modalState.duplicateSubtask.onOpen();
  };

  const handleSetMoveSubtasks = (subtasks: QueryTaskChildTask[]) => {
    setSelectedTasksToPerform(subtasks);

    modalState.moveSubtask.onOpen();
  };

  const handleAddSubtask = (task: QueryTask) => {
    setSubtaskParent(task);

    modalState.task.onOpen();
  };

  const handleCloseMoveTaskModal = () => {
    modalState.moveTask.onClose();

    setSelectedTasksToPerform(undefined);
  };

  const handleCloseDuplicateTaskModal = () => {
    modalState.duplicateTask.onClose();

    setSelectedTasksToPerform(undefined);
  };

  const handleCloseMoveSubtaskModal = () => {
    modalState.moveSubtask.onClose();

    setSelectedTasksToPerform(undefined);
  };

  const handleCloseDuplicateSubtaskModal = () => {
    modalState.duplicateSubtask.onClose();

    setSelectedTasksToPerform(undefined);
  };

  const handleCloseAddTaskModal = () => {
    setSubtaskParent(undefined);
    modalState.task.onClose();
  };

  const handleViewTask = (task: QueryTask) => {
    if (!task?.id || !activeCompany?.slug) {
      return;
    }

    navigateTask({
      navigate,
      companySlug: activeCompany.slug,
      taskId: task.id,
      location,
    });
  };

  const handleDownloadTemplate = () => {
    TemplateService.downloadTaskTemplate();
  };

  const handleSearch = (values: SearchTaskFormValues | undefined) => {
    setSearchValues(values);

    modalState.search.onClose();
  };

  const handleBeforeDuplicateProject = () => {
    if (
      !activeCompany?.currentSubscription?.stripeSubscriptionId &&
      !activeCompany?.currentSubscription?.package?.isCustom
    ) {
      Modal.info({
        title: 'Reached Plan Limit',
        content:
          companyMember?.type === CompanyMemberType.Admin
            ? 'Project Duplication is only available to SME plan and above'
            : 'Project Duplication is only available to SME plan and above, please contact your admin or company owner"',
        okText:
          companyMember?.type === CompanyMemberType.Admin
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
      modalState.duplicate.onOpen();
    }
  };

  const handleClickMenuItem = (key: string) => {
    if (key === 'edit') {
      modalState.project.onOpen();
    } else if (key === 'move') {
      modalState.move.onOpen();
    } else if (key === 'duplicate') {
      handleBeforeDuplicateProject();
    } else if (key === 'archive') {
      handleOpenArchiveProjectConfirmation();
    } else if (key === 'archived-tasks') {
      activeCompany?.slug &&
        projectId &&
        navigateProjectArchivedTasksPage({
          navigate,
          companySlug: activeCompany.slug,
          projectId,
        });
    } else if (key === 'delete') {
      handleOpenDeleteProjectConfirmation();
    }
  };

  const handleOpenArchiveProjectConfirmation = () => {
    Modal.confirmV2({
      title: 'Archive Project',
      content: 'Do you want to archive this project?',
      okText: 'Archive Project',
      onConfirm: handleArchiveProject,
    });
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

  const handleOpenDeleteTasksConfirmation = (
    tasks: QueryTask[],
    callback?: () => void,
  ) => {
    Modal.confirmV2({
      title: tasks.length > 1 ? 'Delete Tasks' : 'Delete Task',
      content: `Do you want to delete ${
        tasks.length > 1 ? 'these tasks' : 'this task'
      }?`,
      okText: tasks.length > 1 ? 'Delete Tasks' : 'Delete Task',
      onConfirm: async () => {
        try {
          await handleDeleteTasks(tasks);

          callback?.();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleOpenArchiveTasksConfirmation = ({
    tasks,
    callback,
  }: {
    tasks: QueryTask[];
    callback?: () => void;
  }) => {
    const title = tasks.length > 1 ? `Archive tasks` : `Archive task`;

    Modal.confirmV2({
      title,
      content: `Do you want to archive ${
        tasks.length > 1 ? 'these tasks' : 'this task'
      }?`,
      okText: title,
      onConfirm: async () => {
        try {
          await handleArchiveTasks(tasks);

          callback?.();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleOpenDeleteProjectGroupConfirmation = (groupId: string) => {
    const title = 'Delete Project Group';

    Modal.confirmV2({
      title,
      content:
        'Do you want to delete this project group? All its tasks will be deleted as well.',
      okText: title,
      onConfirm: async () => {
        await handleDeleteProjectGroup(groupId);
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

  const handleUpdateProjectDescription = async (description: string) => {
    if (!projectId) {
      return;
    }

    const res = await mutateUpdateProject({
      variables: {
        input: {
          projectId,
          description: description.trim(),
        },
      },
    });

    if (!res.errors) {
      reload();
      refetchQuery();
      Message.success(getErrorMessage(res.errors), {
        title: 'Description updated',
      });
    } else {
      Message.error(getErrorMessage(res.errors), {
        title: 'Failed to update description',
      });
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

  const handleToggleCustomColumn = async (input: { attributeId: string }) => {
    try {
      if (!projectId) {
        return;
      }

      const { attributeId } = input;

      const res = await mutateToggleCustomColumn({
        variables: {
          input: {
            projectId,
            attributeId,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to toggle custom column',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReorderGroups = async (input: {
    reorderedGroups: { groupId: string; ordering: number }[];
  }) => {
    try {
      if (!projectId) {
        return;
      }

      const { reorderedGroups } = input;

      const res = await mutateReorderGroups({
        variables: {
          input: {
            projectId,
            reorderedGroups,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to reorder groups',
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

  const handleArchiveProject = async () => {
    if (!projectId) {
      return;
    }

    try {
      const res = await mutateUpdateProjectArchivedState({
        variables: {
          input: {
            projectIds: [projectId],
            archived: true,
          },
        },
      });

      if (!res.errors) {
        reload();

        navigate(`/${activeCompany?.slug}/workspaces`);
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to archive project',
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

        navigate(
          `/${activeCompany?.slug}/workspace/${queryData?.project?.workspace?.id}`,
        );
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete project',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateProjectGroup = async (values: ProjectGroupFormValues) => {
    if (!projectId) {
      return;
    }

    try {
      const res = await mutateCreateProjectGroup({
        variables: {
          input: {
            projectId,
            name: values.name,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        modalState.group.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create project group',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProjectGroup = async (groupId: string, title: string) => {
    try {
      const res = await mutateEditProjectGroup({
        variables: {
          input: {
            projectGroupId: groupId,
            name: title,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update project group',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProjectGroup = async (groupId: string) => {
    try {
      const res = await mutateDeleteProjectGroups({
        variables: {
          input: {
            projectGroupIds: [groupId],
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

  const handleSubmitCreateTask = async (values: AddTaskFormValues) => {
    const { timeline } = values;
    const [startDate, endDate] = timeline || [];

    try {
      await handleCreateTask({
        input: {
          name: values.name,
          groupId: values.groupId,
          projectStatusId: values.statusId,
          startDate: startDate ? getUTC(startDate) : undefined,
          endDate: endDate ? getUTC(endDate) : undefined,
          parentId: subtaskParent?.id,
        },
        memberIds: values.assigneeIds,
      });

      handleCloseAddTaskModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (payload: CreateTaskMutationVariables) => {
    if (!projectId) {
      return;
    }

    try {
      const res = await mutateCreateTask({
        variables: {
          ...payload,
          input: {
            projectId,
            ...payload.input,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
        reloadUser();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create task',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTask = async (task: QueryTask, input: TaskUpdateInput) => {
    try {
      const res = await updateTask({
        task,
        input,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update task',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImportTasks = async (files: File[]) => {
    if (!projectId) {
      return;
    }

    try {
      let importSuccessCount = 0;

      for (const file of files) {
        const res = await mutateImportTasks({
          variables: {
            input: {
              projectId,
              attachment: file,
            },
          },
        });

        if (res.errors) {
          Message.error(
            `Failed to import tasks from ${file.name}, only 500 tasks can be imported at a time.`,
          );
        } else {
          importSuccessCount++;
        }
      }

      if (importSuccessCount > 0) {
        Message.success('The tasks had been successfully imported');

        refetchQuery();

        modalState.import.onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoveTasks = async (values: MoveTaskFormValues) => {
    if (!selectedTasksToPerform || selectedTasksToPerform.length === 0) {
      return;
    }

    try {
      const res = await mutateMoveTasks({
        variables: {
          input: {
            projectGroupId: values.groupId,
            projectId: values.projectId,
            taskIds: selectedTasksToPerform.map((task) => task?.id as string),
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseMoveTaskModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to move tasks',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDuplicateTasks = async (values: DuplicateTaskFormValues) => {
    if (!selectedTasksToPerform || selectedTasksToPerform.length === 0) {
      return;
    }

    try {
      const res = await mutateDuplicateTasks({
        variables: {
          input: {
            projectGroupId: values.groupId,
            projectId: values.projectId,
            taskIds: selectedTasksToPerform.map((task) => task?.id as string),
          },
        },
      });

      if (!res.errors) {
        if (values.projectId === projectId) {
          refetchQuery();
        }

        handleCloseDuplicateTaskModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to duplicate tasks',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchiveTasks = async (tasks: QueryTask[]) => {
    try {
      const res = await mutateArchiveTasks({
        variables: {
          input: {
            task_ids: tasks.map((task) => task?.id as string),
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: `Failed to archive ${tasks.length > 1 ? 'tasks' : 'task'}`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoveSubtask = async (values: MoveSubtaskFormValues) => {
    if (!selectedTasksToPerform || selectedTasksToPerform.length === 0) {
      return;
    }

    try {
      const allRes = await Promise.all(
        selectedTasksToPerform.map((task) =>
          mutateUpdateTaskParent({
            variables: {
              input: {
                childTaskId: task?.id as string,
                destinationParentId: values.taskId,
              },
            },
          }),
        ),
      );

      if (allRes.some((res) => res.errors)) {
        Message.error('Failed to move one or more subtasks');
      }

      refetchQuery();

      handleCloseMoveSubtaskModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTaskMembers = async (task: QueryTask, memberIds: string[]) => {
    try {
      const res = await assignTaskMembers({
        task,
        memberIds,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add assignee',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTaskMembers = async (
    task: QueryTask,
    memberIds: string[],
  ) => {
    try {
      const res = await deleteTaskMembers({
        task,
        memberIds,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to remove assignee from task',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartTimesheetEntry = async (task: QueryTask) => {
    if (!companyMember?.id) {
      return;
    }

    try {
      const res = await startTimesheetEntry({
        task,
        companyMemberId: companyMember.id,
      });

      if (!res.errors) {
        Message.success('Timesheet started successfully');

        refetchQuery();
      } else {
        handlePauseOngoingTracker(task);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStopTimesheet = async (timesheet: QueryTimesheet) => {
    if (!timesheet?.id) {
      return;
    }

    try {
      const res = await stopTimesheet(timesheet as Timesheet);

      if (res && !res.errors) {
        Message.success('Timesheet has been stopped');

        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to stop timesheet',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePauseOngoingTracker = (task: QueryTask) => {
    Modal.confirmV2({
      title: 'Pause Activity Tracker',
      content: `Currently there is another ongoing activity tracker, do you want to pause it?`,
      okText: 'Pause Activity Tracker',
      onConfirm: async () => {
        try {
          const res = await mutateOngoingActivityTracker({
            variables: {
              memberId: companyMember?.id as string,
            },
          });

          if (!res.errors) {
            Message.success('Activity tracker paused successfully');

            handleStartTimesheetEntry(task);
          } else {
            Message.error(getErrorMessage(res.errors), {
              title: 'Failed to pause activity tracker',
            });
          }
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleAssignTaskTags = async (task: QueryTask, tagIds: string[]) => {
    try {
      const res = await assignTaskTags({
        task,
        tagIds,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add tags to task',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTaskTags = async (task: QueryTask, tagIds: string[]) => {
    try {
      const res = await deleteTaskTags({
        task,
        tagIds,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to remove tags from task',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTaskWatchers = async (
    task: QueryTask,
    memberIds: string[],
  ) => {
    if (!task?.id) {
      return;
    }

    try {
      const res = await addTaskWatchers({
        task,
        memberIds,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add watcher',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveTaskWatchers = async (
    task: QueryTask,
    memberIds: string[],
  ) => {
    if (!task?.id) {
      return;
    }

    try {
      const res = await removeTaskWatchers({
        task,
        memberIds,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to remove watcher',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignTaskPics = async (task: QueryTask, picIds: string[]) => {
    try {
      const res = await assignTaskPics({
        task,
        picIds,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add pic',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveTaskPics = async (task: QueryTask, picIds: string[]) => {
    try {
      const res = await removeTaskPics({
        task,
        picIds,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to remove pic',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateRecurringTask = async (
    task: QueryTask,
    cronString: string,
  ) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await createRecurringTask({
        task,
        cronString,
        companyId: activeCompany.id,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to make task recurring',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateRecurringTask = async (
    task: QueryTask,
    cronString: string,
  ) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await updateRecurringTask({
        task,
        cronString,
        companyId: activeCompany.id,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update recurring task',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTaskTemplate = async (task: QueryTask) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await deleteRecurringTask({
        task,
        companyId: activeCompany.id,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to remove recurring task',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTasks = async (tasks: QueryTask[]) => {
    try {
      const res = await mutateDeleteTasks({
        variables: {
          taskIds: tasks.map((task) => task?.id as string),
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: `Failed to delete ${tasks.length > 1 ? 'tasks' : 'task'}`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeTaskPosition = async ({
    task,
    position,
    projectStatusId,
    member,
  }: {
    task: QueryTask | QueryTaskChildTask;
    position: number;
    projectStatusId?: string;
    member?: { prevMemberId: string; newMemberId: string };
  }) => {
    if (!task?.id) {
      return;
    }

    if (member) {
      const movedRes = await mutateMoveTaskToMember({
        variables: {
          input: {
            taskId: task.id,
            sourceMemberId: member.prevMemberId,
            destinationMemberId: member.newMemberId,
          },
        },
      });

      if (!movedRes.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(movedRes.errors), {
          title: 'Failed to change task position',
        });
      }

      return;
    }

    try {
      const res = await mutateChangeTaskPosition({
        variables: {
          input: {
            taskId: task.id,
            posY: position,
            projectStatusId,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to change task position',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDuplicateSubtasks = async (
    values: DuplicateSubtaskFormValues,
  ) => {
    if (
      !selectedTasksToPerform ||
      selectedTasksToPerform.length === 0 ||
      !projectId
    ) {
      return;
    }

    try {
      const res = await mutateDuplicateTasks({
        variables: {
          input: {
            taskIds: selectedTasksToPerform.map((task) => task?.id as string),
            projectId,
            parentId: values.taskId,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseDuplicateSubtaskModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to duplicate subtasks',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCustomColumnForGroup = async (
    values: CreateCustomFormValues,
  ) => {
    try {
      const { groupIds, name, type } = values;

      const success: boolean[] = [];

      for (const groupId of groupIds) {
        const res = await mutateCreateCustomColumnForGroup({
          variables: {
            input: {
              groupId,
              name,
              type,
            },
          },
        });

        if (res.errors) {
          Message.error(getErrorMessage(res.errors), {
            title: 'Failed to create custom column',
          });
        } else {
          success.push(true);
        }
      }

      if (success.every((s) => s)) {
        Message.success('Successfully created custom column', {
          title: 'Success',
        });
      }

      refetchQuery();
      modalState.customColumn.onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCustomColumnGroup = async (
    input: DeleteCustomColumnForGroupInput,
  ) => {
    try {
      const { attributeId, groupId } = input;
      const res = await mutateDeleteCustomColumnForGroup({
        variables: {
          input: {
            attributeId,
            groupId,
          },
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete custom column',
        });
      } else {
        modalState.customColumn.onClose();
        setSelectedGroupIds([]);
        setSelectedCustomColumn(undefined);

        Message.success('Successfully deleted custom column', {
          title: 'Success',
        });
      }

      refetchQuery();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditCustomColumnGroup = async (
    input: EditCustomColumnForGroupInput,
  ) => {
    try {
      const { attributeId, groupId, name } = input;
      const res = await mutateEditCustomColumnForGroup({
        variables: {
          input: {
            attributeId,
            groupId,
            name,
          },
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to edit custom column',
        });
      } else {
        modalState.customColumn.onClose();
        setSelectedGroupIds([]);
        setSelectedCustomColumn(undefined);
        Message.success('Successfully edited custom column', {
          title: 'Success',
        });
      }

      refetchQuery();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenCreateCustomColumn = async (
    groupIds: string[],
    current?: { attributeId: string; name: string; type: string },
  ) => {
    setSelectedGroupIds(groupIds);

    if (current && current?.attributeId && current?.name) {
      // @ts-ignore
      setSelectedCustomColumn(current);
    }
    modalState.customColumn.onOpen();
  };

  const handleAddCustomValueToTask = async (input: {
    attributeId: string;
    value: string;
    taskId: string;
    groupId: string;
  }) => {
    try {
      if (!queryData?.tasks) {
        return;
      }
      const { attributeId, value, groupId, taskId } = input;

      const res = await mutateAddCustomValueToTask({
        variables: {
          input: {
            taskId,
            attributeId,
            groupId,
            value,
          },
        },
      });
      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add custom value to task',
        });
      } else {
        refetchQuery();
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

  const getProjectGroupOptions = (): SelectOption[] => {
    if (!queryData?.project?.groups) {
      return [];
    }

    return queryData.project.groups.map((group) => ({
      label: group?.name,
      value: group?.id as string,
    }));
  };

  const getProjectStatusOptions = (): SelectOption[] => {
    if (!queryData?.project?.projectStatuses) {
      return [];
    }

    return queryData.project.projectStatuses.map((status) => ({
      label: status?.name,
      value: status?.id as string,
    }));
  };

  const getWorkspaceOptions = (): SelectOption[] => {
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

  const getTaskOptions = (): SelectOption[] => {
    if (!queryData?.tasks) {
      return [];
    }

    return queryData.tasks.map((task) => ({
      label: task?.name,
      value: task?.id as string,
    }));
  };

  const getProjectTaskOptions = (): SelectOption[] => {
    if (!queryData?.project?.tasks) {
      return [];
    }

    const allTasks = queryData.project.tasks.reduce<
      (QueryTask | QueryTaskChildTask)[]
    >((prev, task) => [...prev, task, ...(task?.childTasks || [])], []);

    return allTasks.map((task) => ({
      label: task?.name,
      value: task?.id as string,
    }));
  };

  const totalEstimatedBudget = useMemo(() => {
    if (!queryData?.project?.tasks) {
      return 0;
    }

    return queryData.project.tasks.reduce((prev, task) => {
      if (task?.projectedCost) {
        return prev + task.projectedCost;
      }

      return prev;
    }, 0);
  }, [queryData?.project?.tasks]);

  const totalActualCost = useMemo(() => {
    if (!queryData?.project?.tasks) {
      return 0;
    }

    return queryData.project.tasks.reduce((prev, task) => {
      if (task?.actualCost) {
        return prev + task.actualCost;
      }

      return prev;
    }, 0);
  }, [queryData?.project?.tasks]);

  return (
    <>
      <Spin loading={!queryData} block size={30}>
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
                  <Menu.Item key="archive">Archive project</Menu.Item>
                  <hr />
                  <Menu.Item key="archived-tasks">
                    View archived tasks
                  </Menu.Item>
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

          <div className="flex">
            <EditableProjectDescription
              value={queryData?.project?.description || ''}
              onUpdate={(value) => handleUpdateProjectDescription(value)}
            />
          </div>

          {view === 'kanban' && (
            <div className="pl-4">
              <div className="text-gray-400">Total Value</div>
              <div className="w-60 rounded bg-white shadow">
                <div>
                  <div>
                    <div className={`relative h-12 w-full`}>
                      <div
                        className={`absolute bottom-0 left-0 h-1 border-b border-gray-200`}
                        style={{ width: '100%' }}
                      />

                      <div
                        className={`absolute top-0 left-0 flex h-full w-full items-center`}
                      >
                        <div className="w-1/2 py-2 pl-2">
                          <div className="leading-none">
                            RM{formatToCurrency(totalEstimatedBudget)}
                          </div>
                          <div className="text-xs opacity-50">Budget</div>
                        </div>

                        <div className="w-1/2 py-2 pl-2 p-2 border-l bg-green-50 text-green-600 border-green-500">
                          <div className="leading-none">
                            RM{formatToCurrency(totalActualCost)}
                          </div>
                          <div className="text-xs opacity-50">Actual</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <>
            <Tabs
              className={styles.tabs}
              activeTab={view}
              onChange={handleChangeTab}
              onClickTab={(key) =>
                navigateProjectTabsPage({
                  navigate,
                  companySlug: activeCompany?.slug as string,
                  projectId: queryData?.project?.id as string,
                  view: key,
                })
              }
            >
              <Tabs.TabPane key="table" title="Table" />
              <Tabs.TabPane key="kanban" title="Kanban" />
              <Tabs.TabPane key="calendar" title="Calendar" />
              <Tabs.TabPane key="timeline" title="Timeline" />
              <Tabs.TabPane key="chart" title="Charts" />
              <Tabs.TabPane key="billing" title="Billing" />
            </Tabs>

            {view === 'table' && (
              <TableView
                project={queryData?.project}
                tagGroups={queryData?.tagGroups}
                contacts={queryData?.contacts}
                timesheets={queryData?.getTimesheetsByCompanyMember}
                searchValues={searchValues}
                companyMemberOptions={getCompanyMemberOptions()}
                statusOptions={getProjectStatusOptions()}
                onView={handleViewTask}
                onOpenCustomColumnModal={handleOpenCreateCustomColumn}
                onDelete={handleOpenDeleteTasksConfirmation}
                onArchive={handleOpenArchiveTasksConfirmation}
                onCreateTask={({ groupId, name }) =>
                  handleCreateTask({
                    input: {
                      name,
                      groupId,
                    },
                  })
                }
                onAddGroup={modalState.group.onOpen}
                onAddTask={handleBeforeAddTask}
                onAddSubtask={handleBeforeAddSubtask}
                onImport={modalState.import.onOpen}
                onUpdateProjectGroup={handleUpdateProjectGroup}
                onDeleteProjectGroup={handleOpenDeleteProjectGroupConfirmation}
                onSearch={modalState.search.onOpen}
                onUpdateSearch={handleSearch}
                onMove={handleSetMoveTasks}
                onDuplicate={handleSetDuplicateTasks}
                onDuplicateSubtasks={handleSetDuplicateSubtasks}
                onMoveSubtasks={handleSetMoveSubtasks}
                onUpdateProperties={(properties) => {
                  const customColumn = properties?.filter(
                    (p) => p && p?.includes('-') && p?.length === 36,
                  );

                  if (!isEmpty(customColumn)) {
                    return handleToggleCustomColumn({
                      attributeId: last(customColumn) as string,
                    });
                  }

                  const defaultProperties = properties.filter(
                    (p) => !p.includes('-'),
                  );

                  const columns = defaultProperties.reduce(
                    (prev, property) => ({ ...prev, [property]: true }),
                    {},
                  );

                  handleEditProjectSettings(columns);
                }}
                onUpdateTask={handleUpdateTask}
                onAddTaskMembers={handleAddTaskMembers}
                onDeleteTaskMembers={handleDeleteTaskMembers}
                onStartTimesheetEntry={handleStartTimesheetEntry}
                onStopTimesheet={handleStopTimesheet}
                onAssignTags={handleAssignTaskTags}
                onDeleteTags={handleDeleteTaskTags}
                onAddWatchers={handleAddTaskWatchers}
                onRemoveWatchers={handleRemoveTaskWatchers}
                onAddTaskPics={handleAssignTaskPics}
                onRemoveTaskPics={handleRemoveTaskPics}
                onCreateRecurringTask={handleCreateRecurringTask}
                onUpdateRecurringTask={handleUpdateRecurringTask}
                onRemoveRecurringTask={handleDeleteTaskTemplate}
                onReorderGroups={handleReorderGroups}
                onAddCustomValueToTask={handleAddCustomValueToTask}
              />
            )}
            {view === 'kanban' && (
              <KanbanView
                project={queryData?.project}
                searchValues={searchValues}
                companyMemberOptions={getCompanyMemberOptions()}
                statusOptions={getProjectStatusOptions()}
                onAddTask={modalState.task.onOpen}
                onAddGroup={modalState.group.onOpen}
                onImport={modalState.import.onOpen}
                onSearch={modalState.search.onOpen}
                onUpdateSearch={handleSearch}
                onView={handleViewTask}
                onChangeTaskPosition={handleChangeTaskPosition}
              />
            )}
            {view === 'calendar' && (
              <CalendarView
                project={queryData?.project}
                searchValues={searchValues}
                companyMemberOptions={getCompanyMemberOptions()}
                statusOptions={getProjectStatusOptions()}
                onAddTask={modalState.task.onOpen}
                onAddGroup={modalState.group.onOpen}
                onImport={modalState.import.onOpen}
                onSearch={modalState.search.onOpen}
                onUpdateSearch={handleSearch}
                onViewTask={handleViewTask}
              />
            )}
            {view === 'timeline' && (
              <TimelineView
                project={queryData?.project}
                searchValues={searchValues}
                companyMemberOptions={getCompanyMemberOptions()}
                statusOptions={getProjectStatusOptions()}
                onAddTask={modalState.task.onOpen}
                onAddGroup={modalState.group.onOpen}
                onImport={modalState.import.onOpen}
                onSearch={modalState.search.onOpen}
                onUpdateSearch={handleSearch}
                onView={handleViewTask}
              />
            )}
            {view === 'chart' && <ChartView project={queryData?.project} />}
            {view === 'billing' && (
              <BillingView
                projectId={projectId}
                invoices={queryData?.billingInvoices}
                contacts={queryData?.contacts}
                taskOptions={getProjectTaskOptions()}
                companyMemberOptions={getCompanyMemberOptions()}
                refetchQuery={refetchQuery}
              />
            )}
          </>
        </div>
      </Spin>

      <EditProjectModal
        visible={modalState.project.visible}
        onCancel={modalState.project.onClose}
        loading={updateProjectLoading}
        project={queryData?.project}
        companyTeamOptions={getCompanyTeamOptions()}
        companyMemberOptions={getCompanyMemberOptions()}
        onUpdate={handleUpdateProject}
      />

      <AddProjectGroupModal
        visible={modalState.group.visible}
        onCancel={modalState.group.onClose}
        loading={mutateCreateProjectGroupLoading}
        onSubmit={handleCreateProjectGroup}
      />

      <AddTaskModal
        visible={modalState.task.visible}
        onCancel={handleCloseAddTaskModal}
        loading={mutateCreateTaskLoading}
        isSubtask={!!subtaskParent}
        projectGroupOptions={getProjectGroupOptions()}
        workspaceStatusOptions={getProjectStatusOptions()}
        companyMemberOptions={getCompanyMemberOptions()}
        onSubmit={handleSubmitCreateTask}
      />

      <SearchTaskModal
        visible={modalState.search.visible}
        onCancel={modalState.search.onClose}
        companyMemberOptions={getCompanyMemberOptions()}
        statusOptions={getProjectStatusOptions()}
        onSearch={handleSearch}
      />

      <MoveProjectModal
        visible={modalState.move.visible}
        onCancel={modalState.move.onClose}
        loading={mutateMoveProjectsToWorkspaceLoading}
        workspaceOptions={getNotActiveWorkspaceOptions()}
        onSubmit={handleMoveProject}
      />

      <DuplicateProjectModal
        visible={modalState.duplicate.visible}
        onCancel={modalState.duplicate.onClose}
        loading={mutateCopyProjectLoading}
        workspaceOptions={getWorkspaceOptions()}
        onSubmit={handleDuplicateProject}
      />

      <ImportTaskModal
        visible={modalState.import.visible}
        onCancel={modalState.import.onClose}
        loading={mutateImportTasksLoading}
        onImport={handleImportTasks}
        onDownloadTemplate={handleDownloadTemplate}
      />

      <MoveTaskModal
        visible={modalState.moveTask.visible}
        onCancel={handleCloseMoveTaskModal}
        loading={mutateMoveTasksLoading}
        workspaceOptions={getWorkspaceOptions()}
        workspaceProjectOptions={getWorkspaceProjectOptions()}
        projectGroupOptions={getWorkspaceProjectGroupOptions()}
        onSubmit={handleMoveTasks}
      />

      <DuplicateTaskModal
        visible={modalState.duplicateTask.visible}
        onCancel={handleCloseDuplicateTaskModal}
        loading={mutateDuplicateTasksLoading}
        workspaceOptions={getWorkspaceOptions()}
        workspaceProjectOptions={getWorkspaceProjectOptions()}
        projectGroupOptions={getWorkspaceProjectGroupOptions()}
        onSubmit={handleDuplicateTasks}
      />

      <MoveSubtaskModal
        visible={modalState.moveSubtask.visible}
        onCancel={handleCloseMoveSubtaskModal}
        loading={mutateUpdateTaskParentLoading}
        taskOptions={getTaskOptions()}
        onSubmit={handleMoveSubtask}
      />

      <DuplicateSubtaskModal
        visible={modalState.duplicateSubtask.visible}
        onCancel={handleCloseDuplicateSubtaskModal}
        loading={mutateDuplicateTasksLoading}
        taskOptions={getTaskOptions()}
        onSubmit={handleDuplicateSubtasks}
      />

      <CreateCustomColumnModal
        loading={true}
        groupIds={selectedGroupIds}
        //@ts-ignore
        current={selectedCustomColumn}
        visible={modalState.customColumn.visible}
        onCancel={() => {
          modalState.customColumn.onClose();
          setSelectedCustomColumn(undefined);
          setSelectedGroupIds([]);
        }}
        onDelete={handleDeleteCustomColumnGroup}
        onEdit={handleEditCustomColumnGroup}
        onSubmit={handleCreateCustomColumnForGroup}
      />
    </>
  );
};

const taskFragment = gql`
  fragment ProjectPageTaskFragment on Task {
    id
    name
    startDate
    endDate
    projectedCost
    priority
    plannedEffort
    dueReminder
    posY
    archived
    actualStart
    actualEnd
    actualCost
    customValues {
      value
      group {
        id
      }
      attribute {
        id
        name
        type
      }
    }
    parentTask {
      id
    }
    projectStatus {
      id
      name
      color
    }
    group {
      id
      name
      customColumns {
        enabled
        attribute {
          id
          name
          type
        }
      }
    }
    comments {
      id
    }
    attachments {
      id
    }
    members {
      id
      companyMember {
        id
      }
      user {
        id
        name
        email
        profileImage
      }
    }
    watchers {
      companyMember {
        id
      }
    }
    pics {
      id
      contact {
        id
      }
      pic {
        id
      }
    }
    tags {
      id
    }
    templateTask {
      id
      isRecurring
      recurringSetting {
        intervalType
        day
        month
        skipWeekend
      }
    }
  }
`;

const projectPageQuery = gql`
  query ProjectPage(
    $projectId: ID!
    $filters: FilterOptions
    $companyId: ID!
    $companyMemberId: ID!
  ) {
    project(id: $projectId) {
      id
      name
      visibility
      description
      members {
        id
        companyMember {
          id
        }
        user {
          name
          email
        }
      }
      workspace {
        id
      }
      groups {
        id
        name
        ordering
        customColumns {
          enabled
          attribute {
            id
            name
            type
          }
        }
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
      tasks(filters: $filters) {
        ...ProjectPageTaskFragment
        childTasks {
          ...ProjectPageTaskFragment
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
    tagGroups(companyId: $companyId) {
      ...TagGroupFragment
    }
    contacts(companyId: $companyId) {
      id
      name
      pics {
        id
        name
      }
    }
    companyTeams(companyId: $companyId) {
      id
      title
    }
    getTimesheetsByCompanyMember(companyMemberId: $companyMemberId) {
      id
      startDate
      endDate
      activity {
        task {
          id
        }
      }
    }
    tasks(companyId: $companyId) {
      id
      name
    }
    billingInvoices(projectId: $projectId) {
      id
      docNo
      docDate
      terms
      totalDiscounted
      totalTaxed
      totalReceived
      void
      contactPic {
        id
        name
        contact {
          id
        }
      }
      items {
        id
        unitPrice
        discountPercentage
        taxPercentage
        itemName
        billed
        task {
          id
          name
        }
      }
    }
  }
  ${taskFragment}
  ${tagGroupFragment}
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

const moveProjectsToWorkspaceMutation = gql`
  mutation MoveProjectsToWorkspace($input: MoveProjectsToWorkspaceInput!) {
    moveProjectsToWorkspace(input: $input) {
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

const createProjectGroupMutation = gql`
  mutation CreateProjectGroup($input: CreateProjectGroupInput!) {
    createProjectGroup(input: $input) {
      id
    }
  }
`;

const editProjectGroupMutation = gql`
  mutation EditProjectGroup($input: EditProjectGroupInput!) {
    editProjectGroup(input: $input) {
      id
    }
  }
`;

const createTaskMutation = gql`
  mutation CreateTask($input: TaskInput!, $memberIds: [ID], $picIds: [ID]) {
    createTask(input: $input, memberIds: $memberIds, picIds: $picIds) {
      id
    }
  }
`;

const deleteTasksMutation = gql`
  mutation DeleteTasks($taskIds: [ID]!) {
    deleteTasks(taskIds: $taskIds) {
      id
    }
  }
`;

const archiveTasksMutation = gql`
  mutation ArchiveTasks($input: ArchiveTaskInput!) {
    archiveTasks(input: $input) {
      id
    }
  }
`;

const stopMemberActivityTrackerMutation = gql`
  mutation StopMemberActivityTracker($memberId: ID!) {
    stopMemberActivityTracker(memberId: $memberId) {
      id
    }
  }
`;

const moveTasksMutation = gql`
  mutation MoveTasks($input: MoveTasksInput!) {
    moveTasks(input: $input) {
      id
    }
  }
`;

const duplicateTasksMutation = gql`
  mutation DuplicateTasks($input: DuplicateTasksInput!) {
    duplicateTasks(input: $input) {
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

const updateProjectArchivedState = gql`
  mutation UpdateProjectsArchivedState(
    $input: UpdateProjectsArchivedStateInput!
  ) {
    updateProjectsArchivedState(input: $input) {
      id
    }
  }
`;

const importTasksMutation = gql`
  mutation ImportTasks($input: ImportTasksInput!) {
    importTasks(input: $input) {
      imported
      failed
    }
  }
`;

const updateTaskParentMutation = gql`
  mutation UpdateTaskParent($input: UpdateTaskParentInput!) {
    updateTaskParent(input: $input) {
      sourceTask {
        id
      }
    }
  }
`;

const changeTaskPositionMutation = gql`
  mutation ChangeTaskPosition($input: ChangeTaskPositionInput!) {
    changeTaskPosition(input: $input) {
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

const moveTaskToMemberMutation = gql`
  mutation MoveTaskToMemberProjectPage($input: MoveTaskToMemberInput!) {
    moveTaskToMember(input: $input) {
      id
    }
  }
`;

const createCustomColumnForGroupMutation = gql`
  mutation CreateCustomColumnForGroupProjectPage(
    $input: CreateCustomColumnForGroupInput!
  ) {
    createCustomColumnForGroup(input: $input) {
      group {
        id
      }
    }
  }
`;

const editCustomColumnForGroupMutation = gql`
  mutation EditCustomColumnForGroupProjectPage(
    $input: EditCustomColumnForGroupInput!
  ) {
    editCustomColumnForGroup(input: $input) {
      group {
        id
      }
    }
  }
`;

const deleteCustomColumnForGroupMutation = gql`
  mutation DeleteCustomColumnForGroupProjectPage(
    $input: DeleteCustomColumnForGroupInput!
  ) {
    deleteCustomColumnForGroup(input: $input) {
      group {
        id
      }
    }
  }
`;

const toggleCustomColumnMutation = gql`
  mutation ToggleCustomColumnProjectPage(
    $input: ToggleEnabledCustomColumnInput!
  ) {
    toggleEnabledCustomColumn(input: $input) {
      attribute {
        id
      }
    }
  }
`;

const reorderGroupMutation = gql`
  mutation ReorderGroupMutationProjectPage($input: ReorderGroupInput!) {
    reorderGroups(input: $input) {
      id
    }
  }
`;

const addCustomValueToTaskMutation = gql`
  mutation AddCustomValueToProjectPage($input: AddCustomValueToTaskInput!) {
    addCustomValueToTask(input: $input) {
      value
    }
  }
`;

export default ProjectPage;
