import { gql, useMutation, useQuery } from '@apollo/client';
import { InputNumber, Table, Form, Button } from '@arco-design/web-react';
import { Input, Modal as ArcoModal } from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table/interface';
import { IconPlus } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { isEmpty, round, uniqBy } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { MdDelete } from 'react-icons/md';

import { FormLabel } from '@/components';
import Modal from '@/components/Modal';

import styles from '../AttendanceStyles.module.less';
import TimesheetTrackingNav from './TimesheetTrackingNav/TimesheetTrackingNav';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { convertYearMonthDayToDateString } from '@/utils/timesheet.utils';

import { TASK_NAME_MAX_LENGTH } from '@/constants/task.constants';

import { BaseModalConfig, ArrayElement } from '@/types';

import {
  CreateCustomTimesheetApprovalsTimesheetTrackingPageMutation,
  CreateCustomTimesheetApprovalsTimesheetTrackingPageMutationVariables,
  CreateTimesheetApprovalsTimesheetTrackingPageMutation,
  CreateTimesheetApprovalsTimesheetTrackingPageMutationVariables,
  CustomTimesheetApprovalsTimesheetTrackingPageQuery,
  CustomTimesheetApprovalsTimesheetTrackingPageQueryVariables,
  DeleteCustomTimesheetApprovalsTimesheetTrackingPageMutation,
  DeleteCustomTimesheetApprovalsTimesheetTrackingPageMutationVariables,
  ProjectsTimesheetTrackingPageQuery,
  ProjectsTimesheetTrackingPageQueryVariables,
  TimesheetApprovalsTimesheetTrackingPageQuery,
  TimesheetApprovalsTimesheetTrackingPageQueryVariables,
  TimesheetsByCompanyMemberQuery,
  TimesheetsByCompanyMemberQueryVariables,
} from 'generated/graphql-types';

const FormItem = Form.Item;

export type FormValues = {
  taskId: string;
  [key: string]: string | number;
};

const round5 = (x: number) => {
  return Math.ceil(x / 0.5) * 0.5;
};

