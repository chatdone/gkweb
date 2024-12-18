import {
  Button,
  Drawer,
  Dropdown,
  Input,
  Menu, // Space,
  Table, // Typography,
  Avatar as ArcoAvatar,
  Tabs,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table/interface';
// import dayjs from 'dayjs';
import { capitalize, upperFirst } from 'lodash-es';
import { SyntheticEvent, useState } from 'react';
import { MdChecklist, MdMoreVert, MdSearch } from 'react-icons/md';

import { Avatar, StatusTag } from '@/components';

import styles from './TaskListDrawer.module.less';

import { useAppStore } from '@/stores/useAppStore';
import { useResponsiveStore } from '@/stores/useResponsiveStores';

import { alphabeticalSort, dateSort } from '@/utils/sorter.utils';
import { isTaskOverdue } from '@/utils/task.utils';

import type { ArrayElement, BaseModalConfig } from '@/types';

import {
  // Task,
  // StageType,
  // TaskBoardCategory,
  HomePageQuery,
} from 'generated/graphql-types';

type QueryTask = ArrayElement<HomePageQuery['tasks']>;

type Props = BaseModalConfig & {
  loading: boolean;
  tasks: HomePageQuery['tasks'];
  sharedTasks: HomePageQuery['sharedWithMeTasks'];
  type: 'pending' | 'overdue' | 'done' | undefined;
  onViewTask: (task: QueryTask) => void;
};

const TaskListDrawer = (props: Props) => {
  const { visible, onCancel, loading, tasks, sharedTasks, type, onViewTask } =
    props;

  const { currentUser } = useAppStore();
  const { isMobile } = useResponsiveStore();

  const [activeTab, setActiveTab] = useState<string>('company');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const handleChangeTab = (key: string) => {
    setActiveTab(key);
  };

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const columns: ColumnProps<QueryTask>[] = [
    {
      title: 'Task',
      sorter: alphabeticalSort('name'),
      // render: (col, item) => {
      //   const pendingSubtasks = item?.subtasks?.filter(
      //     (subtask) => !subtask?.checked,
      //   );

      //   return (
      //     <Space>
      //       <Typography.Text>{item?.name}</Typography.Text>

      //       {pendingSubtasks && pendingSubtasks.length > 0 && (
      //         <Space className={styles.subtask} size={3}>
      //           <MdChecklist />
      //           <Typography.Text>{pendingSubtasks.length}</Typography.Text>
      //         </Space>
      //       )}
      //     </Space>
      //   );
      // },
    },
    {
      title: 'Assignee',
      render: (col, item) => {
        return (
          <ArcoAvatar.Group size={20}>
            {item?.members?.map((member) => (
              <Avatar
                key={member?.id}
                name={member?.user?.name || member?.user?.email}
                imageSrc={member?.user?.profileImage}
                showTooltip
              />
            ))}
          </ArcoAvatar.Group>
        );
      },
    },
    {
      title: 'Due Date',
      width: 110,
      sorter: dateSort('dueDate'),
      // render: (col, item) => {
      //   const isOverdue = isTaskOverdue(item as Task);

      //   return item?.dueDate ? (
      //     <Typography.Text
      //       style={{
      //         fontWeight: isOverdue ? 'bold' : undefined,
      //         color: isOverdue ? '#D6001C' : undefined,
      //       }}
      //     >
      //       {dayjs(item.dueDate).format('DD MMM YYYY')}
      //     </Typography.Text>
      //   ) : (
      //     '-'
      //   );
      // },
    },
    {
      title: 'Status',
      // render: (col, item) => {
      //   const isOverdue = isTaskOverdue(item as Task);

      //   return (
      //     <StatusTag
      //       mode={
      //         item?.stageStatus === StageType.Closed ||
      //         item?.stageStatus === StageType.Pass
      //           ? 'green-2'
      //           : isOverdue
      //           ? 'red-2'
      //           : 'blue-2'
      //       }
      //     >
      //       {isOverdue ? 'Overdue' : capitalize(item?.stageStatus as string)}
      //     </StatusTag>
      //   );
      // },
    },
    {
      title: 'Created Date',
      width: 140,
      sorter: dateSort('createdAt'),
      // render: (col, item) => {
      //   return dayjs(item?.createdAt).format('DD MMM YYYY');
      // },
    },
    {
      title: 'Action',
      width: 80,
      render: (col, item) => {
        const handleClickMenuItem = (key: string, event: SyntheticEvent) => {
          event.stopPropagation();

          if (key === 'view') {
            onViewTask(item);
          }
        };

        return (
          <Dropdown
            position="br"
            droplist={
              <Menu
                onClickMenuItem={handleClickMenuItem}
                onClick={(e) => e.stopPropagation()}
              >
                <Menu.Item key="view">View</Menu.Item>
              </Menu>
            }
          >
            <Button
              className={styles['icon-btn']}
              icon={<MdMoreVert />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        );
      },
    },
  ];

  const getVisibleData = () => {
    if (!tasks || !sharedTasks?.tasks) {
      return [];
    }

    let visibleTasks =
      activeTab === 'company'
        ? tasks
        : activeTab === 'personal'
        ? tasks.filter((task) =>
            task?.members?.some(
              (member) => member?.user?.id === currentUser?.id,
            ),
          )
        : sharedTasks.tasks;

    // visibleTasks = visibleTasks.filter(
    //   (task) =>
    //     !task?.archived &&
    //     task?.published &&
    //     !task.taskBoard?.archived &&
    //     task.taskBoard?.category === TaskBoardCategory.Default &&
    //     task.stageStatus !== StageType.Closed,
    // );

    if (type) {
      // if (type === 'done') {
      //   visibleTasks = visibleTasks.filter(
      //     (task) => task?.stageStatus === StageType.Pass,
      //   );
      // } else if (type === 'pending') {
      //   visibleTasks = visibleTasks.filter(
      //     (task) =>
      //       task?.stageStatus === StageType.Pending && !isTaskOverdue(task),
      //   );
      // } else if (type === 'overdue') {
      //   visibleTasks = visibleTasks.filter((task) => isTaskOverdue(task));
      // }
    }

    if (searchKeyword) {
      const regex = RegExp(searchKeyword, 'i');

      visibleTasks = visibleTasks.filter((task) => task?.name?.match(regex));
    }

    return visibleTasks;
  };

  return (
    <Drawer
      title={type ? upperFirst(type) : 'Total'}
      visible={visible}
      width={isMobile ? '100%' : 818}
      onCancel={onCancel}
      footer={null}
    >
      <Input
        className={styles.input}
        allowClear
        placeholder="Search task"
        suffix={<MdSearch />}
        value={searchKeyword}
        onChange={handleUpdateSearchKeyword}
      />

      <Tabs
        className={styles.tabs}
        activeTab={activeTab}
        onClickTab={handleChangeTab}
      >
        <Tabs.TabPane key="company" title="Company" />
        <Tabs.TabPane key="shared" title="Shared with me" />
        <Tabs.TabPane key="personal" title="Assigned to me" />
      </Tabs>

      <Table
        className={styles.table}
        loading={loading}
        columns={columns}
        data={getVisibleData()}
        border={false}
        scroll={{
          x: isMobile ? 1000 : undefined,
        }}
        pagination={{
          showTotal: (total) => `Total ${total} tasks`,
        }}
        onRow={(record) => ({
          onClick: () => onViewTask(record),
        })}
      />
    </Drawer>
  );
};

export default TaskListDrawer;
