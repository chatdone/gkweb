import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Card,
  Grid,
  Button,
  Typography,
  Divider,
  Spin,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import styles from './CompanyWorkScheduleInfoPage.module.less';
import EditWorkScheduleForm, {
  editWorkScheduleFormFragment,
  FormValues as EditWorkScheduleFormValues,
} from './EditWorkScheduleForm';

import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';

import { navigateCompanyWorkSchedulesPage } from '@/navigation';

import {
  WorkDay,
  CompanyMemberType,
  CompanyWorkScheduleInfoPageQuery,
  CompanyWorkScheduleInfoPageQueryVariables,
  UpdateEmployeeTypeMutation,
  UpdateEmployeeTypeMutationVariables,
  UpdateCompanyWorkDaySettingMutation,
  UpdateCompanyWorkDaySettingMutationVariables,
  ArchiveEmployeeTypeMutation,
  ArchiveEmployeeTypeMutationVariables,
} from 'generated/graphql-types';

const CompanyWorkScheduleInfoPage = () => {
  const { employeeTypeId } = useParams();
  const navigate = useNavigate();

  const { activeCompany, getCurrentMember } = useAppStore();

  const currentMember = getCurrentMember();

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<
    CompanyWorkScheduleInfoPageQuery,
    CompanyWorkScheduleInfoPageQueryVariables
  >(companyWorkScheduleInfoPageQuery, {
    variables: {
      employeeTypeId: employeeTypeId as string,
    },
    skip: !employeeTypeId,
  });
  const [mutateUpdateEmployeeType] = useMutation<
    UpdateEmployeeTypeMutation,
    UpdateEmployeeTypeMutationVariables
  >(updateEmployeeTypeMutation);
  const [mutateUpdateWorkDaySetting] = useMutation<
    UpdateCompanyWorkDaySettingMutation,
    UpdateCompanyWorkDaySettingMutationVariables
  >(updateWorkDaySettingMutation);
  const [
    mutateArchiveEmployeeType,
    { loading: mutateArchiveEmployeeTypeLoading },
  ] = useMutation<
    ArchiveEmployeeTypeMutation,
    ArchiveEmployeeTypeMutationVariables
  >(archiveEmployeeTypeMutation);

  const [updateWorkScheduleLoading, setUpdateWorkScheduleLoading] =
    useState<boolean>(false);

  const canEdit = currentMember?.type !== CompanyMemberType.Member;

  const handleArchiveSuccess = () => {
    if (!activeCompany?.slug) {
      return;
    }

    navigateCompanyWorkSchedulesPage(navigate, activeCompany.slug);
  };

  const handleOpenArchiveEmployeeTypeConfirmation = () => {
    if (!employeeTypeId) {
      return;
    }

    Modal.confirm({
      title: 'Delete Schedule',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this schedule?
        </div>
      ),
      onOk: handleArchiveSchedule,
    });
  };

  const handleUpdateWorkSchedule = async (
    values: EditWorkScheduleFormValues,
  ) => {
    if (!employeeTypeId) {
      return;
    }

    try {
      setUpdateWorkScheduleLoading(true);

      const { name, overtime, ...rest } = values;

      const updateEmployeeTypeRes = await mutateUpdateEmployeeType({
        variables: {
          typeId: employeeTypeId,
          name: name.trim(),
          overtime,
        },
      });

      if (updateEmployeeTypeRes.errors) {
        Message.error(getErrorMessage(updateEmployeeTypeRes.errors), {
          title: 'Failed to update employee type',
        });
      }

      const updateDaySettingPromises = Object.entries(rest).map(
        ([key, value]) =>
          new Promise((resolve) => {
            // TODO: camel case
            mutateUpdateWorkDaySetting({
              variables: {
                companyId: activeCompany?.id as string,
                day: key.toUpperCase() as WorkDay,
                employeeTypeId: employeeTypeId,
                input: {
                  open: value.active,
                  start_hour: dayjs(value.startHour).format('HH:mm:ss'),
                  end_hour: dayjs(value.endHour).format('HH:mm:ss'),
                  // startHour: dayjs(value.startHour).format('HH:mm:ss'),
                  // endHour: dayjs(value.endHour).format('HH:mm:ss'),
                },
              },
            }).then((result) => {
              if (result.errors) {
                Message.error(getErrorMessage(result.errors), {
                  title: `Failed to update ${key} setting`,
                });
              }

              resolve(0);
            });
          }),
      );

      await Promise.all(updateDaySettingPromises);

      refetchQuery();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateWorkScheduleLoading(false);
    }
  };

  const handleArchiveSchedule = async () => {
    if (!employeeTypeId) {
      return;
    }

    try {
      const res = await mutateArchiveEmployeeType({
        variables: {
          typeId: employeeTypeId,
          archived: true,
        },
      });

      if (!res.errors) {
        handleArchiveSuccess();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to archive schedule',
        });
      }
    } catch (error) {
      console.error(error);
    }
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
            path: '/settings/company/work-schedules',
          },
          {
            name: queryData?.employeeType?.name || 'Loading',
          },
        ]}
      />

      <Spin
        style={{ display: 'block' }}
        loading={
          !employeeTypeId ||
          mutateArchiveEmployeeTypeLoading ||
          updateWorkScheduleLoading ||
          queryLoading
        }
      >
        <Card className={styles.wrapper}>
          <Typography.Text className={styles['card-title']}>
            Work Schedule
          </Typography.Text>

          <EditWorkScheduleForm
            employeeType={queryData?.employeeType}
            loading={updateWorkScheduleLoading}
            canEdit={canEdit}
            onSubmit={handleUpdateWorkSchedule}
          />

          {canEdit && (
            <>
              <Divider />

              <Grid.Row
                className={styles['delete-section']}
                justify="space-between"
                align="center"
              >
                <div>
                  <Typography.Paragraph className={styles.title}>
                    Delete schedule
                  </Typography.Paragraph>

                  <Typography.Paragraph>
                    You are proceeding to delete all the information and files
                    of the work schedule permanently.
                  </Typography.Paragraph>
                </div>

                <Button
                  className={styles['theme-button']}
                  onClick={handleOpenArchiveEmployeeTypeConfirmation}
                >
                  Delete schedule
                </Button>
              </Grid.Row>
            </>
          )}
        </Card>
      </Spin>
    </>
  );
};

const companyWorkScheduleInfoPageQuery = gql`
  query CompanyWorkScheduleInfoPage($employeeTypeId: ID!) {
    employeeType(employeeTypeId: $employeeTypeId) {
      ...EditWorkScheduleFormFragment
    }
  }
  ${editWorkScheduleFormFragment}
`;

const updateEmployeeTypeMutation = gql`
  mutation UpdateEmployeeType(
    $typeId: ID!
    $name: String!
    $overtime: Boolean!
  ) {
    updateEmployeeType(typeId: $typeId, name: $name, overtime: $overtime) {
      id
    }
  }
`;

const updateWorkDaySettingMutation = gql`
  mutation UpdateCompanyWorkDaySetting(
    $companyId: ID!
    $day: WorkDay!
    $employeeTypeId: ID!
    $input: UpdateCompanyWorkDayInput!
  ) {
    updateCompanyWorkDaySetting(
      companyId: $companyId
      day: $day
      employeeTypeId: $employeeTypeId
      input: $input
    ) {
      day
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

export default CompanyWorkScheduleInfoPage;
