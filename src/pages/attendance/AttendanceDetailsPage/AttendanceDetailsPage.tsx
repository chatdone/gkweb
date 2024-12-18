import { gql, useQuery } from '@apollo/client';
import {
  Card,
  Typography,
  Image,
  Descriptions,
  Space,
  Button,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { head } from 'lodash-es';
import { useContext, useEffect, useState } from 'react';
import { MdCheck, MdClose } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { ContentHeader } from '@/components';

import styles from './AttendanceDetailsPage.module.less';
import ClockRecords from './ClockRecords';

import { useAppStore } from '@/stores/useAppStore';

import { SocketContext } from 'contexts/socket';

import { formatToHoursAndMinutes } from '@/utils/date.utils';

import { attendanceDayFragment } from '@/fragments';

import {
  AttendancesDetailsPageQuery,
  AttendancesDetailsPageQueryVariables,
} from 'generated/graphql-types';

type ViewMode = 'daily' | 'weekly' | 'monthly';

const AttendanceDetailsPage = () => {
  const { memberId } = useParams();

  const { activeCompany } = useAppStore();
  const { socket, addSocketEventHandler } = useContext(SocketContext);

  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedDate, setSelectedDate] = useState<Date>(dayjs().toDate());
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    dayjs(selectedDate).startOf('week').toDate(),
    dayjs(selectedDate).endOf('week').toDate(),
  ]);

  const { data: queryData, refetch: refetchQuery } = useQuery<
    AttendancesDetailsPageQuery,
    AttendancesDetailsPageQueryVariables
  >(attendancesDetailsPageQuery, {
    variables: {
      companyMemberId: memberId as string,
      companyId: activeCompany?.id as string,
      input: {
        company_id: activeCompany?.id as string,
        company_member_id: memberId as string,
        from_date: selectedDates[0],
        to_date: selectedDates[1],
      },
      daySummaryInput: {
        companyMemberId: memberId,
        day: dayjs(selectedDate).date(),
        month: dayjs(selectedDate).month() + 1,
        year: dayjs(selectedDate).year(),
      },
      weekSummaryInput: {
        companyMemberId: memberId,
        week: dayjs(selectedDate).isoWeek(),
        month: dayjs(selectedDate).month() + 1,
        year: dayjs(selectedDate).year(),
      },
    },
    skip: !activeCompany?.id || !memberId || selectedDates.length < 2,
  });

  const currentMemberDayAttendance = head(queryData?.attendanceDaySummary);

  const currentMemberWeekAttendance = head(queryData?.attendanceWeekSummary);

  const firstInClockIn = currentMemberDayAttendance?.firstAttendance?.startDate
    ? `${dayjs(
        currentMemberDayAttendance?.firstAttendance?.startDate,
      ).fromNow()}, ${dayjs(
        currentMemberDayAttendance?.firstAttendance?.startDate,
      ).format('hh:mmA')}`
    : '-';

  const lastClockOut = currentMemberDayAttendance?.lastAttendance?.endDate
    ? dayjs(currentMemberDayAttendance?.lastAttendance?.endDate).format(
        'hh:mmA',
      )
    : '-';

  useEffect(() => {
    if (socket) {
      addSocketEventHandler('attendance:start', ({ userId }) => {
        if (userId === queryData?.companyMember?.user?.id) {
          refetchQuery();
        }
      });
      addSocketEventHandler('attendance:stop', ({ userId }) => {
        if (userId === queryData?.companyMember?.user?.id) {
          refetchQuery();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('attendance:start');
        socket.off('attendance:stop');
      }
    };
  }, [socket, queryData?.companyMember]);

  useEffect(() => {
    if (viewMode === 'daily') {
      const fromDate = dayjs(selectedDate).startOf('day').toDate();
      const toDate = dayjs(selectedDate).endOf('day').toDate();

      setSelectedDates([fromDate, toDate]);
    } else if (viewMode === 'weekly') {
      const fromDate = dayjs(selectedDate).startOf('week').toDate();
      const toDate = dayjs(selectedDate).endOf('week').toDate();

      setSelectedDates([fromDate, toDate]);
    } else if (viewMode === 'monthly') {
      const fromDate = dayjs(selectedDate).startOf('month').toDate();
      const toDate = dayjs(selectedDate).endOf('month').toDate();

      setSelectedDates([fromDate, toDate]);
    }
  }, [viewMode, selectedDate]);

  const handleChangeDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleChangeViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const data = [
    {
      label: 'Name',
      value:
        queryData?.companyMember?.user?.name ||
        queryData?.companyMember?.user?.email,
    },
    {
      label: 'First clock in',
      value: firstInClockIn,
    },
    {
      label: 'Last clock out',
      value: lastClockOut,
    },
  ];

  const weeklyData = [
    {
      label: 'Week',
      value: `${dayjs(selectedDate).weekday(0).format('DD MMM')} - ${dayjs(
        selectedDate,
      )
        .weekday(6)
        .format('DD MMM')}`,
    },
    {
      label: 'Worked hours',
      value: `${formatToHoursAndMinutes(
        currentMemberWeekAttendance?.workedTotal || 0,
      )}`,
    },
    {
      label: 'Overtime hours',
      value: `${formatToHoursAndMinutes(
        currentMemberWeekAttendance?.overtimeTotal || 0,
      )}`,
    },
  ];

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Attendance',
            path: '/attendance',
          },

          {
            name: `${
              queryData?.companyMember?.user?.name ||
              queryData?.companyMember?.user?.email ||
              ''
            }`,
          },
          {
            name: `Attendance Details`,
          },
        ]}
      />
      <Card className={styles.content}>
        <Typography.Text className={styles.title}>
          Attendance Detail
        </Typography.Text>

        {/* <VerificationContainer /> */}

        <Space className={styles['descriptions-group']}>
          <Descriptions
            labelStyle={{ paddingRight: 26 }}
            column={1}
            layout="horizontal"
            data={data}
          />

          <Descriptions
            className={styles['description-weekly']}
            labelStyle={{ paddingRight: 26 }}
            column={1}
            layout="horizontal"
            title="Weekly Summary"
            data={weeklyData}
          />
        </Space>
      </Card>

      <ClockRecords
        attendances={queryData?.attendances}
        attendanceDaySummary={queryData?.attendanceDaySummary}
        selectedDate={selectedDate}
        onDateChange={handleChangeDate}
        viewMode={viewMode}
        onChangeViewMode={handleChangeViewMode}
      />
    </>
  );
};

