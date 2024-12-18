import { Card, Typography, Table, Checkbox } from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';

import { ContentHeader } from '@/components';

import styles from './CompanyPermissionsPage.module.less';

type Permission = {
  id: string;
  title: string;
  pic: boolean;
  watcher: boolean;
  assignee: boolean;
  owner: boolean;
};

type PermissionGroup = {
  id: string;
  title: string;
  children: Permission[];
};

const CompanyPermissionsPage = () => {
  const isPermissionGroup = (
    item: PermissionGroup | Permission,
  ): item is PermissionGroup => {
    return (item as PermissionGroup).children !== undefined;
  };

  const columns: ColumnProps<PermissionGroup | Permission>[] = [
    {
      title: 'Actions',
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

  const data: PermissionGroup[] = [
    {
      id: 'manage',
      title: 'Manage actions',
      children: [
        {
          id: 'member',
          title: 'Add/ Remove Members',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'pic',
          title: 'Add/ Remove PICs',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'status',
          title: 'Edit Status',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'custom_field',
          title: 'Manage Custom Field',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'tags',
          title: 'Manage Tags',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
      ],
    },
    {
      id: 'company',
      title: 'Company Actions?',
      children: [
        {
          id: 'export',
          title: 'Exporting',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'import',
          title: 'Importing',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'invite',
          title: 'Invite Guests',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'integrations',
          title: 'Integrations',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'permissions',
          title: 'Permissions',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
      ],
    },
    {
      id: 'access_permission',
      title: 'Access Permission',
      children: [
        {
          id: 'collection',
          title: 'Access Collection',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'payment',
          title: 'Access Payment',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'attendance',
          title: 'Access Time Attendance',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'project',
          title: 'Access Project',
          assignee: false,
          owner: false,
          pic: false,
          watcher: false,
        },
        {
          id: 'project_value',
          title: 'Access Project Value',
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
        breadcrumbItems={[{ name: 'Setting' }, { name: 'Permission' }]}
      />

      <Card className={styles.wrapper}>
        <Typography.Paragraph className={styles['card-title']}>
          Permission
        </Typography.Paragraph>

        <Table
          data={data}
          columns={columns}
          pagination={false}
          border={false}
          indentSize={0}
        />
      </Card>
    </>
  );
};

export default CompanyPermissionsPage;
