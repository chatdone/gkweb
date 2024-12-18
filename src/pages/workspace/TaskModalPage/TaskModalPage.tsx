import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Badge,
  Button,
  Dropdown,
  Input,
  Menu,
  Modal as ArcoModal,
  Select,
  Tabs,
  Tag,
  Tooltip,
  TreeSelectProps,
  Spin,
  Divider,
} from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import { capitalize, head } from 'lodash-es';
import { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import {
  MdAdd,
  MdMoreVert,
  MdOutlinePause,
  MdOutlinePlayArrow,
  MdShare,
} from 'react-icons/md';
import {
  useLocation,
  useNavigate,
  Location,
  useParams,
  Link,
} from 'react-router-dom';

import { EditableCell } from '@/components';
import ErrorContent from '@/components/ErrorContent';
import Message from '@/components/Message';
import Modal from '@/components/Modal';
import { CascaderOption } from '@/components/SelectUserCascaderInput';
import TaskTimelinePicker from '@/components/TaskTimelinePIcker';

import CreateCustomColumnModal, {
  FormValues as CreateCustomFormValues,
} from '../ProjectPage/CreateCustomColumnModal';
import MoveSubtaskModal, {
  FormValues as MoveSubtaskFormValues,
} from '../ProjectPage/MoveSubtaskModal';
import ActivitiesPanel from './ActivitiesPanel';
import DedocoPanel from './DedocoPanel';
// import DedocoPanel from './DedocoPanel';
import DetailsPanel from './DetailsPanel';
import EditableDescription from './EditableDescription';
import SubtasksPanel from './SubtasksPanel';
import TaskModalVisibility from './TaskModalVisibility';
import { FormValues as TaskFormValues } from './TaskModalVisibility/TaskModalVisibility';

import { useDisclosure, useDuration } from '@/hooks';
import useTaskMutations from '@/hooks/useTaskMutations';
import { useAppStore } from '@/stores/useAppStore';

import { SocketContext } from 'contexts/socket';

import { DedocoService } from '@/services';

import { formatToCurrency } from '@/utils/currency.utils';
import { formatToHoursAndMinutes, getUTC } from '@/utils/date.utils';
import { getErrorMessage } from '@/utils/error.utils';
import {
  getTaskRecurringCronString,
  getTaskReminderOptions,
  getVisibilityUpdate,
} from '@/utils/task.utils';

import {
  TASK_NAME_MAX_LENGTH,
  TASK_PRIORITY_COLORS,
  TASK_RECURRING_CASCADER_OPTIONS,
} from '@/constants/task.constants';
import { PRE_TASk_MODAL_EVENT } from '@/constants/windowEvent.constants';

import {
  navigateCompanySubscriptionsPage,
  navigateTaskPage,
} from '@/navigation';

import Icons from '@/assets/icons';

import Configs from '@/configs';

import { tagGroupFragment } from '@/fragments';

import { ArrayElement, SelectOption, TaskRecurringType } from '@/types';

import {
  PackageTypes,
  TaskPriorityType,
  Timesheet,
  CompanyMemberType,
  TaskUpdateInput,
  TaskModalPageQuery,
  TaskModalPageQueryVariables,
  EditProjectSettingsMutation,
  EditProjectSettingsMutationVariables,
  CreateTaskMutation,
  CreateTaskMutationVariables,
  StopMemberActivityTrackerMutation,
  StopMemberActivityTrackerMutationVariables,
  ArchiveTasksMutation,
  ArchiveTasksMutationVariables,
  DeleteTasksMutation,
  DeleteTasksMutationVariables,
  UpdateTaskParentMutation,
  UpdateTaskParentMutationVariables,
  DuplicateTasksMutation,
  DuplicateTasksMutationVariables,
  RemoveFromTaskVisibilityWhitelistMutation,
  RemoveFromTaskVisibilityWhitelistMutationVariables,
  AddToTaskVisibilityWhitelistMutation,
  AddToTaskVisibilityWhitelistMutationVariables,
  SetTaskVisibilityMutation,
  SetTaskVisibilityMutationVariables,
  AddToTaskVisibilityWhitelistInput,
  RemoveFromTaskVisibilityWhitelistInput,
  CommonVisibility,
  AddCustomValueToTaskModalMutation,
  AddCustomValueToTaskModalMutationVariables,
  ProjectGroupCustomAttributeType,
  ToggleCustomColumnTaskModalPageMutation,
  ToggleCustomColumnTaskModalPageMutationVariables,
  CreateCustomColumnForGroupTaskModalMutation,
  CreateCustomColumnForGroupTaskModalMutationVariables,
} from 'generated/graphql-types';

type QueryTimesheet = ArrayElement<
  NonNullable<TaskModalPageQuery['getTimesheetsByCompanyMember']>
>;

type QueryTask = TaskModalPageQuery['task'];

type QueryTaskChildTask = ArrayElement<NonNullable<QueryTask>['childTasks']>;

const TaskModalPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    backgroundLocation: Location;
    visible?: boolean;
  };

  const {
    activeCompany,
    getCurrentMember,
    reloadUser,
    currentUser,
    isStartupPlan,
  } = useAppStore();
  const { socket, addSocketEventHandler } = useContext(SocketContext);

  const companyMember = getCurrentMember();

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<TaskModalPageQuery, TaskModalPageQueryVariables>(
    taskModalPageQuery,
    {
      variables: {
        companyId: activeCompany?.id as string,
        taskId: taskId as string,
        companyMemberId: companyMember?.id as string,
      },
      skip: !taskId || !activeCompany?.id || !companyMember?.id,
    },
  );
  const [mutateEditProjectSettings] = useMutation<
    EditProjectSettingsMutation,
    EditProjectSettingsMutationVariables
  >(editProjectSettingsMutation);
  const [mutateCreateTask] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(createTaskMutation);
  const [mutateOngoingActivityTracker] = useMutation<
    StopMemberActivityTrackerMutation,
    StopMemberActivityTrackerMutationVariables
  >(stopMemberActivityTrackerMutation);
  const [mutateArchiveTasks] = useMutation<
    ArchiveTasksMutation,
    ArchiveTasksMutationVariables
  >(archiveTasksMutation);
  const [mutateDeleteTasks] = useMutation<
    DeleteTasksMutation,
    DeleteTasksMutationVariables
  >(deleteTasksMutation);
  const [mutateUpdateTaskParent, { loading: mutateUpdateTaskParentLoading }] =
    useMutation<UpdateTaskParentMutation, UpdateTaskParentMutationVariables>(
      updateTaskParentMutation,
    );
  const [mutateDuplicateTasks] = useMutation<
    DuplicateTasksMutation,
    DuplicateTasksMutationVariables
  >(duplicateTasksMutation);

  const [mutateRemoveFromVisibilityWhitelistTask] = useMutation<
    RemoveFromTaskVisibilityWhitelistMutation,
    RemoveFromTaskVisibilityWhitelistMutationVariables
  >(removeFromTaskVisibilityWhitelistMutation);

  const [mutateAddToVisibilityWhitelistTask] = useMutation<
    AddToTaskVisibilityWhitelistMutation,
    AddToTaskVisibilityWhitelistMutationVariables
  >(addToTaskVisibilityWhitelist);

  const [mutateSetTaskVisibility] = useMutation<
    SetTaskVisibilityMutation,
    SetTaskVisibilityMutationVariables
  >(setTaskVisibilityMutation);

  const [mutateAddCustomValueToTask] = useMutation<
    AddCustomValueToTaskModalMutation,
    AddCustomValueToTaskModalMutationVariables
  >(addCustomValueToTaskMutation);

  const [mutateToggleCustomColumn] = useMutation<
    ToggleCustomColumnTaskModalPageMutation,
    ToggleCustomColumnTaskModalPageMutationVariables
  >(toggleCustomColumnMutation);

  const [mutateCreateCustomColumnForGroup] = useMutation<
    CreateCustomColumnForGroupTaskModalMutation,
    CreateCustomColumnForGroupTaskModalMutationVariables
  >(createCustomColumnForGroupMutation);

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

  // When open google drive modal, focus should be false
  // Else will have interaction issue when the google drive modal
  const [focusLock, setFocusLock] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(state.visible ?? true);
  const [taskName, setTaskName] = useState<string>('');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [subtasksToPerform, setSubtasksToPerform] =
    useState<QueryTaskChildTask[]>();
  const [dedocoDocumentsStatuses, setDedocoDocumentsStatuses] = useState<
    { [key: string]: unknown }[]
  >([]);

  const hasPermissionToViewTask = !!queryData?.task;
  const isAdminOrManager = companyMember?.type !== CompanyMemberType.Member;

  const modalState = {
    duplicateTask: useDisclosure(),
    moveSubtask: useDisclosure(),
    customColumn: useDisclosure(),
  };

  useEffect(() => {
    const handlePreTaskModalCallback = () => {
      setVisible(true);
    };

    window.addEventListener(PRE_TASk_MODAL_EVENT, handlePreTaskModalCallback);

    return () => {
      window.removeEventListener(
        PRE_TASk_MODAL_EVENT,
        handlePreTaskModalCallback,
      );
    };
  }, []);

  useEffect(() => {
    if (socket) {
      addSocketEventHandler('task:update', (socketTaskId) => {
        if (taskId === socketTaskId) {
          refetchQuery();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('task:update');
      }
    };
  }, [socket]);

  useEffect(() => {
    handleGetDedocoDocumentStatuses();
  }, [activeCompany, taskId]);

  useEffect(() => {
    if (queryData) {
      setTaskName(queryData.task?.name || '');
    }
  }, [queryData]);

  const handleGetDedocoDocumentStatuses = async () => {
    if (!activeCompany?.id || !taskId) {
      return;
    }

    try {
      const res = await DedocoService.getDocumentsStatuses({
        companyId: activeCompany.id,
        taskId: taskId,
      });

      setDedocoDocumentsStatuses(res.data);
    } catch (error) {
      Message.error(getErrorMessage(error), {
        title: 'Failed to retrieve dedoco documents list.',
      });
    }
  };

  const handleTaskNameChange = (value: string) => {
    setTaskName(value);
  };

  const handleClose = () => {
    navigate(state.backgroundLocation.pathname);
  };

  const handleSetSubtasksToMove = (subtasks: QueryTaskChildTask[]) => {
    setSubtasksToPerform(subtasks);

    modalState.moveSubtask.onOpen();
  };

  const handleCloseMoveSubtaskModal = () => {
    setSubtasksToPerform(undefined);

    modalState.moveSubtask.onClose();
  };

  const handleGoogleDriveOpen = (open: boolean) => {
    setFocusLock(!open);
  };

  const handleShareTask = () => {
    navigator.clipboard.writeText(window.location.href);

    Message.success('The link has been copied to your clipboard.');
  };

  const handleViewSubtask = (subtask: QueryTaskChildTask) => {
    if (!activeCompany?.slug || !subtask?.id) {
      return;
    }

    navigateTaskPage({
      navigate,
      companySlug: activeCompany.slug,
      taskId: subtask.id,
      location: location.state.backgroundLocation,
    });
  };

  const handleClickMenuItem = (key: string) => {
    if (key === 'archive') {
      handleOpenArchiveTaskConfirmation();
    } else if (key === 'delete') {
      handleOpenDeleteTaskConfirmation();
    }
  };

  const handleOpenArchiveTaskConfirmation = () => {
    const title = 'Archive subtask';

    Modal.confirmV2({
      title,
      content: `Do you want to archive this task?`,
      okText: title,
      onConfirm: async () => {
        try {
          await handleArchiveTasks([queryData?.task]);

          handleClose();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleOpenDeleteTaskConfirmation = () => {
    Modal.confirmV2({
      title: 'Delete Task',
      content: `Do you want to delete this task?`,
      okText: 'Delete Task',
      onConfirm: async () => {
        try {
          await handleDeleteTasks([queryData?.task], false);

          handleClose();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleOpenArchiveSubtasksConfirmation = ({
    subtasks,
    callback,
  }: {
    subtasks: QueryTaskChildTask[];
    callback?: () => void;
  }) => {
    const title = subtasks.length > 1 ? `Archive subtasks` : `Archive subtask`;

    Modal.confirmV2({
      title,
      content: `Do you want to archive ${
        subtasks.length > 1 ? 'these subtasks' : 'this subtask'
      }?`,
      okText: title,
      onConfirm: async () => {
        try {
          await handleArchiveTasks(subtasks);

          callback?.();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleOpenDeleteSubtasksConfirmation = ({
    subtasks,
    callback,
  }: {
    subtasks: QueryTaskChildTask[];
    callback?: () => void;
  }) => {
    Modal.confirmV2({
      title: subtasks.length > 1 ? 'Delete Subtasks' : 'Delete Subtask',
      content: `Do you want to delete ${
        subtasks.length > 1 ? 'these subtasks' : 'this subtask'
      }?`,
      okText: subtasks.length > 1 ? 'Delete Subtasks' : 'Delete Subtask',
      onConfirm: async () => {
        try {
          await handleDeleteTasks(subtasks);

          callback?.();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleOpenCancelDocumentSigningConfirmation = (input: {
    document: { [key: string]: unknown };
    workflowId: string;
  }) => {
    Modal.confirm({
      title: 'Void Document Signing',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to cancel this document signing?
        </div>
      ),
      onOk: async () => {
        await handleCancelDocumentSigning(input);
      },
    });
  };

  const handleBeforeCreateSubtask = (name: string) => {
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
      handleCreateSubtask(name);
    }
  };

  const handleBeforeStartTimesheetEntry = (
    task: QueryTask | QueryTaskChildTask,
  ) => {
    if (
      !activeCompany?.currentSubscription?.stripeSubscriptionId &&
      !activeCompany?.currentSubscription?.package?.isCustom
    ) {
      Modal.info({
        title: 'Reached Plan Limit',
        content:
          companyMember?.type === CompanyMemberType.Admin
            ? 'Time Tracking is not available in your current plan'
            : 'Time Tracking is not available in your current plan, please upgrade your plan or contact your admin',
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

      return;
    }

    handleStartTimesheetEntry(task);
  };

  const handleEditProjectSettings = async (properties: string[]) => {
    if (!queryData?.task?.project?.id) {
      return;
    }

    try {
      const columns = properties.reduce(
        (prev, property) => ({ ...prev, [property]: true }),
        {},
      );

      const res = await mutateEditProjectSettings({
        variables: {
          input: {
            projectId: queryData.task.project.id,
            columns,
          },
        },
      });
      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to edit project settings',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTask = async (input: TaskUpdateInput) => {
    try {
      const res = await updateTask({
        task: queryData?.task,
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

  const handleAddTaskMembers = async (
    task: QueryTask | QueryTaskChildTask,
    memberIds: string[],
  ) => {
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
    task: QueryTask | QueryTaskChildTask,
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

  const handleStartTimesheetEntry = async (
    task: QueryTask | QueryTaskChildTask,
  ) => {
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
    try {
      const res = await stopTimesheet(timesheet as Timesheet);

      if (!res.errors) {
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

  const handlePauseOngoingTracker = (task: QueryTask | QueryTaskChildTask) => {
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

  const handleAssignTaskTags = async (
    task: QueryTask | QueryTaskChildTask,
    tagIds: string[],
  ) => {
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

  const handleDeleteTaskTags = async (
    task: QueryTask | QueryTaskChildTask,
    tagIds: string[],
  ) => {
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
    task: QueryTask | QueryTaskChildTask,
    memberIds: string[],
  ) => {
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
    task: QueryTask | QueryTaskChildTask,
    memberIds: string[],
  ) => {
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

  const handleAssignTaskPics = async (
    task: QueryTask | QueryTaskChildTask,
    picIds: string[],
  ) => {
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

  const handleRemoveTaskPics = async (
    task: QueryTask | QueryTaskChildTask,
    picIds: string[],
  ) => {
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
    task: QueryTask | QueryTaskChildTask,
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
    task: QueryTask | QueryTaskChildTask,
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

  const handleDeleteTaskTemplate = async (
    task: QueryTask | QueryTaskChildTask,
  ) => {
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

  const handleDeleteTasks = async (
    tasks: (QueryTaskChildTask | QueryTask)[],
    isSubtask = true,
  ) => {
    try {
      const res = await mutateDeleteTasks({
        variables: {
          taskIds: tasks.map((task) => task?.id as string),
        },
        update(cache) {
          tasks.forEach((task) => {
            const normalizedId = cache.identify({
              id: task?.id,
              __typename: 'Task',
            });
            cache.evict({ id: normalizedId });
          });

          cache.gc();
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        const taskTitle = isSubtask ? 'subtask' : 'task';

        Message.error(getErrorMessage(res.errors), {
          title: `Failed to delete ${
            tasks.length > 1 ? `${taskTitle}s` : taskTitle
          }`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateSubtask = async (name: string) => {
    if (!taskId || !queryData?.task?.project?.id) {
      return;
    }

    try {
      const res = await mutateCreateTask({
        variables: {
          input: {
            name,
            parentId: taskId,
            projectId: queryData.task.project.id,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
        reloadUser();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create subtask',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateSubtask = async (
    subtask: QueryTaskChildTask,
    input: TaskUpdateInput,
  ) => {
    try {
      const res = await updateTask({
        task: subtask,
        input,
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update subtask',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchiveTasks = async (
    tasks: (QueryTaskChildTask | QueryTask)[],
    isSubtask = true,
  ) => {
    try {
      const res = await mutateArchiveTasks({
        variables: {
          input: {
            task_ids: tasks.map((task) => task?.id as string),
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          archiveTasks: tasks.map((task) => ({
            id: task?.id as string,
            archived: true,
            __typename: 'Task',
          })),
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        const taskTitle = isSubtask ? 'subtask' : 'task';

        Message.error(getErrorMessage(res.errors), {
          title: `Failed to archive ${
            tasks.length > 1 ? `${taskTitle}s` : taskTitle
          }`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoveSubtasks = async (values: MoveSubtaskFormValues) => {
    if (!subtasksToPerform || subtasksToPerform.length === 0) {
      return;
    }

    try {
      const allRes = await Promise.all(
        subtasksToPerform.map((subtask) =>
          mutateUpdateTaskParent({
            variables: {
              input: {
                childTaskId: subtask?.id as string,
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

  const handleDuplicateSubtasks = async (subtask: QueryTaskChildTask[]) => {
    if (!queryData?.task?.project?.id || !taskId) {
      return;
    }

    try {
      const res = await mutateDuplicateTasks({
        variables: {
          input: {
            taskIds: subtask.map((subtask) => subtask?.id as string),
            projectId: queryData.task.project.id,
            parentId: taskId,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to duplicate subtasks',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelDocumentSigning = async ({
    document,
    workflowId,
  }: {
    document: { [key: string]: unknown };
    workflowId: string;
  }) => {
    if (!activeCompany?.id || !taskId) {
      return;
    }

    try {
      const res = await DedocoService.cancelDocumentSigning({
        documentId: document.id as number,
        workflowId,
        taskId,
        companyId: activeCompany.id,
      });

      setDedocoDocumentsStatuses(res.data);
    } catch (error) {
      Message.error(getErrorMessage(error), {
        title: 'Failed to cancel process.',
      });
    }
  };

  const getTagGroupTreeData = (): TreeSelectProps['treeData'] => {
    if (!queryData?.tagGroups) {
      return [];
    }

    return queryData.tagGroups.map((group) => ({
      id: group?.id as string,
      title: group?.name,
      value: group?.id as string,
      children: group?.tags?.map((tag) => ({
        id: tag?.id as string,
        title: tag?.name,
        value: tag?.id,
      })),
    }));
  };

  const getContactCascaderOptions = (): CascaderOption[] => {
    if (!queryData?.contacts) {
      return [];
    }

    return queryData.contacts.map((contact) => ({
      label: contact?.name as string,
      value: contact?.id as string,
      children:
        contact?.pics?.map((pic) => ({
          label: pic?.name as string,
          value: pic?.id as string,
        })) || [],
    }));
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

  const getCompanyTeamOptions = (): SelectOption[] => {
    if (!queryData?.companyTeams) {
      return [];
    }

    return queryData.companyTeams.map((team) => ({
      label: team?.title,
      value: team?.id as string,
    }));
  };

  const getProjectStatusOptions = (): SelectOption[] => {
    if (!queryData?.task?.project?.projectStatuses) {
      return [];
    }

    return queryData.task.project.projectStatuses.map((status) => ({
      label: status?.name,
      value: status?.id as string,
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

  const getVisibleProperties = () => {
    if (!queryData?.task?.project?.projectSettings?.columns) {
      return [];
    }

    const defaultProperties = Object.keys(
      queryData.task.project.projectSettings.columns,
    );

    return defaultProperties;
  };

  const visiblePropertiesWithCustom = useMemo(() => {
    if (!queryData?.task?.project?.projectSettings?.columns) {
      return [];
    }

    const defaultProperties = Object.keys(
      queryData.task.project.projectSettings.columns,
    );

    const currentGroup = queryData?.task?.project?.groups?.filter(
      (g) => !g?.id?.includes('DEFAULT'),
    )[0];

    const customProperties = currentGroup?.customColumns
      ?.map((col) => col?.enabled && col?.attribute?.id)
      .filter((col) => col) as string[];

    customProperties.forEach((prop) => defaultProperties.push(prop));

    return defaultProperties;
  }, [queryData, queryData?.task?.project?.groups]);

  const getTaskTimesheets = () => {
    if (!taskId || !queryData?.getTimesheetsByCompanyMember) {
      return [];
    }

    return queryData.getTimesheetsByCompanyMember.filter(
      (sheet) => sheet?.activity?.task?.id === taskId,
    );
  };

  const getActiveTimesheet = () => {
    const timesheets = getTaskTimesheets();

    return timesheets?.find((timesheet) => !timesheet?.endDate);
  };

  const canAccessDedoco = () => {
    if (!queryData?.company?.activeSubscription) {
      return false;
    }

    return queryData.company.activeSubscription.some(
      (sub) =>
        sub?.type === PackageTypes.Dedoco &&
        sub.whiteListedMembers?.companyMembers?.some(
          (member) => member?.id === companyMember?.id,
        ),
    );
  };

  const customColumns = useMemo(() => {
    if (!queryData?.task?.project?.groups) {
      return [];
    }
    const currentGroup = queryData?.task?.project?.groups?.filter(
      (g) => !g?.id?.includes('DEFAULT'),
    )[0];

    const customColumns =
      currentGroup?.customColumns?.map((col) => {
        return {
          key: col?.attribute?.id as string,
          label: col?.attribute?.name as string,
          isEnabled: col?.enabled,
          type: col?.attribute?.type as string,
        };
      }) || [];

    return customColumns;
  }, [queryData?.task?.project?.groups]);

  const renderOptionalProperties = () => {
    const visibleProperties = getVisibleProperties();

    customColumns.forEach(
      (col) => col.isEnabled && visibleProperties.push(col.key),
    );

    let properties = [
      {
        key: 'timeline',
        label: 'Due date',
        component: () => {
          return (
            <TaskTimelinePicker
              value={[queryData?.task?.startDate, queryData?.task?.endDate]}
              onChange={([startDate, endDate]) =>
                handleUpdateTask({
                  startDate: getUTC(startDate),
                  endDate: getUTC(endDate),
                })
              }
              onClear={() =>
                handleUpdateTask({
                  startDate: null,
                  endDate: null,
                })
              }
            />
          );
        },
      },
      {
        key: 'assignee',
        label: 'Assignee',
        component: () => {
          return (
            <EditableCell
              type="user-select"
              options={getCompanyMemberOptions()}
              value={queryData?.task?.members?.map(
                (member) => member?.companyMember?.id as string,
              )}
              filterValue={queryData?.task?.watchers?.map(
                (watcher) => watcher?.companyMember?.id as string,
              )}
              onSubmit={(value) => {
                const newMemberIds = value.filter(
                  (val) =>
                    !queryData?.task?.members?.some(
                      (member) => member?.companyMember?.id === val,
                    ),
                );
                const memberIdsToRemove = queryData?.task?.members
                  ?.filter(
                    (member) =>
                      !value.includes(member?.companyMember?.id as string),
                  )
                  .map((member) => member?.companyMember?.id as string);

                if (newMemberIds.length) {
                  handleAddTaskMembers(queryData?.task, newMemberIds);
                }

                if (memberIdsToRemove?.length) {
                  handleDeleteTaskMembers(queryData?.task, memberIdsToRemove);
                }
              }}
            />
          );
        },
      },
      {
        key: 'watchers',
        label: 'Watchers',
        component: () => {
          return (
            <EditableCell
              type="user-select"
              options={getCompanyMemberOptions()}
              value={queryData?.task?.watchers?.map(
                (watcher) => watcher?.companyMember?.id as string,
              )}
              filterValue={queryData?.task?.members?.map(
                (member) => member?.companyMember?.id as string,
              )}
              onSubmit={(value) => {
                const newMemberIds = value.filter(
                  (val) =>
                    !queryData?.task?.watchers?.some(
                      (watcher) => watcher?.companyMember?.id === val,
                    ),
                );
                const memberIdsToRemove = queryData?.task?.watchers
                  ?.filter(
                    (watcher) =>
                      !value.includes(watcher?.companyMember?.id as string),
                  )
                  .map((watcher) => watcher?.companyMember?.id as string);

                if (newMemberIds.length) {
                  handleAddTaskWatchers(queryData?.task, newMemberIds);
                }

                if (memberIdsToRemove?.length) {
                  handleRemoveTaskWatchers(queryData?.task, memberIdsToRemove);
                }
              }}
            />
          );
        },
      },

      {
        key: 'contacts',
        label: 'Contacts',
        component: () => {
          const value = queryData?.task?.pics?.map((taskPic) => [
            taskPic?.contact?.id as string,
            taskPic?.pic?.id as string,
          ]);
          const picIds = queryData?.task?.pics?.map(
            (pic) => pic?.pic?.id as string,
          );

          return (
            <EditableCell
              type="user-cascader"
              showInputOnly
              options={getContactCascaderOptions()}
              value={value}
              onSubmit={(value) => {
                const finalPicIds = value.map((val) => val[1]);

                const picIdsToAdd = finalPicIds.filter(
                  (id) => !picIds?.includes(id),
                );
                const picIdsToRemove = picIds?.filter(
                  (id) => !finalPicIds.includes(id),
                );

                if (picIdsToAdd.length) {
                  handleAssignTaskPics(queryData?.task, picIdsToAdd);
                }

                if (picIdsToRemove?.length) {
                  handleRemoveTaskPics(queryData?.task, picIdsToRemove);
                }
              }}
            />
          );
        },
      },
      {
        key: 'tracking',
        label: 'Tracking',
        component: () => {
          const activeTimesheet = getActiveTimesheet();

          return (
            <TimeTracking
              activeTimesheet={activeTimesheet}
              onStart={() => handleBeforeStartTimesheetEntry(queryData?.task)}
              onStop={() =>
                activeTimesheet && handleStopTimesheet(activeTimesheet)
              }
            />
          );
        },
      },
      {
        key: 'priority',
        label: 'Priority',
        component: () => {
          const handleClickMenuItem = (key: string) => {
            if (key === queryData?.task?.priority) {
              return;
            }

            handleUpdateTask({ priority: key as TaskPriorityType });
          };

          return (
            <Dropdown
              trigger="click"
              droplist={
                <Menu onClickMenuItem={handleClickMenuItem}>
                  <Menu.Item key={TaskPriorityType.Low}>
                    <Badge color={TASK_PRIORITY_COLORS['LOW']} text="Low" />
                  </Menu.Item>

                  <Menu.Item key={TaskPriorityType.Medium}>
                    <Badge
                      color={TASK_PRIORITY_COLORS['MEDIUM']}
                      text="Medium"
                    />
                  </Menu.Item>

                  <Menu.Item key={TaskPriorityType.High}>
                    <Badge color={TASK_PRIORITY_COLORS['HIGH']} text="High" />
                  </Menu.Item>
                </Menu>
              }
            >
              <div className="cursor-pointer">
                {queryData?.task?.priority ? (
                  <Badge
                    color={TASK_PRIORITY_COLORS[queryData.task.priority]}
                    text={capitalize(queryData.task.priority.toString())}
                  />
                ) : (
                  <div className="px-1 hover:bg-gray-200">
                    <MdAdd className="text-gray-600 hover:text-gray-900" />
                  </div>
                )}
              </div>
            </Dropdown>
          );
        },
      },
      {
        key: 'value',
        label: 'Budget',
        component: () => {
          return (
            <EditableCell
              type="number"
              placeholder="RM"
              precision={2}
              min={0}
              value={queryData?.task?.projectedValue || undefined}
              onSubmit={(value) => handleUpdateTask({ projectedCost: +value })}
              renderContent={(value) => (
                <EditableCellContent value={value}>
                  <div>{formatToCurrency(value as number)}</div>
                </EditableCellContent>
              )}
            />
          );
        },
      },
      {
        key: 'effort',
        label: 'Targeted Hours',
        component: () => {
          return (
            <EditableCell
              type="number"
              placeholder="Hours"
              precision={2}
              min={0}
              value={
                queryData?.task?.plannedEffort
                  ? queryData.task.plannedEffort / 60
                  : undefined
              }
              onSubmit={(value) =>
                handleUpdateTask({ plannedEffort: +value * 60 })
              }
              renderContent={() => (
                <EditableCellContent value={queryData?.task?.plannedEffort}>
                  <div>
                    {(queryData?.task?.plannedEffort as number) / 60} hours
                  </div>
                </EditableCellContent>
              )}
            />
          );
        },
      },
      {
        key: 'reminder',
        label: 'Reminder',
        component: () => {
          const options = getTaskReminderOptions(queryData?.task);
          const selectedOption = options.find(
            (option) => option.value === queryData?.task?.dueReminder,
          );

          return queryData?.task?.startDate ? (
            <EditableCell
              type="single-select"
              placeholder="Please select"
              options={options}
              value={(selectedOption?.value as string) || undefined}
              onSubmit={(value) => handleUpdateTask({ dueReminder: value })}
              renderContent={(value) => {
                return (
                  <EditableCellContent value={value}>
                    <div>{selectedOption?.label}</div>
                  </EditableCellContent>
                );
              }}
            />
          ) : (
            <Tooltip content="Please set the task's timeline in order to use reminder">
              Not Available
            </Tooltip>
          );
        },
      },
      {
        key: 'recurrence',
        label: 'Recurrence',
        component: () => {
          const value: string[] = [];

          if (queryData?.task?.templateTask?.isRecurring) {
            value.push(
              queryData.task.templateTask.recurringSetting
                ?.intervalType as string,
            );

            if (
              queryData.task.templateTask.recurringSetting?.intervalType ===
              'DAILY'
            ) {
              queryData.task.templateTask.recurringSetting.skipWeekend
                ? value.push('working_day')
                : value.push('everyday');
            } else if (
              [
                'WEEKLY',
                'FIRST_WEEK',
                'SECOND_WEEK',
                'THIRD_WEEK',
                'FOURTH_WEEK',
                'MONTHLY',
              ].includes(
                queryData.task.templateTask.recurringSetting
                  ?.intervalType as string,
              )
            ) {
              value.push(
                queryData.task.templateTask.recurringSetting?.day?.toString() as string,
              );
            } else if (
              queryData.task.templateTask.recurringSetting?.intervalType ===
              'YEARLY'
            ) {
              value.push(
                (
                  (queryData.task.templateTask.recurringSetting
                    .month as number) + 1
                )?.toString() as string,
              );
              value.push(
                queryData.task.templateTask.recurringSetting.day?.toString() as string,
              );
            }
          }

          const options = queryData?.task?.templateTask?.isRecurring
            ? [
                ...TASK_RECURRING_CASCADER_OPTIONS,
                {
                  label: 'Remove',
                  value: 'remove',
                },
              ]
            : TASK_RECURRING_CASCADER_OPTIONS;

          return (
            <EditableCell
              type="cascader"
              showInputOnly={!!queryData?.task?.templateTask?.isRecurring}
              options={options}
              value={value}
              onSubmit={(value) => {
                if (
                  !activeCompany?.currentSubscription?.stripeSubscriptionId &&
                  !activeCompany?.currentSubscription?.package?.isCustom
                ) {
                  Modal.info({
                    title: 'Reached Plan Limit',
                    content:
                      companyMember?.type === CompanyMemberType.Admin
                        ? 'Task recurrence is only available to SME plan and above'
                        : 'Task recurrence is only available to SME plan and above, please contact the owner or admin.',
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

                  return;
                }

                const castValue = value as (string | number)[];

                if (castValue[0] === 'remove') {
                  handleDeleteTaskTemplate(queryData?.task);
                } else {
                  const cronString = getTaskRecurringCronString({
                    intervalType: castValue[0] as TaskRecurringType,
                    skipWeekend: castValue[1] === 'working_day',
                    day:
                      castValue[0] === 'YEARLY'
                        ? (castValue[2] as number)
                        : (castValue[1] as number),
                    month: castValue[1] as number,
                  });

                  queryData?.task?.templateTask?.isRecurring
                    ? handleUpdateRecurringTask(queryData.task, cronString)
                    : handleCreateRecurringTask(queryData?.task, cronString);
                }
              }}
              renderContent={(value) => (
                <EditableCellContent value={value}>
                  <></>
                </EditableCellContent>
              )}
            />
          );
        },
      },
      {
        key: 'tags',
        label: 'Tags',
        component: () => {
          return (
            <EditableCell
              type="tree-select"
              treeData={getTagGroupTreeData()}
              showInputOnly
              value={queryData?.task?.tags?.map((tag) => tag?.id as string)}
              onChange={(value) => {
                const tagIds = value.map((val) => val.value);

                const newTagIds = tagIds.filter(
                  (tagId) =>
                    !queryData?.task?.tags?.some((tag) => tag?.id === tagId),
                );
                const tagIdsToRemove = queryData?.task?.tags
                  ?.filter((tag) => !tagIds.includes(tag?.id as string))
                  .map((tag) => tag?.id as string);

                if (newTagIds.length) {
                  handleAssignTaskTags(queryData?.task, newTagIds);
                }

                if (tagIdsToRemove?.length) {
                  handleDeleteTaskTags(queryData?.task, tagIdsToRemove);
                }
              }}
            />
          );
        },
      },
    ];

    const customProperties = () => {
      return customColumns.map((col) => {
        return {
          key: col.key,
          label: col.label,
          component: () => {
            const customValue = queryData?.task?.customValues?.find(
              (custom) => custom?.attribute?.id === col.key,
            );
            const value = customValue?.value;

            if (col.type === ProjectGroupCustomAttributeType.Text) {
              return (
                <EditableCell
                  type="input"
                  showInputOnly
                  value={value?.toString() || ''}
                  onSubmit={(value) => {
                    handleAddCustomValueToTask({ attributeId: col.key, value });
                  }}
                />
              );
            } else {
              return (
                <EditableCell
                  type="number"
                  showInputOnly
                  step={1}
                  value={+(value || '')}
                  onSubmit={(value) => {
                    handleAddCustomValueToTask({
                      attributeId: col.key,
                      value: value?.toString(),
                    });
                  }}
                />
              );
            }
          },
        };
      });
    };

    customProperties().forEach((p) => properties.push(p));

    properties = properties.filter((property) =>
      visibleProperties.includes(property.key),
    );

    return properties.map((property) => (
      <RightPanelItem key={property.key} label={property.label}>
        {property.component()}
      </RightPanelItem>
    ));
  };

  const handleAddToVisibilityWhitelistTask = async (
    input: AddToTaskVisibilityWhitelistInput,
  ) => {
    try {
      const res = await mutateAddToVisibilityWhitelistTask({
        variables: {
          input,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add member(s) to task visibility whitelist',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFromVisibilityWhitelistTask = async (
    input: RemoveFromTaskVisibilityWhitelistInput,
  ) => {
    try {
      const res = await mutateRemoveFromVisibilityWhitelistTask({
        variables: {
          input,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add member(s) to workspace visibility whitelist',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTaskVisibility = async (visibility: TaskFormValues) => {
    if (!queryData?.task?.id) {
      return;
    }

    try {
      let res;

      // @ts-ignore
      if (queryData?.task.visibility !== visibility?.type) {
        res = await mutateSetTaskVisibility({
          variables: {
            input: {
              taskId: queryData?.task?.id,
              visibility: visibility.type,
            },
          },
        });
      }

      if (visibility.type === CommonVisibility.Specific) {
        const { add, remove } = getVisibilityUpdate(
          {
            teamIds:
              queryData?.task?.visibilityWhitelist?.teams?.map(
                (team) => team?.id as string,
              ) || [],
            memberIds:
              queryData?.task?.visibilityWhitelist?.members?.map(
                (member) => member?.id as string,
              ) || [],
          },
          {
            teamIds: visibility.teamIds || [],
            memberIds: visibility.memberIds || [],
          },
        );

        if (add.teamIds.length || add.memberIds.length) {
          await handleAddToVisibilityWhitelistTask({
            taskId: queryData?.task?.id,
            teamIds: add.teamIds,
            memberIds: add.memberIds,
          });
        }

        if (remove.teamIds.length || remove.memberIds.length) {
          await handleRemoveFromVisibilityWhitelistTask({
            taskId: queryData?.task?.id,
            teamIds: remove.teamIds,
            memberIds: remove.memberIds,
          });
        }
      }

      if (res?.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to set task visibility',
        });
      }

      refetchQuery();
    } catch (error) {
      console.error(error);
    }
  };

  const getCanEditTaskVisibility = () => {
    if (!queryData?.task) {
      return false;
    }

    const companyMember = getCurrentMember();

    return (
      companyMember?.type === CompanyMemberType.Admin ||
      companyMember?.type === CompanyMemberType.Manager ||
      queryData?.task?.createdBy?.id === currentUser?.id
    );
  };

  const handleToggleCustomColumn = async (input: { attributeId: string }) => {
    try {
      if (!queryData?.task?.project?.id) {
        return;
      }

      const { attributeId } = input;

      const res = await mutateToggleCustomColumn({
        variables: {
          input: {
            projectId: queryData?.task?.project?.id,
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

  const handleAddCustomValueToTask = async (input: {
    attributeId: string;
    value: string;
  }) => {
    try {
      if (!queryData?.task?.id) {
        return;
      }

      const { attributeId, value } = input;
      const groupIds = queryData?.task?.project?.groups
        ?.map((g) => g?.id)
        .filter((id) => !id?.includes('DEFAULT')) as string[];

      const res = await mutateAddCustomValueToTask({
        variables: {
          input: {
            taskId: queryData?.task?.id,
            attributeId,
            groupId: head(groupIds) as string,
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

  const propertyOptions = useMemo(() => {
    const baseOptions = [
      {
        label: 'Assignee',
        value: 'assignee',
      },
      {
        label: 'Watchers',
        value: 'watchers',
      },
      {
        label: 'Due date',
        value: 'timeline',
      },
      {
        label: 'Contacts',
        value: 'contacts',
      },
      {
        label: 'Tracking',
        value: 'tracking',
      },
      {
        label: 'Priority',
        value: 'priority',
      },
      {
        label: 'Budget',
        value: 'value',
      },
      {
        label: 'Targeted Hours',
        value: 'effort',
      },
      {
        label: 'Reminder',
        value: 'reminder',
      },
      {
        label: 'Recurrence',
        value: 'recurrence',
      },
      {
        label: 'Tags',
        value: 'tags',
      },
    ];

    const customOptions = customColumns.map((col) => ({
      label: col.label,
      value: col.key,
    }));

    customOptions.forEach((option) => baseOptions.push(option));

    return baseOptions;
  }, [queryData?.task?.project?.groups]);

  const handleOpenCreateCustomColumn = async (groupIds: string[]) => {
    setSelectedGroupIds(groupIds);
    modalState.customColumn.onOpen();
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

  return (
    <>
      <ArcoModal
        className="w-full max-w-5xl"
        visible={visible}
        onCancel={handleClose}
        autoFocus={false}
        focusLock={focusLock}
        footer={null}
        title={
          <div className="flex items-center pr-4">
            <div className="flex-1">Edit Task</div>

            <Button
              className="ml-2 text-sm"
              size="mini"
              type="text"
              icon={<MdShare className="h-4 w-4 text-gray-600" />}
              onClick={handleShareTask}
            />

            <Dropdown
              droplist={
                <Menu onClickMenuItem={handleClickMenuItem}>
                  <Menu.Item key="archive">Archive</Menu.Item>
                  <hr />
                  <Menu.Item key="delete">Delete</Menu.Item>
                </Menu>
              }
            >
              <Button
                className="ml-2 text-sm"
                size="mini"
                type="text"
                icon={<MdMoreVert className="h-4 w-4 text-gray-600" />}
              />
            </Dropdown>
          </div>
        }
      >
        {!queryData && queryLoading && (
          <Spin className="flex justify-center" size={50} />
        )}

        {queryData && !hasPermissionToViewTask && (
          <ErrorContent
            iconSrc={Icons.noPermission}
            title="You are not authorized to view this task."
          />
        )}

        {hasPermissionToViewTask && (
          <div className="-my-6 -mx-5 grid grid-cols-1 md:h-screen md:max-h-[80vh] md:grid-cols-3">
            <div className="col-span-2 overflow-auto border-b border-gray-200 md:border-r md:border-b-0">
              {queryData.task?.parentTask && (
                <Link
                  to={`/${activeCompany?.slug}/task/${queryData.task.parentTask.id}`}
                  state={{
                    backgroundLocation: location.state.backgroundLocation,
                  }}
                >
                  <div className="px-4 pt-2">
                    {queryData.task.parentTask.name}
                  </div>
                </Link>
              )}

              <div className="p-1">
                <Input
                  className="large bg-white font-semibold"
                  allowClear
                  placeholder="Add a task name"
                  maxLength={TASK_NAME_MAX_LENGTH}
                  value={taskName}
                  onChange={handleTaskNameChange}
                  onBlur={() => handleUpdateTask({ name: taskName.trim() })}
                  onPressEnter={() =>
                    handleUpdateTask({ name: taskName.trim() })
                  }
                />

                <EditableDescription
                  value={queryData?.task?.description || ''}
                  onUpdate={(value) => handleUpdateTask({ description: value })}
                />
              </div>

              <Tabs defaultActiveTab="details">
                <Tabs.TabPane key="details" title="Details">
                  <DetailsPanel
                    task={queryData?.task}
                    canAccessDedoco={canAccessDedoco()}
                    refetchQuery={refetchQuery}
                    onGoogleDriveOpen={handleGoogleDriveOpen}
                    onCompleteDedocoSigning={handleGetDedocoDocumentStatuses}
                  />
                </Tabs.TabPane>

                {!queryData.task?.parentTask?.id && (
                  <Tabs.TabPane key="subtasks" title="Subtasks">
                    <SubtasksPanel
                      isAdminOrManager={isAdminOrManager}
                      task={queryData.task}
                      timesheets={queryData.getTimesheetsByCompanyMember}
                      contacts={queryData.contacts}
                      tagGroups={queryData.tagGroups}
                      companyMemberOptions={getCompanyMemberOptions()}
                      statusOptions={getProjectStatusOptions()}
                      onView={handleViewSubtask}
                      onOpenCustomColumnModal={handleOpenCreateCustomColumn}
                      onUpdateProperties={(val) => {
                        const properties = visiblePropertiesWithCustom;

                        const currentSelections = properties;
                        const newSelections = val;
                        const added = head(
                          newSelections.filter(
                            (x) => !currentSelections?.includes(x),
                          ),
                        ) as string;

                        const removed = head(
                          currentSelections.filter(
                            (x) => !newSelections?.includes(x),
                          ),
                        ) as string;
                        if (added?.length === 36 || removed?.length === 36) {
                          const attributeIds = [added, removed].filter(
                            (a) => a,
                          );
                          handleToggleCustomColumn({
                            attributeId: head(attributeIds) as string,
                          });
                        } else {
                          const updatedDefaultProperties = val.filter(
                            (p) => !p.includes('-') && p?.length !== 36,
                          );

                          handleEditProjectSettings(updatedDefaultProperties);
                        }
                      }}
                      onCreateSubtask={handleBeforeCreateSubtask}
                      onUpdateSubtask={handleUpdateSubtask}
                      onStartTimesheetEntry={handleStartTimesheetEntry}
                      onStopTimesheet={handleStopTimesheet}
                      onAssignTags={handleAssignTaskTags}
                      onDeleteTags={handleDeleteTaskTags}
                      onAddTaskPics={handleAssignTaskPics}
                      onRemoveTaskPics={handleRemoveTaskPics}
                      onAddWatchers={handleAddTaskWatchers}
                      onRemoveWatchers={handleRemoveTaskWatchers}
                      onAddTaskMembers={handleAddTaskMembers}
                      onDeleteTaskMembers={handleDeleteTaskMembers}
                      onCreateRecurringTask={handleCreateRecurringTask}
                      onUpdateRecurringTask={handleUpdateRecurringTask}
                      onRemoveRecurringTask={handleDeleteTaskTemplate}
                      onArchive={handleOpenArchiveSubtasksConfirmation}
                      onMove={handleSetSubtasksToMove}
                      onDuplicate={handleDuplicateSubtasks}
                      onDelete={handleOpenDeleteSubtasksConfirmation}
                    />
                  </Tabs.TabPane>
                )}

                <Tabs.TabPane key="activities" title="Activities">
                  <ActivitiesPanel
                    taskActivities={queryData?.task?.taskActivities}
                  />
                </Tabs.TabPane>

                {/* TODO: Re-enable when release */}
                {Configs.env.ENABLE_DEDOCO && (
                  <Tabs.TabPane
                    key="signature"
                    title={
                      <Tooltip
                        content={
                          canAccessDedoco()
                            ? undefined
                            : 'Subscribe Dedoco to use this feature'
                        }
                      >
                        Signature
                      </Tooltip>
                    }
                    disabled={!canAccessDedoco()}
                  >
                    <DedocoPanel
                      documents={dedocoDocumentsStatuses}
                      onCancelSigning={
                        handleOpenCancelDocumentSigningConfirmation
                      }
                    />
                  </Tabs.TabPane>
                )}
              </Tabs>
            </div>

            <div className="col-span-1 overflow-auto bg-gray-100 p-2">
              <div className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
                <RightPanelItem label="Status">
                  <EditableCell
                    type="single-select"
                    options={getProjectStatusOptions()}
                    value={queryData?.task?.projectStatus?.id || undefined}
                    onSubmit={(value) =>
                      handleUpdateTask({ projectStatusId: value })
                    }
                    renderContent={(value) => (
                      <EditableCellContent value={value}>
                        <Tag
                          className="w-full cursor-pointer text-center"
                          bordered
                          color={
                            queryData?.task?.projectStatus?.color || undefined
                          }
                        >
                          {queryData?.task?.projectStatus?.name}
                        </Tag>
                      </EditableCellContent>
                    )}
                  />
                </RightPanelItem>

                {renderOptionalProperties()}
              </div>

              <div className="flex p-1.5">
                <Select
                  mode="multiple"
                  options={propertyOptions}
                  value={visiblePropertiesWithCustom}
                  onChange={(val: string[]) => {
                    const properties = visiblePropertiesWithCustom;

                    const currentSelections = properties;
                    const newSelections = val;
                    const added = head(
                      newSelections.filter(
                        (x) => !currentSelections?.includes(x),
                      ),
                    ) as string;

                    const removed = head(
                      currentSelections.filter(
                        (x) => !newSelections?.includes(x),
                      ),
                    ) as string;
                    if (added?.length === 36 || removed?.length === 36) {
                      const attributeIds = [added, removed].filter((a) => a);
                      handleToggleCustomColumn({
                        attributeId: head(attributeIds) as string,
                      });
                    } else {
                      const updatedDefaultProperties = val.filter(
                        (p) => !p.includes('-') && p?.length !== 36,
                      );

                      handleEditProjectSettings(updatedDefaultProperties);
                    }
                  }}
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      {isAdminOrManager && !isStartupPlan() && (
                        <>
                          <Divider style={{ margin: 0 }} />
                          <Button
                            type="text"
                            size="mini"
                            className="w-full my-1"
                            onClick={() => {
                              const groupIds = queryData?.task?.project?.groups
                                ?.map((group) => group?.id as string)
                                ?.filter((id) => id) as string[];
                              handleOpenCreateCustomColumn(groupIds);
                            }}
                          >
                            <IconPlus />
                            Column
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                  dropdownMenuStyle={{ maxHeight: 150 }}
                  triggerElement={
                    <div className="w-40">
                      <Button icon={<MdAdd />}>Property</Button>
                    </div>
                  }
                />
              </div>

              <>
                <hr />

                <h4 className="p-2">Actual</h4>

                <div className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
                  <RightPanelItem label="Actual Date">
                    <TaskTimelinePicker
                      value={[
                        queryData?.task?.actualStart,
                        queryData?.task?.actualEnd,
                      ]}
                      onChange={([startDate, endDate]) =>
                        handleUpdateTask({
                          actualStart: getUTC(startDate),
                          actualEnd: getUTC(endDate),
                        })
                      }
                      onClear={() =>
                        handleUpdateTask({
                          actualStart: null,
                          actualEnd: null,
                        })
                      }
                    />
                  </RightPanelItem>

                  <RightPanelItem label="Actual Cost">
                    <EditableCell
                      type="number"
                      placeholder="RM"
                      precision={2}
                      min={0}
                      value={
                        queryData?.task?.actualEffort ||
                        queryData?.task?.approvedCost ||
                        undefined
                      }
                      onSubmit={(value) =>
                        handleUpdateTask({ actualValue: +value })
                      }
                      renderContent={(value) => (
                        <EditableCellContent value={value}>
                          <div>{formatToCurrency(value as number)}</div>
                        </EditableCellContent>
                      )}
                    />
                  </RightPanelItem>

                  <RightPanelItem label="Effort">
                    {/* TODO: Re-enable in the future */}
                    {/* <EditableCell
                        type="number"
                        placeholder="Hours"
                        precision={2}
                        min={0}
                        value={
                          queryData?.task?.actualEffort
                            ? queryData.task.actualEffort / 60
                            : undefined
                        }
                        onSubmit={(value) =>
                          handleUpdateTask({ actualEffort: +value * 60 })
                        }
                        renderContent={() => (
                          <EditableCellContent
                            value={queryData?.task?.actualEffort}
                          >
                            <div>
                              {(queryData?.task?.actualEffort as number) / 60}{' '}
                              hours
                            </div>
                          </EditableCellContent>
                        )}
                      /> */}

                    {queryData.task?.timeSpent
                      ? formatToHoursAndMinutes(queryData.task.timeSpent)
                      : '-'}
                  </RightPanelItem>
                </div>
              </>

              {getCanEditTaskVisibility() && (
                <>
                  <div className="mt-6"></div>
                  <hr />
                  <h4 className="p-2">Visibility</h4>
                  <div className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
                    <TaskModalVisibility
                      loading={queryLoading}
                      companyMemberOptions={getCompanyMemberOptions()}
                      companyTeamOptions={getCompanyTeamOptions()}
                      task={queryData?.task}
                      onUpdate={handleUpdateTaskVisibility}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </ArcoModal>

      <MoveSubtaskModal
        visible={modalState.moveSubtask.visible}
        onCancel={handleCloseMoveSubtaskModal}
        loading={mutateUpdateTaskParentLoading}
        taskOptions={getTaskOptions()}
        onSubmit={handleMoveSubtasks}
      />

      <CreateCustomColumnModal
        loading={false}
        groupIds={selectedGroupIds}
        visible={modalState.customColumn.visible}
        onCancel={modalState.customColumn.onClose}
        onSubmit={handleCreateCustomColumnForGroup}
      />
    </>
  );
};

const RightPanelItem = ({
  label,
  children,
}: {
  label: string | ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className="flex px-2 py-3">
      <div className="flex-1">{label}</div>

      <div className="w-40">{children}</div>
    </div>
  );
};

const EditableCellContent = ({
  children,
  value,
}: {
  children: ReactNode;
  value: unknown | undefined;
}) => {
  return (Array.isArray(value) ? value.length > 0 : value) ? (
    <>{children}</>
  ) : (
    <div className="cursor-pointer px-1 hover:bg-gray-200">
      <MdAdd className="text-gray-600 hover:text-gray-900" />
    </div>
  );
};

const TimeTracking = ({
  activeTimesheet,
  onStart,
  onStop,
}: {
  activeTimesheet: QueryTimesheet | undefined;
  onStart: () => void;
  onStop: () => void;
}) => {
  const { duration } = useDuration({
    date: activeTimesheet?.startDate,
  });

  return (
    <Button
      className="w-full text-center"
      size="mini"
      icon={activeTimesheet ? <MdOutlinePause /> : <MdOutlinePlayArrow />}
      type={activeTimesheet ? 'primary' : 'secondary'}
      status={activeTimesheet ? 'success' : undefined}
      onClick={activeTimesheet ? onStop : onStart}
    >
      {activeTimesheet ? duration : 'Start'}
    </Button>
  );
};

const taskFragment = gql`
  fragment TaskModalPageTaskFragment on Task {
    id
    name
    startDate
    endDate
    actualStart
    actualEnd
    projectedValue
    actualValue
    plannedEffort
    actualEffort
    priority
    dueReminder
    timeSpent
    approvedCost
    visibility
    customValues {
      value
      attribute {
        id
      }
    }
    project {
      groups {
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
    }
    createdBy {
      id
    }
    visibilityWhitelist {
      teams {
        id
      }
      members {
        id
      }
    }

    projectStatus {
      id
      name
      color
    }
    checklists {
      id
      title
      checked
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

const taskModalPageQuery = gql`
  query TaskModalPage($taskId: ID!, $companyId: ID!, $companyMemberId: ID!) {
    task(taskId: $taskId) {
      ...TaskModalPageTaskFragment
      description
      parentTask {
        id
        name
      }
      childTasks {
        ...TaskModalPageTaskFragment
        archived
      }
      project {
        id
        company {
          id
        }
        projectSettings {
          columns
        }
        projectStatuses {
          id
          name
          color
        }
        workspace {
          id
        }
      }
      comments {
        id
        message
        messageContent
        createdAt
        createdBy {
          id
          name
          email
          profileImage
        }
        parentTaskComment {
          id
          messageContent
          message
          createdAt
          createdBy {
            id
            name
            email
            profileImage
          }
        }
        attachments {
          id
          name
          type
          url
          isExternal
          isDeleted
          createdBy {
            id
            email
            name
            profileImage
          }
        }
      }
      attachments {
        id
        name
        type
        createdAt
        url
        isExternal
        externalSource
        createdBy {
          id
          name
          email
          profileImage
        }
      }
      members {
        id
        companyMember {
          id
          user {
            id
            name
            email
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
      taskActivities {
        id
        actionType
        fromDate
        toDate
        createdAt
        createdBy {
          id
          email
          name
          profileImage
        }
        targetPic {
          id
          user {
            id
            email
            name
          }
        }
        targetMember {
          id
          user {
            id
            email
            name
          }
        }
        attachment {
          id
          name
        }
        toCardStatus {
          id
          label
        }
      }
    }
    companyTeams(companyId: $companyId) {
      id
      title
    }
    company(id: $companyId) {
      id
      activeSubscription {
        id
        type
        whiteListedMembers {
          companyMembers {
            id
            user {
              id
              email
              name
            }
          }
        }
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
  }
  ${taskFragment}
  ${tagGroupFragment}
`;

const editProjectSettingsMutation = gql`
  mutation EditProjectSettings($input: ProjectSettingsEditInput!) {
    editProjectSettings(input: $input) {
      columns
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

const stopMemberActivityTrackerMutation = gql`
  mutation StopMemberActivityTracker($memberId: ID!) {
    stopMemberActivityTracker(memberId: $memberId) {
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

const deleteTasksMutation = gql`
  mutation DeleteTasks($taskIds: [ID]!) {
    deleteTasks(taskIds: $taskIds) {
      id
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

const duplicateTasksMutation = gql`
  mutation DuplicateTasks($input: DuplicateTasksInput!) {
    duplicateTasks(input: $input) {
      id
    }
  }
`;

// const addToTaskVisibilityWhitelistMutation = gql`
//   mutation AddToTaskVisibilityWhitelist(
//     $input: AddToTaskVisibilityWhitelistInput!
//   ) {
//     addToTaskVisibilityWhitelist(input: $input) {
//       id
//     }
//   }
// `;

const removeFromTaskVisibilityWhitelistMutation = gql`
  mutation RemoveFromTaskVisibilityWhitelist(
    $input: RemoveFromTaskVisibilityWhitelistInput!
  ) {
    removeFromTaskVisibilityWhitelist(input: $input) {
      id
    }
  }
`;

const setTaskVisibilityMutation = gql`
  mutation SetTaskVisibility($input: SetTaskVisibilityInput!) {
    setTaskVisibility(input: $input) {
      id
    }
  }
`;

const addToTaskVisibilityWhitelist = gql`
  mutation AddToTaskVisibilityWhitelist(
    $input: AddToTaskVisibilityWhitelistInput!
  ) {
    addToTaskVisibilityWhitelist(input: $input) {
      id
    }
  }
`;

const addCustomValueToTaskMutation = gql`
  mutation AddCustomValueToTaskModal($input: AddCustomValueToTaskInput!) {
    addCustomValueToTask(input: $input) {
      value
    }
  }
`;

const toggleCustomColumnMutation = gql`
  mutation ToggleCustomColumnTaskModalPage(
    $input: ToggleEnabledCustomColumnInput!
  ) {
    toggleEnabledCustomColumn(input: $input) {
      attribute {
        id
      }
    }
  }
`;

const createCustomColumnForGroupMutation = gql`
  mutation CreateCustomColumnForGroupTaskModal(
    $input: CreateCustomColumnForGroupInput!
  ) {
    createCustomColumnForGroup(input: $input) {
      group {
        id
      }
    }
  }
`;

export default TaskModalPage;
