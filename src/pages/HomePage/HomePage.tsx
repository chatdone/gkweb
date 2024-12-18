import { useQuery, gql, useMutation } from '@apollo/client';
import { Button, Dropdown, Menu, Space } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { MdChevronRight } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

import { ContentHeader } from '@/components';
import AddTaskModal, {
  FormValues as AddTaskFormValues,
} from '@/components/AppLayout/QuickCreateAction/AddTaskModal';
import Message from '@/components/Message';

import {
  AddContactModal,
  FormValues as AddContactFormValues,
} from '../crm/ContactListPage/AddContactModal';
import AttendanceCard from './AttendanceCard';
import styles from './HomePage.module.less';
import TaskCard, { taskCardFragments } from './TaskCard';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';
import { usePageLoadStore } from '@/stores/usePageLoadStore';
import { useResponsiveStore } from '@/stores/useResponsiveStores';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

import { getUTC } from '@/utils/date.utils';
import { getErrorMessage } from '@/utils/error.utils';
import { alphabeticalSort } from '@/utils/sorter.utils';

import { navigateTaskPage } from '@/navigation';

import { tagGroupFragment } from '@/fragments';

import { SelectOption } from '@/types';

import {
  TimesheetArchiveStatus,
  HomePageQuery,
  HomePageQueryVariables,
  CreateContactMutation,
  CreateContactMutationVariables,
  CreateContactPicMutation,
  CreateContactPicMutationVariables,
  CreateTaskMutation,
  CreateTaskMutationVariables,
} from 'generated/graphql-types';

