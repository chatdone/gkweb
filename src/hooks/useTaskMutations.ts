import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';

import {
  Task,
  Timesheet,
  TaskUpdateInput,
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
  AssignTaskTagsMutation,
  AssignTaskTagsMutationVariables,
  DeleteTaskTagsMutation,
  DeleteTaskTagsMutationVariables,
  AssignTaskPicsMutation,
  AssignTaskPicsMutationVariables,
  RemoveTaskPicsMutation,
  RemoveTaskPicsMutationVariables,
  AddTaskWatchersMutation,
  AddTaskWatchersMutationVariables,
  RemoveTaskWatchersMutation,
  RemoveTaskWatchersMutationVariables,
  AssignTaskMembersMutation,
  AssignTaskMembersMutationVariables,
  DeleteTaskMembersMutation,
  DeleteTaskMembersMutationVariables,
  CreateTaskTemplateMutation,
  CreateTaskTemplateMutationVariables,
  UpdateTaskTemplateMutation,
  UpdateTaskTemplateMutationVariables,
  DeleteTaskTemplateMutation,
  DeleteTaskTemplateMutationVariables,
  CreateTimesheetEntryMutation,
  CreateTimesheetEntryMutationVariables,
  UpdateTimesheetMutation,
  UpdateTimesheetMutationVariables,
} from 'generated/graphql-types';

