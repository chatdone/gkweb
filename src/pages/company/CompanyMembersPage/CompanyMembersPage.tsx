import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Card,
  Dropdown,
  Input,
  Menu,
  Select,
  Space,
  Table,
  Typography,
  Modal,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { capitalize, escapeRegExp } from 'lodash-es';
import { useState } from 'react';
import {
  MdAdd,
  MdCancel,
  MdMoreVert,
  MdSearch,
  MdVerified,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import {
  ContentHeader,
  TableMultiSelectActionBar,
  FilterDropdown,
} from '@/components';
import Message from '@/components/Message';

import AddCompanyMemberModal, {
  FormValues as AddCompanyMemberFormValues,
} from './AddCompanyMemberModal';
import BulkAddCompanyMembersModal from './BulkAddCompanyMembersModal';
import styles from './CompanyMembersPage.module.less';
import EditCompanyMemberDrawer, {
  editCompanyMemberDrawerFragment,
  FormValues as EditCompanyMemberFormValues,
} from './EditCompanyMemberDrawer';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { ApolloClient } from '@/services';

import { formatToCurrency } from '@/utils/currency.utils';
import { getErrorMessage } from '@/utils/error.utils';
import { openHubspot } from '@/utils/hubspot.utils';
import { alphabeticalSort, countSort, dateSort } from '@/utils/sorter.utils';

import { companyMemberTypeOptions } from '@/constants/company.constants';

import { navigateCompanySubscriptionsPage } from '@/navigation';

import { ArrayElement, SelectOption } from '@/types';

import {
  CompanyMemberType,
  CompanyMemberReferenceImageStatus,
  CompanyMembersPageQuery,
  CompanyMembersPageQueryVariables,
  UpdateCompanyMemberInfoMutation,
  UpdateCompanyMemberInfoMutationVariables,
  AddMemberToCompanyMutation,
  AddMemberToCompanyMutationVariables,
  RemoveMemberFromCompanyMutation,
  RemoveMemberFromCompanyMutationVariables,
  BulkUploadMembersMutation,
  BulkUploadMembersMutationVariables,
  SetCompanyMemberReferenceImageMutation,
  SetCompanyMemberReferenceImageMutationVariables,
  GetReferenceImageUploadUrlQuery,
  GetReferenceImageUploadUrlQueryVariables,
  UpdateCompanyMemberActiveStatusMutation,
  UpdateCompanyMemberActiveStatusMutationVariables,
} from 'generated/graphql-types';

type FilterFormValues = {
  role?: CompanyMemberType;
  activeMember?: 'true' | 'false';
  joinedDateRange?: Date[];
  hourlyRate?: number;
};

type QueryCompanyMember = ArrayElement<
  NonNullable<CompanyMembersPageQuery['company']>['members']
>;

const CompanyMembersPage = () => {
  const navigate = useNavigate();

  const { activeCompany, getCurrentMember, reloadUser } = useAppStore();

  const currentMember = getCurrentMember();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    CompanyMembersPageQuery,
    CompanyMembersPageQueryVariables
  >(companyMembersPageQuery, {
    variables: {
      companyId: activeCompany?.id as string,
    },
    skip: !activeCompany?.id,
  });
  const [
    mutateUpdateCompanyMemberInfo,
    { loading: mutateUpdateCompanyMemberInfoLoading },
  ] = useMutation<
    UpdateCompanyMemberInfoMutation,
    UpdateCompanyMemberInfoMutationVariables
  >(updateCompanyMemberInfoMutation);
  const [
    mutateAddMemberToCompany,
    { loading: mutateAddMemberToCompanyLoading },
  ] = useMutation<
    AddMemberToCompanyMutation,
    AddMemberToCompanyMutationVariables
  >(addMemberToCompanyMutation);
  const [mutateRemoveMemberFromCompany] = useMutation<
    RemoveMemberFromCompanyMutation,
    RemoveMemberFromCompanyMutationVariables
  >(removeMemberFromCompanyMutation);
  const [mutateBulkUploadMembers, { loading: mutateBulkUploadMembersLoading }] =
    useMutation<BulkUploadMembersMutation, BulkUploadMembersMutationVariables>(
      bulkUploadMembersMutation,
    );
  const [mutateSetCompanyMemberReferenceImage] = useMutation<
    SetCompanyMemberReferenceImageMutation,
    SetCompanyMemberReferenceImageMutationVariables
  >(setCompanyMemberReferenceImageMutation);
  const [mutateUpdateCompanyMemberActiveStatus] = useMutation<
    UpdateCompanyMemberActiveStatusMutation,
    UpdateCompanyMemberActiveStatusMutationVariables
  >(updateCompanyMemberActiveStatusMutation);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [editCompanyMember, setEditCompanyMember] =
    useState<QueryCompanyMember>();
  const [filterValues, setFilterValues] = useState<FilterFormValues>({});
  const [uploadingReferenceImage, setUploadingReferenceImage] =
    useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<QueryCompanyMember[]>([]);

  const disclosureState = {
    add: useDisclosure(),
    edit: useDisclosure(),
    batch: useDisclosure(),
  };

  const isAdmin = currentMember?.type === CompanyMemberType.Admin;
  const isManager = currentMember?.type === CompanyMemberType.Manager;
  const isAdminOrManager = isAdmin || isManager;

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleUpdateFilter = (values: FilterFormValues) => {
    setFilterValues(values);
  };

  const handleUpdateSelectedRows = (selectedRows: QueryCompanyMember[]) => {
    setSelectedRows(selectedRows);
  };

  const handleClearSelectedRows = () => {
    setSelectedRows([]);
  };

  const handleCloseDrawer = () => {
    disclosureState.edit.onClose();
  };

  const handleEditMember = (member: QueryCompanyMember) => {
    setEditCompanyMember(member);

    disclosureState.edit.onOpen();
  };

  const handleOpenDeleteMemberConfirmation = (member: QueryCompanyMember) => {
    Modal.confirm({
      title: 'Delete Company Member',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to remove this member?
        </div>
      ),
      okText: 'Confirm',
      okButtonProps: {
        style: {
          background: '#d6001c',
        },
      },
      onOk: async () => {
        await handleRemoveMemberFromCompany(member);
      },
    });
  };

  const handleOpenDeleteSelectedMembersConfirmation = () => {
    if (selectedRows.length === 0) {
      return;
    }

    Modal.confirm({
      title: 'Delete Company Members',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to remove these members?
        </div>
      ),
      okText: 'Confirm',
      okButtonProps: {
        style: {
          background: '#d6001c',
        },
      },
      onOk: async () => {
        for (const member of selectedRows) {
          await handleRemoveMemberFromCompany(member);
        }

        handleClearSelectedRows();
      },
    });
  };

  const handleCheckCanAddCompanyMember = () => {
    if (activeCompany?.currentSubscription?.userQuota === 0) {
      if (
        activeCompany.currentSubscription.package?.userQuota &&
        activeCompany.currentSubscription.package.userQuota >= 60
      ) {
        Modal.info({
          title: 'Reached Plan Limit',
          content:
            'You are out of seats, please contact our support team to customize your plan.',
          okText: 'Open Hubspot',
          onConfirm: () => {
            openHubspot();
          },
        });
      } else {
        Modal.info({
          title: 'Reached Plan Limit',
          content:
            currentMember?.type === CompanyMemberType.Admin
              ? 'You are out of seats, please upgrade your plan to add more members'
              : 'You are out of seats, please upgrade your plan or contact your admin.',
          okText:
            currentMember?.type === CompanyMemberType.Admin
              ? 'Upgrade Plan'
              : undefined,
          onConfirm: () => {
            activeCompany.slug &&
              navigateCompanySubscriptionsPage({
                navigate,
                companySlug: activeCompany.slug,
              });
          },
        });
      }

      return false;
    }

    return true;
  };

  const handleBeforeAddCompanyMember = () => {
    const canAddMember = handleCheckCanAddCompanyMember();

    canAddMember && disclosureState.add.onOpen();
  };

  const handleBeforeBatchImport = () => {
    const canAddMember = handleCheckCanAddCompanyMember();

    canAddMember && disclosureState.batch.onOpen();
  };

  const handleAddCompanyMember = async (values: AddCompanyMemberFormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      // TODO: camel case
      const res = await mutateAddMemberToCompany({
        variables: {
          companyId: activeCompany.id,
          input: {
            email: values.email,
            position: values.position.trim(),
            type: values.role,
            employee_type_id: values.employeeTypeId,
            hourly_rate: values.hourlyRate,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
        reloadUser();

        disclosureState.add.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add company member',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBatchAddCompanyMembers = async (file: File) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateBulkUploadMembers({
        variables: {
          companyId: activeCompany.id,
          attachment: file,
        },
      });

      if (!res.errors) {
        if (
          res.data?.bulkUploadMembers?.duplicateEmails &&
          res.data.bulkUploadMembers.duplicateEmails > 0
        ) {
          Message.info(
            `Failed to add ${res.data.bulkUploadMembers.duplicateEmails} member(s) due to duplicate`,
          );
        }

        refetchQuery();
        reloadUser();

        disclosureState.batch.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to batch add company member(s)',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCompanyMember = async (
    values: EditCompanyMemberFormValues,
  ) => {
    if (!editCompanyMember?.id) {
      return;
    }

    try {
      const res = await mutateUpdateCompanyMemberInfo({
        variables: {
          companyMemberId: editCompanyMember.id,
          input: {
            position: values.position.trim(),
            type: values.role,
            hourlyRate: values.hourlyRate,
            employeeTypeId: values.employeeTypeId,
          },
        },
      });

      if (editCompanyMember.active !== values.active) {
        await handleUpdateCompanyMemberActiveStatus(values.active);
      }

      if (!res.errors) {
        refetchQuery();
        reloadUser();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update company member',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCompanyMemberRole = async (
    member: QueryCompanyMember,
    role: CompanyMemberType,
  ) => {
    if (!member?.id) {
      return;
    }

    try {
      const res = await mutateUpdateCompanyMemberInfo({
        variables: {
          companyMemberId: member.id,
          input: {
            type: role,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
        reloadUser();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update company member',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveMemberFromCompany = async (member: QueryCompanyMember) => {
    if (!member?.id || !activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateRemoveMemberFromCompany({
        variables: {
          companyId: activeCompany.id,
          companyMemberId: member.id,
        },
      });

      if (!res.errors) {
        refetchQuery();
        reloadUser();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to remove company member',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetCompanyMemberReferenceImage = async (file: File) => {
    if (!editCompanyMember?.id || !activeCompany?.id) {
      return;
    }

    setUploadingReferenceImage(true);

    try {
      const { data } = await ApolloClient.query<
        GetReferenceImageUploadUrlQuery,
        GetReferenceImageUploadUrlQueryVariables
      >({
        query: getReferenceImageUploadUrlQuery,
        variables: {
          companyId: activeCompany.id,
        },
      });

      const uriParts = data.getReferenceImageUploadUrl?.uploadUrl?.split('?');

      const options = {
        method: 'PUT',
        body: file,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };

      await fetch(
        data.getReferenceImageUploadUrl?.uploadUrl as string,
        options,
      );

      const res = await mutateSetCompanyMemberReferenceImage({
        variables: {
          companyMemberId: editCompanyMember.id,
          input: {
            image_url: uriParts?.[0] as string,
            s3_bucket: data.getReferenceImageUploadUrl?.s3Bucket as string,
            s3_key: data.getReferenceImageUploadUrl?.s3Key as string,
          },
        },
      });

      if (!res.errors) {
        const refetchRes = await refetchQuery();

        const updatedMember = refetchRes.data.company?.members?.find(
          (member) => member?.id === editCompanyMember.id,
        );
        updatedMember && setEditCompanyMember(updatedMember);
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to upload reference image',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploadingReferenceImage(false);
    }
  };

  const handleUpdateCompanyMemberActiveStatus = async (active: boolean) => {
    if (!editCompanyMember?.id) {
      return;
    }

    try {
      const res = await mutateUpdateCompanyMemberActiveStatus({
        variables: {
          companyMemberId: editCompanyMember.id,
          active,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: "Failed to update company member's active status ",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployeeTypeOptions = (): SelectOption[] => {
    if (!queryData?.company?.employeeTypes) {
      return [];
    }

    return queryData.company.employeeTypes
      .filter((type) => !type?.archived)
      .map((type) => ({
        label: type?.name,
        value: type?.id as string,
      }));
  };

  const columns: ColumnProps<QueryCompanyMember>[] = [
    {
      title: 'Name',
      sorter: alphabeticalSort((item) => item?.user?.name || ''),
      render: (col, item) => {
        return (
          <Space>
            <Typography.Text>{item?.user?.name}</Typography.Text>

            {item?.referenceImage?.status ===
              CompanyMemberReferenceImageStatus.Approved && (
              <MdVerified className={styles['verified-icon']} />
            )}

            {item?.referenceImage?.status ===
              CompanyMemberReferenceImageStatus.Rejected && (
              <MdCancel className={styles['rejected-icon']} />
            )}
          </Space>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'user.email',
    },
    {
      title: 'Position',
      width: 175,
      dataIndex: 'position',
    },
    {
      key: 'hourly_rate',
      title: 'Hourly Rate',
      width: 150,
      sorter: countSort((item) => item?.hourlyRate || 0),
      render: (col, item) => {
        return item?.hourlyRate ? formatToCurrency(item.hourlyRate) : '-';
      },
    },
    {
      title: 'Role',
      width: 150,
      render: (col, item) => {
        const canEditAdmin = item?.type === CompanyMemberType.Admin && isAdmin;

        return canEditAdmin ||
          (item?.type !== CompanyMemberType.Admin && isAdminOrManager) ? (
          <Select
            options={
              isManager
                ? companyMemberTypeOptions.filter(
                    (option) => option.value !== CompanyMemberType.Admin,
                  )
                : companyMemberTypeOptions
            }
            value={item?.type as CompanyMemberType}
            onChange={(value, option) => {
              if (!Array.isArray(option)) {
                option.onClick = (e) => e.stopPropagation();
              }

              handleUpdateCompanyMemberRole(item, value);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          capitalize(item?.type as string)
        );
      },
    },
    {
      title: 'Joined Date',
      width: 150,
      sorter: dateSort('item.createdAt'),
      render: (col, item) => {
        return item?.createdAt && dayjs(item.createdAt).format('D MMM YYYY');
      },
    },
    {
      key: 'action',
      title: 'Action',
      width: 80,
      render: (col, item) => {
        const canEditAdmin = item?.type === CompanyMemberType.Admin && isAdmin;

        const handleClickMenuItem = (key: string) => {
          if (key === 'edit') {
            handleEditMember(item);
          } else if (key === 'delete') {
            handleOpenDeleteMemberConfirmation(item);
          }
        };

        return (
          (canEditAdmin ||
            (item?.type !== CompanyMemberType.Admin && isAdminOrManager)) && (
            <Dropdown
              position="br"
              droplist={
                <Menu onClickMenuItem={handleClickMenuItem}>
                  <Menu.Item key="edit">Edit</Menu.Item>
                  <Menu.Item key="delete">Delete</Menu.Item>
                </Menu>
              }
            >
              <Button icon={<MdMoreVert />} type="text" />
            </Dropdown>
          )
        );
      },
    },
  ];

  const getData = (): QueryCompanyMember[] => {
    let data = queryData?.company?.members || [];

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      data = data.filter(
        (member) =>
          member?.user?.name?.match(regex) || member?.user?.email?.match(regex),
      );
    }

    if (Object.keys(filterValues).length > 0) {
      Object.entries(filterValues)
        .filter(([, value]) => value)
        .forEach(([key, value]) => {
          if (key === 'role') {
            data = data.filter((member) => member?.type === value);
          } else if (key === 'hourlyRate') {
            data = data.filter((member) => member?.hourlyRate === value);
          } else if (key === 'joinedDateRange') {
            const [startDate, endDate] = value as Date[];

            data = data.filter(
              (member) =>
                member?.createdAt &&
                dayjs(member.createdAt).isBetween(
                  startDate,
                  endDate,
                  'day',
                  '[]',
                ),
            );
          }
        });
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
            name: 'Member',
          },
        ]}
      />

      <Card className={styles['card-wrapper']}>
        <Space direction="vertical" size={30}>
          <div>
            <div className={styles['space-between']}>
              <Typography.Text className={styles.title}>Member</Typography.Text>

              <Space>
                <Input
                  style={{ width: 306 }}
                  placeholder="Search member"
                  suffix={<MdSearch />}
                  value={searchKeyword}
                  onChange={handleUpdateSearchKeyword}
                />

                <FilterDropdown
                  fields={[
                    {
                      label: 'Role',
                      field: 'role',
                      type: 'select',
                      options: companyMemberTypeOptions,
                    },
                    {
                      label: 'Hourly Rate',
                      field: 'hourlyRate',
                      type: 'number',
                      min: 0,
                      precision: 2,
                      placeholder: 'Please insert',
                    },
                    {
                      label: 'Joined Date',
                      field: 'joinedDateRange',
                      type: 'dateRange',
                    },
                    {
                      label: 'Active Member',
                      field: 'activeMember',
                      type: 'select',
                      placeholder: 'Not Selected',
                      options: [
                        {
                          label: 'Yes',
                          value: 'true',
                        },
                        {
                          label: 'No',
                          value: 'false',
                        },
                      ],
                    },
                  ]}
                  value={filterValues}
                  onUpdate={handleUpdateFilter}
                />
              </Space>
            </div>

            {isAdminOrManager && (
              <div className={styles['btn-row']}>
                <Space>
                  <Button
                    className={styles['theme-btn']}
                    icon={<MdAdd />}
                    onClick={handleBeforeAddCompanyMember}
                  >
                    Add Member
                  </Button>

                  <Button onClick={handleBeforeBatchImport}>
                    Batch Import
                  </Button>
                </Space>
              </div>
            )}
          </div>

          <div>
            {selectedRows.length > 0 && (
              <TableMultiSelectActionBar
                numberOfRows={selectedRows.length}
                suffix="members"
                actions={[
                  <Button
                    className={styles['theme-btn-text']}
                    size="small"
                    type="text"
                    onClick={handleOpenDeleteSelectedMembersConfirmation}
                  >
                    Delete
                  </Button>,
                ]}
                onDeselectAll={handleClearSelectedRows}
              />
            )}

            <Table
              className={styles.table}
              showHeader={selectedRows.length === 0}
              loading={!queryData}
              border={false}
              columns={isAdmin ? columns : columns.filter((col) => !col.key)}
              data={getData()}
              pagination={{
                showTotal: (total) => `Total ${total} Members`,
              }}
              rowSelection={
                isAdminOrManager
                  ? {
                      selectedRowKeys: selectedRows.map(
                        (member) => member?.id as string,
                      ),
                      onChange: (_, selectedRows) =>
                        handleUpdateSelectedRows(selectedRows),
                      checkAll: isAdmin,
                      renderCell: (node, checked, record) => {
                        const canEditAdmin =
                          record?.type === CompanyMemberType.Admin && isAdmin;

                        return (
                          (canEditAdmin ||
                            (record?.type !== CompanyMemberType.Admin &&
                              isAdminOrManager)) &&
                          node
                        );
                      },
                    }
                  : undefined
              }
            />
          </div>
        </Space>
      </Card>

      <EditCompanyMemberDrawer
        visible={disclosureState.edit.visible}
        onCancel={handleCloseDrawer}
        companyMember={editCompanyMember}
        loading={mutateUpdateCompanyMemberInfoLoading}
        isAdmin={isAdmin}
        isManager={isManager}
        onSubmit={handleUpdateCompanyMember}
        uploadingReferenceImage={uploadingReferenceImage}
        onUploadReferenceImage={handleSetCompanyMemberReferenceImage}
        employeeTypeOptions={getEmployeeTypeOptions()}
      />

      <AddCompanyMemberModal
        visible={disclosureState.add.visible}
        onCancel={disclosureState.add.onClose}
        loading={mutateAddMemberToCompanyLoading}
        employeeTypeOptions={getEmployeeTypeOptions()}
        onSubmit={handleAddCompanyMember}
      />

      <BulkAddCompanyMembersModal
        visible={disclosureState.batch.visible}
        onCancel={disclosureState.batch.onClose}
        loading={mutateBulkUploadMembersLoading}
        onSubmit={handleBatchAddCompanyMembers}
      />
    </>
  );
};

const companyMembersPageQuery = gql`
  query CompanyMembersPage($companyId: ID!) {
    company(id: $companyId) {
      id
      members {
        id
        hourlyRate
        createdAt
        type
        position
        user {
          id
          name
          email
          contactNo
        }
        referenceImage {
          imageUrl
          status
        }
        ...EditCompanyMemberDrawerFragment
      }
      employeeTypes {
        id
        name
        archived
      }
    }
  }
  ${editCompanyMemberDrawerFragment}
`;

const addMemberToCompanyMutation = gql`
  mutation AddMemberToCompany(
    $companyId: ID!
    $input: AddMemberToCompanyInput!
  ) {
    addMemberToCompany(companyId: $companyId, input: $input) {
      id
    }
  }
`;

const bulkUploadMembersMutation = gql`
  mutation BulkUploadMembers($companyId: ID!, $attachment: Upload!) {
    bulkUploadMembers(companyId: $companyId, attachment: $attachment) {
      duplicateEmails
    }
  }
`;

const updateCompanyMemberInfoMutation = gql`
  mutation UpdateCompanyMemberInfo(
    $companyMemberId: ID!
    $input: UpdateCompanyMemberInfoInput!
  ) {
    updateCompanyMemberInfo(companyMemberId: $companyMemberId, input: $input) {
      id
      type
    }
  }
`;

const removeMemberFromCompanyMutation = gql`
  mutation RemoveMemberFromCompany($companyId: ID!, $companyMemberId: ID!) {
    removeMemberFromCompany(
      companyId: $companyId
      companyMemberId: $companyMemberId
    ) {
      id
    }
  }
`;

const getReferenceImageUploadUrlQuery = gql`
  query GetReferenceImageUploadUrl($companyId: ID!) {
    getReferenceImageUploadUrl(companyId: $companyId) {
      s3Bucket
      s3Key
      uploadUrl
    }
  }
`;

const setCompanyMemberReferenceImageMutation = gql`
  mutation SetCompanyMemberReferenceImage(
    $companyMemberId: ID!
    $input: UploadMemberReferenceImageInput!
  ) {
    setCompanyMemberReferenceImage(
      companyMemberId: $companyMemberId
      input: $input
    ) {
      id
    }
  }
`;

const updateCompanyMemberActiveStatusMutation = gql`
  mutation UpdateCompanyMemberActiveStatus(
    $companyMemberId: ID!
    $active: Boolean!
  ) {
    updateCompanyMemberActiveStatus(
      companyMemberId: $companyMemberId
      active: $active
    ) {
      id
    }
  }
`;

export default CompanyMembersPage;
