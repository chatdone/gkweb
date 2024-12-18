import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Form,
  InputNumber,
  Table,
  Button,
  Input,
  Spin,
} from '@arco-design/web-react';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import { IconCheck } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import { uniqBy } from 'lodash-es';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Avatar } from '@/components';
import Message from '@/components/Message';

import styles from '../AttendanceStyles.module.less';
import TimesheetApprovalNav from './TimesheetApprovalNav/TimesheetApprovalNav';

import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';
import { isSameDateTimesheetApproval } from '@/utils/timesheet.utils';

import { ArrayElement } from '@/types';

import {
  ProjectTimesheetApprovalPageQuery,
  ProjectTimesheetApprovalPageQueryVariables,
  TimesheetApprovalPageQuery,
  TimesheetApprovalPageQueryVariables,
  TimesheetApprovalStatus,
  UpdateTimesheetApprovalsTimesheetApprovalPageMutation,
  UpdateTimesheetApprovalsTimesheetApprovalPageMutationVariables,
} from 'generated/graphql-types';

export type FormValues = {
  taskId: string;
};

const round5 = (x: number) => {
  return Math.ceil(x / 0.5) * 0.5 || 0;
};

type ProjectGroupQuery = ArrayElement<
  NonNullable<ProjectTimesheetApprovalPageQuery['project']>['groups']
>;

type TaskQuery = ArrayElement<NonNullable<ProjectGroupQuery>['tasks']>;

type TaskCompanyMember = ArrayElement<NonNullable<TaskQuery>['members']>;

type TimesheetApprovalQuery = ArrayElement<
  NonNullable<TimesheetApprovalPageQuery>['timesheetApprovals']
>;

