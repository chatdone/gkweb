import { Space, Tooltip } from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { head, range } from 'lodash-es';

import { Avatar } from '@/components';

import styles from './TimeEntries.module.less';

import { formatToHoursAndMinutes } from '@/utils/date.utils';

import { ArrayElement } from '@/types';

import { AttendanceListPageQuery } from 'generated/graphql-types';

type QueryMonthSummary = ArrayElement<
  NonNullable<AttendanceListPageQuery['attendanceMonthSummary']>
>;

type QueryDaySummary = ArrayElement<
  NonNullable<AttendanceListPageQuery['attendanceDaySummaries']>
>;

const monthlyColumns = (
  selectedDate: Date,
  daySummaries: AttendanceListPageQuery['attendanceDaySummaries'],
): ColumnProps<QueryMonthSummary>[] => {
  const startDate = dayjs(selectedDate).startOf('month');
  const endDate = dayjs(selectedDate).endOf('month');

  const dateColumns: ColumnProps<QueryMonthSummary>[] = range(
    startDate.date(),
    endDate.date() + 1,
  ).map((date) => {
    const parsedDate = dayjs(selectedDate).date(date);

    return {
      title: `${parsedDate.format('D')}`,
      width: 20,
      align: 'center',
      render: (col, item) => {
        const day = parsedDate.date();
        const month = parsedDate.month() + 1;
        const year = parsedDate.year();

        const summary = daySummaries?.find(
          (summary) =>
            summary?.companyMember?.id === item?.companyMember?.id &&
            summary?.day === day &&
            summary.month === month &&
            summary.year === year,
        );

        const isClockedIn = summary?.tracked && summary.tracked > 0;

        return (
          <MonthlyTableSquare
            item={summary}
            type={isClockedIn ? 'active' : 'rest'}
          />
        );
      },
    };
  });

  return [
    {
      title: 'Member',
      width: 120,
      render: (col, item) => {
        return (
          <Space>
            <Avatar
              size={30}
              name={
                item?.companyMember?.user?.name ||
                item?.companyMember?.user?.email
              }
              imageSrc={item?.companyMember?.user?.profileImage}
            />

            {item?.companyMember?.user?.name ||
              item?.companyMember?.user?.email}
          </Space>
        );
      },
    },
    ...dateColumns,
    {
      title: 'Total Time',
      width: 100,
      align: 'center',
      render: (col, item) => {
        if (!item?.trackedTotal) {
          return '-';
        }
        return <Space>{formatToHoursAndMinutes(item?.trackedTotal)}</Space>;
      },
    },
  ];
};

const MonthlyTableSquare = ({
  type: propType,
  item,
}: {
  type: 'overtime' | 'active' | 'rest';
  item?: QueryDaySummary;
}) => {
  const type = item?.overtime && item.overtime > 0 ? 'overtime' : propType;

  const timezone =
    head(item?.companyMember?.employeeType?.workDaySettings)?.timezone ||
    'Asia/Kuala_Lumpur';

  return (
    <Tooltip
      content={
        <div className={styles['tooltip-month-square']}>
          <div>
            {dayjs(item?.lastAttendance?.endDate)
              .tz(timezone)
              .format('DD MMM, dddd')}
          </div>
          <div>
            Total Time:{' '}
            {item?.tracked ? formatToHoursAndMinutes(item?.tracked || 0) : '-'}
          </div>
          <div>
            First In:{' '}
            {item?.firstAttendance?.startDate
              ? dayjs(item?.firstAttendance?.startDate)
                  .tz(timezone)
                  .format('hh:mm a')
              : '-'}
          </div>
          <div>
            Last Out:{' '}
            {item?.lastAttendance?.endDate
              ? dayjs(item?.lastAttendance?.endDate)
                  .tz(timezone)
                  .format('hh:mm a')
              : '-'}
          </div>
          <div>
            Overtime:{' '}
            {item?.overtime
              ? formatToHoursAndMinutes(item?.overtime || 0)
              : '-'}
          </div>
        </div>
      }
    >
      <div
        className={
          styles[`monthly-table-square${type !== 'active' ? `-${type}` : ''}`]
        }
      />
    </Tooltip>
  );
};

export default monthlyColumns;
