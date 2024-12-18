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
import _, { uniqBy } from 'lodash';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Message from '@/components/Message';

import styles from '../AttendanceStyles.module.less';
import TimesheetApprovalNav from './TimesheetApprovalNav/TimesheetApprovalNav';

import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';
import { convertYearMonthDayToDateString } from '@/utils/timesheet.utils';

import { ArrayElement } from '@/types';

import {
  CustomTimesheetMemberApprovalPageQuery,
  CustomTimesheetMemberApprovalPageQueryVariables,
  TimesheetApprovalStatus,
  TimesheetMemberApprovalPageQuery,
  TimesheetMemberApprovalPageQueryVariables,
  TimesheetMemberApprovalProjectsPageQuery,
  TimesheetMemberApprovalProjectsPageQueryVariables,
  UpdateCustomTimesheetMemberApprovalsTimesheetApprovalPageMutation,
  UpdateCustomTimesheetMemberApprovalsTimesheetApprovalPageMutationVariables,
  UpdateTimesheetMemberApprovalsTimesheetApprovalPageMutation,
  UpdateTimesheetMemberApprovalsTimesheetApprovalPageMutationVariables,
} from 'generated/graphql-types';

export type FormValues = {
  taskId: string;
};

const round5 = (x: number) => {
  return Math.ceil(x / 0.5) * 0.5 || 0;
};

type TimesheetQuery = ArrayElement<
  NonNullable<TimesheetMemberApprovalPageQuery>['timesheetApprovals']
>;

type QueryProject = ArrayElement<
  NonNullable<TimesheetMemberApprovalProjectsPageQuery>['projects']
>;

type QueryProjectTask = ArrayElement<NonNullable<QueryProject>['tasks']>;

