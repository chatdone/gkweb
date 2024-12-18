import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Space,
  Card,
  Button,
  Typography,
  Table,
  Dropdown,
  Menu,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { getTimeZones } from '@vvo/tzdb';
import { SyntheticEvent, useState } from 'react';
import { MdAdd, MdMoreVert } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { ContentHeader, TableMultiSelectActionBar } from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import AddWorkScheduleModal, {
  FormValues as AddWorkScheduleFormValues,
} from './AddWorkScheduleModal';
import styles from './CompanyWorkSchedulesPage.module.less';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';

import { navigateCompanyWorkScheduleInfoPage } from '@/navigation';

import type { ArrayElement } from '@/types';

import {
  CompanyMemberType,
  CompanyWorkSchedulesPageQuery,
  CompanyWorkSchedulesPageQueryVariables,
  CreateEmployeeTypeMutation,
  CreateEmployeeTypeMutationVariables,
  ArchiveEmployeeTypeMutation,
  ArchiveEmployeeTypeMutationVariables,
} from 'generated/graphql-types';

type QueryEmployeeType = ArrayElement<
  NonNullable<CompanyWorkSchedulesPageQuery['company']>['employeeTypes']
>;

const CompanyWorkSchedulePage = () => {
  const navigate = useNavigate();

  const { activeCompany, getCurrentMember } = useAppStore();

  const currentMember = getCurrentMember();

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<
    CompanyWorkSchedulesPageQuery,
    CompanyWorkSchedulesPageQueryVariables
  >(companyWorkSchedulesPageQuery, {
    variables: {
      companyId: activeCompany?.id as string,
    },
    skip: !activeCompany?.id,
  });
  const [
    mutateCreateEmployeeType,
    { loading: mutateCreateEmployeeTypeLoading },
  ] = useMutation<
    CreateEmployeeTypeMutation,
    CreateEmployeeTypeMutationVariables
  >(createEmployeeTypeMutation);
  const [mutateArchiveEmployeeType] = useMutation<
    ArchiveEmployeeTypeMutation,
    ArchiveEmployeeTypeMutationVariables
  >(archiveEmployeeTypeMutation);

  const [selectedRows, setSelectedRows] = useState<QueryEmployeeType[]>([]);

  const { visible, onClose, onOpen } = useDisclosure();

  const canEdit = currentMember?.type !== CompanyMemberType.Member;

  const handleUpdateSelectedRows = (selectedRows: QueryEmployeeType[]) => {
    setSelectedRows(selectedRows);
  };

  const handleClearSelectedRows = () => {
    setSelectedRows([]);
  };

  const handleViewSchedule = (employeeType: QueryEmployeeType) => {
    if (!activeCompany?.slug || !employeeType?.id) {
      return;
    }

    navigateCompanyWorkScheduleInfoPage({
      navigate,
      companySlug: activeCompany.slug,
      employeeTypeId: employeeType.id,
    });
  };

  const handleOpenArchiveEmployeeTypeConfirmation = (
    employeeType: QueryEmployeeType,
  ) => {
    if (!employeeType?.id) {
      return;
    }

    Modal.confirm({
      title: 'Delete Schedule',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to Delete this schedule?
        </div>
      ),
      onOk: async () => {
        await handleArchiveSchedule(employeeType);
      },
    });
  };

  const handleOpenArchiveEmployeeTypesConfirmation = () => {
    if (selectedRows.length === 0) {
      return;
    }

    Modal.confirm({
      title: 'Delete Schedules',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete these schedules?
        </div>
      ),
      onOk: async () => {
        for (const type of selectedRows) {
          await handleArchiveSchedule(type);
        }

        handleClearSelectedRows();
      },
    });
  };

  const handleCreateEmployeeType = async (
    values: AddWorkScheduleFormValues,
  ) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateCreateEmployeeType({
        variables: {
          companyId: activeCompany.id,
          name: values.name.trim(),
          timezone: values.timezone,
          overtime: false,
        },
      });

      if (!res.errors) {
        refetchQuery();

        onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add work schedule',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchiveSchedule = async (employeeType: QueryEmployeeType) => {
    if (!employeeType?.id) {
      return;
    }

    try {
      const res = await mutateArchiveEmployeeType({
        variables: {
          typeId: employeeType.id,
          archived: true,
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete schedule',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnProps<QueryEmployeeType>[] = [
    {
      title: 'Schedule Name',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Timezone',
      render: (col, item) => {
        const timezone = getTimeZones().find(
          (zone) => zone.name === item?.workDaySettings?.[0]?.timezone,
        );

        return (
          <Typography.Text className={styles.timezone}>
            {timezone?.rawFormat}
          </Typography.Text>
        );
      },
    },
    {
      title: 'Action',
      width: 100,
      render: (col, item) => {
        const handleClickMenuItem = (key: string, event: SyntheticEvent) => {
          event.stopPropagation();

          if (key === 'view') {
            handleViewSchedule(item);
          } else if (key === 'archive') {
            handleOpenArchiveEmployeeTypeConfirmation(item);
          }
        };

        return (
          <Dropdown
            position="br"
            droplist={
              <Menu
                onClick={(e) => e.stopPropagation()}
                onClickMenuItem={handleClickMenuItem}
              >
                <Menu.Item key="view">View</Menu.Item>
                {canEdit && (
                  <Menu.Item className={styles['delete-txt']} key="archive">
                    Delete
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <Button icon={<MdMoreVert />} type="text" />
          </Dropdown>
        );
      },
    },
  ];

  const getActiveEmployeeTypes = () => {
    if (!queryData?.company?.employeeTypes) {
      return [];
    }

    return queryData.company.employeeTypes.filter((type) => !type?.archived);
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
            name: 'Work Schedule',
          },
        ]}
      />

      <Card className={styles.wrapper}>
        <Space size={20} direction="vertical">
          <Typography.Text className={styles['card-title']}>
            Work Schedule
          </Typography.Text>

          {canEdit && (
            <Button
              className={styles['theme-button']}
              icon={<MdAdd />}
              onClick={onOpen}
            >
              Add schedule
            </Button>
          )}

          <div>
            {selectedRows.length > 0 && (
              <TableMultiSelectActionBar
                numberOfRows={selectedRows.length}
                suffix="schedules"
                onDeselectAll={handleClearSelectedRows}
                actions={[
                  <Button
                    className={styles['theme-btn-text']}
                    type="text"
                    size="small"
                    onClick={handleOpenArchiveEmployeeTypesConfirmation}
                  >
                    Delete
                  </Button>,
                ]}
              />
            )}

            <Table
              loading={queryLoading}
              showHeader={selectedRows.length === 0}
              data={getActiveEmployeeTypes()}
              columns={columns}
              border={false}
              pagination={false}
              scroll={{ x: 1000 }}
              rowSelection={
                canEdit
                  ? {
                      checkboxProps: () => ({
                        onClick: (e: SyntheticEvent) => {
                          e.stopPropagation();
                        },
                      }),
                      selectedRowKeys: selectedRows.map(
                        (type) => type?.id as string,
                      ),
                      onChange: (_, selectedRows) =>
                        handleUpdateSelectedRows(selectedRows),
                    }
                  : undefined
              }
              onRow={(record) => ({
                onClick: () => handleViewSchedule(record),
              })}
            />
          </div>
        </Space>
      </Card>

      <AddWorkScheduleModal
        visible={visible}
        onCancel={onClose}
        loading={mutateCreateEmployeeTypeLoading}
        onSubmit={handleCreateEmployeeType}
      />
    </>
  );
};

const companyWorkSchedulesPageQuery = gql`
  query CompanyWorkSchedulesPage($companyId: ID!) {
    company(id: $companyId) {
      id
      employeeTypes {
        id
        name
        archived
        workDaySettings {
          timezone
        }
      }
    }
  }
`;

const createEmployeeTypeMutation = gql`
  mutation CreateEmployeeType(
    $companyId: ID!
    $name: String!
    $overtime: Boolean!
    $timezone: String
  ) {
    createEmployeeType(
      companyId: $companyId
      name: $name
      overtime: $overtime
      timezone: $timezone
    ) {
      id
    }
  }
`;

const archiveEmployeeTypeMutation = gql`
  mutation ArchiveEmployeeType($typeId: ID!, $archived: Boolean!) {
    archiveEmployeeType(typeId: $typeId, archived: $archived) {
      id
    }
  }
`;

export default CompanyWorkSchedulePage;
