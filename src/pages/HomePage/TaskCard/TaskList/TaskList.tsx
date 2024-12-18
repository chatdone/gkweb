import {
  Table,
  Space,
  Button,
  Typography,
  Divider,
  Tag,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdChecklist } from 'react-icons/md';

import { EmptyContent, Avatar } from '@/components';
import TaskListItem from '@/components/TaskListItem';

import styles from './TaskList.module.less';

import { useResponsiveStore } from '@/stores/useResponsiveStores';

import { alphabeticalSort } from '@/utils/sorter.utils';
import { isTaskOverdue } from '@/utils/task.utils';

import Icons from '@/assets/icons';

import { ArrayElement } from '@/types';

import { HomePageQuery } from 'generated/graphql-types';

type QueryTasks = NonNullable<HomePageQuery['tasks']>;

type QueryTask = ArrayElement<QueryTasks>;

type Props = {
  loading: boolean;
  tasks: QueryTasks;
  onViewTask: (task: QueryTask) => void;
};

const TaskList = (props: Props) => {
  const { loading, tasks, onViewTask } = props;

  const { t } = useTranslation();

  const { isMobile } = useResponsiveStore();

  const [visibleCount, setVisibleCount] = useState<number>(5);

  useEffect(() => {
    setVisibleCount(5);
  }, [tasks, isMobile]);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const columns: ColumnProps<QueryTask>[] = [
    {
      title: 'Task Name',
      sorter: alphabeticalSort('name'),
      render: (col, item) => {
        const pendingChecklists = item?.checklists?.filter(
          (checklist) => !checklist?.checked,
        );

        return (
          <Space>
            <Typography.Text>{item?.name}</Typography.Text>

            {pendingChecklists && pendingChecklists.length > 0 && (
              <Space className={styles.subtask} size={3}>
                <MdChecklist />
                <Typography.Text>{pendingChecklists.length}</Typography.Text>
              </Space>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Project',
      dataIndex: 'project.name',
      sorter: alphabeticalSort('project.name'),
    },
    {
      title: 'Assignee',
      render: (col, item) => {
        return (
          <Avatar.Group size={20}>
            {item?.members?.map((member) => (
              <Avatar
                key={member?.id}
                name={member?.user?.name || member?.user?.email}
                imageSrc={member?.user?.profileImage}
                showTooltip
              />
            ))}
          </Avatar.Group>
        );
      },
    },
    {
      title: 'Status',
      render: (col, item) => {
        return item?.projectStatus ? (
          <Tag
            className="w-full cursor-pointer text-center"
            bordered
            color={item?.projectStatus?.color || undefined}
          >
            {item?.projectStatus?.name}
          </Tag>
        ) : (
          '-'
        );
      },
    },
    {
      title: 'Timeline',
      render: (col, item) => {
        const isOverdue = isTaskOverdue(item);

        return item?.startDate && item.endDate ? (
          <Typography.Text
            style={{
              fontWeight: isOverdue ? 'bold' : undefined,
              color: isOverdue ? '#D6001C' : undefined,
            }}
          >
            {`${dayjs(item.startDate).format('DD MMM YYYY hh:mm a')} - ${dayjs(
              item.endDate,
            ).format('DD MMM YYYY hh:mm a')}`}
          </Typography.Text>
        ) : (
          '-'
        );
      },
    },
  ];

  return (
    <Space direction="vertical" size={5}>
      {!isMobile && (
        <Table
          data={tasks.slice(0, visibleCount)}
          loading={loading}
          columns={columns}
          border={false}
          pagination={false}
          scroll={{}}
          onRow={(record) => ({
            onClick: () => onViewTask(record),
          })}
          noDataElement={
            <EmptyContent
              iconSrc={Icons.emptyList}
              title={t('fills.nothingHere')}
              subtitle={t('fills.createTask')}
            />
          }
        />
      )}

      {isMobile && (
        <Space
          direction="vertical"
          split={<Divider className={styles['task-list-separator']} />}
        >
          {tasks.slice(0, visibleCount).map((task) => (
            <TaskListItem
              key={task?.id}
              task={task}
              onClick={() => onViewTask(task)}
            />
          ))}
        </Space>
      )}

      {tasks.length > visibleCount && (
        <Button
          className={styles['show-more-btn']}
          long
          onClick={handleViewMore}
        >
          {t('show#More', { number: 5 })}
        </Button>
      )}
    </Space>
  );
};

export default TaskList;