const VerificationContainer = () => {
  const data = [
    {
      label: 'Status',
      value: 'Pending Approval',
    },
  ];

  return (
    <div className={styles['verification-container']}>
      <Space>
        <Image
          width={40}
          src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
          alt="lamp"
        />

        <Descriptions
          colon=" :"
          layout="inline-horizontal"
          title="Verification Photo"
          data={data}
        />
      </Space>

      <Space className={styles['action']}>
        <Button shape="circle" size="small" icon={<MdClose />} />

        <Button
          shape="circle"
          size="small"
          className={styles['theme-button']}
          icon={<MdCheck />}
        />
      </Space>
    </div>
  );
};

// const attendanceWeekDetailsPageQuery = gql`
//   query AttendanceWeeklyDetailsPage(
//     $companyId: ID!
//     $input: AttendanceWeekSummaryInput!
//   ) {
//     attendanceWeekSummary(companyId: $companyId, input: $input) {
//       monday
//       tuesday
//       wednesday
//       thursday
//       friday
//       saturday
//       sunday
//       workedTotal
//       overtimeTotal
//       trackedTotal
//       companyMember {
//         id
//         employeeType {
//           name
//           workDaySettings {
//             timezone
//           }
//         }
//         user {
//           id
//           email
//           name
//           profileImage
//         }
//       }
//     }
//   }
// `;

const attendancesDetailsPageQuery = gql`
  query AttendancesDetailsPage(
    $companyMemberId: ID!
    $input: GetAttendancesInput!
    $companyId: ID!
    $daySummaryInput: AttendanceDaySummaryInput!
    $weekSummaryInput: AttendanceWeekSummaryInput!
  ) {
    companyMember(companyMemberId: $companyMemberId) {
      id
      user {
        id
        name
        email
      }
    }
    attendances(input: $input) {
      id
      startDate
      endDate
      type
      verificationType
      lat
      lng
      imageUrl
      timeTotal
      worked
      overtime
      address
      comments
      commentsOut
      location {
        id
        name
        lat
        lng
        metadata
      }
      label {
        id
        name
        color
      }
      contact {
        id
        name
      }
    }
    attendanceDaySummary(companyId: $companyId, input: $daySummaryInput) {
      ...AttendanceDayFragment
    }
    attendanceWeekSummary(companyId: $companyId, input: $weekSummaryInput) {
      monday
      tuesday
      wednesday
      thursday
      friday
      saturday
      sunday
      workedTotal
      overtimeTotal
      trackedTotal
      companyMember {
        id
        employeeType {
          name
          workDaySettings {
            timezone
          }
        }
        user {
          id
          email
          name
          profileImage
        }
      }
    }
  }
  ${attendanceDayFragment}
`;

export default AttendanceDetailsPage;
