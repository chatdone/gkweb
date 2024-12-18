import { Space } from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';

import { Avatar } from '@/components';

import { formatToHoursAndMinutes } from '@/utils/date.utils';

import { ArrayElement } from '@/types';

import { AttendanceListPageQuery } from 'generated/graphql-types';

type QueryWeekSummary = ArrayElement<
  NonNullable<AttendanceListPageQuery['attendanceWeekSummary']>
>;

const weeklyColumns = (selectedDate: Date): ColumnProps<QueryWeekSummary>[] => [
  {
    title: 'Member',
    width: 200,
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
          {item?.companyMember?.user?.name || item?.companyMember?.user?.email}
        </Space>
      );
    },
  },
  {
    title: `${dayjs(selectedDate).weekday(1).format('DD')}`,
    render: (col, item) => {
      return (
        <Space>
          {item?.monday ? formatToHoursAndMinutes(item?.monday) : '-'}
        </Space>
      );
    },
  },
  {
    title: `${dayjs(selectedDate).weekday(2).format('DD')}`,
    render: (col, item) => {
      return (
        <Space>
          {item?.tuesday ? formatToHoursAndMinutes(item?.tuesday) : '-'}
        </Space>
      );
    },
  },
  {
    title: `${dayjs(selectedDate).weekday(3).format('DD')}`,
    render: (col, item) => {
      return (
        <Space>
          {item?.wednesday ? formatToHoursAndMinutes(item?.wednesday) : '-'}
        </Space>
      );
    },
  },
  {
    title: `${dayjs(selectedDate).weekday(4).format('DD')}`,
    render: (col, item) => {
      return (
        <Space>
          {item?.thursday ? formatToHoursAndMinutes(item?.thursday) : '-'}
        </Space>
      );
    },
  },
  {
    title: `${dayjs(selectedDate).weekday(5).format('DD')}`,
    render: (col, item) => {
      return (
        <Space>
          {item?.friday ? formatToHoursAndMinutes(item?.friday) : '-'}
        </Space>
      );
    },
  },
  {
    title: `${dayjs(selectedDate).weekday(6).format('DD')}`,
    render: (col, item) => {
      return (
        <Space>
          {item?.saturday ? formatToHoursAndMinutes(item?.saturday) : '-'}
        </Space>
      );
    },
  },
  {
    title: `${dayjs(selectedDate).weekday(7).format('DD')}`,
    render: (col, item) => {
      return (
        <Space>
          {item?.sunday ? formatToHoursAndMinutes(item?.sunday) : '-'}
        </Space>
      );
    },
  },

  {
    title: 'Total Hour',
    render: (col, item) => {
      return (
        <Space>
          {item?.trackedTotal
            ? formatToHoursAndMinutes(item?.trackedTotal)
            : '-'}
        </Space>
      );
    },
  },
];

export default weeklyColumns;
