import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Card,
  Grid,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { escapeRegExp, upperFirst } from 'lodash-es';
import { useState } from 'react';
import { MdAdd, MdDelete, MdEdit, MdSearch } from 'react-icons/md';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';

import styles from './CompanyHolidaysPage.module.less';
import { EditCompanyHolidayModal, FormValues } from './EditCompanyHolidayModal';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { getUTC } from '@/utils/date.utils';
import { getErrorMessage } from '@/utils/error.utils';

import type { ArrayElement } from '@/types';

import {
  CompanyMemberType,
  CompanyHolidayPageQuery,
  CompanyHolidayPageQueryVariables,
  ActivatePublicHolidayMutation,
  ActivatePublicHolidayMutationVariables,
  DeactivatePublicHolidayMutation,
  DeactivatePublicHolidayMutationVariables,
  CreateHolidayMutation,
  CreateHolidayMutationVariables,
  UpdateCompanyHolidayMutation,
  UpdateCompanyHolidayMutationVariables,
  DeleteCompanyHolidayMutation,
  DeleteCompanyHolidayMutationVariables,
} from 'generated/graphql-types';

type QueryHoliday = ArrayElement<CompanyHolidayPageQuery['holidays']>;

const CompanyHolidayPage = () => {
  const { activeCompany, getCurrentMember } = useAppStore();

  const currentMember = getCurrentMember();

  const [editHoliday, setEditHoliday] = useState<QueryHoliday>();
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<CompanyHolidayPageQuery, CompanyHolidayPageQueryVariables>(
    companyHolidayPageQuery,
    {
      variables: {
        companyId: activeCompany?.id as string,
        year: selectedYear,
      },
      skip: !activeCompany?.id,
    },
  );
  const [mutateActivatePublicHoliday] = useMutation<
    ActivatePublicHolidayMutation,
    ActivatePublicHolidayMutationVariables
  >(activatePublicHolidayMutation);
  const [mutateDeactivatePublicHoliday] = useMutation<
    DeactivatePublicHolidayMutation,
    DeactivatePublicHolidayMutationVariables
  >(deactivatePublicHolidayMutation);
  const [mutateCreateHoliday, { loading: mutateCreateHolidayLoading }] =
    useMutation<CreateHolidayMutation, CreateHolidayMutationVariables>(
      createHolidayMutation,
    );
  const [mutateUpdateHoliday, { loading: mutateUpdateHolidayLoading }] =
    useMutation<
      UpdateCompanyHolidayMutation,
      UpdateCompanyHolidayMutationVariables
    >(updateCompanyHolidayMutation);
  const [mutateDeleteHoliday] = useMutation<
    DeleteCompanyHolidayMutation,
    DeleteCompanyHolidayMutationVariables
  >(deleteCompanyHolidayMutation);

  const { onClose, onOpen, visible } = useDisclosure();

  const canEdit = currentMember?.type !== CompanyMemberType.Member;

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleUpdateSelectedYear = (value: number) => {
    setSelectedYear(value);
  };

  const handleEditHoliday = (holiday: QueryHoliday) => {
    setEditHoliday(holiday);

    onOpen();
  };

  const handleCloseModal = () => {
    onClose();

    setEditHoliday(undefined);
  };

  const handleOpenDeleteCompanyHolidayConfirmation = (
    holiday: QueryHoliday,
  ) => {
    if (holiday?.type === 'PUBLIC') {
      return;
    }

    Modal.confirm({
      title: 'Delete Company Holiday',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this holiday?
        </div>
      ),
      okText: 'Confirm',
      okButtonProps: {
        style: {
          background: '#d6001c',
        },
      },
      onOk: async () => {
        await handleDeleteCompanyHoliday(holiday);
      },
    });
  };

  const handleActivatePublicHoliday = async (holiday: QueryHoliday) => {
    if (!holiday?.id || holiday?.type !== 'PUBLIC' || !activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateActivatePublicHoliday({
        variables: {
          companyId: activeCompany.id,
          holidayId: holiday.id,
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to activate public holiday',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeactivatePublicHoliday = async (holiday: QueryHoliday) => {
    if (!holiday?.id || holiday?.type !== 'PUBLIC' || !activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateDeactivatePublicHoliday({
        variables: {
          companyId: activeCompany.id,
          publicHolidayId: holiday.id,
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to deactivate public holiday',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateHoliday = async (values: FormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      // TODO: camel case
      const res = await mutateCreateHoliday({
        variables: {
          companyId: activeCompany.id,
          input: {
            name: values.name,
            start_date: getUTC(values.startDate),
            end_date: getUTC(values.endDate),
            // startDate: getUTC(values.startDate),
            // endDate: getUTC(values.endDate),
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create holiday',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateHoliday = async (values: FormValues) => {
    if (!activeCompany?.id || !editHoliday?.id) {
      return;
    }

    try {
      // TODO: camel case
      const res = await mutateUpdateHoliday({
        variables: {
          companyId: activeCompany.id,
          companyHolidayId: editHoliday.id,
          input: {
            name: values.name,
            start_date: getUTC(values.startDate),
            end_date: getUTC(values.endDate),
            // startDate: getUTC(values.startDate),
            // endDate: getUTC(values.endDate),
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update holiday',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCompanyHoliday = async (holiday: QueryHoliday) => {
    if (!activeCompany?.id || !holiday?.id) {
      return;
    }

    try {
      const res = await mutateDeleteHoliday({
        variables: {
          companyId: activeCompany.id,
          companyHolidayId: holiday.id,
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete company holiday',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnProps<QueryHoliday>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Date',
      render: (col, item) => {
        const { date, endDate, startDate } = item || {};

        return date
          ? dayjs(date).format('DD MMM YY')
          : dayjs(startDate).isSame(dayjs(endDate), 'day')
          ? dayjs(startDate).format('DD MMM YY')
          : `${dayjs(startDate).format('DD MMM YY')} - ${dayjs(endDate).format(
              'DD MMM YY',
            )}`;
      },
    },
    {
      title: 'Day',
      width: 150,
      render: (col, item) => {
        const { date, endDate, startDate } = item || {};

        return date
          ? dayjs(date).format('dddd')
          : dayjs(startDate).isSame(dayjs(endDate), 'day')
          ? dayjs(startDate).format('dddd')
          : '-';
      },
    },
    {
      title: 'Type',
      width: 150,
      dataIndex: 'type',
      render: (col, item) => {
        return upperFirst(item?.type?.toLowerCase());
      },
    },
    {
      title: 'Action',
      width: 150,
      align: 'right',
      render: (col, item) => {
        return item?.type !== 'PUBLIC' ? (
          <Space>
            <Button
              type="text"
              icon={<MdEdit />}
              onClick={() => handleEditHoliday(item)}
            />

            <Button
              type="text"
              icon={<MdDelete />}
              onClick={() => handleOpenDeleteCompanyHolidayConfirmation(item)}
            />
          </Space>
        ) : (
          <Switch
            checked={!!item?.active}
            onChange={(value) => {
              value
                ? handleActivatePublicHoliday(item)
                : handleDeactivatePublicHoliday(item);
            }}
          />
        );
      },
    },
  ];

  const getData = (): QueryHoliday[] => {
    let data: QueryHoliday[] = queryData?.holidays || [];

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      data = data.filter((holiday) => holiday?.name?.match(regex));
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
            name: 'Time Attendance',
          },
          {
            name: 'Holiday',
          },
        ]}
      />

      <Card className={styles.wrapper}>
        <Space direction="vertical" size={20}>
          <Grid.Row justify="space-between">
            <Typography.Text className={styles.title}>Holiday</Typography.Text>

            <Input
              style={{ width: 362 }}
              suffix={<MdSearch />}
              placeholder="Search holiday"
              value={searchKeyword}
              onChange={handleUpdateSearchKeyword}
            />
          </Grid.Row>

          {canEdit && (
            <Button
              className={styles['theme-btn']}
              icon={<MdAdd />}
              onClick={onOpen}
            >
              Add Holiday
            </Button>
          )}

          <Select
            style={{ width: 100 }}
            value={selectedYear}
            options={[
              {
                label: '2022',
                value: 2022,
              },
              {
                label: '2021',
                value: 2021,
              },
            ]}
            onChange={handleUpdateSelectedYear}
          />

          <Table
            columns={canEdit ? columns : columns.slice(0, -1)}
            data={getData()}
            border={false}
            pagination={false}
            loading={queryLoading}
          />
        </Space>
      </Card>

      <EditCompanyHolidayModal
        visible={visible}
        onCancel={handleCloseModal}
        loading={mutateCreateHolidayLoading || mutateUpdateHolidayLoading}
        holiday={editHoliday}
        onCreate={handleCreateHoliday}
        onUpdate={handleUpdateHoliday}
      />
    </>
  );
};

const companyHolidayPageQuery = gql`
  query CompanyHolidayPage($companyId: ID!, $year: Int!) {
    holidays(companyId: $companyId, year: $year) {
      id
      name
      type
      startDate
      endDate
      date
      active
    }
  }
`;

const activatePublicHolidayMutation = gql`
  mutation ActivatePublicHoliday($companyId: ID!, $holidayId: ID!) {
    activatePublicHoliday(companyId: $companyId, holidayId: $holidayId) {
      id
    }
  }
`;

const deactivatePublicHolidayMutation = gql`
  mutation DeactivatePublicHoliday($companyId: ID!, $publicHolidayId: ID!) {
    deactivatePublicHoliday(
      companyId: $companyId
      publicHolidayId: $publicHolidayId
    ) {
      id
    }
  }
`;

const createHolidayMutation = gql`
  mutation CreateHoliday($companyId: ID!, $input: CreateCompanyHolidayInput!) {
    createHoliday(companyId: $companyId, input: $input) {
      id
    }
  }
`;

const updateCompanyHolidayMutation = gql`
  mutation UpdateCompanyHoliday(
    $companyId: ID!
    $companyHolidayId: ID!
    $input: UpdateCompanyHolidayInput!
  ) {
    updateCompanyHoliday(
      companyId: $companyId
      companyHolidayId: $companyHolidayId
      input: $input
    ) {
      id
    }
  }
`;

const deleteCompanyHolidayMutation = gql`
  mutation DeleteCompanyHoliday($companyId: ID!, $companyHolidayId: ID!) {
    deleteCompanyHoliday(
      companyId: $companyId
      companyHolidayId: $companyHolidayId
    ) {
      id
    }
  }
`;

export default CompanyHolidayPage;
