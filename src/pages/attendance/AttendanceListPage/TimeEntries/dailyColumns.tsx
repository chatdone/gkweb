import { Button, Dropdown, Menu, Space } from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import type { SyntheticEvent } from 'react';
import { MdMoreVert } from 'react-icons/md';

import { Avatar } from '@/components';

import { formatToHoursAndMinutes } from '@/utils/date.utils';
import { alphabeticalSort } from '@/utils/sorter.utils';

import { ArrayElement } from '@/types';

import { AttendanceListPageQuery } from 'generated/graphql-types';

type QueryDaySummary = ArrayElement<
  NonNullable<AttendanceListPageQuery['attendanceDaySummary']>
>;

const dailyColumns = (input?: { onClockOut?: (memberId: string) => void }) => {
  const { onClockOut } = input || {};

  const columns: ColumnProps<QueryDaySummary>[] = [
    {
      title: 'Member',
      width: 250,
      sorter: alphabeticalSort<QueryDaySummary>(
        (item) =>
          (item?.companyMember?.user?.name ||
            item?.companyMember?.user?.email) as string,
      ),
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
    {
      title: 'Employee Type',
      width: 200,
      sorter: alphabeticalSort<QueryDaySummary>(
        (item) => item?.companyMember?.employeeType?.name || '',
      ),
      render: (col, item) => {
        return item?.companyMember?.employeeType?.name || '(No Schedule)';
      },
    },
    {
      title: 'Location',
      render: (col, item) => {
        const locationName = item?.firstAttendance?.location?.name;
        return <Space>{locationName ? locationName : '-'}</Space>;
      },
    },
    {
      title: 'First In',
      render: (col, item) => {
        return item?.firstAttendance?.startDate
          ? dayjs(item.firstAttendance.startDate).format('hh:mm a')
          : '-';
      },
    },
    {
      title: 'Last Out',
      render: (col, item) => {
        return item?.lastAttendance?.endDate
          ? dayjs(item?.lastAttendance?.endDate).format('hh:mm a')
          : '-';
      },
    },
    {
      title: 'Overtime',
      render: (col, item) => {
        return item?.overtime
          ? formatToHoursAndMinutes(item?.overtime || 0)
          : '-';
      },
    },
    {
      title: 'Total Time',
      render: (col, item) => {
        return item?.tracked ? formatToHoursAndMinutes(item.tracked) : '-';
      },
    },
  ];

  if (onClockOut) {
    columns.push({
      title: 'Action',
      width: 75,
      render: (col, item) => {
        const canClockOut = item?.attendances?.some(
          (attendance) => !attendance?.endDate,
        );

        const handleClickMenuItem = (key: string, event: SyntheticEvent) => {
          event.stopPropagation();

          if (key === 'clock-out') {
            item?.companyMember?.id && onClockOut?.(item.companyMember.id);
          }
        };

        return (
          canClockOut && (
            <Dropdown
              position="br"
              droplist={
                <Menu
                  onClick={(e) => e.stopPropagation()}
                  onClickMenuItem={handleClickMenuItem}
                >
                  <Menu.Item
                    key="clock-out"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Clock Out
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="text" icon={<MdMoreVert />} />
            </Dropdown>
          )
        );
      },
    });
  }

  return columns;
};

export default dailyColumns;
