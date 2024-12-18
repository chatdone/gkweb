import { gql, useMutation } from '@apollo/client';
import { Button, Typography } from '@arco-design/web-react';
import { MdAdd } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

import Message from '@/components/Message';

import AddTaskModal, { FormValues } from './AddTaskModal';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

import { getUTC } from '@/utils/date.utils';
import { getErrorMessage } from '@/utils/error.utils';

import { navigateTaskPage } from '@/navigation';

import { SelectOption } from '@/types';

import {
  CreateTaskMutation,
  CreateTaskMutationVariables,
} from 'generated/graphql-types';

type Props = {
  collapsed: boolean;
};

const QuickCreateAction = (props: Props) => {
  const { collapsed } = props;

  const navigate = useNavigate();
  const location = useLocation();

  const { activeCompany, reloadUser } = useAppStore();
  const {
    workspaces,
    getWorkspaceProjectOptions,
    getWorkspaceProjectGroupOptions,
    getProjectStatusesOptions,
  } = useWorkspaceStore();

  const [mutateCreateTask, { loading: mutateCreateTaskLoading }] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(createTaskMutation);

  const modalState = {
    task: useDisclosure(),
  };

  const handleCreateTask = async (values: FormValues) => {
    try {
      const [startDate, endDate] = values.timeline || [];

      const res = await mutateCreateTask({
        variables: {
          input: {
            name: values.name,
            groupId: values.groupId,
            projectId: values.projectId,
            projectStatusId: values.statusId,
            startDate: startDate ? getUTC(startDate) : undefined,
            endDate: endDate ? getUTC(endDate) : undefined,
          },
          memberIds: values.assigneeIds,
        },
      });

      if (!res.errors) {
        Message.success(
          <span>
            The task has been successfully created.{' '}
            <span
              className="text-blue-600 font-semibold hover:cursor-pointer"
              onClick={() =>
                navigateTaskPage({
                  navigate,
                  companySlug: activeCompany?.slug as string,
                  taskId: res.data?.createTask?.id as string,
                  location,
                })
              }
            >
              Click here to view task
            </span>
          </span>,
        );

        reloadUser();
        modalState.task.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create task',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getWorkspaceOptions = (): SelectOption[] => {
    return workspaces.map((workspace) => ({
      label: workspace?.name,
      value: workspace?.id as string,
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

  return (
    <>
      <div className="pb-8">
        <div
          className="mx-1.5 flex cursor-pointer items-center rounded border-gray-300 bg-white p-2 hover:bg-gray-100"
          onClick={modalState.task.onOpen}
        >
          <Button className="!bg-brand-500" shape="circle">
            <MdAdd className="text-white" />
          </Button>

          {!collapsed && (
            <Typography.Text className="menu-text">Add new</Typography.Text>
          )}
        </div>
      </div>

      <AddTaskModal
        visible={modalState.task.visible}
        onCancel={modalState.task.onClose}
        loading={mutateCreateTaskLoading}
        workspaceOptions={getWorkspaceOptions()}
        workspaceProjectOptions={getWorkspaceProjectOptions()}
        projectGroupOptions={getWorkspaceProjectGroupOptions()}
        companyMemberOptions={getCompanyMemberOptions()}
        projectStatusOptions={getProjectStatusesOptions()}
        onSubmit={handleCreateTask}
      />
    </>
  );
};

const createTaskMutation = gql`
  mutation CreateTask($input: TaskInput!, $memberIds: [ID], $picIds: [ID]) {
    createTask(input: $input, memberIds: $memberIds, picIds: $picIds) {
      id
    }
  }
`;

export default QuickCreateAction;