const TimesheetTrackingPage = () => {
  const [selected, setSelected] = useState(dayjs());

  const [form] = Form.useForm<FormValues>();

  const modalState = useDisclosure();

  const { getCurrentMember, activeCompany } = useAppStore();

  const [value, setValue] = useState(0);

  const currentMember = getCurrentMember();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    ProjectsTimesheetTrackingPageQuery,
    ProjectsTimesheetTrackingPageQueryVariables
  >(projectsTimesheetTrackingQuery, {
    variables: {
      memberId: currentMember?.id as string,
      filters: { taskMember: { memberId: currentMember?.id as string } },
    },
    skip: !currentMember?.id,
  });

  const { data: timesheetData, refetch: refetchTimesheetData } = useQuery<
    TimesheetsByCompanyMemberQuery,
    TimesheetsByCompanyMemberQueryVariables
  >(timesheetsByCompanyMember, {
    variables: {
      companyMemberId: currentMember?.id as string,
    },
  });

  const { data: timesheetApprovalsData, refetch: refetchTimesheetApprovals } =
    useQuery<
      TimesheetApprovalsTimesheetTrackingPageQuery,
      TimesheetApprovalsTimesheetTrackingPageQueryVariables
    >(timesheetsApprovalByMember, {
      variables: {
        memberId: currentMember?.id as string,
        companyId: activeCompany?.id as string,
      },
    });

  const {
    data: customTimesheetApprovalsData,
    refetch: refetchCustomTimesheetApprovals,
  } = useQuery<
    CustomTimesheetApprovalsTimesheetTrackingPageQuery,
    CustomTimesheetApprovalsTimesheetTrackingPageQueryVariables
  >(customTimesheetsApprovalByMember, {
    variables: {
      memberId: currentMember?.id as string,
      companyId: activeCompany?.id as string,
    },
  });

  const [mutateCreateTimesheetApprovals] = useMutation<
    CreateTimesheetApprovalsTimesheetTrackingPageMutation,
    CreateTimesheetApprovalsTimesheetTrackingPageMutationVariables
  >(createTimesheetApprovalsMutation);

  const [mutateCreateCustomTimesheetApprovals] = useMutation<
    CreateCustomTimesheetApprovalsTimesheetTrackingPageMutation,
    CreateCustomTimesheetApprovalsTimesheetTrackingPageMutationVariables
  >(createCustomTimesheetApprovalsMutation);

  const [mutateDeleteCustomTimesheetApprovals] = useMutation<
    DeleteCustomTimesheetApprovalsTimesheetTrackingPageMutation,
    DeleteCustomTimesheetApprovalsTimesheetTrackingPageMutationVariables
  >(deleteCustomTimesheetApprovalsMutation);

  const handleChangeDate = (date: dayjs.Dayjs) => {
    setSelected(date);
  };

  type QueryTimesheetTrackingProject = ArrayElement<
    NonNullable<ProjectsTimesheetTrackingPageQuery['projects']>
  >;
  type QueryTimesheetTrackingCustom = ArrayElement<
    NonNullable<CustomTimesheetApprovalsTimesheetTrackingPageQuery>['customTimesheetApprovals']
  >;
  type QueryTimesheet = ArrayElement<
    NonNullable<TimesheetsByCompanyMemberQuery['getTimesheetsByCompanyMember']>
  >;

  type QueryTask = ArrayElement<
    NonNullable<QueryTimesheetTrackingProject>['tasks']
  >;

  const timesheets = useMemo(() => {
    if (!timesheetData?.getTimesheetsByCompanyMember) {
      return [];
    }

    return timesheetData.getTimesheetsByCompanyMember;
  }, [timesheetData?.getTimesheetsByCompanyMember]);

  const timesheetApprovals = useMemo(() => {
    if (!timesheetApprovalsData?.timesheetApprovals) {
      return [];
    }

    return timesheetApprovalsData.timesheetApprovals;
  }, [timesheetApprovalsData?.timesheetApprovals]);

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
        id: `${cta?.customName}---custom-${i}`, // This is to identify it's a custom activity when filtering later
        task: {
          id: `${cta?.customName}---custom-${i}`, // This is to identify it's a custom activity when filtering later
          name: cta?.customName,
        },
      };
    });

    return t;
  }, [customTimesheetApprovalsData?.customTimesheetApprovals]);

  const projects = useMemo(() => {
    if (!queryData?.projects) {
      return [];
    }

    const projectsWithOtherActivities = [...queryData.projects];
    return projectsWithOtherActivities;
  }, [
    queryData?.projects,
    customTimesheetApprovals,
  ]) as QueryTimesheetTrackingProject[];

  useEffect(() => {
    refetchQuery();
    refetchCustomTimesheetApprovals();
    refetchTimesheetData();
    refetchTimesheetData();
    form.resetFields();
  }, [selected]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     refetchQuery();
  //     refetchCustomTimesheetApprovals();
  //     refetchTimesheetData();
  //     refetchTimesheetData();
  //   }, 5000);
  //   return () => clearTimeout(timer);
  // }, []);

  const obj = Object.entries(form.getFieldsValue());

  const columns = [
    {
      title: 'Task',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'Total hours',
      dataIndex: 'total_hours',
      width: 100,
      fixed: 'left',
      render: (col, record, i) => {
        return (
          <Form.Item
            key={i}
            shouldUpdate
            className="m-0 p-0"
            children={(getFieldValue) => {
              const obj = Object.entries(getFieldValue);

              const month = selected.format('MM');
              const year = selected.format('YYYY');
              const arr = obj.filter((key) =>
                key[0].includes(`${record?.id}-${year}-${month}`),
              ) as [string, number][];

              const total = arr.reduce((acc, cur) => {
                if (cur[1]) {
                  return +(acc + +cur[1]);
                } else {
                  return acc + 0;
                }
              }, 0);

              const hours = round5(total);
              return (
                <InputNumber
                  min={0}
                  step={0.5}
                  precision={2}
                  value={hours}
                  defaultValue={hours}
                  onChange={(value) => setValue(value)}
                  className={
                    hours > 0
                      ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                      : ''
                  }
                />
              );
            }}
          />
        );
      },
    },
  ] as ColumnProps[];

  for (let i = 1; i <= selected.daysInMonth(); i++) {
    const d = new Date(selected.year(), selected.month(), i);
    const day = dayjs(d);

    const time = [] as QueryTimesheet[];

    for (let i = 0; i < timesheets.length; i++) {
      const timesheet = timesheets[i];

      const isNextDay = dayjs(timesheet?.endDate).isAfter(
        timesheet?.startDate,
        'day',
      );
      if (
        dayjs(timesheet?.startDate).isSame(day, 'day') &&
        dayjs(timesheet?.endDate).isSame(day, 'day')
      ) {
        const diff = dayjs(timesheet?.endDate).diff(
          timesheet?.startDate,
          'second',
        );
        time.push({
          id: timesheet?.id as string,
          activity: timesheet?.activity,
          timeTotal: diff,
          startDate: timesheet?.startDate,
          endDate: timesheet?.endDate,
        });
      } else if (isNextDay) {
        const endOfStartDay = dayjs(timesheet?.startDate).endOf('day');
        const startOfEndDay = dayjs(timesheet?.endDate).startOf('day');
        const diff = endOfStartDay.diff(timesheet?.startDate, 'second');
        const differenceDays = dayjs(timesheet?.endDate).diff(
          timesheet?.startDate,
          'day',
        );
        time.push({
          id: timesheet?.id as string,
          activity: timesheet?.activity,
          timeTotal: diff,
          startDate: timesheet?.startDate,
          endDate: endOfStartDay,
        });

        const diffEndDay = dayjs(timesheet?.endDate).diff(
          startOfEndDay,
          'second',
        );

        if (differenceDays > 1) {
          for (let i = 1; i < differenceDays; i++) {
            const startOfNextDay = dayjs(timesheet?.startDate)
              .add(i, 'day')
              .startOf('day');
            const endOfNextDay = dayjs(timesheet?.startDate)
              .add(i, 'day')
              .endOf('day');
            const diffNextDay = endOfNextDay.diff(startOfNextDay, 'second');
            time.push({
              id: timesheet?.id as string,
              activity: timesheet?.activity,
              timeTotal: diffNextDay,
              startDate: startOfNextDay,
              endDate: endOfNextDay,
            });
          }
        }

        time.push({
          id: timesheet?.id as string,
          activity: timesheet?.activity,
          timeTotal: diffEndDay,
          startDate: startOfEndDay,
          endDate: timesheet?.endDate,
        });
      }
    }

    const sameDayTimesheet = time
      .map((timesheet) => {
        if (
          dayjs(timesheet?.startDate).isSame(day, 'day') &&
          dayjs(timesheet?.endDate).isSame(day, 'day')
        ) {
          return timesheet;
        }
      })
      .filter((timesheet) => timesheet);

    columns.push({
      title: day.format('ddd D'),
      dataIndex: i.toString(),
      width: 100,
      fixed: i === 0 ? 'left' : undefined,
      render: (_, item) => {
        const tasksTimesheet = sameDayTimesheet
          ?.filter((timesheet) => {
            if (timesheet?.activity?.task?.id === item?.id) {
              return timesheet;
            }
          })
          .filter((timesheet) => timesheet);

        const timeFromTasksTimesheet = round(
          tasksTimesheet.reduce((acc, cur) => {
            return acc + (cur?.timeTotal || 0);
          }, 0) /
            60 /
            60,
          2,
        );

        const totalTimeFromApprovals = round(
          (timesheetApprovals.find(
            (timesheet) =>
              timesheet?.task?.id === item?.id &&
              timesheet?.day === day.get('date') &&
              timesheet?.month === day.get('month') + 1 &&
              timesheet?.year === day.get('year'),
          )?.total || 0) /
            60 /
            60,
          2,
        );

        const objArr = obj.filter(
          (key) =>
            key[0].includes(item?.id) &&
            key[0].includes(day.format('YYYY-MM-DD')),
        );

        const totalFromForm = objArr.reduce((acc, cur) => {
          if (cur[1]) {
            return +(acc + +cur[1]);
          } else {
            return acc + 0;
          }
        }, 0);

        const hours = round5(
          totalFromForm || totalTimeFromApprovals || timeFromTasksTimesheet,
        );

        return (
          <FormItem
            field={`${item?.id}-${day.format('YYYY-MM-DD')}`}
            initialValue={hours}
            style={{ margin: 0, padding: 0 }}
            defaultValue={hours}
          >
            <InputNumber
              min={0}
              max={24}
              step={0.5}
              precision={2}
              value={hours}
              defaultValue={hours}
              onChange={(value) => setValue(value)}
              className={
                hours > 0
                  ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                  : ''
              }
            />
          </FormItem>
        );
      },
    });
  }
  const handleDeleteCustomTimesheet = async (
    record: QueryTimesheetTrackingCustom,
  ) => {
    try {
      if (!record) {
        return;
      }

      const customName = record.customName;

      const customInput = {
        customName: customName as string,
        daysInput: {
          day: record?.day as number,
          month: record?.month as number,
          year: record?.year as number,
        },
      };

      Modal.confirm({
        title: 'Delete Custom Timesheet',
        content: (
          <div style={{ textAlign: 'center' }}>
            Confirm delete custom timesheet??
          </div>
        ),
        onOk: async () => {
          try {
            const res = await mutateDeleteCustomTimesheetApprovals({
              variables: {
                input: {
                  companyMemberId: getCurrentMember()?.id as string,
                  customInput: [customInput],
                },
              },
            });

            if (!res.errors) {
              refetchCustomTimesheetApprovals();
            }
          } catch (error) {
            console.error(error);
          }
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const customColumns = useMemo(() => {
    const c = [
      {
        title: 'Task',
        dataIndex: 'name',
        width: 200,
        fixed: 'left',
      },
      {
        title: '',
        dataIndex: 'delete',
        width: 50,
        render: (col, record, i) => {
          return (
            <Button
              type="text"
              onClick={() => handleDeleteCustomTimesheet(record)}
              key={i}
              iconOnly
              icon={<MdDelete />}
            />
          );
        },
      },
      {
        title: 'Total hours',
        dataIndex: 'total_hours',
        width: 100,
        fixed: 'left',
        render: (col, record, i) => {
          const thisMonthsTimesheets =
            customTimesheetApprovalsData?.customTimesheetApprovals?.filter(
              (t: QueryTimesheetTrackingCustom) => {
                if (t && t?.month && t?.year && t?.day) {
                  return dayjs(
                    convertYearMonthDayToDateString({
                      month: +t?.month,
                      year: +t?.year,
                      day: +t?.day,
                    }),
                  ).isSame(selected, 'month');
                }
              },
            );

          const obj = Object.entries(form.getFieldsValue());
          const objArr = obj.filter((key) => key[0].includes(record?.id));

          const total = objArr.reduce((acc, cur) => {
            if (cur[1]) {
              return +(acc + +cur[1]);
            } else {
              return acc + 0;
            }
          }, 0);

          const tasksTimesheet = thisMonthsTimesheets
            ?.filter((timesheet) => {
              if (timesheet?.customName === record?.name) {
                return timesheet;
              }
            })
            .filter((timesheet) => timesheet);

          const timeFromTasksTimesheet = round(
            (tasksTimesheet?.reduce((acc, cur) => {
              return acc + (cur?.total || 0);
            }, 0) || 0) /
              60 /
              60,
            2,
          );

          const totalTimeFromApprovals = round(
            (timesheetApprovals.find(
              (timesheet) =>
                timesheet?.task?.id === record?.id &&
                timesheet?.day === selected.get('date') &&
                timesheet?.month === selected.get('month') + 1 &&
                timesheet?.year === selected.get('year'),
            )?.total || 0) /
              60 /
              60,
            2,
          );

          const hours =
            total || totalTimeFromApprovals || timeFromTasksTimesheet;

          return (
            <Form.Item
              defaultValue={hours}
              key={i}
              field={i}
              className="m-0 p-0"
            >
              <InputNumber
                key={i}
                min={0}
                readOnly
                step={0.5}
                precision={2}
                value={hours}
                defaultValue={hours}
                className={
                  hours > 0
                    ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                    : ''
                }
              />
            </Form.Item>
          );
        },
      },
    ] as ColumnProps[];

    for (let i = 1; i <= selected.daysInMonth(); i++) {
      const thisMonthsTimesheets =
        customTimesheetApprovalsData?.customTimesheetApprovals?.filter(
          (t: QueryTimesheetTrackingCustom) => {
            if (t && t?.month && t?.year && t?.day) {
              return dayjs(
                convertYearMonthDayToDateString({
                  month: +t?.month,
                  year: +t?.year,
                  day: +t?.day,
                }),
              ).isSame(selected, 'month');
            }
          },
        );

      const day = selected.clone().date(i);

      c.push({
        title: day.format('ddd D'),
        dataIndex: i.toString(),
        width: 100,
        fixed: i === 0 ? 'left' : undefined,
        render: (col, item) => {
          const obj = Object.entries(form.getFieldsValue());

          const objArr = obj.filter(
            (key) =>
              key[0].includes(item?.id) &&
              key[0].includes(day.format('YYYY-MM-DD')),
          );

          const total = objArr.reduce((acc, cur) => {
            if (cur[1]) {
              return +(acc + +cur[1]);
            } else {
              return acc + 0;
            }
          }, 0);

          const currentDay = day?.date();
          const currentMonth = day?.month() + 1;
          const currentYear = day?.year();

          const currentDayTimesheets = thisMonthsTimesheets?.filter(
            (t) =>
              t?.day === currentDay &&
              t?.month === currentMonth &&
              t?.year === currentYear &&
              t?.customName === item?.name,
          );

          const timeTotal = round(
            (currentDayTimesheets?.reduce((acc, cur) => {
              if (cur?.total) {
                return acc + cur?.total;
              } else {
                return acc;
              }
            }, 0) || 0) /
              60 /
              60,
            2,
          );

          const hours = round(timeTotal || total);

          return (
            <FormItem
              field={`${item?.id}-${day.format('YYYY-MM-DD')}`}
              initialValue={hours}
              style={{ margin: 0, padding: 0 }}
              defaultValue={hours}
            >
              <InputNumber
                min={0}
                max={24}
                step={0.5}
                precision={2}
                value={hours}
                defaultValue={hours}
                onChange={(value) => setValue(value)}
                className={
                  hours > 0
                    ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                    : ''
                }
              />
            </FormItem>
          );
        },
      });
    }

    return c;
  }, [
    customTimesheetApprovals,
    selected,
    value,
    form,
  ]) as ColumnProps<unknown>[];

  const totalColumns = useMemo(() => {
    const col = [
      {
        title: 'Task',
        dataIndex: 'name',
        fixed: 'left',
        width: 200,
        render: (col: string, record, index) => {
          return (
            <div className="truncate" key={index}>
              {record?.name}
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
          return (
            <Form.Item
              key={i}
              shouldUpdate
              className="m-0 p-0"
              children={(getFieldValue) => {
                const obj = Object.entries(getFieldValue) as [string, number][];

                const month = selected.format('MM');
                const year = selected.format('YYYY');
                const arr = obj.filter((key) =>
                  key[0].includes(`${year}-${month}`),
                );

                const total = arr.reduce((acc, cur) => {
                  if (cur[1]) {
                    return +(acc + +cur[1]);
                  } else {
                    return acc + 0;
                  }
                }, 0);

                const hours = round5(total);
                return (
                  <InputNumber
                    min={0}
                    step={0.5}
                    precision={2}
                    value={hours}
                    defaultValue={hours}
                    onChange={(value) => setValue(value)}
                    className={
                      hours > 0
                        ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                        : ''
                    }
                  />
                );
              }}
            />
          );
        },
      },
    ] as ColumnProps[];

    for (let i = 1; i <= selected.daysInMonth(); i++) {
      const d = new Date(selected.year(), selected.month(), i);
      const day = dayjs(d);

      col.push({
        title: day.format('ddd D'),
        dataIndex: i.toString(),
        width: 100,
        fixed: i === 0 ? 'left' : undefined,
        render: (col, item, index) => {
          return (
            <Form.Item
              key={index}
              shouldUpdate
              className="m-0 p-0"
              children={(getFieldValue) => {
                const obj = Object.entries(getFieldValue) as [string, number][];

                const day = selected.date(i).format('DD');
                const month = selected.format('MM');
                const year = selected.format('YYYY');

                const arr = obj.filter((key) =>
                  key[0].includes(`${year}-${month}-${day}`),
                );

                const total = arr.reduce((acc, cur) => {
                  if (cur[1]) {
                    return +(acc + +cur[1]);
                  } else {
                    return acc + 0;
                  }
                }, 0);

                const hours = round5(total);
                return (
                  <InputNumber
                    min={0}
                    max={24}
                    step={0.5}
                    precision={2}
                    readOnly
                    value={hours}
                    defaultValue={hours}
                    onChange={(value) => setValue(value)}
                    className={
                      hours > 0
                        ? '[&>span>.arco-input-inner-wrapper]:bg-green-100 border border-green-500'
                        : ''
                    }
                  />
                );
              }}
            />
          );
        },
      });
    }

    return col;
  }, [
    selected,
    timesheetApprovalsData?.timesheetApprovals,
    customTimesheetApprovalsData?.customTimesheetApprovals,
    form,
    queryData?.projects,
    handleChangeDate,
    setSelected,
  ]);

  const onSubmit = async () => {
    const data = form.getFieldsValue();

    const taskIdsArray = Object.entries(data);

    const customInput = taskIdsArray
      .map((customInput) => {
        if (customInput[0].includes('---custom')) {
          const customName = customInput[0].split('---custom')[0];
          const days = customInput[0].split('---custom')[1];
          const daysArray = days.split('-');

          const year = daysArray[2];
          const month = daysArray[3];
          const day = daysArray[4];
          const timeTotal = +(customInput[1] || 0) * 60 * 60;
          const hasChanged = customTimesheetApprovals.find(
            (timesheet) =>
              timesheet?.task?.id.includes(customName) &&
              timesheet?.day === +day &&
              timesheet?.month === +month &&
              timesheet?.year === +year,
          );
          if (timeTotal > 0 || hasChanged) {
            return {
              customName,
              daysInput: {
                year: parseInt(year),
                month: parseInt(month),
                day: parseInt(day),
                total: timeTotal,
              },
            };
          }
        }
      })
      .filter((customInput) => customInput) as {
      customName: string;
      daysInput: {
        year: number;
        month: number;
        day: number;
        total: number;
      };
    }[];

    const tasksInput = taskIdsArray
      .map((taskInput) => {
        if (!taskInput[0].includes('---custom')) {
          const days = taskInput[0].slice(37);
          const daysArray = days.split('-');
          const year = daysArray[0];
          const month = daysArray[1];
          const day = daysArray[2];
          const taskId = taskInput[0].slice(0, 36);

          const timeTotal = +(taskInput[1] || 0) * 60 * 60;
          const hasChanged = timesheetApprovals.find(
            (timesheet) =>
              timesheet?.task?.id === taskId &&
              timesheet?.day === +day &&
              timesheet?.month === +month &&
              timesheet?.year === +year,
          );
          if (timeTotal > 0 || hasChanged) {
            return {
              taskId,
              daysInput: {
                year: parseInt(year),
                month: parseInt(month),
                day: parseInt(day),
                total: timeTotal,
              },
            };
          }
        }
      })
      .filter((taskInput) => taskInput) as {
      taskId: string;
      daysInput: {
        year: number;
        month: number;
        day: number;
        total: number;
      };
    }[];

    Modal.confirm({
      title: 'Timesheet Tracking',
      content: (
        <div style={{ textAlign: 'center' }}>Submit your timesheets?</div>
      ),
      onOk: async () => {
        if (!isEmpty(tasksInput)) {
          try {
            const res = await mutateCreateTimesheetApprovals({
              variables: {
                input: {
                  companyMemberId: getCurrentMember()?.id as string,
                  tasksInput,
                },
              },
            });

            if (!res.errors) {
              refetchQuery();
              refetchTimesheetData();
              refetchTimesheetApprovals();
            }
          } catch (error) {
            console.error(error);
          }
        }

        if (!isEmpty(customInput)) {
          try {
            const res = await mutateCreateCustomTimesheetApprovals({
              variables: {
                input: {
                  companyMemberId: getCurrentMember()?.id as string,
                  customInput,
                },
              },
            });

            if (!res.errors) {
              refetchQuery();
              refetchTimesheetData();
              refetchTimesheetApprovals();
              refetchCustomTimesheetApprovals();
            }
          } catch (error) {
            console.error(error);
          }
        }
      },
    });
  };

  const handleCreateCustomActivity = async (values: FormValuesModal) => {
    const customName = values?.name;

    const numberOfDays = selected.daysInMonth();
    const month = selected.get('month') + 1;
    const year = selected.get('year');

    const selectedDays = Array.from({ length: numberOfDays }, (_, i) => {
      return {
        year,
        month,
        day: i + 1,
        total: 0,
      };
    });

    const customInput = [];

    for (const selectedDay of selectedDays) {
      customInput.push({ daysInput: selectedDay, customName });
    }

    try {
      const res = await mutateCreateCustomTimesheetApprovals({
        variables: {
          input: {
            companyMemberId: getCurrentMember()?.id as string,
            customInput,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
        refetchTimesheetData();
        refetchTimesheetApprovals();
        refetchCustomTimesheetApprovals();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="overflow-auto px-3 bg-gray-50">
        <h1 className="py-4">Timesheet</h1>

        <TimesheetTrackingNav
          submitTimesheet={onSubmit}
          selected={selected}
          handleChangeDate={handleChangeDate}
        />

        {projects?.map((project) => {
          const tasks = project?.tasks?.reduce((acc, task) => {
            acc.push({
              ...task,
              id: task?.id as string,
              // key: task?.id,
            });

            //Include subtasks
            if (task?.childTasks && task?.childTasks?.length > 0) {
              acc.push(
                ...task.childTasks.map((childTask) => ({
                  ...childTask,
                  id: childTask?.id as string,
                  // key: childTask?.id,
                })),
              );
            }

            return acc;
          }, [] as QueryTask[]);

          return (
            <div key={project?.id}>
              <h2 className="px-3">{project?.name}</h2>
              <Form form={form}>
                <Table
                  className={styles.table}
                  columns={columns}
                  data={tasks}
                  pagination={false}
                  scroll={{
                    x: true,
                  }}
                />
              </Form>
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
              <Form form={form}>
                <Table
                  className={styles.table}
                  columns={customColumns}
                  data={tasks}
                  pagination={false}
                  scroll={{
                    x: true,
                  }}
                />
                {project?.id === 'other-activities' && (
                  <div>
                    <Button
                      size="mini"
                      icon={<IconPlus />}
                      className="mt-2"
                      type="text"
                      onClick={modalState.onOpen}
                    >
                      Add Task
                    </Button>
                  </div>
                )}
              </Form>
            </div>
          );
        })}

        <div key={'total'}>
          <h2 className="px-3">{'Total'}</h2>
          <Form form={form}>
            <Table
              className={styles.table}
              columns={totalColumns}
              data={[{ key: 'total', id: 'total', name: 'Total' }]}
              pagination={false}
              scroll={{
                x: true,
              }}
            />
          </Form>
        </div>
      </div>
      <AddOtherActivityModal
        onSubmit={handleCreateCustomActivity}
        visible={modalState.visible}
        onCancel={modalState.onClose}
        loading={false}
      />
    </>
  );
};

export type FormValuesModal = {
  name: string;
};

type Props = BaseModalConfig & {
  loading: boolean;
  onSubmit: (values: FormValuesModal) => void;
};

const AddOtherActivityModal = (props: Props) => {
  const { visible, onCancel, onSubmit } = props;

  const [form] = Form.useForm<FormValuesModal>();

  const handleSubmit = () => {
    form.validate().then((values) => {
      onSubmit(values);
      form.resetFields();
      onCancel();
    });
  };

  return (
    <ArcoModal
      className="w-full max-w-lg"
      visible={visible}
      onCancel={onCancel}
      title="Add Task"
      onOk={handleSubmit}
      okText="Add Task"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          field="name"
          label={<FormLabel label="Task name" />}
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Add a task name"
            maxLength={TASK_NAME_MAX_LENGTH}
            showWordLimit
          />
        </Form.Item>
      </Form>
    </ArcoModal>
  );
};

const projectsTimesheetTrackingQuery = gql`
  query ProjectsTimesheetTrackingPage($memberId: ID!, $filters: FilterOptions) {
    projects(memberId: $memberId) {
      id
      name
      archived
      tasks(filters: $filters) {
        id
        name
        timeSpent
        timeSpentMember
        childTasks {
          id
          name
          timeSpent
          timeSpentMember
        }
      }
    }
  }
`;

const timesheetsByCompanyMember = gql`
  query TimesheetsByCompanyMember($companyMemberId: ID!) {
    getTimesheetsByCompanyMember(companyMemberId: $companyMemberId) {
      id
      timeTotal
      startDate
      endDate
      activity {
        task {
          id
          name
        }
      }
    }
  }
`;

const timesheetsApprovalByMember = gql`
  query TimesheetApprovalsTimesheetTrackingPage(
    $companyId: ID!
    $memberId: ID
  ) {
    timesheetApprovals(companyId: $companyId, memberId: $memberId) {
      day
      month
      year
      total
      companyMember {
        id
      }
      task {
        id
      }
    }
  }
`;

const customTimesheetsApprovalByMember = gql`
  query CustomTimesheetApprovalsTimesheetTrackingPage(
    $companyId: ID!
    $memberId: ID
  ) {
    customTimesheetApprovals(companyId: $companyId, memberId: $memberId) {
      day
      month
      year
      total
      companyMember {
        id
      }
      customName
    }
  }
`;

const createTimesheetApprovalsMutation = gql`
  mutation CreateTimesheetApprovalsTimesheetTrackingPage(
    $input: CreateTimesheetApprovalsInput!
  ) {
    createTimesheetApprovals(input: $input) {
      companyMember {
        id
        user {
          name
          id
        }
      }
      day
      month
      year
      status
      task {
        id
        name
      }
      total
    }
  }
`;

const createCustomTimesheetApprovalsMutation = gql`
  mutation CreateCustomTimesheetApprovalsTimesheetTrackingPage(
    $input: CreateCustomTimesheetApprovalsInput!
  ) {
    createCustomTimesheetApprovals(input: $input) {
      companyMember {
        id
        user {
          name
          id
        }
      }
      day
      month
      year
      status
      customName
      total
    }
  }
`;

const deleteCustomTimesheetApprovalsMutation = gql`
  mutation DeleteCustomTimesheetApprovalsTimesheetTrackingPage(
    $input: DeleteCustomTimesheetApprovalsInput!
  ) {
    deleteCustomTimesheetApprovals(input: $input) {
      companyMember {
        id
        user {
          name
          id
        }
      }
      day
      month
      year
      status
      customName
    }
  }
`;

export default TimesheetTrackingPage;
