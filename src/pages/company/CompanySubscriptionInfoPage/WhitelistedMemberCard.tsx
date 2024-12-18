import {
  Card,
  Space,
  Typography,
  Button,
  Table,
  Dropdown,
  Menu,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { useState } from 'react';
import { MdAdd, MdMoreVert } from 'react-icons/md';

import { TableMultiSelectActionBar } from '@/components';

import styles from './WhitelistedMemberCard.module.less';

import { alphabeticalSort } from '@/utils/sorter.utils';

import { ArrayElement } from '@/types';

import { CompanySubscriptionInfoPageQuery } from 'generated/graphql-types';

type QueryCompanyMember = ArrayElement<
  NonNullable<
    NonNullable<
      CompanySubscriptionInfoPageQuery['companySubscription']
    >['whiteListedMembers']
  >['companyMembers']
>;

type Props = {
  companySubscription: CompanySubscriptionInfoPageQuery['companySubscription'];
  onAdd: () => void;
  onRemoveMember: (member: QueryCompanyMember) => void;
  onRemoveMembers: (
    members: QueryCompanyMember[],
    callback: () => void,
  ) => void;
};

const WhitelistedMemberCard = (props: Props) => {
  const { companySubscription, onAdd, onRemoveMember, onRemoveMembers } = props;

  const [selectedRows, setSelectedRows] = useState<QueryCompanyMember[]>([]);

  const handleUpdateSelectedRows = (selectedRows: QueryCompanyMember[]) => {
    setSelectedRows(selectedRows);
  };

  const handleClearSelectedRows = () => {
    setSelectedRows([]);
  };

  const handleRemoveSelectedRows = () => {
    if (selectedRows.length === 0) {
      return;
    }

    onRemoveMembers(selectedRows, handleClearSelectedRows);
  };

  const getFormattedPackageTitle = () => {
    if (!companySubscription?.packageTitle) {
      return '-';
    }

    let title = companySubscription.packageTitle.replace('Omni', '');

    if (companySubscription.cancelDate) {
      title += ' (Unsubscribed)';
    }

    return title;
  };

  const columns: ColumnProps<QueryCompanyMember>[] = [
    {
      title: 'Name',
      dataIndex: 'user.name',
      sorter: alphabeticalSort('user.name'),
    },
    {
      title: 'Email',
      dataIndex: 'user.email',
      sorter: alphabeticalSort('user.email'),
    },
    {
      title: 'Contact',
      dataIndex: 'user.contactNo',
    },
    {
      title: 'Action',
      width: 80,
      render: (col, item) => {
        const handleClickMenuItem = (key: string) => {
          if (key === 'remove') {
            onRemoveMember(item);
          }
        };

        return (
          <Dropdown
            position="br"
            droplist={
              <Menu onClickMenuItem={handleClickMenuItem}>
                <Menu.Item key="remove">Remove</Menu.Item>
              </Menu>
            }
          >
            <Button icon={<MdMoreVert />} type="text" />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Card className={styles['whitelist-card']}>
      <Space direction="vertical" size={20}>
        <Space direction="vertical">
          <Typography.Text className={styles.title}>
            {getFormattedPackageTitle()}
          </Typography.Text>

          <Button
            className={styles['theme-button']}
            icon={<MdAdd />}
            onClick={onAdd}
            disabled={!companySubscription}
          >
            Add Member
          </Button>
        </Space>

        <div>
          {selectedRows.length > 0 && (
            <TableMultiSelectActionBar
              numberOfRows={selectedRows.length}
              suffix="members"
              onDeselectAll={handleClearSelectedRows}
              actions={[
                <Button
                  type="text"
                  size="small"
                  onClick={handleRemoveSelectedRows}
                >
                  Remove
                </Button>,
              ]}
            />
          )}

          <Table
            showHeader={selectedRows.length === 0}
            data={companySubscription?.whiteListedMembers?.companyMembers || []}
            columns={columns}
            border={false}
            pagination={{
              showTotal: (total) => `Total ${total} Members`,
            }}
            rowSelection={{
              selectedRowKeys: selectedRows.map(
                (member) => member?.id as string,
              ),
              onChange: (_, selectedRows) =>
                handleUpdateSelectedRows(selectedRows),
            }}
          />
        </div>
      </Space>
    </Card>
  );
};

export default WhitelistedMemberCard;
