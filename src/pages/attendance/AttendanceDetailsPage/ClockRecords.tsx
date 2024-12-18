import {
  Card,
  Typography,
  Space,
  DatePicker,
  Button,
  Select,
  Table,
  Link,
} from '@arco-design/web-react';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { last, head } from 'lodash-es';
import { MdLocationOn } from 'react-icons/md';

import { CompanyTag, Avatar } from '@/components';

import styles from './ClockRecords.module.less';

import { GoogleService } from '@/services';

import { formatToHoursAndMinutes } from '@/utils/date.utils';

import { ArrayElement } from '@/types';

import {
  AttendanceType,
  AttendancesDetailsPageQuery,
} from 'generated/graphql-types';

type QueryAttendance = ArrayElement<AttendancesDetailsPageQuery['attendances']>;

type QueryLocation = NonNullable<QueryAttendance>['location'];

type ViewMode = 'daily' | 'weekly' | 'monthly';

type Props = {
  attendances: AttendancesDetailsPageQuery['attendances'];
  attendanceDaySummary: AttendancesDetailsPageQuery['attendanceDaySummary'];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
};

const ClockRecords = (props: Props) => {
  const {
    attendances,
    attendanceDaySummary,
    selectedDate,
    onDateChange,
    viewMode,
    onChangeViewMode,
  } = props;

  const dayAttendance = head(attendanceDaySummary);
  const lastAttendance = last(attendances);

  const workedTotal =
    attendances?.reduce((curr, total) => (curr += total?.worked || 0), 0) || 0;

  const timezone = 'Asia/Kuala_Lumpur';

  const handleViewLocation = (location: QueryLocation) => {
    if (!location?.name || !location.lat || !location.lng) {
      return;
    }

    const parsedMetaData = location.metadata
      ? JSON.parse(location.metadata)
      : undefined;

    GoogleService.openGoogleMap({
      name: location.name,
      lat: location.lat,
      lng: location.lng,
      placeId: parsedMetaData?.googlePlaceId,
    });
  };

  const columns: ColumnProps<QueryAttendance>[] = [
    {
      title: 'Time',
      render: (col, item) => {
        const time = dayjs(lastAttendance?.startDate).isSame(item?.startDate)
          ? dayjs(item?.endDate).format('hh:mma')
          : dayjs(item?.startDate).format('hh:mma');

        return (
          <Space>
            <Avatar
              size={30}
              name={
                dayAttendance?.companyMember?.user?.name ||
                dayAttendance?.companyMember?.user?.email
              }
            />

            {time.includes('Invalid') ? 'In Progress' : time}
          </Space>
        );
      },
    },
    {
      title: 'Clock',
      render: (col, item) => {
        const inOrOut =
          dayjs(lastAttendance?.startDate).isSame(item?.startDate) &&
          lastAttendance?.endDate
            ? 'Out'
            : 'In';

        return (
          <Typography.Text>
            {item?.type === AttendanceType.Clock ? inOrOut : 'Break'}
          </Typography.Text>
        );
      },
    },
    {
      title: 'Activity',
      render: (col, item) => {
        return item?.label ? (
          <CompanyTag color={item.label.color || 'grey'} bordered>
            {item?.label?.name}
          </CompanyTag>
        ) : (
          '-'
        );
      },
    },
    {
      title: 'Location',
      render: (col, item) => {
        return item?.location ? (
          <Link
            icon={<MdLocationOn />}
            onClick={() => handleViewLocation(item.location)}
          >
            {item?.location?.name}
          </Link>
        ) : (
          '-'
        );
      },
    },
    {
      title: 'Contact',
      render: (col, item) => {
        return item?.contact?.name || '-';
      },
    },
    {
      title: 'Notes',
      render: (col, item) => {
        return item?.comments ? (
          <Typography.Text>{item.comments}</Typography.Text>
        ) : (
          '-'
        );
      },
    },
    {
      title: 'Total Time',
      render: (col, item) => {
        return item?.timeTotal ? (
          <Typography.Text>
            {formatToHoursAndMinutes(item.timeTotal)}
          </Typography.Text>
        ) : (
          '-'
        );
      },
    },
  ];

  return (
    <Card className={styles.wrapper}>
      <Typography.Paragraph className={styles.title}>
        Clock Records
      </Typography.Paragraph>

      <Space>
        <Space>
          <Typography.Text>List By:</Typography.Text>

          <Select
            className={styles['view-mode-select']}
            options={[
              {
                label: 'Daily',
                value: 'daily',
              },
              {
                label: 'Weekly',
                value: 'weekly',
              },
              {
                label: 'Monthly',
                value: 'monthly',
              },
            ]}
            value={viewMode}
            onChange={onChangeViewMode}
            triggerProps={{
              autoAlignPopupMinWidth: false,
              autoAlignPopupWidth: false,
            }}
          />
        </Space>

        {viewMode === 'daily' && (
          <DatePicker
            timezone={timezone}
            format={'DD MMM YYYY'}
            allowClear={false}
            value={selectedDate}
            onChange={(value, date) => onDateChange(date.toDate())}
          />
        )}

        {viewMode === 'weekly' && (
          <DatePicker.WeekPicker
            timezone={timezone}
            format={'DD MMM YYYY'}
            allowClear={false}
            dayStartOfWeek={1}
            value={dayjs(selectedDate).startOf('week')}
            onChange={(value, date) => onDateChange(date.toDate())}
          />
        )}

        {viewMode === 'monthly' && (
          <DatePicker.MonthPicker
            timezone={timezone}
            format={'MMM YYYY'}
            allowClear={false}
            value={dayjs(selectedDate).startOf('month')}
            onChange={(value, date) => onDateChange(date.toDate())}
          />
        )}

        <Button onClick={() => onDateChange(dayjs().toDate())}>Today</Button>
      </Space>

      <Table
        className={styles.table}
        columns={columns}
        data={attendances || []}
        border={false}
        pagination={false}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={4}>Total</Table.Summary.Cell>
              <Table.Summary.Cell>Worked hours</Table.Summary.Cell>
              <Table.Summary.Cell>
                {formatToHoursAndMinutes(workedTotal)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
};

export default ClockRecords;
