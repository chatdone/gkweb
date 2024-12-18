import { gql, useQuery } from '@apollo/client';
import {
  Card,
  Typography,
  Grid,
  Space,
  DatePicker,
} from '@arco-design/web-react';
import { Chart, Axis, Interval, Legend } from 'bizcharts';
import dayjs from 'dayjs';
import { groupBy } from 'lodash-es';
import { useEffect, useState } from 'react';

import { ChartTooltip } from '@/components';

import styles from './AttendanceCard.module.less';

import { useAppStore } from '@/stores/useAppStore';
import { useResponsiveStore } from '@/stores/useResponsiveStores';

import { getAttendancesSummary } from '@/utils/attendance.utils';
import { formatToHoursAndMinutes, getUTC } from '@/utils/date.utils';

import {
  Attendance,
  AttendanceCardQuery,
  AttendanceCardQueryVariables,
} from 'generated/graphql-types';

type ChartData = {
  name: 'Worked' | 'Breaks' | 'Overtime';
  time: string;
  value: number;
};

type View = 'company' | 'member';

type Props = {
  view: View;
};

const AttendanceCard = (props: Props) => {
  const { view } = props;

  const { activeCompany, getCurrentMember } = useAppStore();
  const { isMobile } = useResponsiveStore();

  const currentCompanyMember = getCurrentMember();

  const [filterDateRange, setFilterDateRange] = useState<dayjs.Dayjs[]>([
    dayjs().startOf('week'),
    dayjs().endOf('week'),
  ]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // TODO: camel case
  const { data: queryData } = useQuery<
    AttendanceCardQuery,
    AttendanceCardQueryVariables
  >(attendanceCardQuery, {
    variables: {
      input: {
        company_id: activeCompany?.id as string,
        from_date: getUTC(filterDateRange[0].startOf('day')),
        to_date: getUTC(filterDateRange[1].endOf('day')),
        company_member_id:
          view === 'member' ? currentCompanyMember?.id : undefined,
      },
    },
    skip: !activeCompany?.id,
  });

  useEffect(() => {
    if (queryData?.attendances) {
      const groupedAttendance = groupBy(queryData.attendances, (attendance) =>
        dayjs(attendance?.startDate).format('YYYY-MM-DD'),
      );

      const newChartData: ChartData[] = [];

      Object.entries(groupedAttendance).forEach(([key, value]) => {
        const { worked, breaks, overtime } = getAttendancesSummary(
          value as Attendance[],
        );

        newChartData.push({
          name: 'Worked',
          time: key,
          value: worked / (60 * 60),
        });

        newChartData.push({
          name: 'Breaks',
          time: key,
          value: breaks / (60 * 60),
        });

        newChartData.push({
          name: 'Overtime',
          time: key,
          value: overtime / (60 * 60),
        });
      });

      setChartData(newChartData);
    } else {
      setChartData([]);
    }
  }, [queryData]);

  const handleUpdateFilterDateRange = (date: dayjs.Dayjs[]) => {
    setFilterDateRange(date);
  };

  return (
    <Card className={styles.wrapper}>
      <Space direction="vertical" size={20}>
        <Grid.Row justify="space-between">
          <Typography.Text className={styles.title}>
            Time Attendance
          </Typography.Text>

          {!isMobile && (
            <DatePicker.RangePicker
              allowClear={false}
              value={filterDateRange}
              onChange={(_, date) => handleUpdateFilterDateRange(date)}
            />
          )}
        </Grid.Row>

        <Chart
          height={300}
          autoFit
          padding="auto"
          scale={{ type: 'time', value: { min: 0 } }}
          data={chartData}
        >
          <Interval
            adjust="stack"
            color={['name', ['#81E2FF', '#00B2FF', '#246EFF']]}
            position="time*value"
            size={26}
            style={{
              radius: [2, 2, 0, 0],
            }}
          />

          <Axis name="value" />

          <ChartTooltip
            config={{ shared: true }}
            formatter={(value) => {
              return formatToHoursAndMinutes(+value * 60 * 60);
            }}
          />

          <Legend name="name" marker={{ symbol: 'circle' }} />
        </Chart>
      </Space>
    </Card>
  );
};

const attendanceCardQuery = gql`
  query AttendanceCard($input: GetAttendancesInput!) {
    attendances(input: $input) {
      id
      type
      startDate
      endDate
      timeTotal
      worked
      overtime
    }
  }
`;

export default AttendanceCard;
