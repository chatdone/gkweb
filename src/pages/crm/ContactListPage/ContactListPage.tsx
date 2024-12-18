import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Card,
  Space,
  Typography,
  Select,
  Button,
  Input,
  Dropdown,
  Menu,
  SelectProps,
  Grid,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { cloneDeep, escapeRegExp } from 'lodash-es';
import { SyntheticEvent, useState } from 'react';
import {
  MdChevronRight,
  MdMoreVert,
  MdMoveToInbox,
  MdSearch,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import {
  ContentHeader,
  GroupedTable,
  TableMultiSelectActionBar,
  FilterDropdown,
  GroupedList,
} from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import {
  AddContactModal,
  FormValues as ContactFormValues,
} from './AddContactModal';
import BulkAddContactModal, { BulkFile } from './BulkAddContactModal';
import styles from './ContactListPage.module.less';
import {
  EditContactGroupModal,
  FormValues as ContactGroupFormValues,
} from './EditContactGroupModal';
import ListItem from './ListItem';
import SwitchGroupModal, {
  FormValues as SwitchGroupFormValues,
} from './SwitchGroupModal';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';
import { useResponsiveStore } from '@/stores/useResponsiveStores';

import { TemplateService, ContactService } from '@/services';

import { getErrorMessage } from '@/utils/error.utils';
import { alphabeticalSort } from '@/utils/sorter.utils';

import { navigateContactInfoPage } from '@/navigation';

import type { ArrayElement, SelectOption } from '@/types';

import {
  ContactType,
  ContactListPageQuery,
  ContactListPageQueryVariables,
  CreateContactGroupMutation,
  CreateContactGroupMutationVariables,
  UpdateContactGroupMutation,
  UpdateContactGroupMutationVariables,
  DeleteContactGroupMutation,
  DeleteContactGroupMutationVariables,
  CreateContactMutation,
  CreateContactMutationVariables,
  DeleteContactsMutation,
  DeleteContactsMutationVariables,
  CreateContactPicMutation,
  CreateContactPicMutationVariables,
  BulkUploadContactsMutation,
  BulkUploadContactsMutationVariables,
  AddMembersToContactGroupMutation,
  AddMembersToContactGroupMutationVariables,
} from 'generated/graphql-types';

type QueryContactGroup = ArrayElement<
  NonNullable<ContactListPageQuery['contactGroups']>
>;

type QueryContact = ArrayElement<NonNullable<QueryContactGroup>['contacts']>;

type FilterFormValues = {
  type: 'all' | 'company' | 'personal';
  dealOwnerId?: string;
  dealAmount?: {
    min: number;
    max: number;
  };
  tagIds?: string[];
};

const ContactListPage = () => {
  const navigate = useNavigate();

  const { activeCompany, currentUser } = useAppStore();
  const { isMobile } = useResponsiveStore();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    ContactListPageQuery,
    ContactListPageQueryVariables
  >(contactListPageQuery, {
    variables: {
      companyId: activeCompany?.id as string,
    },
    skip: !activeCompany?.id,
  });
  const [
    mutateCreateContactGroup,
    { loading: mutateCreateContactGroupLoading },
  ] = useMutation<
    CreateContactGroupMutation,
    CreateContactGroupMutationVariables
  >(createContactGroupMutation);
  const [
    mutateUpdateContactGroup,
    { loading: mutateUpdateContactGroupLoading },
  ] = useMutation<
    UpdateContactGroupMutation,
    UpdateContactGroupMutationVariables
  >(updateContactGroupMutation);
  const [mutateDeleteContactGroup] = useMutation<
    DeleteContactGroupMutation,
    DeleteContactGroupMutationVariables
  >(deleteContactGroupMutation);
  const [mutateCreateContact] = useMutation<
    CreateContactMutation,
    CreateContactMutationVariables
  >(createContactMutation);
  const [mutateDeleteContacts] = useMutation<
    DeleteContactsMutation,
    DeleteContactsMutationVariables
  >(deleteContactsMutation);
  const [mutateCreateContactPic] = useMutation<
    CreateContactPicMutation,
    CreateContactPicMutationVariables
  >(createContactPicMutation);
  const [mutateBulkUploadContacts] = useMutation<
    BulkUploadContactsMutation,
    BulkUploadContactsMutationVariables
  >(bulkUploadContactsMutation);
  const [
    mutateAddMembersToContactGroup,
    { loading: mutateAddMembersToContactGroupLoading },
  ] = useMutation<
    AddMembersToContactGroupMutation,
    AddMembersToContactGroupMutationVariables
  >(addMembersToContactGroupMutation);

  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filterValues, setFilterValues] = useState<FilterFormValues>({
    type: 'all',
  });
  const [editGroup, setEditGroup] = useState<QueryContactGroup>();
  const [addContactLoading, setAddContactLoading] = useState<boolean>(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<QueryContact[]>([]);
  const [moveContacts, setMoveContacts] = useState<QueryContact[]>([]);

  const modalState = {
    group: useDisclosure(),
    contact: useDisclosure(),
    bulk: useDisclosure(),
    switch: useDisclosure(),
  };

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleUpdateFilter = (values: FilterFormValues) => {
    setFilterValues(values);
  };

  const handleRowSelect = (selected: boolean, record: QueryContact) => {
    if (selected) {
      setSelectedRows((prev) => [...prev, record]);
    } else {
      setSelectedRows((prev) =>
        prev.filter((board) => board?.id !== record?.id),
      );
    }
  };

  const handleClearSelectedRows = () => {
    setSelectedRows([]);
  };

  const handleDownloadTemplate = () => {
    TemplateService.downloadContactTemplate();
  };

  const handleSetMoveContacts = (contacts: QueryContact[]) => {
    setMoveContacts(contacts);

    modalState.switch.onOpen();
  };

  const handleMoveSelectedRows = () => {
    handleSetMoveContacts(selectedRows);
  };

  const handleExportContacts = () => {
    if (!currentUser?.id || !activeCompany?.id) {
      return;
    }

    ContactService.exportContacts({
      userId: currentUser.id,
      companyId: activeCompany.id,
      groupId: selectedGroupId !== 'all' ? selectedGroupId : undefined,
      keyword: searchKeyword,
    });
  };

  const handleChangeGroup = (value: string) => {
    setSelectedGroupId(value);

    if (value !== 'all' && value !== 'unassigned') {
      const foundGroup = queryData?.contactGroups?.find(
        (group) => group?.id === value,
      );

      setEditGroup(foundGroup);
    } else {
      setEditGroup(undefined);
    }
  };

  const handleEditGroup = () => {
    if (selectedGroupId === 'all' || selectedGroupId === 'unassigned') {
      return;
    }

    const foundGroup = queryData?.contactGroups?.find(
      (group) => group?.id === selectedGroupId,
    );

    if (foundGroup) {
      setEditGroup(foundGroup);

      modalState.group.onOpen();
    }
  };

  const handleClickAddMenuItem = (key: string) => {
    if (key === 'group') {
      modalState.group.onOpen();
    } else if (key === 'contact') {
      modalState.contact.onOpen();
    }
  };

  const handleCloseGroupModal = () => {
    modalState.group.onClose();
    setEditGroup(undefined);
  };

  const handleOpenDeleteContactGroupConfirmation = () => {
    if (!editGroup) {
      return;
    }

    modalState.group.onClose();

    Modal.confirm({
      title: 'Delete Contact Group',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this contact group?
        </div>
      ),
      onOk: handleDeleteContactGroup,
    });
  };

  const handleOpenDeleteContactConfirmation = (contact: QueryContact) => {
    Modal.confirm({
      title: 'Delete Contact',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this contact?
        </div>
      ),
      onOk: async () => {
        await handleDeleteContacts([contact]);
      },
    });
  };

  const handleOpenDeleteContactsConfirmation = () => {
    if (selectedRows.length === 0) {
      return;
    }

    Modal.confirm({
      title: 'Delete Contacts',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete these contacts?
        </div>
      ),
      onOk: async () => {
        await handleDeleteContacts(selectedRows);

        handleClearSelectedRows();
      },
    });
  };

  const handleViewContact = (contact: QueryContact) => {
    if (!activeCompany?.slug || !contact?.id) {
      return;
    }

    navigateContactInfoPage({
      navigate,
      companySlug: activeCompany.slug,
      contactId: contact.id,
    });
  };

  const handleCreateContactGroup = async (values: ContactGroupFormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateCreateContactGroup({
        variables: {
          companyId: activeCompany.id,
          input: {
            name: values.name.trim(),
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseGroupModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create contact group',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateContactGroup = async (values: ContactGroupFormValues) => {
    if (selectedGroupId === 'all') {
      return;
    }

    try {
      const res = await mutateUpdateContactGroup({
        variables: {
          groupId: selectedGroupId,
          input: {
            name: values.name.trim(),
          },
        },
      });
      if (!res.errors) {
        refetchQuery();
        handleCloseGroupModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create contact group',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteContactGroup = async () => {
    if (!editGroup?.id) {
      return;
    }

    try {
      const res = await mutateDeleteContactGroup({
        variables: {
          groupId: editGroup.id,
        },
      });

      if (!res.errors) {
        refetchQuery();

        setEditGroup(undefined);
        setSelectedGroupId('all');
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete contact group',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateContact = async (values: ContactFormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      setAddContactLoading(true);

      // TODO: camel case
      const res = await mutateCreateContact({
        variables: {
          companyId: activeCompany.id,
          contactGroupId: values.groupId,
          dealCreator: values.dealOwnerId,
          input: {
            name: values.name.trim(),
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

        refetchQuery();

        modalState.contact.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create contact',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAddContactLoading(false);
    }
  };

  const handleCreateContactPics = async (
    contactId: string,
    values: ContactFormValues['pics'],
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
              name: pic.name.trim(),
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

  const handleBulkAddContacts = async (files: BulkFile[]) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      setBulkUploadLoading(true);

      let shouldRefetchQuery = false;

      const promises = files.map((file) =>
        mutateBulkUploadContacts({
          variables: {
            companyId: activeCompany.id as string,
            groupId: file.groupId,
            attachment: file.file,
          },
        }).then((res) => {
          if (res.errors) {
            Message.error(getErrorMessage(res.errors), {
              title: 'Failed to bulk upload contacts',
            });
          } else {
            shouldRefetchQuery = true;
          }
        }),
      );

      await Promise.all(promises);

      if (shouldRefetchQuery) {
        refetchQuery();
      }

      modalState.bulk.onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setBulkUploadLoading(false);
    }
  };

  const handleDeleteContacts = async (contacts: QueryContact[]) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateDeleteContacts({
        variables: {
          companyId: activeCompany.id,
          contactIds: contacts.map((contact) => contact?.id as string),
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete contact',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMembersToContactGroup = async (
    values: SwitchGroupFormValues,
  ) => {
    if (moveContacts.length === 0) {
      return;
    }

    try {
      // TODO: camel case
      const res = await mutateAddMembersToContactGroup({
        variables: {
          groupId: values.groupId !== 'unassigned' ? values.groupId : undefined,
          input: {
            contact_ids: moveContacts.map((contact) => contact?.id as string),
            // contactIds: [],
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        modalState.switch.onClose();

        setMoveContacts([]);
        handleClearSelectedRows();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to assign contacts to contact group',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getContactGroupSelectOptions = (): SelectProps['options'] => {
    if (!queryData?.contactGroups) {
      return [];
    }

    const options: SelectProps['options'] = queryData.contactGroups.map(
      (group) => ({
        label: `${group?.name} (${group?.contacts?.length})`,
        value: group?.id as string,
      }),
    );

    const totalContacts = queryData.contactGroups.reduce(
      (prev, current) => prev + (current?.contacts?.length || 0),
      0,
    );

    options.unshift({
      label: `All (${totalContacts})`,
      value: 'all',
    });

    return options;
  };

  const getCompanyMemberOptions = (): SelectOption[] => {
    if (!activeCompany?.members) {
      return [];
    }

    return activeCompany.members
      .map((member) => ({
        label: member?.user?.name || member?.user?.email,
        value: member?.user?.id as string,
      }))
      .sort(alphabeticalSort('label'));
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

  const columns: ColumnProps<QueryContact>[] = [
    {
      title: 'Contact',
      dataIndex: 'name',
    },
    {
      title: 'Type',
      width: 100,
      align: 'center',
      render: (col, item) => {
        return item?.type === ContactType.Individual ? 'Personal' : 'Company';
      },
    },
    {
      title: 'Total Contact Person',
      width: 160,
      dataIndex: 'pics.length',
      align: 'center',
    },
    {
      title: 'Deal Owner',
      width: 150,
      render: (col, item) => {
        return item?.dealCreator?.name || item?.dealCreator?.email;
      },
    },
    {
      title: 'Created Date',
      width: 160,
      align: 'center',
      render: (col, item) => {
        return dayjs(item?.createdAt).format('DD MMM YYYY hh:mm a');
      },
    },
    {
      title: 'Action',
      width: 80,
      render: (col, item) => {
        const handleClickMenuItem = (key: string, event: SyntheticEvent) => {
          event.stopPropagation();

          if (key === 'view') {
            handleViewContact(item);
          } else if (key === 'move') {
            handleSetMoveContacts([item]);
          } else if (key === 'delete') {
            handleOpenDeleteContactConfirmation(item);
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
                <Menu.Item key="move">Move</Menu.Item>
                <Menu.Item key="delete">Delete</Menu.Item>
              </Menu>
            }
          >
            <Button type="text" icon={<MdMoreVert />} />
          </Dropdown>
        );
      },
    },
  ];

  const getGroups = () => {
    if (!queryData?.contactGroups) {
      return [];
    }

    let data = cloneDeep(queryData.contactGroups);

    if (selectedGroupId !== 'all') {
      data = data.filter((group) => group?.id === selectedGroupId);
    }

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      data = data.filter(
        (group) =>
          group?.name?.match(regex) ||
          group?.contacts?.some((contact) => contact?.name?.match(regex)),
      );

      data.forEach((group) => {
        if (group?.contacts) {
          group.contacts = group.contacts.filter((contact) =>
            contact?.name?.match(regex),
          );
        }
      });
    }

    const filterEntries = Object.entries(filterValues).filter(
      ([, value]) => value,
    );
    filterEntries.forEach(([key, value]) => {
      if (key === 'type' && value !== 'all') {
        data.forEach((group) => {
          if (group?.contacts) {
            group.contacts = group.contacts.filter(
              (contact) => contact?.type === value,
            );
          }
        });
      } else if (key === 'dealOwnerId') {
        data.forEach((group) => {
          if (group?.contacts) {
            group.contacts = group.contacts.filter(
              (contact) => contact?.dealCreator?.id === value,
            );
          }
        });
      } else if (key === 'dealAmount') {
        const minMax = value as { min: number; max: number };

        data.forEach((group) => {
          if (group?.contacts) {
            group.contacts = group.contacts.filter(
              (contact) =>
                contact?.dealValue &&
                contact.dealValue >= minMax.min &&
                contact.dealValue <= minMax.max,
            );
          }
        });
      } else if (key === 'tagIds') {
        const tagIds = value as string[];

        data.forEach((group) => {
          if (group?.contacts) {
            group.contacts = group.contacts.filter((contact) =>
              contact?.tags?.some((tag) => tag?.id && tagIds.includes(tag.id)),
            );
          }
        });
      }
    });

    return data.map((group) => ({
      key: group?.id as string,
      label: `${group?.name}(${group?.contacts?.length})`,
      data: group?.contacts || [],
    }));
  };

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Contacts',
          },
        ]}
      />

      <Card className={styles.wrapper}>
        <Space
          className={styles['space-wrapper']}
          direction="vertical"
          size={20}
        >
          <Typography.Text className={styles.title}>Contacts</Typography.Text>

          {!isMobile && (
            <Grid.Row justify="space-between">
              <Space>
                <Typography.Text>Group:</Typography.Text>

                <Select
                  style={{ width: 229 }}
                  showSearch
                  loading={!queryData}
                  value={selectedGroupId}
                  options={getContactGroupSelectOptions()}
                  onChange={handleChangeGroup}
                  filterOption={(inputValue, option) => {
                    return option.props.children.match(
                      new RegExp(inputValue, 'i'),
                    );
                  }}
                />

                <Button
                  className={styles['edit-group-button']}
                  type="text"
                  disabled={
                    selectedGroupId === 'all' ||
                    selectedGroupId === 'unassigned'
                  }
                  onClick={handleEditGroup}
                >
                  Edit group
                </Button>
              </Space>

              <Space>
                <Input
                  className={styles['search-input']}
                  suffix={<MdSearch />}
                  placeholder="Search group or contact"
                  allowClear
                  value={searchKeyword}
                  onChange={handleUpdateSearchKeyword}
                />

                <FilterDropdown
                  cardClassName={styles['filter-card']}
                  resetValue={{
                    type: 'all',
                  }}
                  fields={[
                    {
                      type: 'radio-group',
                      field: 'type',
                      label: 'Type',
                      options: [
                        { label: 'All', value: 'all' },
                        { label: 'Company', value: ContactType.Company },
                        { label: 'Personal', value: ContactType.Individual },
                      ],
                      render: (option) => (
                        <Button shape="round">
                          {typeof option === 'object' && option?.label}
                        </Button>
                      ),
                    },
                    {
                      type: 'select',
                      field: 'dealOwnerId',
                      label: 'Deal Owner',
                      options: getCompanyMemberOptions(),
                      placeholder: 'Not Selected',
                    },
                    {
                      type: 'minMax',
                      field: 'dealAmount',
                      label: 'Deal Amount',
                      precision: 2,
                    },
                    {
                      type: 'tags',
                      field: 'tagIds',
                      label: 'Tags',
                      tagGroups: queryData?.tagGroups,
                    },
                  ]}
                  value={filterValues}
                  onUpdate={handleUpdateFilter}
                />
              </Space>
            </Grid.Row>
          )}

          {isMobile && (
            <Space className={styles['responsive-select']}>
              <Typography.Text>Group:</Typography.Text>

              <Select
                className={styles['group-select']}
                showSearch
                loading={!queryData}
                value={selectedGroupId}
                options={getContactGroupSelectOptions()}
                onChange={handleChangeGroup}
                filterOption={(inputValue, option) => {
                  return option.props.children.match(
                    new RegExp(inputValue, 'i'),
                  );
                }}
              />
            </Space>
          )}

          <Grid.Row justify="space-between">
            <Space>
              <Dropdown
                droplist={
                  <Menu onClickMenuItem={handleClickAddMenuItem}>
                    <Menu.Item key="group">Add group</Menu.Item>
                    <Menu.Item key="contact">Add contact</Menu.Item>
                  </Menu>
                }
              >
                <Button className={styles['theme-button']}>
                  Add New <MdChevronRight className={styles['chevron-down']} />
                </Button>
              </Dropdown>

              <Button onClick={modalState.bulk.onOpen}>Bulk Upload</Button>
            </Space>

            {!isMobile && (
              <Button icon={<MdMoveToInbox />} onClick={handleExportContacts}>
                Export
              </Button>
            )}
          </Grid.Row>

          {isMobile ? (
            <GroupedList
              className={styles['grouped-list']}
              groups={getGroups()}
              renderItem={(item) => (
                <ListItem
                  contact={item}
                  onClick={() => handleViewContact(item)}
                />
              )}
            />
          ) : (
            <GroupedTable
              groups={getGroups()}
              columns={columns}
              HeaderRowsSelected={
                selectedRows.length > 0 && (
                  <TableMultiSelectActionBar
                    numberOfRows={selectedRows.length}
                    onDeselectAll={handleClearSelectedRows}
                    actions={[
                      <Button
                        size="small"
                        type="text"
                        onClick={handleMoveSelectedRows}
                      >
                        Move
                      </Button>,
                      <Button
                        className={styles['theme-btn-text']}
                        size="small"
                        type="text"
                        onClick={handleOpenDeleteContactsConfirmation}
                      >
                        Delete
                      </Button>,
                    ]}
                  />
                )
              }
              onRow={(record) => ({
                onClick: () => handleViewContact(record),
              })}
              selectedRowKeys={selectedRows.map(
                (contact) => contact?.id as string,
              )}
              onSelect={handleRowSelect}
            />
          )}
        </Space>
      </Card>

      <EditContactGroupModal
        visible={modalState.group.visible}
        onCancel={handleCloseGroupModal}
        loading={
          mutateCreateContactGroupLoading || mutateUpdateContactGroupLoading
        }
        contactGroup={editGroup}
        onCreate={handleCreateContactGroup}
        onUpdate={handleUpdateContactGroup}
        onDelete={handleOpenDeleteContactGroupConfirmation}
      />

      <AddContactModal
        visible={modalState.contact.visible}
        onCancel={modalState.contact.onClose}
        tagGroups={queryData?.tagGroups}
        loading={addContactLoading}
        onSubmit={handleCreateContact}
        companyMemberOptions={getCompanyMemberOptions()}
        contactGroupOptions={getContactGroupOptions()}
      />

      <BulkAddContactModal
        visible={modalState.bulk.visible}
        onCancel={modalState.bulk.onClose}
        title="Batch Import"
        loading={bulkUploadLoading}
        onDownloadTemplate={handleDownloadTemplate}
        onSubmit={handleBulkAddContacts}
        contactGroupOptions={getContactGroupOptions()}
      />

      <SwitchGroupModal
        visible={modalState.switch.visible}
        onCancel={modalState.switch.onClose}
        loading={mutateAddMembersToContactGroupLoading}
        contactGroupOptions={getContactGroupOptions()}
        onSubmit={handleAddMembersToContactGroup}
      />
    </>
  );
};

const contactListPageQuery = gql`
  query ContactListPage($companyId: ID!) {
    contactGroups(companyId: $companyId) {
      id
      name
      contacts {
        id
        name
        type
        dealValue
        createdAt
        pics {
          id
        }
        dealCreator {
          id
          name
          email
          profileImage
        }
        tags {
          id
        }
      }
    }
    tagGroups(companyId: $companyId) {
      id
      name
      tags {
        id
        name
      }
    }
  }
`;

const createContactGroupMutation = gql`
  mutation CreateContactGroup(
    $companyId: ID!
    $input: CreateContactGroupInput!
  ) {
    createContactGroup(companyId: $companyId, input: $input) {
      id
    }
  }
`;

const updateContactGroupMutation = gql`
  mutation UpdateContactGroup($groupId: ID!, $input: UpdateContactGroupInput!) {
    updateContactGroup(groupId: $groupId, input: $input) {
      id
      name
    }
  }
`;

const deleteContactGroupMutation = gql`
  mutation DeleteContactGroup($groupId: ID!) {
    deleteContactGroup(groupId: $groupId) {
      id
    }
  }
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

const deleteContactsMutation = gql`
  mutation DeleteContacts($companyId: ID!, $contactIds: [ID]!) {
    deleteContacts(companyId: $companyId, contactIds: $contactIds) {
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

const bulkUploadContactsMutation = gql`
  mutation BulkUploadContacts(
    $companyId: ID!
    $attachment: Upload!
    $groupId: ID
  ) {
    bulkUploadContacts(
      companyId: $companyId
      attachment: $attachment
      groupId: $groupId
    ) {
      contacts {
        id
      }
    }
  }
`;

const addMembersToContactGroupMutation = gql`
  mutation AddMembersToContactGroup(
    $input: AddMembersToContactGroupInput!
    $groupId: ID
  ) {
    addMembersToContactGroup(input: $input, groupId: $groupId) {
      id
    }
  }
`;

export default ContactListPage;