const useTaskMutations = () => {
  const [mutateUpdateTask, updateTaskState] = useMutation<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >(updateTaskMutation);
  const [mutateAssignTaskTags, assignTaskTagsState] = useMutation<
    AssignTaskTagsMutation,
    AssignTaskTagsMutationVariables
  >(assignTaskTagsMutation);
  const [mutateDeleteTaskTags, deleteTaskTagsState] = useMutation<
    DeleteTaskTagsMutation,
    DeleteTaskTagsMutationVariables
  >(deleteTaskTagsMutation);
  const [mutateAssignTaskPics, assignTaskPicsState] = useMutation<
    AssignTaskPicsMutation,
    AssignTaskPicsMutationVariables
  >(assignTaskPicsMutation);
  const [mutateRemoveTaskPics, removeTaskPicsState] = useMutation<
    RemoveTaskPicsMutation,
    RemoveTaskPicsMutationVariables
  >(removeTaskPicsMutation);
  const [mutateAddTaskWatchers, addTaskWatchersState] = useMutation<
    AddTaskWatchersMutation,
    AddTaskWatchersMutationVariables
  >(addTaskWatchersMutation);
  const [mutateRemoveTaskWatchers, removeTaskWatchersState] = useMutation<
    RemoveTaskWatchersMutation,
    RemoveTaskWatchersMutationVariables
  >(removeTaskWatchersMutation);
  const [mutateAssignTaskMembers, assignTaskMembersState] = useMutation<
    AssignTaskMembersMutation,
    AssignTaskMembersMutationVariables
  >(assignTaskMembersMutation);
  const [mutateDeleteTaskMembers, deleteTaskMembersState] = useMutation<
    DeleteTaskMembersMutation,
    DeleteTaskMembersMutationVariables
  >(deleteTaskMembersMutation);
  const [mutateCreateTaskTemplate, createRecurringTaskState] = useMutation<
    CreateTaskTemplateMutation,
    CreateTaskTemplateMutationVariables
  >(createTaskTemplateMutation);
  const [mutateUpdateTaskTemplate, updateRecurringTaskState] = useMutation<
    UpdateTaskTemplateMutation,
    UpdateTaskTemplateMutationVariables
  >(updateTaskTemplateMutation);
  const [mutateDeleteTaskTemplate, deleteRecurringTaskState] = useMutation<
    DeleteTaskTemplateMutation,
    DeleteTaskTemplateMutationVariables
  >(deleteTaskTemplateMutation);
  const [mutateCreateTimesheetEntry, createTimesheetEntryState] = useMutation<
    CreateTimesheetEntryMutation,
    CreateTimesheetEntryMutationVariables
  >(createTimesheetEntryMutation);
  const [mutateUpdateTimesheet, updateTimesheetState] = useMutation<
    UpdateTimesheetMutation,
    UpdateTimesheetMutationVariables
  >(updateTimesheetMutation);

  const updateTask = async (input: {
    task: Task | null | undefined;
    input: TaskUpdateInput;
  }) => {
    const { task, input: updateInput } = input;

    if (!task?.id) {
      return Promise.reject('Missing task id');
    }

    try {
      const res = await mutateUpdateTask({
        variables: {
          taskId: task.id,
          input: updateInput,
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const assignTaskTags = async (input: {
    task: Task | null | undefined;
    tagIds: string[];
  }) => {
    const { task, tagIds } = input;

    if (!task?.id) {
      return Promise.reject('Missing task id');
    }

    try {
      const res = await mutateAssignTaskTags({
        variables: {
          input: {
            taskId: task.id,
            tagIds,
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const deleteTaskTags = async (input: {
    task: Task | null | undefined;
    tagIds: string[];
  }) => {
    const { task, tagIds } = input;

    if (!task?.id) {
      return Promise.reject('Missing task id');
    }

    try {
      const res = await mutateDeleteTaskTags({
        variables: {
          input: {
            taskId: task.id,
            tagIds,
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const assignTaskPics = async (input: {
    task: Task | null | undefined;
    picIds: string[];
  }) => {
    const { task, picIds } = input;

    if (!task?.id) {
      return Promise.reject('Missing task id');
    }

    try {
      const res = await mutateAssignTaskPics({
        variables: {
          taskId: task.id,
          input: {
            pic_ids: picIds,
            picIds,
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const removeTaskPics = async (input: {
    task: Task | null | undefined;
    picIds: string[];
  }) => {
    const { task, picIds } = input;

    if (!task?.id) {
      return Promise.reject('Missing task id');
    }

    try {
      const res = await mutateRemoveTaskPics({
        variables: {
          input: {
            taskId: task.id,
            picIds,
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const addTaskWatchers = async (input: {
    task: Task | null | undefined;
    memberIds: string[];
  }) => {
    const { task, memberIds } = input;

    if (!task?.id) {
      return Promise.reject('Missing task id');
    }

    try {
      const res = await mutateAddTaskWatchers({
        variables: {
          input: {
            taskId: task.id,
            memberIds,
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const removeTaskWatchers = async (input: {
    task: Task | null | undefined;
    memberIds: string[];
  }) => {
    const { task, memberIds } = input;

    if (!task?.id) {
      return Promise.reject('Missing task id');
    }

    try {
      const res = await mutateRemoveTaskWatchers({
        variables: {
          input: {
            taskId: task.id,
            memberIds,
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const assignTaskMembers = async (input: {
    task: Task | null | undefined;
    memberIds: string[];
  }) => {
    const { task, memberIds } = input;

    if (!task?.id) {
      return Promise.reject('Missing task id');
    }

    try {
      const res = await mutateAssignTaskMembers({
        variables: {
          taskId: task.id,
          input: {
            company_member_ids: memberIds,
            companyMemberIds: memberIds,
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const deleteTaskMembers = async (input: {
    task: Task | null | undefined;
    memberIds: string[];
  }) => {
    const { task, memberIds } = input;

    if (!task?.id) {
      return Promise.reject('Missing task id');
    }

    try {
      const res = await mutateDeleteTaskMembers({
        variables: {
          taskId: task.id,
          input: {
            company_member_ids: memberIds,
            companyMemberIds: memberIds,
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const createRecurringTask = async (input: {
    task: Task | null | undefined;
    companyId: string;
    cronString: string;
  }) => {
    const { task, companyId, cronString } = input;

    if (!task?.id) {
      return Promise.reject('Missing task id');
    }

    if (!task?.name) {
      return Promise.reject('Missing task name');
    }

    try {
      const res = await mutateCreateTaskTemplate({
        variables: {
          input: {
            companyId,
            sourceTaskId: task.id,
            name: task.name,
            copyAttachments: false,
            copySubtasks: false,
            isRecurring: true,
            cronString,
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateRecurringTask = async (input: {
    companyId: string;
    task: Task | null | undefined;
    cronString: string;
  }) => {
    const { companyId, task, cronString } = input;

    if (!task?.templateTask?.id) {
      return Promise.reject('Missing template task id');
    }

    if (!task?.name) {
      return Promise.reject('Missing task name');
    }

    try {
      const res = await mutateUpdateTaskTemplate({
        variables: {
          input: {
            companyId,
            templateId: task.templateTask.id,
            name: task.name,
            cronString,
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const deleteRecurringTask = async (input: {
    companyId: string;
    task: Task | null | undefined;
  }) => {
    const { companyId, task } = input;

    if (!task?.templateTask?.id) {
      return Promise.reject('Missing template task id');
    }

    try {
      const res = await mutateDeleteTaskTemplate({
        variables: {
          input: {
            companyId,
            templateId: task.templateTask.id,
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const startTimesheetEntry = async (input: {
    task: Task | null | undefined;
    companyMemberId: string;
  }) => {
    const { task, companyMemberId } = input;

    if (!task?.id) {
      return Promise.reject('Missing task id');
    }

    try {
      const res = await mutateCreateTimesheetEntry({
        variables: {
          taskId: task.id,
          memberId: companyMemberId,
          input: {
            start_date: dayjs().toDate(),
            startDate: dayjs().toDate(),
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const stopTimesheet = async (timesheet: Timesheet | null | undefined) => {
    if (!timesheet?.id) {
      return Promise.reject('Missing timesheet id');
    }

    try {
      const res = await mutateUpdateTimesheet({
        variables: {
          timesheetId: timesheet.id,
          input: {
            endDate: dayjs().toDate(),
          },
        },
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    updateTask: [updateTask, updateTaskState],
    assignTaskTags: [assignTaskTags, assignTaskTagsState],
    deleteTaskTags: [deleteTaskTags, deleteTaskTagsState],
    assignTaskPics: [assignTaskPics, assignTaskPicsState],
    removeTaskPics: [removeTaskPics, removeTaskPicsState],
    addTaskWatchers: [addTaskWatchers, addTaskWatchersState],
    removeTaskWatchers: [removeTaskWatchers, removeTaskWatchersState],
    assignTaskMembers: [assignTaskMembers, assignTaskMembersState],
    deleteTaskMembers: [deleteTaskMembers, deleteTaskMembersState],
    createRecurringTask: [createRecurringTask, createRecurringTaskState],
    updateRecurringTask: [updateRecurringTask, updateRecurringTaskState],
    deleteRecurringTask: [deleteRecurringTask, deleteRecurringTaskState],
    startTimesheetEntry: [startTimesheetEntry, createTimesheetEntryState],
    stopTimesheet: [stopTimesheet, updateTimesheetState],
  } as const;
};

const updateTaskMutation = gql`
  mutation UpdateTask($taskId: ID!, $input: TaskUpdateInput!) {
    updateTask(taskId: $taskId, input: $input) {
      id
    }
  }
`;

const assignTaskTagsMutation = gql`
  mutation AssignTaskTags($input: TaskTagOptions!) {
    assignTaskTags(input: $input) {
      tag {
        id
      }
    }
  }
`;

const deleteTaskTagsMutation = gql`
  mutation DeleteTaskTags($input: TaskTagOptions!) {
    deleteTaskTags(input: $input) {
      tag {
        id
      }
    }
  }
`;

const assignTaskPicsMutation = gql`
  mutation AssignTaskPics($taskId: ID!, $input: TaskPicInput!) {
    assignTaskPics(taskId: $taskId, input: $input) {
      id
    }
  }
`;

const removeTaskPicsMutation = gql`
  mutation RemoveTaskPics($input: TaskPicsInput!) {
    removeTaskPics(input: $input) {
      id
    }
  }
`;

const addTaskWatchersMutation = gql`
  mutation AddTaskWatchers($input: AddTaskWatchersInput!) {
    addTaskWatchers(input: $input) {
      task {
        id
      }
    }
  }
`;

const removeTaskWatchersMutation = gql`
  mutation RemoveTaskWatchers($input: RemoveTaskWatchersInput!) {
    removeTaskWatchers(input: $input) {
      task {
        id
      }
    }
  }
`;

const assignTaskMembersMutation = gql`
  mutation AssignTaskMembers($taskId: ID!, $input: TaskMemberInput!) {
    assignTaskMembers(taskId: $taskId, input: $input) {
      id
    }
  }
`;

const deleteTaskMembersMutation = gql`
  mutation DeleteTaskMembers($taskId: ID!, $input: TaskMemberInput!) {
    deleteTaskMembers(taskId: $taskId, input: $input) {
      id
    }
  }
`;

const createTaskTemplateMutation = gql`
  mutation CreateTaskTemplate($input: CreateTaskTemplateInput!) {
    createTaskTemplate(input: $input) {
      id
    }
  }
`;

const updateTaskTemplateMutation = gql`
  mutation UpdateTaskTemplate($input: UpdateTaskTemplateInput!) {
    updateTaskTemplate(input: $input) {
      id
    }
  }
`;

const deleteTaskTemplateMutation = gql`
  mutation DeleteTaskTemplate($input: DeleteTemplateInput!) {
    deleteTaskTemplate(input: $input) {
      id
    }
  }
`;

const createTimesheetEntryMutation = gql`
  mutation CreateTimesheetEntry(
    $taskId: ID!
    $memberId: ID!
    $input: TimesheetEntryInput!
    $locationId: ID
  ) {
    createTimesheetEntry(
      taskId: $taskId
      memberId: $memberId
      input: $input
      locationId: $locationId
    ) {
      id
    }
  }
`;

const updateTimesheetMutation = gql`
  mutation UpdateTimesheet($timesheetId: ID!, $input: UpdateTimesheetInput!) {
    updateTimesheet(timesheetId: $timesheetId, input: $input) {
      id
    }
  }
`;

export default useTaskMutations;
