import {
  Card,
  Typography,
  Table,
  Checkbox,
  Button,
  Space,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { useState } from 'react';
import {
  MdOutlineComputer,
  MdOutlineMail,
  MdPhoneIphone,
} from 'react-icons/md';

import { ContentHeader } from '@/components';

import styles from './CompanyNotificationsPage.module.less';

type NotificationType = 'in-app' | 'mobile' | 'email';

type Notification = {
  id: string;
  title: string;
  pic: boolean;
  watcher: boolean;
  assignee: boolean;
  owner: boolean;
};

type NotificationGroup = {
  id: string;
  title: string;
  children: Notification[];
};

const CompanyNotificationsPage = () => {
  const [activeType, setActiveType] = useState<NotificationType>('in-app');

  const handleChangeNotificationType = (type: NotificationType) => {
    setActiveType(type);
  };

  const isPermissionGroup = (
    item: NotificationGroup | Notification,
  ): item is NotificationGroup => {
    return (item as NotificationGroup).children !== undefined;
  };

  const columns: ColumnProps<NotificationGroup | Notification>[] = [
    {
      title: 'Title',
      render: (col, item) => {
        const isParent = isPermissionGroup(item);

        return (
          <Typography.Text
            style={{ fontWeight: isParent ? 'bold' : undefined }}
          >
            {item.title}
          </Typography.Text>
        );
      },
    },
    {
      title: 'PIC',
      width: 150,
      render: (col, item) => {
        const isParent = isPermissionGroup(item);

        return !isParent && <Checkbox checked={item.pic} />;
      },
    },
    {
      title: 'Watcher',
      width: 150,
      render: (col, item) => {
        const isParent = isPermissionGroup(item);

        return !isParent && <Checkbox checked={item.watcher} />;
      },
    },
    {
      title: 'Assignee',
      width: 150,
      render: (col, item) => {
        const isParent = isPermissionGroup(item);

        return !isParent && <Checkbox checked={item.assignee} />;
      },
    },
    {
      title: 'Owner',
      width: 150,
      render: (col, item) => {
        const isParent = isPermissionGroup(item);

        return !isParent && <Checkbox checked={item.owner} />;
      },
    },
  ];

  const data: NotificationGroup[] = [
    {
      id: 'task',
      title: 'Task',
      children: [
        {
          id: 'new_task_created',
          title: 'New task created',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'due_date_updated',
          title: 'Due Date update',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'assignee_updated',
          title: 'Assignee Updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'status_updated',
          title: 'Task status updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'name_updated',
          title: 'Task name updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'checklist_updated',
          title: 'Checklist updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'custom_field_updated',
          title: 'Custom field updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'tag_updated',
          title: 'Tag updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'task_updated',
          title: 'Task shared',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'new_comment',
          title: 'New comment',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
      ],
    },
    {
      id: 'project',
      title: 'Project',
      children: [
        {
          id: 'new_task_created',
          title: 'New task created',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'due_date_updated',
          title: 'Due Date update',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'assignee_updated',
          title: 'Assignee Updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'status_updated',
          title: 'Task status updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'name_updated',
          title: 'Task name updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'checklist_updated',
          title: 'Checklist updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'custom_field_updated',
          title: 'Custom field updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'tag_updated',
          title: 'Tag updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'task_updated',
          title: 'Task shared',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'new_comment',
          title: 'New comment',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
      ],
    },
    {
      id: 'collection',
      title: 'Collection',
      children: [
        {
          id: 'new_task_created',
          title: 'New task created',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'due_date_updated',
          title: 'Due Date update',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'assignee_updated',
          title: 'Assignee Updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'status_updated',
          title: 'Task status updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'name_updated',
          title: 'Task name updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'checklist_updated',
          title: 'Checklist updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'custom_field_updated',
          title: 'Custom field updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'tag_updated',
          title: 'Tag updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'task_updated',
          title: 'Task shared',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'new_comment',
          title: 'New comment',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
      ],
    },
    {
      id: 'payment',
      title: 'Payment',
      children: [
        {
          id: 'new_task_created',
          title: 'New task created',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'due_date_updated',
          title: 'Due Date update',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'assignee_updated',
          title: 'Assignee Updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'status_updated',
          title: 'Task status updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'name_updated',
          title: 'Task name updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'checklist_updated',
          title: 'Checklist updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'custom_field_updated',
          title: 'Custom field updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'tag_updated',
          title: 'Tag updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'task_updated',
          title: 'Task shared',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'new_comment',
          title: 'New comment',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
      ],
    },
    {
      id: 'crm',
      title: 'CRM',
      children: [
        {
          id: 'new_task_created',
          title: 'New task created',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'due_date_updated',
          title: 'Due Date update',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'assignee_updated',
          title: 'Assignee Updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'status_updated',
          title: 'Task status updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'name_updated',
          title: 'Task name updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'checklist_updated',
          title: 'Checklist updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'custom_field_updated',
          title: 'Custom field updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'tag_updated',
          title: 'Tag updated',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'task_updated',
          title: 'Task shared',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'new_comment',
          title: 'New comment',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
      ],
    },
  ];

  return (
    <>
      <ContentHeader
        breadcrumbItems={[{ name: 'Setting' }, { name: 'Notification' }]}
      />

      <Card className={styles.wrapper}>
        <Typography.Paragraph className={styles['card-title']}>
          Notification
        </Typography.Paragraph>

        <Space direction="vertical" size={20}>
          <Space>
            <Button
              className={
                activeType === 'in-app'
                  ? styles['btn-active']
                  : styles['btn-inactive']
              }
              shape="round"
              icon={<MdOutlineComputer />}
              onClick={() => handleChangeNotificationType('in-app')}
            >
              In-App
            </Button>
            <Button
              className={
                activeType === 'mobile'
                  ? styles['btn-active']
                  : styles['btn-inactive']
              }
              shape="round"
              icon={<MdPhoneIphone />}
              onClick={() => handleChangeNotificationType('mobile')}
            >
              Mobile App
            </Button>
            <Button
              className={
                activeType === 'email'
                  ? styles['btn-active']
                  : styles['btn-inactive']
              }
              shape="round"
              icon={<MdOutlineMail />}
              onClick={() => handleChangeNotificationType('email')}
            >
              Email
            </Button>
          </Space>

          <div className={styles['description-container']}>
            <Typography.Paragraph className={styles.title}>
              Customize Notification
            </Typography.Paragraph>

            <Typography.Paragraph>
              Choose what topics matter to you and how you get notified about
              them.
            </Typography.Paragraph>
          </div>

          <Table
            data={data}
            columns={columns}
            pagination={false}
            border={false}
            indentSize={0}
          />
        </Space>
      </Card>
    </>
  );
};

export default CompanyNotificationsPage;
