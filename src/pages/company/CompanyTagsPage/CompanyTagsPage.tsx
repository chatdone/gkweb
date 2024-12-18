import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Button,
  Card,
  Dropdown,
  Grid,
  Input,
  Menu,
  Space,
  Table,
  Typography,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { escapeRegExp } from 'lodash-es';
import { SyntheticEvent, useState } from 'react';
import { MdMoreVert, MdSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import {
  ContentHeader,
  CompanyTag,
  TableMultiSelectActionBar,
} from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import AddTagGroupForm, { FormValues } from './AddTagGroupForm';
import styles from './CompanyTagsPage.module.less';

import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';

import { navigateCompanyTagGroupPage } from '@/navigation';

import type { ArrayElement } from '@/types';

import {
  CompanyMemberType,
  CompanyTagsPageQuery,
  CompanyTagsPageQueryVariables,
  CreateTagGroupMutation,
  CreateTagGroupMutationVariables,
  DeleteTagGroupMutation,
  DeleteTagGroupMutationVariables,
} from 'generated/graphql-types';

type QueryTagGroup = ArrayElement<CompanyTagsPageQuery['tagGroups']>;

const CompanyTagsPage = () => {
  const navigate = useNavigate();

  const { activeCompany, getCurrentMember } = useAppStore();

  const currentMember = getCurrentMember();

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<CompanyTagsPageQuery, CompanyTagsPageQueryVariables>(
    companyTagsPageQuery,
    {
      variables: {
        companyId: activeCompany?.id as string,
      },
      skip: !activeCompany?.id,
    },
  );
  const [mutateCreateTagGroup] = useMutation<
    CreateTagGroupMutation,
    CreateTagGroupMutationVariables
  >(createTagGroupMutation);
  const [mutateDeleteTagGroup] = useMutation<
    DeleteTagGroupMutation,
    DeleteTagGroupMutationVariables
  >(deleteTagGroupMutation);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<QueryTagGroup[]>([]);

  const canEdit = currentMember?.type !== CompanyMemberType.Member;

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleUpdateSelectedRows = (selectedRows: QueryTagGroup[]) => {
    setSelectedRows(selectedRows);
  };

  const handleClearSelectedRows = () => {
    setSelectedRows([]);
  };

  const handleViewGroup = (group: QueryTagGroup) => {
    if (!group?.id || !activeCompany?.slug) {
      return;
    }

    navigateCompanyTagGroupPage({
      navigate,
      companySlug: activeCompany.slug,
      tagGroupId: group.id,
    });
  };

  const handleOpenDeleteTagGroupConfirmation = (group: QueryTagGroup) => {
    Modal.confirm({
      title: 'Delete Tag Group',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this group?
        </div>
      ),
      onOk: async () => {
        await handleDeleteTagGroup(group);
      },
    });
  };

  const handleOpenDeleteTagGroupsConfirmation = () => {
    if (selectedRows.length === 0) {
      return;
    }

    Modal.confirm({
      title: 'Delete Tag Groups',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete these groups?
        </div>
      ),
      onOk: async () => {
        for (const group of selectedRows) {
          await handleDeleteTagGroup(group);
        }

        handleClearSelectedRows();
      },
    });
  };

  const handleCreateTagGroup = async (values: FormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateCreateTagGroup({
        variables: {
          input: {
            companyId: activeCompany.id,
            name: values.name.trim(),
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create tag group',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTagGroup = async (group: QueryTagGroup) => {
    if (!group?.id) {
      return;
    }

    try {
      const res = await mutateDeleteTagGroup({
        variables: {
          deleteTagGroupId: group.id,
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete tag group',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnProps<QueryTagGroup>[] = [
    {
      title: 'Tag Group',
      dataIndex: 'name',
      width: 250,
    },
    {
      title: 'Tags',
      render: (col, item) => {
        return (
          <Space>
            {item?.tags?.slice(0, 5).map((tag) => (
              <CompanyTag key={tag?.id} color={tag?.color as string}>
                {tag?.name}
              </CompanyTag>
            ))}

            {item?.tags && item.tags.length > 5 && (
              <CompanyTag>+{item.tags.length - 5}</CompanyTag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Action',
      width: 80,
      render: (col, item) => {
        const handleClickMenuItem = (key: string) => {
          if (key === 'view') {
            handleViewGroup(item);
          } else if (key === 'delete') {
            handleOpenDeleteTagGroupConfirmation(item);
          }
        };

        return (
          <Dropdown
            position="br"
            droplist={
              <Menu onClickMenuItem={handleClickMenuItem}>
                <Menu.Item key="view" onClick={(e) => e.stopPropagation()}>
                  View
                </Menu.Item>
                {canEdit && (
                  <Menu.Item key="delete" onClick={(e) => e.stopPropagation()}>
                    Delete
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <Button
              icon={<MdMoreVert />}
              type="text"
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        );
      },
    },
  ];

  const getData = (): QueryTagGroup[] => {
    let data = queryData?.tagGroups || [];

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      data = data.filter((group) =>
        group?.tags?.some((tag) => tag?.name?.match(regex)),
      );
    }

    return data;
  };

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Setting',
          },
          {
            name: 'Company',
          },
          {
            name: 'Tags',
          },
        ]}
      />

      <Space className={styles.wrapper} direction="vertical">
        {canEdit && (
          <Card>
            <Typography.Text className={styles.title}>
              Add Group
            </Typography.Text>

            <AddTagGroupForm onSubmit={handleCreateTagGroup} />
          </Card>
        )}

        <Card>
          <Space direction="vertical" size={20}>
            <Grid.Row justify="space-between">
              <Typography.Text className={styles.title}>
                Tag Groups
              </Typography.Text>

              <Input
                style={{ width: 240 }}
                suffix={<MdSearch />}
                placeholder="Search tag"
                value={searchKeyword}
                onChange={handleUpdateSearchKeyword}
              />
            </Grid.Row>

            <div>
              {selectedRows.length > 0 && (
                <TableMultiSelectActionBar
                  numberOfRows={selectedRows.length}
                  suffix="groups"
                  onDeselectAll={handleClearSelectedRows}
                  actions={[
                    <Button
                      type="text"
                      size="small"
                      onClick={handleOpenDeleteTagGroupsConfirmation}
                    >
                      Delete
                    </Button>,
                  ]}
                />
              )}

              <Table
                loading={queryLoading}
                showHeader={selectedRows.length === 0}
                columns={columns}
                data={getData()}
                border={false}
                rowSelection={
                  canEdit
                    ? {
                        checkAll: false,
                        checkboxProps: () => ({
                          onClick: (e: SyntheticEvent) => {
                            e.stopPropagation();
                          },
                        }),
                        selectedRowKeys: selectedRows.map(
                          (group) => group?.id as string,
                        ),
                        onChange: (_, selectedRows) =>
                          handleUpdateSelectedRows(selectedRows),
                      }
                    : undefined
                }
                pagination={{
                  showTotal: (total) => `Total ${total} Groups`,
                }}
                onRow={(record) => ({
                  onClick: () => handleViewGroup(record),
                })}
                scroll={{ x: 1000 }}
              />
            </div>
          </Space>
        </Card>
      </Space>
    </>
  );
};

const companyTagsPageQuery = gql`
  query CompanyTagsPage($companyId: ID!) {
    tagGroups(companyId: $companyId) {
      id
      name
      tags {
        id
        name
        color
      }
    }
  }
`;

const createTagGroupMutation = gql`
  mutation CreateTagGroup($input: CreateTagGroupInput!) {
    createTagGroup(input: $input) {
      id
    }
  }
`;

const deleteTagGroupMutation = gql`
  mutation DeleteTagGroup($deleteTagGroupId: ID!) {
    deleteTagGroup(id: $deleteTagGroupId) {
      id
    }
  }
`;

export default CompanyTagsPage;
