import { gql } from '@apollo/client';
import {
  Space,
  Table,
  Typography,
  Input,
  Avatar as ArcoAvatar,
  Divider,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { escapeRegExp } from 'lodash-es';
import { useState } from 'react';
import { MdInfoOutline, MdSearch } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

import { Avatar, StatusTag } from '@/components';
import TaskListItem, { fragment } from '@/components/TaskListItem';

import styles from './ContactTaskPanel.module.less';

import { useAppStore } from '@/stores/useAppStore';
import { useResponsiveStore } from '@/stores/useResponsiveStores';

import { alphabeticalSort } from '@/utils/sorter.utils';
import { isTaskOverdue } from '@/utils/task.utils';

import { navigateTaskPage } from '@/navigation';

import Icons from '@/assets/icons';

import type { ArrayElement } from '@/types';

import { Task, ContactInfoPageQuery } from 'generated/graphql-types';

const AvatarGroup = ArcoAvatar.Group;

type QueryContact = NonNullable<ContactInfoPageQuery['contact']>;

type QueryTaskBoard = ArrayElement<NonNullable<QueryContact['taskBoards']>>;

type QueryTask = ArrayElement<NonNullable<QueryTaskBoard>['tasks']>;

export const contactTaskPanelFragment = gql`
  fragment ContactTaskPanelFragment on Task {
    id
    name
    dueDate
    archived
    members {
      id
      user {
        id
        email
        name
        profileImage
      }
    }
    ...TaskListItemFragment
  }
  ${fragment}
`;

type Props = {
  contactTasks: NonNullable<QueryTaskBoard>['tasks'];
};

const ContactTaskPanel = (props: Props) => {
  const { contactTasks } = props;

  const navigate = useNavigate();
  const location = useLocation();

  const { activeCompany } = useAppStore();
  const { isMobile } = useResponsiveStore();

  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleViewTask = (task: QueryTask) => {
    if (!task?.id || !activeCompany?.slug) {
      return;
    }

    navigateTaskPage({
      navigate,
      companySlug: activeCompany.slug,
      taskId: task.id,
      location,
    });
  };

  const columns: ColumnProps<QueryTask>[] = [
    {
      title: 'Task Name',
      dataIndex: 'name',
      sorter: alphabeticalSort('name'),
    },
    {
      title: 'Assignee',
      width: 200,
      render: (col, item) => (
        <AvatarGroup size={20} maxCount={8}>
          {item?.members?.map((member) => (
            <Avatar
              key={member?.id}
              name={member?.user?.name || member?.user?.email}
              imageSrc={member?.user?.profileImage}
            />
          ))}
        </AvatarGroup>
      ),
    },
    {
      title: 'Due Date',
      width: 120,
      dataIndex: 'dueDate',
      render: (col, item) => {
        const isOverdue = isTaskOverdue(item as Task);

        return (
          <Typography.Text
            style={{
              fontWeight: isOverdue ? 'bold' : 'normal',
              color: isOverdue ? '#FF5B4C' : 'inherit',
            }}
          >
            {item?.dueDate ? dayjs(item.dueDate).format('D MMM YYYY') : '-'}
          </Typography.Text>
        );
      },
    },
    {
      title: 'Status',
      width: 120,
      render: (col, item) => {
        const isOverdue = isTaskOverdue(item);

        return (
          <StatusTag mode={isOverdue ? 'red-2' : 'blue-2'}>
            {isOverdue ? 'Overdue' : item?.projectStatus?.name}
          </StatusTag>
        );
      },
    },
  ];

  const getData = () => {
    let data = contactTasks || [];

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      data = data.filter((task) => task?.name?.match(regex));
    }

    return data;
  };

  return (
    <Space style={{ width: '100%' }} direction="vertical" size={25}>
      <Input
        className={styles['search-input']}
        allowClear
        placeholder="Search Task"
        suffix={<MdSearch />}
        value={searchKeyword}
        onChange={handleUpdateSearchKeyword}
      />

      {isMobile ? (
        <Space
          direction="vertical"
          split={<Divider className={styles.divider} />}
        >
          {getData().map((task) => (
            <TaskListItem
              key={task?.id}
              task={task}
              onClick={() => handleViewTask(task)}
            />
          ))}
        </Space>
      ) : (
        <Table
          className={styles.table}
          data={getData()}
          columns={columns}
          border={false}
          pagination={{
            showTotal: (total) => (
              <Typography.Text>Total {total} Tasks</Typography.Text>
            ),
          }}
          noDataElement={<EmptyData />}
          onRow={(record) => ({
            onClick: () => handleViewTask(record),
          })}
        />
      )}
    </Space>
  );
};

const EmptyData = () => {
  return (
    <div className={styles['empty-data-container']}>
      <img src={Icons.emptyList} alt="no data" />

      <Space align="center" size={20}>
        <MdInfoOutline />

        <div>
          <Typography.Paragraph className={styles.title}>
            There's nothing here yet!
          </Typography.Paragraph>
          <Typography.Paragraph>
            Create a task to keep things moving.
          </Typography.Paragraph>
        </div>
      </Space>
    </div>
  );
};

export default ContactTaskPanel;