type View = 'company' | 'member';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setIsPageLoading } = usePageLoadStore();
  const { activeCompany, reloadUser } = useAppStore();
  const { isMobile } = useResponsiveStore();
  const {
    workspaces,
    getWorkspaceProjectOptions,
    getWorkspaceProjectGroupOptions,
    getProjectStatusesOptions,
  } = useWorkspaceStore();

  useEffect(() => {
    // The isPageLoading flag is used by the onboarding tooltip
    // This would tell onboarding tooltip that the home page has been loaded
    setIsPageLoading(false);
  }, []);

  const { data: queryData, refetch: refetchQuery } = useQuery<
    HomePageQuery,
    HomePageQueryVariables
  >(homePageQuery, {
    variables: {
      companyId: activeCompany?.id as string,
      filters: {
        archived: {
          status: TimesheetArchiveStatus.False,
        },
      },
    },
    skip: !activeCompany?.id,
  });
  const [mutateCreateContact] = useMutation<
    CreateContactMutation,
    CreateContactMutationVariables
  >(createContactMutation);
  const [mutateCreateContactPic] = useMutation<
    CreateContactPicMutation,
    CreateContactPicMutationVariables
  >(createContactPicMutation);
  const [mutateCreateTask, { loading: mutateCreateTaskLoading }] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(createTaskMutation);

  const [view, setView] = useState<View>('company');
  const [createContactLoading, setCreateContactLoading] =
    useState<boolean>(false);

  const modalState = {
    task: useDisclosure(),
    contact: useDisclosure(),
    project: useDisclosure(),
  };

  const handleUpdateView = (value: View) => {
    setView(value);
  };

  const handleClickMenuItem = (key: string) => {
    if (key === 'task') {
      modalState.task.onOpen();
    } else if (key === 'contact') {
      modalState.contact.onOpen();
    } else if (key === 'project') {
      modalState.project.onOpen();
    }
  };

  const handleSubmitCreateTask = (values: AddTaskFormValues) => {
    const [startDate, endDate] = values.timeline || [];

    handleCreateTask({
      input: {
        name: values.name,
        groupId: values.groupId,
        projectId: values.projectId,
        projectStatusId: values.statusId,
        startDate: startDate ? getUTC(startDate) : undefined,
        endDate: endDate ? getUTC(endDate) : undefined,
      },
      memberIds: values.assigneeIds,
    });
  };

  const handleCreateContact = async (values: AddContactFormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    setCreateContactLoading(true);

    try {
      // TODO: camel case
      const res = await mutateCreateContact({
        variables: {
          companyId: activeCompany.id,
          contactGroupId: values.groupId,
          dealCreator: values.dealOwnerId,
          input: {
            name: values.name,
            type: values.type,
            address: values.address,
            remarks: values.note,
            tagIds: values.tagIds,
            // dealValue: values.dealAmount,
            deal_value: values.dealAmount,
          },
        },
      });

      if (!res.errors) {
        if (res.data?.createContact?.id && values.pics) {
          await handleCreateContactPics(res.data.createContact.id, values.pics);
        }

        Message.success('The contact has been successfully created.', {
          title: 'Success',
        });

        modalState.contact.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create contact',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCreateContactLoading(false);
    }
  };

  const handleCreateContactPics = async (
    contactId: string,
    values: AddContactFormValues['pics'],
  ) => {
    if (!activeCompany?.id || values.length === 0) {
      return;
    }

    try {
      // TODO: camel case
      const promises = values.map((pic) =>
        mutateCreateContactPic({
          variables: {
            companyId: activeCompany.id as string,
            contactId,
            input: {
              name: pic.name,
              email: pic.email,
              // contactNo: pic.contactNo,
              contact_no: pic.contactNo,
            },
          },
        }).then((res) => {
          if (res.errors) {
            Message.error(getErrorMessage(res.errors), {
              title: 'Failed to create contact pic',
            });
          }
        }),
      );

      await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (input: CreateTaskMutationVariables) => {
    try {
      const res = await mutateCreateTask({
        variables: input,
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

        modalState.task.onClose();

        refetchQuery();
        reloadUser();
      } else {
        Message.error(getErrorMessage(res?.errors), {
          title: 'Failed to create task',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getContactGroupOptions = (): SelectOption[] => {
    if (!queryData?.contactGroups) {
      return [];
    }

    return queryData.contactGroups
      .filter((group) => group?.id !== 'unassigned')
      .map((group) => ({
        label: group?.name,
        value: group?.id as string,
      }))
      .sort(alphabeticalSort('label'));
  };

  const getCompanyMemberOptions = (useUserId = false): SelectOption[] => {
    if (!activeCompany?.members) {
      return [];
    }

    return activeCompany.members
      .map((member) => ({
        label: member?.user?.name || member?.user?.email,
        value: useUserId
          ? (member?.user?.id as string)
          : (member?.id as string),
        extra: {
          profileImage: member?.user?.profileImage,
        },
      }))
      .sort(alphabeticalSort('label'));
  };

  const getWorkspaceOptions = (): SelectOption[] => {
    return workspaces.map((workspace) => ({
      label: workspace?.name,
      value: workspace?.id as string,
    }));
  };

  return (
    <>
      <ContentHeader
        showBreadCrumb={!isMobile}
        breadcrumbItems={[{ name: 'Home' }]}
        rightElement={
          <Space>
            <Button
              className={view === 'company' ? styles['active-btn'] : undefined}
              onClick={() => handleUpdateView('company')}
            >
              Show all
            </Button>

            <Button
              className={view === 'member' ? styles['active-btn'] : undefined}
              onClick={() => handleUpdateView('member')}
            >
              Assigned to me
            </Button>

            <Dropdown
              position="br"
              droplist={
                <Menu onClickMenuItem={handleClickMenuItem}>
                  <Menu.Item key="task">Task</Menu.Item>
                  <Menu.Item key="contact">Contact</Menu.Item>
                </Menu>
              }
            >
              <Button
                className={`${styles['theme-button']} ${styles['create-btn']}`}
              >
                Quick create <MdChevronRight />
              </Button>
            </Dropdown>
          </Space>
        }
      />

      <Space className={styles.wrapper} direction="vertical">
        <TaskCard
          loading={!queryData}
          view={view}
          tasks={queryData?.tasks}
          sharedTasks={queryData?.sharedWithMeTasks}
          company={queryData?.company}
        />

        <AttendanceCard view={view} />
      </Space>

      <AddContactModal
        visible={modalState.contact.visible}
        onCancel={modalState.contact.onClose}
        tagGroups={queryData?.tagGroups}
        loading={createContactLoading}
        companyMemberOptions={getCompanyMemberOptions(true)}
        contactGroupOptions={getContactGroupOptions()}
        onSubmit={handleCreateContact}
      />

      <AddTaskModal
        visible={modalState.task.visible}
        onCancel={modalState.task.onClose}
        loading={mutateCreateTaskLoading}
        workspaceOptions={getWorkspaceOptions()}
        workspaceProjectOptions={getWorkspaceProjectOptions()}
        projectGroupOptions={getWorkspaceProjectGroupOptions()}
        companyMemberOptions={getCompanyMemberOptions()}
        projectStatusOptions={getProjectStatusesOptions()}
        onSubmit={handleSubmitCreateTask}
      />
    </>
  );
};

const homePageQuery = gql`
  query HomePage(
    $companyId: ID!
    $filters: FilterOptions
    $filter: TaskFilter
  ) {
    tasks(companyId: $companyId, filters: $filters) {
      ...TaskCardTaskFragment
    }
    sharedWithMeTasks(filter: $filter) {
      tasks {
        ...TaskCardTaskFragment
      }
    }
    company(id: $companyId) {
      id
      teams {
        id
        title
      }
    }
    contactGroups(companyId: $companyId) {
      id
      name
    }
    tagGroups(companyId: $companyId) {
      ...TagGroupFragment
    }
  }
  ${taskCardFragments.task}
  ${tagGroupFragment}
`;

const createContactMutation = gql`
  mutation CreateContact(
    $companyId: ID!
    $input: CreateContactInput!
    $contactGroupId: ID
    $dealCreator: ID
  ) {
    createContact(
      companyId: $companyId
      input: $input
      contactGroupId: $contactGroupId
      dealCreator: $dealCreator
    ) {
      id
    }
  }
`;

const createContactPicMutation = gql`
  mutation CreateContactPic(
    $companyId: ID!
    $contactId: ID!
    $input: CreateContactPicInput!
  ) {
    createContactPic(
      companyId: $companyId
      contactId: $contactId
      input: $input
    ) {
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

export default HomePage;