const TimesheetApprovalPage = () => {
  const { activeCompany } = useAppStore();

  const { projectId } = useParams();

  const [selected, setSelected] = useState(dayjs());
  const [view, setView] = useState('group');

  const getDayMonthYear = () => {
    const numberOfDays = selected?.daysInMonth();

    const dates = [] as { day: number; month: number; year: number }[];

    for (let i = 1; i <= numberOfDays; i++) {
      const day = i;
      const month = selected.month() + 1;
      const year = selected.year();

      dates.push({ day, month, year });
    }

    return dates;
  };

  const {
    data: queryData,
    refetch: refetchQuery,
    loading,
  } = useQuery<
    ProjectTimesheetApprovalPageQuery,
    ProjectTimesheetApprovalPageQueryVariables
  >(timesheetApprovalPageQuery, {
    variables: {
      projectId: projectId as string,
      dates: getDayMonthYear(),
    },
    skip: !projectId || !activeCompany?.id,
  });

  const {
    data: timesheetApprovalsData,
    refetch: timesheetApprovalsRefetch,
    loading: timesheetApprovalDataLoading,
  } = useQuery<TimesheetApprovalPageQuery, TimesheetApprovalPageQueryVariables>(
    timesheetsApprovals,
    {
      variables: {
        companyId: activeCompany?.id as string,
      },
    },
  );

  const [mutateUpdateTimesheetApprovals] = useMutation<
    UpdateTimesheetApprovalsTimesheetApprovalPageMutation,
    UpdateTimesheetApprovalsTimesheetApprovalPageMutationVariables
  >(updateTimesheetApprovalsMutation);

  const project = useMemo(() => {
    if (!queryData?.project) {
      return [];
    }

    return queryData?.project;
  }, [queryData?.project]) as ProjectTimesheetApprovalPageQuery['project'];

  const [form] = Form.useForm<FormValues>();

  const handleUpdateStatus = async (
    record: TaskQuery & TimesheetApprovalQuery & { taskId: string },
    status: TimesheetApprovalStatus,
  ) => {
    const sheets = [];

    if (record?.members) {
      const memberIds = record?.members?.map((m) => m?.companyMember?.id);

      for (const memberId of memberIds) {
        sheets.push({ taskId: record?.id, companyMemberId: memberId });
      }
    } else if (record?.companyMember?.id) {
      const memberId = record?.companyMember?.id;

      sheets.push({ taskId: record?.taskId, companyMemberId: memberId });
    }

    try {
      const res = await mutateUpdateTimesheetApprovals({
        variables: {
          input: {
            sheets,
            date: selected,
            status,
          },
        },
      });

      if (!res?.errors) {
        refetchQuery();
        timesheetApprovalsRefetch();
      } else {
        Message.error(getErrorMessage(res?.errors), {
          title: 'Failed update timesheet approval',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatusTasks = async (
    record: TimesheetApprovalQuery,
    status: TimesheetApprovalStatus,
  ) => {
    const taskId = record?.task?.id as string;
    const memberId = record?.companyMember?.id;

    try {
      const res = await mutateUpdateTimesheetApprovals({
        variables: {
          input: {
            sheets: [{ taskId, companyMemberId: memberId }],
            date: selected,
            status,
          },
        },
      });

      if (!res?.errors) {
        refetchQuery();
        timesheetApprovalsRefetch();
      } else {
        Message.error(getErrorMessage(res?.errors), {
          title: 'Failed update timesheet approval',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateBillable = async (
    record: TimesheetApprovalQuery,
    billable: boolean,
  ) => {
    const taskId = record?.task?.id as string;
    const memberId = record?.companyMember?.id;

    try {
      const res = await mutateUpdateTimesheetApprovals({
        variables: {
          input: {
            sheets: [{ taskId, companyMemberId: memberId }],
            date: selected,
            billable,
          },
        },
      });

      if (!res?.errors) {
        refetchQuery();
        timesheetApprovalsRefetch();
      } else {
        Message.error(getErrorMessage(res?.errors), {
          title: 'Failed update timesheet approval',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateBillableTasks = async (
    record: TaskQuery & TimesheetApprovalQuery & { taskId: string },
    billable: boolean,
  ) => {
    const sheets = [];

    if (record?.members) {
      const memberIds = record?.members?.map((m) => m?.companyMember?.id);

      for (const memberId of memberIds) {
        sheets.push({ taskId: record?.id, companyMemberId: memberId });
      }
    } else if (record?.companyMember) {
      const memberId = record?.companyMember?.id;

      sheets.push({ taskId: record?.taskId, companyMemberId: memberId });
    }

    try {
      const res = await mutateUpdateTimesheetApprovals({
        variables: {
          input: {
            sheets,
            date: selected,
            billable,
          },
        },
      });

      if (!res?.errors) {
        refetchQuery();
        timesheetApprovalsRefetch();
      } else {
        Message.error(getErrorMessage(res?.errors), {
          title: 'Failed update timesheet approval',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateBillableAllTasks = async (billable: boolean) => {
    const sheets = [] as { taskId: string; companyMemberId: string }[];
    const groups = project?.groups?.map((g) => g);
    const tasks = groups?.map((t) => t?.tasks).flat();
    const taskIds = tasks?.map((t) => t?.id);
    const memberIds =
      tasks?.map((t) => t?.members?.map((m) => m?.companyMember?.id)).flat() ||
      [];

    memberIds.forEach((memberId) => {
      taskIds?.forEach((taskId) => {
        if (memberId && taskId) {
          sheets.push({ taskId, companyMemberId: memberId });
        }
      });
    });

    try {
      const res = await mutateUpdateTimesheetApprovals({
        variables: {
          input: {
            sheets,
            date: selected,
            billable,
          },
        },
      });

      if (!res?.errors) {
        refetchQuery();
        timesheetApprovalsRefetch();
      } else {
        Message.error(getErrorMessage(res?.errors), {
          title: 'Failed update timesheet approval',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatusAllTasks = async (
    status: TimesheetApprovalStatus,
  ) => {
    const sheets = [] as { taskId: string; companyMemberId: string }[];
    const groups = project?.groups?.map((g) => g);
    const tasks = groups?.map((t) => t?.tasks).flat();
    const taskIds = tasks?.map((t) => t?.id);
    const memberIds =
      tasks?.map((t) => t?.members?.map((m) => m?.companyMember?.id)).flat() ||
      [];

    memberIds.forEach((memberId) => {
      taskIds?.forEach((taskId) => {
        if (memberId && taskId) {
          sheets.push({ taskId, companyMemberId: memberId });
        }
      });
    });

    try {
      const res = await mutateUpdateTimesheetApprovals({
        variables: {
          input: {
            sheets,
            date: selected,
            status,
          },
        },
      });

      if (!res?.errors) {
        refetchQuery();
        timesheetApprovalsRefetch();
      } else {
        Message.error(getErrorMessage(res?.errors), {
          title: 'Failed update timesheet approval',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const timesheets = useMemo(() => {
    if (!timesheetApprovalsData?.timesheetApprovals) {
      return [];
    }

    return timesheetApprovalsData?.timesheetApprovals;
  }, [timesheetApprovalsData?.timesheetApprovals, selected]);

  const columns = useMemo(() => {
    const col = [
      {
        title: 'Task',
        dataIndex: 'name',
        fixed: 'left',
        width: 250,
        render: (col: string, record, index) => {
          return (
            <div className="truncate" key={index}>
              {!record?.children && (
                <Avatar
                  size={24}
                  className="mr-2"
                  imageSrc={record?.avatar}
                  name={col}
                />
              )}

              {col}
            </div>
          );
        },
      },
      {
        title: 'Total hours',
        dataIndex: 'total_hours',
        width: 100,
        fixed: 'left',
        render: (col, record, i) => {
          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return dayjs(
                `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                  +t?.day < 10 ? '0' : ''
                }${t?.day}`,
              ).isSame(selected, 'month');
            }
          });

          let timeTotal = 0;
          if (record?.children) {
            const totalInSeconds = thisMonthsTimesheets?.reduce((acc, t) => {
              if (record?.id === t?.task?.id && t?.total) {
                return acc + t?.total;
              } else {
                return acc + 0;
              }
            }, 0);

            const hours = totalInSeconds / 3600;

            timeTotal = round5(hours);
          } else {
            const totalInSeconds = thisMonthsTimesheets?.reduce((acc, t) => {
              if (
                record?.id === t?.companyMember?.id &&
                record?.taskId === t?.task?.id &&
                t?.total
              ) {
                return acc + t?.total;
              } else {
                return acc + 0;
              }
            }, 0);

            const hours = totalInSeconds / 3600;

            timeTotal = round5(hours);
          }

          return (
            <InputNumber
              key={i}
              min={0}
              readOnly
              step={0.5}
              precision={2}
              value={timeTotal}
              defaultValue={timeTotal}
              className={
                timeTotal > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      },
      {
        title: 'Rate (RM)',
        dataIndex: 'rate',
        width: 100,
        render: (col, record, index: number) => {
          let totalHourlyRate = 0;
          if (record?.children) {
            totalHourlyRate = record?.children?.reduce(
              (acc: number, child: TaskCompanyMember) => {
                if (child && child?.companyMember?.hourlyRate) {
                  return acc + child?.companyMember?.hourlyRate || 0;
                } else {
                  return acc + 0;
                }
              },
              0,
            );
          } else {
            totalHourlyRate = record?.companyMember?.hourlyRate || 0;
          }
          return (
            <Input
              key={index}
              step={0.5}
              defaultValue={totalHourlyRate.toString()}
              value={totalHourlyRate.toString()}
              className={
                totalHourlyRate > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      },
      {
        title: 'Total (RM)',
        dataIndex: 'total',
        width: 100,
        render: (col, record, index: number) => {
          let totalHourlyRate = 0;
          let totalRate = 0;
          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return dayjs(
                `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                  +t?.day < 10 ? '0' : ''
                }${t?.day}`,
              ).isSame(selected, 'month');
            }
          });

          let timeTotal = 0;
          if (record?.children) {
            const totalSeconds = record?.totalRate;

            const hours = totalSeconds / 3600;

            totalRate = round5(hours);
          } else {
            const totalInSeconds = thisMonthsTimesheets?.reduce((acc, t) => {
              if (
                record?.id === t?.companyMember?.id &&
                record?.taskId === t?.task?.id &&
                t?.total
              ) {
                return acc + t?.total;
              } else {
                return acc + 0;
              }
            }, 0);

            const hours = totalInSeconds / 3600;
            totalHourlyRate = record?.companyMember?.hourlyRate || 0;
            timeTotal = round5(hours);

            totalRate = timeTotal * totalHourlyRate;
          }

          return (
            <Input
              key={index}
              readOnly
              min={0}
              step={0.5}
              defaultValue={totalRate.toString()}
              value={totalRate.toString()}
              className={
                totalRate > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        width: 130,
        render: (col, record, index: number) => {
          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return dayjs(
                `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                  +t?.day < 10 ? '0' : ''
                }${t?.day}`,
              ).isSame(selected, 'month');
            }
          });

          let isApproved = false;
          let isBillable = false;

          if (record?.children) {
            const timesheetTasks = thisMonthsTimesheets?.filter(
              (t) => t?.task?.id === record?.id,
            );

            if (timesheetTasks && timesheetTasks?.length > 0) {
              isApproved =
                timesheetTasks?.every(
                  (t) => t?.status === TimesheetApprovalStatus.Approved,
                ) || false;
            }
          } else {
            const memberTimesheetTasks = thisMonthsTimesheets?.filter(
              (t) =>
                t?.companyMember?.id === record?.companyMember?.id &&
                t?.task?.id === record?.taskId,
            );

            if (memberTimesheetTasks && memberTimesheetTasks?.length > 0) {
              isApproved =
                memberTimesheetTasks?.every(
                  (t) => t?.status === TimesheetApprovalStatus.Approved,
                ) || false;
            }
          }

          if (record?.children) {
            const timesheetTasks = thisMonthsTimesheets?.filter(
              (t) => t?.task?.id === record?.id,
            );

            if (timesheetTasks && timesheetTasks?.length > 0) {
              isBillable = timesheetTasks?.every((t) => t?.billable) || false;
            }
          } else {
            const memberTimesheetTasks = thisMonthsTimesheets?.filter(
              (t) =>
                t?.companyMember?.id === record?.companyMember?.id &&
                t?.task?.id === record?.taskId,
            );

            if (memberTimesheetTasks && memberTimesheetTasks?.length > 0) {
              isBillable =
                memberTimesheetTasks?.every((t) => t?.billable) || false;
            }
          }

          return (
            <div key={index}>
              <Button
                size="small"
                shape="circle"
                className={isBillable ? '!bg-brand-500 !text-white' : ''}
                title="Billable"
                onClick={() => {
                  handleUpdateBillableTasks(record, !isBillable);
                }}
              >
                $
              </Button>
              <Button
                size="small"
                shape="circle"
                className={
                  isApproved ? '!bg-green-500 !text-white ml-1' : ' ml-1'
                }
                icon={<IconCheck />}
                onClick={() => {
                  handleUpdateStatus(
                    record,
                    isApproved
                      ? TimesheetApprovalStatus.Rejected
                      : TimesheetApprovalStatus.Approved,
                  );
                }}
              />
            </div>
          );
        },
      },
    ] as ColumnProps[];

    for (let i = 1; i <= selected.daysInMonth(); i++) {
      const d = new Date(selected.year(), selected.month(), i);
      const date = dayjs(d);
      const formattedDate = date.format('ddd D');

      col.push({
        title: formattedDate,
        dataIndex: i.toString(),
        width: 100,

        render: (col, record) => {
          const sameDateTimesheet = timesheets?.filter((t) => {
            if (record?.children) {
              if (t && t?.year && t?.month && t?.day) {
                return (
                  dayjs(
                    `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                      +t?.day < 10 ? '0' : ''
                    }${t?.day}`,
                  ).isSame(date, 'day') && record?.id === t?.task?.id
                );
              }
            } else {
              if (t && t?.year && t?.month && t?.day) {
                return (
                  dayjs(
                    `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                      +t?.day < 10 ? '0' : ''
                    }${t?.day}`,
                  ).isSame(date, 'day') &&
                  record?.taskId === t?.task?.id &&
                  record?.id === t?.companyMember?.id
                );
              }
            }
          });

          const totalSeconds =
            sameDateTimesheet?.reduce((acc, t) => {
              if (t?.total) {
                return acc + t?.total;
              } else {
                return acc;
              }
            }, 0) || 0;

          const hours = totalSeconds / 3600;
          const totalTime = round5(hours);

          return (
            <InputNumber
              min={0}
              max={24}
              step={0.5}
              precision={0}
              readOnly
              defaultValue={totalTime}
              value={totalTime}
              className={
                totalTime > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      });
    }

    return col;
  }, [
    selected,
    timesheetApprovalsData?.timesheetApprovals,
    queryData?.project,

    projectId,
  ]);

  const memberColumns = useMemo(() => {
    const memCols = [
      {
        title: 'Task',
        dataIndex: 'name',
        fixed: 'left',
        width: 250,
        render: (col: string, record, index) => {
          return (
            <div className="truncate" key={index}>
              {record?.task?.name || record?.name}
            </div>
          );
        },
      },
      {
        title: 'Group',
        dataIndex: 'group',
        fixed: 'left',
        width: 120,
        render: (col: string, record, index) => {
          return (
            <div className="truncate" key={index}>
              {record?.task?.group?.name || 'Unassigned'}
            </div>
          );
        },
      },
      {
        title: 'Total hours',
        dataIndex: 'total_hours',
        width: 100,
        fixed: 'left',
        render: (col, record, i) => {
          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') &&
                t?.companyMember?.id === record?.companyMember?.id &&
                t?.task?.id === record?.task?.id
              );
            }
          });

          const totalInSeconds = thisMonthsTimesheets?.reduce((acc, t) => {
            if (t && t?.total) {
              return acc + t?.total;
            } else {
              return acc;
            }
          }, 0);

          const hours = totalInSeconds / 3600;

          const timeTotal = round5(hours);

          return (
            <InputNumber
              key={i}
              min={0}
              readOnly
              step={0.5}
              precision={2}
              value={timeTotal}
              defaultValue={timeTotal}
              className={
                timeTotal > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      },
      {
        title: 'Rate (RM)',
        dataIndex: 'hourlyRate',
        width: 100,
        render: (col, record, index: number) => {
          const hourlyRate = record?.companyMember?.hourlyRate || 0;

          return (
            <Input
              key={index}
              step={0.5}
              defaultValue={hourlyRate.toString()}
              value={hourlyRate.toString()}
              className={
                hourlyRate > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      },
      {
        title: 'Total (RM)',
        dataIndex: 'total',
        width: 100,
        render: (col, record, index: number) => {
          const hourlyRate = record?.companyMember?.hourlyRate || 0;

          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') &&
                t?.companyMember?.id === record?.companyMember?.id &&
                t?.task?.id === record?.task?.id
              );
            }
          });

          const totalInSeconds = thisMonthsTimesheets?.reduce((acc, t) => {
            if (t?.total) {
              return acc + t?.total;
            } else {
              return acc;
            }
          }, 0);

          const hours = totalInSeconds / 3600;

          const timeTotal = round5(hours);

          const totalRate = timeTotal * hourlyRate;
          return (
            <Input
              key={index}
              readOnly
              min={0}
              step={0.5}
              defaultValue={totalRate.toString()}
              value={totalRate.toString()}
              className={
                totalRate > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        width: 130,
        render: (col, record, index: number) => {
          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') &&
                t?.companyMember?.id === record?.companyMember?.id &&
                t?.task?.id === record?.task?.id
              );
            }
          });

          const isAllStatusApproved = thisMonthsTimesheets?.every((t) => {
            return t?.status === TimesheetApprovalStatus.Approved;
          });

          const billable = record?.billable;
          return (
            <div key={index}>
              <Button
                size="small"
                shape="circle"
                className={billable ? '!bg-brand-500 !text-white' : ''}
                title="Billable"
                onClick={() => {
                  handleUpdateBillable(record, billable ? false : true);
                }}
              >
                $
              </Button>
              <Button
                size="small"
                shape="circle"
                className={
                  isAllStatusApproved
                    ? '!bg-green-500 !text-white ml-1'
                    : ' ml-1'
                }
                icon={<IconCheck />}
                onClick={() => {
                  handleUpdateStatusTasks(
                    record,
                    isAllStatusApproved
                      ? TimesheetApprovalStatus.Rejected
                      : TimesheetApprovalStatus.Approved,
                  );
                }}
              />
            </div>
          );
        },
      },
    ] as ColumnProps[];

    for (let i = 1; i <= selected.daysInMonth(); i++) {
      const d = new Date(selected.year(), selected.month(), i);
      const date = dayjs(d);
      const formattedDate = date.format('ddd D');

      memCols.push({
        title: formattedDate,
        dataIndex: i.toString(),
        width: 100,

        render: (col, record) => {
          const sameDateTimesheet = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(date, 'd') &&
                t?.task?.id === record?.task?.id &&
                t?.companyMember?.id === record?.companyMember?.id
              );
            }
          });

          const totalSeconds = sameDateTimesheet?.reduce((acc, t) => {
            if (t?.total) {
              return acc + t?.total;
            } else {
              return acc;
            }
          }, 0);

          const hours = totalSeconds / 3600;
          const totalTime = round5(hours) || 0;

          return (
            <InputNumber
              min={0}
              max={24}
              step={0.5}
              precision={0}
              readOnly
              defaultValue={totalTime}
              value={totalTime}
              className={
                totalTime > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      });
    }

    return memCols;
  }, [
    selected,
    timesheetApprovalsData?.timesheetApprovals,
    queryData?.project,

    projectId,
  ]);

  const totalColumns = useMemo(() => {
    const col = [
      {
        title: 'Task',
        dataIndex: 'name',
        fixed: 'left',
        width: 250,
        render: (col: string, record, index) => {
          return (
            <div className="truncate" key={index}>
              {col}
            </div>
          );
        },
      },

      {
        title: 'Total hours',
        dataIndex: 'total_hours',
        width: 100,
        fixed: 'left',
        render: (col, record, i) => {
          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') &&
                t?.task?.project?.id === project?.id
              );
            }
          });

          const totalInSeconds = thisMonthsTimesheets?.reduce((acc, t) => {
            if (t?.total) {
              return acc + t?.total;
            } else {
              return acc;
            }
          }, 0);

          const hours = totalInSeconds / 3600;

          const timeTotal = round5(hours);

          return (
            <InputNumber
              key={i}
              min={0}
              readOnly
              step={0.5}
              precision={2}
              value={timeTotal}
              defaultValue={timeTotal}
              className={
                timeTotal > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      },
      {
        title: 'Rate (RM)',
        dataIndex: 'rate',
        width: 100,
        render: (col, record, index: number) => {
          let totalHourlyRate = 0;

          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') &&
                t?.task?.project?.id === project?.id
              );
            }
          });

          const members = thisMonthsTimesheets?.map((t) => t?.companyMember);
          const uniqMembers = uniqBy(members, 'id');
          totalHourlyRate = uniqMembers?.reduce((acc, m) => {
            if (m?.hourlyRate) {
              return acc + m?.hourlyRate;
            } else {
              return acc;
            }
          }, 0);

          return (
            <Input
              key={index}
              step={0.5}
              defaultValue={totalHourlyRate.toString()}
              value={totalHourlyRate.toString()}
              className={
                totalHourlyRate > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      },
      {
        title: 'Total (RM)',
        dataIndex: 'total',
        width: 100,
        render: (col, record, index: number) => {
          const groups = project?.groups?.map((g) => g);
          const tasks = groups?.map((t) => t?.tasks).flat();

          const totalRates =
            tasks?.reduce((acc, t) => {
              if (t?.totalRate) {
                return acc + t?.totalRate;
              } else {
                return acc;
              }
            }, 0) || 0;

          const hours = totalRates / 3600;

          const timeTotal = round5(hours);

          return (
            <Input
              key={index}
              readOnly
              min={0}
              step={0.5}
              defaultValue={timeTotal.toString()}
              value={timeTotal.toString()}
              className={
                timeTotal > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        width: 130,
        render: (col, record, index: number) => {
          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return dayjs(
                `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                  +t?.day < 10 ? '0' : ''
                }${t?.day}`,
              ).isSame(selected, 'month');
            }
          });

          let isApproved = false;
          let isBillable = false;

          isApproved =
            thisMonthsTimesheets?.every(
              (t) => t?.status === TimesheetApprovalStatus.Approved,
            ) || false;

          isBillable = thisMonthsTimesheets?.every((t) => t?.billable) || false;

          return (
            <div key={index}>
              <Button
                size="small"
                shape="circle"
                className={isBillable ? '!bg-brand-500 !text-white' : ''}
                title="Billable"
                onClick={() => {
                  handleUpdateBillableAllTasks(!isBillable);
                }}
              >
                $
              </Button>
              <Button
                size="small"
                shape="circle"
                className={
                  isApproved ? '!bg-green-500 !text-white ml-1' : ' ml-1'
                }
                icon={<IconCheck />}
                onClick={() => {
                  handleUpdateStatusAllTasks(
                    isApproved
                      ? TimesheetApprovalStatus.Rejected
                      : TimesheetApprovalStatus.Approved,
                  );
                }}
              />
            </div>
          );
        },
      },
    ] as ColumnProps[];

    for (let i = 1; i <= selected.daysInMonth(); i++) {
      const d = new Date(selected.year(), selected.month(), i);
      const date = dayjs(d);
      const formattedDate = date.format('ddd D');

      col.push({
        title: formattedDate,
        dataIndex: i.toString(),
        width: 100,

        render: () => {
          const sameDateTimesheet = timesheets?.filter((t) => {
            if (t?.year && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(date, 'day') && t?.task?.project?.id === project?.id
              );
            }
          });

          const totalSeconds =
            sameDateTimesheet?.reduce((acc, t) => {
              if (t?.total) {
                return acc + t?.total;
              } else {
                return acc;
              }
            }, 0) || 0;

          const hours = totalSeconds / 3600;
          const totalTime = round5(hours);

          return (
            <InputNumber
              min={0}
              max={24}
              step={0.5}
              precision={0}
              readOnly
              defaultValue={totalTime}
              value={totalTime}
              className={
                totalTime > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      });
    }

    return col;
  }, [
    selected,
    timesheetApprovalsData?.timesheetApprovals,
    queryData?.project,

    projectId,
  ]);

  const totalColumnsMember = useMemo(() => {
    const col = [
      {
        title: 'Task',
        dataIndex: 'name',
        fixed: 'left',
        width: 250,
        render: (col: string, record, index) => {
          return (
            <div className="truncate" key={index}>
              {col}
            </div>
          );
        },
      },
      {
        title: '',
        dataIndex: 'non',
        fixed: 'left',
        width: 120,
      },
      {
        title: 'Total hours',
        dataIndex: 'total_hours',
        width: 100,
        fixed: 'left',
        render: (col, record, i) => {
          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') &&
                t?.task?.project?.id === project?.id
              );
            }
          });

          const totalInSeconds = thisMonthsTimesheets?.reduce((acc, t) => {
            if (t && t?.total) {
              return acc + t?.total;
            } else {
              return acc;
            }
          }, 0);

          const hours = totalInSeconds / 3600;

          const timeTotal = round5(hours);

          return (
            <InputNumber
              key={i}
              min={0}
              readOnly
              step={0.5}
              precision={2}
              value={timeTotal}
              defaultValue={timeTotal}
              className={
                timeTotal > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      },
      {
        title: 'Rate (RM)',
        dataIndex: 'rate',
        width: 100,
        render: (col, record, index: number) => {
          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') &&
                t?.task?.project?.id === project?.id
              );
            }
          });
          const members = thisMonthsTimesheets?.map((t) => t?.companyMember);
          const uniqMembers = uniqBy(members, 'id');
          const totalHourlyRate = uniqMembers?.reduce((acc, m) => {
            if (m && m?.hourlyRate) {
              return acc + m?.hourlyRate;
            } else {
              return acc;
            }
          }, 0);
          return (
            <Input
              key={index}
              step={0.5}
              defaultValue={totalHourlyRate.toString()}
              value={totalHourlyRate.toString()}
              className={
                totalHourlyRate > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      },
      {
        title: 'Total (RM)',
        dataIndex: 'total',
        width: 100,
        render: (col, record, index: number) => {
          const groups = project?.groups?.map((g) => g);
          const tasks = groups?.map((t) => t?.tasks).flat();

          const totalRates =
            tasks?.reduce((acc, t) => {
              if (t?.totalRate) {
                return acc + t?.totalRate;
              } else {
                return acc;
              }
            }, 0) || 0;

          const hours = totalRates / 3600;

          const timeTotal = round5(hours);

          return (
            <Input
              key={index}
              readOnly
              min={0}
              step={0.5}
              defaultValue={timeTotal.toString()}
              value={timeTotal.toString()}
              className={
                timeTotal > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        width: 130,
        render: (col, record, index: number) => {
          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') &&
                t?.task?.project?.id === project?.id
              );
            }
          });

          let isApproved = false;
          let isBillable = false;

          isApproved =
            thisMonthsTimesheets?.every(
              (t) => t?.status === TimesheetApprovalStatus.Approved,
            ) || false;

          isBillable = thisMonthsTimesheets?.every((t) => t?.billable) || false;

          return (
            <div key={index}>
              <Button
                size="small"
                shape="circle"
                className={isBillable ? '!bg-brand-500 !text-white' : ''}
                title="Billable"
                onClick={() => {
                  handleUpdateBillableAllTasks(!isBillable);
                }}
              >
                $
              </Button>
              <Button
                size="small"
                shape="circle"
                className={
                  isApproved ? '!bg-green-500 !text-white ml-1' : ' ml-1'
                }
                icon={<IconCheck />}
                onClick={() => {
                  handleUpdateStatusAllTasks(
                    isApproved
                      ? TimesheetApprovalStatus.Rejected
                      : TimesheetApprovalStatus.Approved,
                  );
                }}
              />
            </div>
          );
        },
      },
    ] as ColumnProps[];

    for (let i = 1; i <= selected.daysInMonth(); i++) {
      const d = new Date(selected.year(), selected.month(), i);
      const date = dayjs(d);
      const formattedDate = date.format('ddd D');

      col.push({
        title: formattedDate,
        dataIndex: i.toString(),
        width: 100,

        render: () => {
          const sameDateTimesheet = timesheets?.filter((t) => {
            if (t && t?.year && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(date, 'day') && t?.task?.project?.id === project?.id
              );
            }
          });

          const totalSeconds = sameDateTimesheet?.reduce((acc, t) => {
            if (t?.total) {
              return acc + t?.total;
            } else {
              return acc;
            }
          }, 0);

          const hours = totalSeconds / 3600;
          const totalTime = round5(hours);

          return (
            <InputNumber
              min={0}
              max={24}
              step={0.5}
              precision={0}
              readOnly
              defaultValue={totalTime}
              value={totalTime}
              className={
                totalTime > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          );
        },
      });
    }

    return col;
  }, [
    selected,
    timesheetApprovalsData?.timesheetApprovals,
    queryData?.project,

    projectId,
  ]);

  const membersForApproval = useMemo(() => {
    if (!timesheetApprovalsData?.timesheetApprovals) {
      return [];
    }
    const members = timesheetApprovalsData?.timesheetApprovals?.map(
      (ta) => ta?.companyMember,
    );
    const uniqMembers = uniqBy(members, 'id');

    return uniqMembers;
  }, [timesheetApprovalsData?.timesheetApprovals]);

  return (
    <div className="bg-white">
      <h1 className="py-4">{project?.name}</h1>

      <TimesheetApprovalNav
        selected={selected}
        setSelected={setSelected}
        view={view}
        setView={setView}
        state={'project'}
      />
      {loading && timesheetApprovalDataLoading ? (
        <div className="flex h-full items-center justify-center m-2">
          <Spin size={50} />
        </div>
      ) : (
        <Form form={form}>
          <div className="overflow-auto p-3 bg-gray-50">
            {view === 'group' &&
              project?.groups?.map((group) => {
                const allTasks = group?.tasks?.filter((task) => task) || [];

                allTasks?.forEach((task) => {
                  if (task?.childTasks?.length) {
                    task?.childTasks?.forEach((child) => {
                      allTasks.push(child);
                    });
                  }
                });
                const tasks = allTasks
                  .map((task) => {
                    const children = task?.members?.map((member) => {
                      return {
                        ...member,
                        taskId: task?.id,
                        id: member?.companyMember?.id,
                        name: member?.user?.name || member?.user?.email,
                        avatar: member?.user?.profileImage,
                      };
                    });
                    return {
                      ...task,
                      children,
                    };
                  })
                  .filter((task) => task?.members?.length);

                const tasksForApproval = tasks?.filter((task) => {
                  return timesheetApprovalsData?.timesheetApprovals?.some(
                    (t) => t?.task?.id === task?.id,
                  );
                });

                return (
                  <div key={group?.id}>
                    <h2 className="py-2">{group?.name}</h2>

                    <Table
                      columns={columns}
                      data={tasksForApproval}
                      pagination={false}
                      className={styles.table}
                      scroll={{
                        x: true,
                      }}
                      summary={(currentData) => {
                        const taskIds = currentData?.map((d) => d?.id);
                        const memberIdArr = currentData?.map((d) =>
                          d?.members?.map((m) => m),
                        );

                        const members = [] as TaskCompanyMember[];
                        memberIdArr?.forEach((m) => {
                          m?.forEach((id) => {
                            if (id) {
                              members.push(id);
                            }
                          });
                        });

                        const uniqMembers = uniqBy(members, 'companyMember.id');

                        const totalHourlyRate = uniqMembers?.reduce(
                          (acc, total) => {
                            if (total?.companyMember?.hourlyRate) {
                              return acc + total?.companyMember?.hourlyRate;
                            } else {
                              return acc + 0;
                            }
                          },
                          0,
                        );

                        const approvalTimesheets =
                          timesheetApprovalsData?.timesheetApprovals?.filter(
                            (t) =>
                              taskIds?.includes(t?.task?.id) &&
                              dayjs(
                                `${t?.year}-${
                                  +(t?.month || 0) < 10 ? '0' : ''
                                }${t?.month}-${+(t?.day || 0) < 10 ? '0' : ''}${
                                  t?.day
                                }`,
                              ).isSame(selected, 'month'),
                          );

                        const totalSeconds = approvalTimesheets?.reduce(
                          (acc, total) => {
                            if (total && total?.total) {
                              return acc + total?.total;
                            } else {
                              return acc + 0;
                            }
                          },
                          0,
                        );

                        const hours = (totalSeconds || 0) / 3600;
                        const totalHours = round5(hours);

                        const totalRatesSeconds = currentData?.reduce(
                          (acc, total) => {
                            if (total?.totalRate) {
                              return acc + total?.totalRate;
                            } else {
                              return acc + 0;
                            }
                          },
                          0,
                        );

                        const rates = (totalRatesSeconds || 0) / 3600;

                        const totalRates = round5(rates);

                        const groupByDay = groupBy(approvalTimesheets, 'day');
                        const d = Object.entries(groupByDay).map(
                          ([key, value]) => {
                            return {
                              day: key,
                              total: value.reduce((acc, total) => {
                                if (total && total?.total) {
                                  return acc + total?.total;
                                } else {
                                  return acc + 0;
                                }
                              }, 0),
                            };
                          },
                        );

                        const dates = [];

                        for (let i = 1; i <= selected.daysInMonth(); i++) {
                          const day = d.find((d) => +d?.day === i);
                          if (!day) {
                            dates.push({
                              day: i.toString(),
                              total: 0,
                            });
                          } else {
                            dates.push(day);
                          }
                        }

                        return (
                          <Table.Summary>
                            <Table.Summary.Row>
                              <Table.Summary.Cell />
                              <Table.Summary.Cell>
                                <InputNumber
                                  readOnly
                                  step={0.5}
                                  precision={0}
                                  value={totalHours}
                                />
                              </Table.Summary.Cell>
                              <Table.Summary.Cell>
                                <InputNumber
                                  readOnly
                                  step={0.5}
                                  precision={0}
                                  value={totalHourlyRate}
                                />
                              </Table.Summary.Cell>
                              <Table.Summary.Cell>
                                <InputNumber
                                  readOnly
                                  step={0.5}
                                  precision={0}
                                  value={totalRates}
                                />
                              </Table.Summary.Cell>
                              <Table.Summary.Cell />
                              {dates?.map((day, index) => {
                                const hours = (day?.total || 0) / 3600;
                                const totalHours = round5(hours);
                                return (
                                  <Table.Summary.Cell key={index}>
                                    <InputNumber
                                      readOnly
                                      step={0.5}
                                      precision={0}
                                      value={totalHours}
                                    />
                                  </Table.Summary.Cell>
                                );
                              })}
                            </Table.Summary.Row>
                          </Table.Summary>
                        );
                      }}
                    />
                  </div>
                );
              })}

            {view === 'member' &&
              membersForApproval.map((member) => {
                const memberTasks =
                  timesheetApprovalsData?.timesheetApprovals?.filter((t) => {
                    return t?.companyMember?.id === member?.id;
                  });

                const uniqMemberTasks = uniqBy(memberTasks, 'task.id');
                const filteredTasks = uniqMemberTasks?.filter(
                  (t) => t?.task?.project?.id === project?.id,
                );
                return (
                  <div key={member?.id}>
                    <h2 className="px-3">
                      <Avatar
                        size={24}
                        className="mr-2"
                        imageSrc={member?.user?.profileImage}
                        name={member?.user?.name || member?.user?.email}
                      />

                      {member?.user?.name || member?.user?.email}
                    </h2>
                    <Table
                      columns={memberColumns}
                      data={filteredTasks}
                      pagination={false}
                      className={styles.table}
                      scroll={{
                        x: true,
                      }}
                      summary={(currentData) => {
                        const memberId = currentData?.[0]?.companyMember?.id;
                        const hourlyRate =
                          currentData?.[0]?.companyMember?.hourlyRate || 0;

                        const timesheetsArr =
                          timesheetApprovalsData?.timesheetApprovals?.filter(
                            (t) =>
                              t?.companyMember?.id === memberId &&
                              dayjs(
                                `${t?.year}-${
                                  +(t?.month || 0) < 10 ? '0' : ''
                                }${t?.month}-${+(t?.day || 0) < 10 ? '0' : ''}${
                                  t?.day
                                }`,
                              ).isSame(selected, 'month') &&
                              t?.task?.project?.id === project?.id,
                          );
                        const totalSecondsMem = timesheetsArr?.reduce(
                          (acc, curr) => {
                            if (curr?.total) {
                              return acc + curr?.total;
                            } else {
                              return acc;
                            }
                          },
                          0,
                        );

                        const hoursMem = (totalSecondsMem || 0) / 3600;
                        const totalHoursMember = round5(hoursMem);

                        const dates = [];

                        for (let i = 1; i <= selected.daysInMonth(); i++) {
                          const filteredDays = timesheetsArr?.filter((t) =>
                            isSameDateTimesheetApproval({
                              day: (t?.day || 0) as number,
                              month: (t?.month || 0) as number,
                              year: (t?.year || 2022) as number,
                              selected,
                              i,
                            }),
                          );

                          if (!filteredDays) {
                            dates.push({
                              day: i.toString(),
                              total: 0,
                            });
                          } else {
                            const totalSeconds = filteredDays?.reduce(
                              (acc, curr) => {
                                if (curr?.total) {
                                  return acc + curr?.total;
                                } else {
                                  return acc;
                                }
                              },
                              0,
                            );

                            dates.push({
                              day: i.toString(),
                              total: totalSeconds,
                            });
                          }
                        }

                        return (
                          <Table.Summary>
                            <Table.Summary.Row>
                              <Table.Summary.Cell />
                              <Table.Summary.Cell />
                              <Table.Summary.Cell>
                                <InputNumber
                                  readOnly
                                  step={0.5}
                                  precision={0}
                                  value={totalHoursMember}
                                />
                              </Table.Summary.Cell>
                              <Table.Summary.Cell>
                                <InputNumber
                                  readOnly
                                  step={0.5}
                                  precision={0}
                                  value={hourlyRate}
                                />
                              </Table.Summary.Cell>

                              <Table.Summary.Cell>
                                <InputNumber
                                  readOnly
                                  step={0.5}
                                  precision={0}
                                  value={totalHoursMember * hourlyRate}
                                />
                              </Table.Summary.Cell>
                              <Table.Summary.Cell />
                              {dates?.map((day, index) => {
                                const hours = (day?.total || 0) / 3600;
                                const totalHours = round5(hours);
                                return (
                                  <Table.Summary.Cell key={index}>
                                    <InputNumber
                                      readOnly
                                      step={0.5}
                                      precision={0}
                                      value={totalHours}
                                    />
                                  </Table.Summary.Cell>
                                );
                              })}
                            </Table.Summary.Row>
                          </Table.Summary>
                        );
                      }}
                    />
                  </div>
                );
              })}

            {view === 'group' &&
              [
                {
                  __typename: 'TaskBoard',
                  id: 'total',
                  name: 'Total',
                  tasks: [
                    {
                      __typename: 'Task',
                      id: 'total',
                      name: 'Total',
                    },
                  ],
                  groups: [],
                },
              ].map((project, index) => {
                return (
                  <div key={index}>
                    <h2 className="px-3">Total </h2>
                    <Table
                      columns={totalColumns}
                      data={[project]}
                      pagination={false}
                      className={styles.table}
                      scroll={{
                        x: true,
                      }}
                    />
                  </div>
                );
              })}

            {view === 'member' &&
              [
                {
                  __typename: 'TaskBoard',
                  id: 'total',
                  name: 'Total',
                  tasks: [
                    {
                      __typename: 'Task',
                      id: 'total',
                      name: 'Total',
                    },
                  ],
                  groups: [],
                },
              ].map((project, index) => {
                return (
                  <div key={index}>
                    <h2 className="px-3">Total </h2>
                    <Table
                      columns={totalColumnsMember}
                      data={[project]}
                      pagination={false}
                      className={styles.table}
                      scroll={{
                        x: true,
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </Form>
      )}
    </div>
  );
};

const timesheetApprovalPageQuery = gql`
  query ProjectTimesheetApprovalPage(
    $projectId: ID!
    $dates: [TaskQueryTotalRate!]!
  ) {
    project(id: $projectId) {
      id
      name
      groups {
        id
        name
        tasks {
          id
          name
          timeSpent
          totalRate(dates: $dates)
          timesheets {
            id
            timeTotal
            startDate
            endDate
            activity {
              task {
                id
              }
            }
          }
          members {
            id
            companyMember {
              id
              hourlyRate
            }
            user {
              name
              email
              profileImage
            }
          }
          group {
            id
            name
          }
          childTasks {
            id
            name
            timeSpent
            totalRate(dates: $dates)
            timesheets {
              id
              timeTotal
              startDate
              endDate
              activity {
                task {
                  id
                }
              }
            }
            members {
              id
              companyMember {
                id
                hourlyRate
              }
              user {
                name
                email
                profileImage
              }
            }
            group {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const timesheetsApprovals = gql`
  query TimesheetApprovalPage($companyId: ID!) {
    timesheetApprovals(companyId: $companyId) {
      day
      month
      year
      total
      status
      billable
      companyMember {
        id
        hourlyRate
        user {
          name
          email
          profileImage
        }
      }
      task {
        name
        id
        project {
          id
        }
        group {
          id
          name
        }
      }
    }
  }
`;

const updateTimesheetApprovalsMutation = gql`
  mutation UpdateTimesheetApprovalsTimesheetApprovalPage(
    $input: UpdateTimesheetApprovalInput!
  ) {
    updateTimesheetApprovals(input: $input) {
      total
    }
  }
`;

export default TimesheetApprovalPage;