const TimesheetMemberApprovalPage = () => {
  const { activeCompany } = useAppStore();

  const { memberId } = useParams();

  const [selected, setSelected] = useState(dayjs());
  const [view, setView] = useState('group');

  const {
    data: queryProjectsData,
    refetch: refetchProjectsQuery,
    loading,
  } = useQuery<
    TimesheetMemberApprovalProjectsPageQuery,
    TimesheetMemberApprovalProjectsPageQueryVariables
  >(timesheetApprovalProjects, {
    variables: {
      memberId: memberId as string,
      companyMemberId: memberId as string,
    },
    skip: !memberId,
  });

  const {
    data: timesheetApprovalsData,
    refetch: timesheetApprovalsRefetch,
    loading: timesheetApprovalLoading,
  } = useQuery<
    TimesheetMemberApprovalPageQuery,
    TimesheetMemberApprovalPageQueryVariables
  >(timesheetsApprovals, {
    variables: {
      companyId: activeCompany?.id as string,
    },
  });

  const {
    data: customTimesheetApprovalsData,
    refetch: customTimesheetApprovalsRefetch,
    loading: customTimesheetApprovalLoading,
  } = useQuery<
    CustomTimesheetMemberApprovalPageQuery,
    CustomTimesheetMemberApprovalPageQueryVariables
  >(customTimesheetsApprovals, {
    variables: {
      companyId: activeCompany?.id as string,
    },
  });

  const [mutateUpdateTimesheetApprovals] = useMutation<
    UpdateTimesheetMemberApprovalsTimesheetApprovalPageMutation,
    UpdateTimesheetMemberApprovalsTimesheetApprovalPageMutationVariables
  >(updateTimesheetApprovalsMutation);

  const [mutateUpdateCustomTimesheetApprovals] = useMutation<
    UpdateCustomTimesheetMemberApprovalsTimesheetApprovalPageMutation,
    UpdateCustomTimesheetMemberApprovalsTimesheetApprovalPageMutationVariables
  >(updateCustomTimesheetApprovalsMutation);

  const [form] = Form.useForm<FormValues>();

  const handleUpdateStatusMembers = async (
    record: QueryProjectTask,
    status: TimesheetApprovalStatus,
  ) => {
    const taskId = record?.id as string;

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
        timesheetApprovalsRefetch();
        refetchProjectsQuery();
      } else {
        Message.error(getErrorMessage(res?.errors), {
          title: 'Failed update timesheet approval',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateBillableMembers = async (
    record: QueryProjectTask,
    billable: boolean,
  ) => {
    const taskId = record?.id as string;

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
    const taskIds = timesheets?.map((timesheet) => timesheet?.task?.id);
    const uniqTaskIds = _.uniq(taskIds) as string[];

    const sheets = uniqTaskIds?.map((taskId) => {
      return { taskId, companyMemberId: memberId };
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
    // const taskId = record?.id;
    const taskIds = timesheets?.map((timesheet) => timesheet?.task?.id);
    const uniqTaskIds = _.uniq(taskIds) as string[];

    const sheets = uniqTaskIds?.map((taskId) => {
      return { taskId, companyMemberId: memberId };
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
        timesheetApprovalsRefetch();
        refetchProjectsQuery();
      } else {
        Message.error(getErrorMessage(res?.errors), {
          title: 'Failed update timesheet approval',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCustomStatusMembers = async (
    record: { name: string },
    status: TimesheetApprovalStatus,
  ) => {
    const customName = record?.name as string;

    try {
      const res = await mutateUpdateCustomTimesheetApprovals({
        variables: {
          input: {
            sheets: [{ customName, companyMemberId: memberId }],
            date: selected,
            status,
          },
        },
      });

      if (!res?.errors) {
        timesheetApprovalsRefetch();
        refetchProjectsQuery();
        customTimesheetApprovalsRefetch();
      } else {
        Message.error(getErrorMessage(res?.errors), {
          title: 'Failed update timesheet approval',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCustomBillableMembers = async (
    record: { name: string },
    billable: boolean,
  ) => {
    const customName = record?.name as string;

    try {
      const res = await mutateUpdateCustomTimesheetApprovals({
        variables: {
          input: {
            sheets: [{ customName, companyMemberId: memberId }],
            date: selected,
            billable,
          },
        },
      });

      if (!res?.errors) {
        timesheetApprovalsRefetch();
        customTimesheetApprovalsRefetch();
      } else {
        Message.error(getErrorMessage(res?.errors), {
          title: 'Failed update timesheet approval',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const customTimesheetApprovals = useMemo(() => {
    if (!customTimesheetApprovalsData?.customTimesheetApprovals) {
      return [];
    }

    const uniqByName = uniqBy(
      customTimesheetApprovalsData.customTimesheetApprovals,
      'customName',
    );

    const t = uniqByName.map((cta, i) => {
      return {
        ...cta,
        name: cta?.customName,
        id: `${cta?.customName}---custom-${i}`,
        task: {
          id: `${cta?.customName}---custom-${i}`,
          name: cta?.customName,
        },
      };
    });

    return t;
  }, [customTimesheetApprovalsData?.customTimesheetApprovals]);

  const timesheets = useMemo<TimesheetQuery[]>(() => {
    if (!timesheetApprovalsData?.timesheetApprovals) {
      return [];
    }

    return timesheetApprovalsData?.timesheetApprovals;
  }, [timesheetApprovalsData?.timesheetApprovals, selected]);

  const projects = useMemo<QueryProject[]>(() => {
    if (!queryProjectsData?.projects) {
      return [];
    }

    return queryProjectsData?.projects;
  }, [queryProjectsData?.projects]);

  const memberPageColumns = useMemo<ColumnProps<QueryProjectTask>[]>(() => {
    const memberPageCols: ColumnProps<QueryProjectTask>[] = [
      {
        title: 'Task',
        dataIndex: 'name',
        fixed: 'left',
        width: 250,
        render: (col, record, index) => {
          return (
            <div className="truncate" key={index}>
              {record?.name}
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
            if (t && t?.month && t?.day) {
              const dateString = convertYearMonthDayToDateString({
                month: +(t?.month || 0),
                day: +(t?.day || 0),
                year: +(t?.year || 0),
              });
              return (
                dayjs(dateString).isSame(selected, 'month') &&
                t?.companyMember?.id === memberId &&
                t?.task?.id === record?.id
              );
            }
          });

          const totalInSeconds =
            thisMonthsTimesheets?.reduce((acc, t) => {
              if (t && t?.total) {
                return acc + t?.total;
              } else {
                return acc;
              }
            }, 0) || 0;

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
          const hourlyRate = queryProjectsData?.companyMember?.hourlyRate || 0;

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
          const hourlyRate = queryProjectsData?.companyMember?.hourlyRate || 0;

          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') &&
                t?.companyMember?.id === memberId &&
                t?.task?.id === record?.id
              );
            }
          });

          const totalInSeconds =
            thisMonthsTimesheets?.reduce((acc, t) => {
              if (t && t?.total) {
                return acc + t?.total;
              } else {
                return acc;
              }
            }, 0) || 0;

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
          const thisMonthsTimesheets =
            timesheets?.filter((t) => {
              if (t && t?.month && t?.day) {
                return (
                  dayjs(
                    `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                      +t?.day < 10 ? '0' : ''
                    }${t?.day}`,
                  ).isSame(selected, 'month') &&
                  t?.companyMember?.id === memberId &&
                  t?.task?.id === record?.id
                );
              }
            }) || [];

          const isAllStatusApproved = thisMonthsTimesheets?.every((t) => {
            return t?.status === TimesheetApprovalStatus.Approved;
          });

          const billable = thisMonthsTimesheets?.every((t) => {
            return t?.billable;
          });

          return (
            <div key={index}>
              <Button
                size="small"
                shape="circle"
                className={billable ? '!bg-brand-500 !text-white' : ''}
                title="Billable"
                onClick={() => {
                  handleUpdateBillableMembers(record, billable ? false : true);
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
                  handleUpdateStatusMembers(
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

      memberPageCols.push({
        title: formattedDate,
        dataIndex: i.toString(),
        width: 100,
        render: (col, record) => {
          const sameDateTimesheet =
            timesheets?.filter((t) => {
              if (t && t?.month && t?.day) {
                return (
                  dayjs(
                    `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                      +t?.day < 10 ? '0' : ''
                    }${t?.day}`,
                  ).isSame(date, 'day') &&
                  t?.task?.id === record?.id &&
                  t?.companyMember?.id === memberId
                );
              }
            }) || [];

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

    return memberPageCols;
  }, [
    selected,
    timesheetApprovalsData?.timesheetApprovals,
    customTimesheetApprovalsData?.customTimesheetApprovals,
    memberId,
  ]);

  const memberPageCustomColumns = useMemo<ColumnProps[]>(() => {
    const memberPageCols: ColumnProps<QueryProjectTask>[] = [
      {
        title: 'Task',
        dataIndex: 'name',
        fixed: 'left',
        width: 250,
        render: (col, record, index) => {
          return (
            <div className="truncate" key={index}>
              {record?.name}
            </div>
          );
        },
      },
      {
        title: '',
        dataIndex: 'group',
        fixed: 'left',
        width: 120,
      },
      {
        title: 'Total hours',
        dataIndex: 'total_hours',
        width: 100,
        fixed: 'left',
        render: (col, record, i) => {
          const thisMonthsTimesheets =
            customTimesheetApprovalsData?.customTimesheetApprovals?.filter(
              (t) => {
                if (t && t?.month && t?.day) {
                  return (
                    dayjs(
                      `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                        +t?.day < 10 ? '0' : ''
                      }${t?.day}`,
                    ).isSame(selected, 'month') &&
                    t?.companyMember?.id === memberId &&
                    t?.customName === record?.name
                  );
                }
              },
            );

          const totalInSeconds =
            thisMonthsTimesheets?.reduce((acc, t) => {
              if (t && t?.total) {
                return acc + t?.total;
              } else {
                return acc;
              }
            }, 0) || 0;

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
          const hourlyRate = queryProjectsData?.companyMember?.hourlyRate || 0;

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
          const hourlyRate = queryProjectsData?.companyMember?.hourlyRate || 0;

          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') &&
                t?.companyMember?.id === memberId &&
                t?.task?.id === record?.id
              );
            }
          });

          const totalInSeconds =
            thisMonthsTimesheets?.reduce((acc, t) => {
              if (t && t?.total) {
                return acc + t?.total;
              } else {
                return acc;
              }
            }, 0) || 0;

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
          const thisMonthsTimesheets =
            customTimesheetApprovalsData?.customTimesheetApprovals?.filter(
              (t) => {
                if (t && t?.month && t?.day) {
                  return (
                    dayjs(
                      `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                        +t?.day < 10 ? '0' : ''
                      }${t?.day}`,
                    ).isSame(selected, 'month') &&
                    t?.companyMember?.id === memberId &&
                    t?.customName === record?.name
                  );
                }
              },
            ) || [];

          const isAllStatusApproved = thisMonthsTimesheets?.every((t) => {
            return t?.status === TimesheetApprovalStatus.Approved;
          });

          const billable = thisMonthsTimesheets?.every((t) => {
            return t?.billable;
          });

          return (
            <div key={index}>
              <Button
                size="small"
                shape="circle"
                className={billable ? '!bg-brand-500 !text-white' : ''}
                title="Billable"
                onClick={() => {
                  handleUpdateCustomBillableMembers(
                    record,
                    billable ? false : true,
                  );
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
                  handleUpdateCustomStatusMembers(
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

      memberPageCols.push({
        title: formattedDate,
        dataIndex: i.toString(),
        width: 100,
        render: (col, record) => {
          const sameDateTimesheet =
            customTimesheetApprovalsData?.customTimesheetApprovals?.filter(
              (t) => {
                if (t && t?.month && t?.day) {
                  return (
                    dayjs(
                      `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                        +t?.day < 10 ? '0' : ''
                      }${t?.day}`,
                    ).isSame(date, 'date') &&
                    t?.customName === record?.name &&
                    t?.companyMember?.id === memberId
                  );
                }
              },
            ) || [];

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

    return memberPageCols;
  }, [
    selected,
    customTimesheetApprovalsData?.customTimesheetApprovals,
    memberId,
  ]);

  const totalColumns = useMemo<ColumnProps[]>(() => {
    const totalCols = [
      {
        title: 'Task',
        dataIndex: 'name',
        fixed: 'left',
        width: 320,
        render: (col: string, record, index) => {
          return (
            <div className="truncate" key={index}>
              {record?.name}
            </div>
          );
        },
      },
      {
        title: '',
        dataIndex: 'non',
        fixed: 'left',
        width: 50,
      },
      {
        title: 'Total hours',
        dataIndex: 'total_hours',
        width: 100,
        fixed: 'left',
        render: (col, record, i) => {
          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.month && t?.day) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') && t?.companyMember?.id === memberId
              );
            }
          });

          const thisMonthsCustomTimesheets =
            customTimesheetApprovalsData?.customTimesheetApprovals?.filter(
              (t) => {
                if (t && t?.month && t?.day) {
                  return (
                    dayjs(
                      `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                        +t?.day < 10 ? '0' : ''
                      }${t?.day}`,
                    ).isSame(selected, 'month') &&
                    t?.companyMember?.id === memberId
                  );
                }
              },
            );

          const totalCustomInSeconds =
            thisMonthsCustomTimesheets?.reduce((acc, t) => {
              if (t && t?.total) {
                return acc + t?.total;
              } else {
                return acc;
              }
            }, 0) || 0;

          const totalInSeconds =
            thisMonthsTimesheets?.reduce((acc, t) => {
              if (t && t?.total) {
                return acc + t?.total;
              } else {
                return acc;
              }
            }, 0) + totalCustomInSeconds || 0;

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
          const hourlyRate = queryProjectsData?.companyMember?.hourlyRate || 0;

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
          const hourlyRate = queryProjectsData?.companyMember?.hourlyRate || 0;

          const thisMonthsTimesheets = timesheets?.filter((t) => {
            if (t && t?.day && t?.month) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') && t?.companyMember?.id === memberId
              );
            }
          });

          const totalInSeconds =
            thisMonthsTimesheets?.reduce((acc, t) => {
              if (t && t?.total) {
                return acc + t?.total;
              } else {
                return acc;
              }
            }, 0) || 0;

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
            if (t && t?.day && t?.month) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(selected, 'month') && t?.companyMember?.id === memberId
              );
            }
          });

          const isAllStatusApproved = thisMonthsTimesheets?.every((t) => {
            return t?.status === TimesheetApprovalStatus.Approved;
          });

          const billable = thisMonthsTimesheets?.every((t) => {
            return t?.billable;
          });

          return (
            <div key={index}>
              <Button
                size="small"
                shape="circle"
                className={billable ? '!bg-brand-500 !text-white' : ''}
                title="Billable"
                onClick={() => {
                  handleUpdateBillableAllTasks(billable ? false : true);
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
                  handleUpdateStatusAllTasks(
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

      totalCols.push({
        title: formattedDate,
        dataIndex: i.toString(),
        width: 100,
        render: () => {
          const sameDateTimesheet = timesheets?.filter((t) => {
            if (t && t?.day && t?.month) {
              return (
                dayjs(
                  `${t?.year}-${+t?.month < 10 ? '0' : ''}${t?.month}-${
                    +t?.day < 10 ? '0' : ''
                  }${t?.day}`,
                ).isSame(date, 'day') && t?.companyMember?.id === memberId
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

    return totalCols;
  }, [selected, timesheetApprovalsData?.timesheetApprovals, memberId]);

  return (
    <div className="bg-white">
      {memberId && (
        <h1 className="py-4">
          {queryProjectsData?.companyMember?.user?.name ||
            queryProjectsData?.companyMember?.user?.email}
        </h1>
      )}
      <TimesheetApprovalNav
        selected={selected}
        setSelected={setSelected}
        view={view}
        setView={setView}
        state={'member'}
      />

      {timesheetApprovalLoading && customTimesheetApprovalLoading && loading ? (
        <div className="flex h-full items-center justify-center m-2">
          <Spin size={50} />
        </div>
      ) : (
        <Form form={form}>
          <div className="overflow-auto p-3 bg-gray-50">
            {memberId && (
              <>
                {projects?.map((project, index) => {
                  const allTasks = Array.from(project?.tasks || []).filter(
                    (task) => {
                      return task?.members?.some(
                        (m) => m?.companyMember?.id === memberId,
                      );
                    },
                  );

                  const allChildTasks = allTasks
                    .reduce(
                      (tasks, task) => [...tasks, ...(task?.childTasks || [])],
                      [] as QueryProjectTask[],
                    )
                    .filter((task) =>
                      task?.members?.some(
                        (member) => member?.companyMember?.id === memberId,
                      ),
                    );

                  const filteredTasks = Array.from([
                    ...allTasks,
                    ...allChildTasks,
                  ]).filter((task) => {
                    return (
                      timesheets?.some((t) => t?.task?.id === task?.id) &&
                      task?.members?.some(
                        (t) => t?.companyMember?.id === memberId,
                      )
                    );
                  });

                  if (!filteredTasks?.length) {
                    return null;
                  }

                  return (
                    <div key={index}>
                      <h2 className="px-3">{project?.name}</h2>
                      <Table
                        className={styles.table}
                        columns={memberPageColumns}
                        data={filteredTasks}
                        pagination={false}
                        scroll={{
                          x: true,
                        }}
                        summary={(currentData) => {
                          const taskIds = currentData?.map((t) => t?.id);

                          const timesheetApprovals =
                            timesheetApprovalsData?.timesheetApprovals?.filter(
                              (t) =>
                                t?.companyMember?.id === memberId &&
                                taskIds?.includes(t?.task?.id) &&
                                dayjs(
                                  convertYearMonthDayToDateString({
                                    month: +(t?.month || 0),
                                    day: +(t?.day || 0),
                                    year: +(t?.year || 0),
                                  }),
                                ).isSame(selected, 'month'),
                            );

                          const total = timesheetApprovals?.reduce(
                            (acc, total) => {
                              if (total && total?.total) {
                                return acc + total?.total;
                              } else {
                                return acc + 0;
                              }
                            },
                            0,
                          );

                          const hours = (total || 0) / 3600;
                          const totalHours = round5(hours);

                          const hourlyRate =
                            queryProjectsData?.companyMember?.hourlyRate || 0;

                          const dates = [];

                          for (let i = 1; i <= selected.daysInMonth(); i++) {
                            const filteredDays = timesheetApprovals?.filter(
                              (t) =>
                                t?.day === i &&
                                t?.month === selected?.get('month') + 1 &&
                                t?.year === selected?.get('year'),
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
                                    value={totalHours}
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
                                    value={totalHours * hourlyRate}
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

                {[
                  {
                    id: 'other-activities',
                    name: 'Other Activities',
                    tasks: customTimesheetApprovals,
                  },
                ].map((project) => {
                  const tasks = project?.tasks?.map((task) => {
                    return {
                      ...task,
                      key: task?.task.id,
                    };
                  });

                  return (
                    <div key={project?.id}>
                      <h2 className="px-3">{project?.name}</h2>

                      <Table
                        className={styles.table}
                        columns={memberPageCustomColumns}
                        data={tasks}
                        pagination={false}
                        scroll={{
                          x: true,
                        }}
                      />
                    </div>
                  );
                })}

                {[
                  {
                    __typename: 'TaskBoard',
                    id: 'total',
                    name: 'Total',
                    tasks: [
                      {
                        __typename: 'Task',
                        id: 'total',
                        name: 'Total',
                        members: [{ companyMember: { id: memberId } }],
                      },
                    ],
                    groups: [],
                  },
                ].map((project, index) => {
                  return (
                    <div key={index}>
                      <h2 className="px-3">Total </h2>
                      <Table
                        className={styles.table}
                        columns={totalColumns}
                        data={[project]}
                        pagination={false}
                        scroll={{
                          x: true,
                        }}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </Form>
      )}
    </div>
  );
};

const timesheetsApprovals = gql`
  query TimesheetMemberApprovalPage($companyId: ID!) {
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
        deletedAt
        group {
          id
          name
        }
        childTasks {
          name
          id
          deletedAt
          group {
            id
            name
          }
        }
      }
    }
  }
`;

const customTimesheetsApprovals = gql`
  query CustomTimesheetMemberApprovalPage($companyId: ID!) {
    customTimesheetApprovals(companyId: $companyId) {
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
      customName
    }
  }
`;

const timesheetApprovalProjects = gql`
  query TimesheetMemberApprovalProjectsPage(
    $memberId: ID!
    $companyMemberId: ID!
  ) {
    companyMember(companyMemberId: $companyMemberId) {
      id
      hourlyRate
      user {
        name
        email
        profileImage
      }
    }
    projects(memberId: $memberId) {
      name
      groups {
        id
        name
        tasks {
          id
          name
          timeSpent
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
      tasks {
        id
        name
        timeSpent
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
`;

const updateTimesheetApprovalsMutation = gql`
  mutation UpdateTimesheetMemberApprovalsTimesheetApprovalPage(
    $input: UpdateTimesheetApprovalInput!
  ) {
    updateTimesheetApprovals(input: $input) {
      total
    }
  }
`;

const updateCustomTimesheetApprovalsMutation = gql`
  mutation UpdateCustomTimesheetMemberApprovalsTimesheetApprovalPage(
    $input: UpdateCustomTimesheetApprovalInput!
  ) {
    updateCustomTimesheetApprovals(input: $input) {
      total
    }
  }
`;

export default TimesheetMemberApprovalPage;
