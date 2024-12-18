import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Card,
  Space,
  Table,
  Typography,
  Button,
  Dropdown,
  Menu,
  Grid,
  Input,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { useEffect, useState } from 'react';
import { MdAdd, MdMoreVert, MdSearch } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { ContentHeader, TableMultiSelectActionBar } from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import styles from './CompanyTagGroupPage.module.less';
import EditTagModal, { FormValues } from './EditTagModal';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';
import { alphabeticalSort } from '@/utils/sorter.utils';

import type { ArrayElement } from '@/types';

import type {
  UpdateTagGroupInput,
  CompanyTagGroupPageQuery,
  CompanyTagGroupPageQueryVariables,
  CreateTagMutation,
  CreateTagMutationVariables,
  UpdateTagMutation,
  UpdateTagMutationVariables,
  DeleteTagMutation,
  DeleteTagMutationVariables,
  UpdateTagGroupMutation,
  UpdateTagGroupMutationVariables,
} from 'generated/graphql-types';

type QueryTag = ArrayElement<
  NonNullable<CompanyTagGroupPageQuery['tagGroup']>['tags']
>;

const CompanyTagGroupPage = () => {
  const { groupId } = useParams();

  const { activeCompany } = useAppStore();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    CompanyTagGroupPageQuery,
    CompanyTagGroupPageQueryVariables
  >(companyTagGroupPageQuery, {
    variables: {
      tagGroupId: groupId as string,
    },
    skip: !groupId,
  });
  const [mutateCreateTag, { loading: mutateCreateTagLoading }] = useMutation<
    CreateTagMutation,
    CreateTagMutationVariables
  >(createTagMutation);
  const [mutateUpdateTag, { loading: mutateUpdateTagLoading }] = useMutation<
    UpdateTagMutation,
    UpdateTagMutationVariables
  >(updateTagMutation);
  const [mutateDeleteTag] = useMutation<
    DeleteTagMutation,
    DeleteTagMutationVariables
  >(deleteTagMutation);
  const [mutateUpdateTagGroup] = useMutation<
    UpdateTagGroupMutation,
    UpdateTagGroupMutationVariables
  >(updateTagGroupMutation);

  const [editTag, setEditTag] = useState<QueryTag>();
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<QueryTag[]>([]);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const { visible, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (queryData?.tagGroup) {
      setName(queryData.tagGroup?.name as string);
      setDescription(queryData.tagGroup?.description as string);
    }
  }, [queryData]);

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleUpdateSelectedRows = (selectedRows: QueryTag[]) => {
    setSelectedRows(selectedRows);
  };

  const handleClearSelectedRows = () => {
    setSelectedRows([]);
  };

  const handleEditTag = (tag: QueryTag) => {
    setEditTag(tag);

    onOpen();
  };

  const handleCloseModal = () => {
    onClose();

    setEditTag(undefined);
  };

  const handleOpenDeleteTagConfirmation = (tag: QueryTag) => {
    Modal.confirm({
      title: 'Delete Tag',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this tag?
        </div>
      ),
      onOk: async () => {
        await handleDeleteTag(tag);
      },
    });
  };

  const handleOpenDeleteTagsConfirmation = () => {
    if (selectedRows.length === 0) {
      return;
    }

    Modal.confirm({
      title: 'Delete Tags',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete these tags?
        </div>
      ),
      onOk: async () => {
        for (const tag of selectedRows) {
          await handleDeleteTag(tag);
        }

        handleClearSelectedRows();
      },
    });
  };

  const handleCreateTag = async (values: FormValues) => {
    if (!activeCompany?.id || !groupId) {
      return;
    }

    try {
      const res = await mutateCreateTag({
        variables: {
          input: {
            companyId: activeCompany.id,
            groupId: groupId,
            name: values.name.trim(),
            color: values.color,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create tag',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTag = async (values: FormValues) => {
    if (!editTag?.id) {
      return;
    }

    try {
      const res = await mutateUpdateTag({
        variables: {
          input: {
            id: editTag.id,
            name: values.name.trim(),
            color: values.color,
          },
        },
      });

      if (!res.errors) {
        handleCloseModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update tag',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTag = async (tag: QueryTag) => {
    if (!tag?.id) {
      return;
    }

    try {
      const res = await mutateDeleteTag({
        variables: {
          deleteTagId: tag.id,
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete tag',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTagGroup = async (
    input: Partial<Pick<UpdateTagGroupInput, 'name' | 'description'>>,
  ) => {
    if (!queryData?.tagGroup?.id || !queryData.tagGroup.name) {
      return;
    }

    try {
      const res = await mutateUpdateTagGroup({
        variables: {
          input: {
            id: queryData.tagGroup.id,
            name: input.name?.trim() || queryData.tagGroup.name,
            description: input.description?.trim(),
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update tag group',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnProps<QueryTag>[] = [
    {
      title: 'Name',
      sorter: alphabeticalSort('name'),
      render: (col, item) => {
        return (
          <Space>
            <div
              className={styles['tag-color-circle']}
              style={{ background: item?.color || undefined }}
            />

            <Typography.Text>{item?.name}</Typography.Text>
          </Space>
        );
      },
    },
    {
      title: 'Action',
      width: 80,
      render: (col, item) => {
        const handleMenuItemClick = (key: string) => {
          if (key === 'edit') {
            handleEditTag(item);
          } else if (key === 'delete') {
            handleOpenDeleteTagConfirmation(item);
          }
        };

        return (
          <Dropdown
            droplist={
              <Menu onClickMenuItem={handleMenuItemClick}>
                <Menu.Item key="edit" onClick={(e) => e.stopPropagation()}>
                  Edit
                </Menu.Item>
                <Menu.Item key="delete" onClick={(e) => e.stopPropagation()}>
                  Delete
                </Menu.Item>
              </Menu>
            }
          >
            <Button icon={<MdMoreVert />} type="text" />
          </Dropdown>
        );
      },
    },
  ];

  const getData = (): QueryTag[] => {
    let data = queryData?.tagGroup?.tags || [];

    if (searchKeyword) {
      const regex = new RegExp(searchKeyword, 'i');

      data = data.filter((tag) => tag?.name?.match(regex));
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
            path: '/settings/company/tags',
          },
          {
            name: queryData?.tagGroup?.name || 'Loading',
          },
        ]}
      />

      <Space className={styles.wrapper} direction="vertical">
        <Card className={styles['group-description-card']}>
          <Typography.Paragraph className={styles.title}>
            Tag Information
          </Typography.Paragraph>

          <Grid.Row className={styles.row}>
            <Grid.Col xs={24} lg={{ span: 8, offset: 1 }}>
              <Space align="center">
                <Typography.Text className={styles.label}>
                  Tag Group :{' '}
                </Typography.Text>

                <Typography.Text
                  editable={{
                    onChange: (text: string) => {
                      setName(text);
                    },
                    onEnd: (text: string) => {
                      handleUpdateTagGroup({
                        name: text,
                      });
                    },
                  }}
                >
                  {name}
                </Typography.Text>
              </Space>
            </Grid.Col>

            <Grid.Col xs={24} lg={{ span: 14, offset: 1 }}>
              <Space align="center">
                <Typography.Text className={styles.label}>
                  Description :{' '}
                </Typography.Text>

                <Typography.Text
                  editable={{
                    onChange: (text: string) => {
                      setDescription(text);
                    },
                    onEnd: (text: string) => {
                      handleUpdateTagGroup({
                        description: text,
                      });
                    },
                  }}
                >
                  {description}
                </Typography.Text>
              </Space>
            </Grid.Col>
          </Grid.Row>
        </Card>

        <Card>
          <Space direction="vertical" size={20}>
            <div>
              <Typography.Paragraph className={styles.title}>
                Tags ({queryData?.tagGroup?.tags?.length || 0})
              </Typography.Paragraph>

              <Grid.Row justify="space-between">
                <Button
                  className={styles['theme-button']}
                  icon={<MdAdd />}
                  onClick={onOpen}
                >
                  Add Tag
                </Button>

                <Input
                  style={{ width: 405 }}
                  suffix={<MdSearch />}
                  placeholder="Search tag"
                  value={searchKeyword}
                  onChange={handleUpdateSearchKeyword}
                />
              </Grid.Row>
            </div>

            <div>
              {selectedRows.length > 0 && (
                <TableMultiSelectActionBar
                  numberOfRows={selectedRows.length}
                  suffix="tags"
                  onDeselectAll={handleClearSelectedRows}
                  actions={[
                    <Button
                      type="text"
                      size="small"
                      onClick={handleOpenDeleteTagsConfirmation}
                    >
                      Delete
                    </Button>,
                  ]}
                />
              )}

              <Table
                showHeader={selectedRows.length === 0}
                data={getData()}
                columns={columns}
                border={false}
                pagination={false}
                rowSelection={{
                  checkAll: false,
                  selectedRowKeys: selectedRows.map((tag) => tag?.id as string),
                  onChange: (_, selectedRows) =>
                    handleUpdateSelectedRows(selectedRows),
                }}
              />
            </div>
          </Space>
        </Card>
      </Space>

      <EditTagModal
        visible={visible}
        onCancel={handleCloseModal}
        loading={mutateCreateTagLoading || mutateUpdateTagLoading}
        tag={editTag}
        onCreate={handleCreateTag}
        onUpdate={handleUpdateTag}
      />
    </>
  );
};

const tagFragment = gql`
  fragment TagFragment on Tag {
    id
    name
    color
  }
`;

const companyTagGroupPageQuery = gql`
  query CompanyTagGroupPage($tagGroupId: ID!) {
    tagGroup(id: $tagGroupId) {
      id
      name
      description
      tags {
        ...TagFragment
      }
    }
  }
  ${tagFragment}
`;

const createTagMutation = gql`
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      id
    }
  }
`;

const updateTagMutation = gql`
  mutation UpdateTag($input: UpdateTagInput!) {
    updateTag(input: $input) {
      ...TagFragment
    }
  }
  ${tagFragment}
`;

const deleteTagMutation = gql`
  mutation DeleteTag($deleteTagId: ID!) {
    deleteTag(id: $deleteTagId) {
      id
    }
  }
`;

const updateTagGroupMutation = gql`
  mutation UpdateTagGroup($input: UpdateTagGroupInput!) {
    updateTagGroup(input: $input) {
      id
    }
  }
`;

export default CompanyTagGroupPage;
