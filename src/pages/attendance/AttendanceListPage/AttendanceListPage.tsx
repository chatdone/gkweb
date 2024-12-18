import { gql, useQuery, useMutation } from '@apollo/client';
import { Card, Typography, Space } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { ReactNode, useContext, useEffect, useState } from 'react';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';

import ApprovalTab from './ApprovalTab';
import styles from './AttendanceListPage.module.less';
import TimeEntries, { timeEntriesFragments } from './TimeEntries';

import { useAppStore } from '@/stores/useAppStore';

import { SocketContext } from 'contexts/socket';

import { getErrorMessage } from '@/utils/error.utils';

import { attendanceDayFragment } from '@/fragments';

import { ArrayElement } from '@/types';

import {
  CompanyMemberType,
  CompanyMemberReferenceImageStatus,
  AttendanceListPageQuery,
  AttendanceListPageQueryVariables,
  CloseAttendanceForUserMutation,
  CloseAttendanceForUserMutationVariables,
} from 'generated/graphql-types';

export type QueryCompanyMember = ArrayElement<
  NonNullable<AttendanceListPageQuery['company']>['members']
>;

const AttendanceListPage = () => {
  const { activeCompany, getCurrentMember } = useAppStore();
  const { socket, addSocketEventHandler } = useContext(SocketContext);

  const currentMember = getCurrentMember();

  const [activeTab, setActiveTab] = useState<string>('timeEntries');
  const [selectedDate, setSelectedDate] = useState<Date>(dayjs().toDate());

  const {
    data: queryData,
    loading: queryLoading,
    refetch: refetchQuery,
  } = useQuery<AttendanceListPageQuery, AttendanceListPageQueryVariables>(
    attendanceListPageQuery,
    {
      variables: {
        companyId: activeCompany?.id as string,
        selectedDate,
        daySummaryInput: {
          day: dayjs(selectedDate).date(),
          month: dayjs(selectedDate).month() + 1,
          year: dayjs(selectedDate).year(),
        },
        weekSummaryInput: {
          week: dayjs(selectedDate).isoWeek(),
          month: dayjs(selectedDate).month() + 1,
          year: dayjs(selectedDate).year(),
        },
        monthSummaryInput: {
          week: getNumberOfWeeksInAMonth(selectedDate),
          month: dayjs(selectedDate).month() + 1,
          year: dayjs(selectedDate).year(),
        },
      },
      skip: !activeCompany?.id,
    },
  );
  const [mutateCloseAttendanceForUser] = useMutation<
    CloseAttendanceForUserMutation,
    CloseAttendanceForUserMutationVariables
  >(closeAttendanceForUserMutation);

  const isAdmin = currentMember?.type === CompanyMemberType.Admin;
  const canClockOutForUsers = currentMember?.type !== CompanyMemberType.Member;

  useEffect(() => {
    if (socket) {
      addSocketEventHandler('attendance:start', () => {
        refetchQuery();
      });
      addSocketEventHandler('attendance:stop', () => {
        refetchQuery();
      });
    }

    return () => {
      if (socket) {
        socket.off('attendance:start');
        socket.off('attendance:stop');
      }
    };
  }, [socket]);

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleChangeSelectedDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCloseAttendanceForUser = async (memberId: string) => {
    try {
      const res = await mutateCloseAttendanceForUser({
        variables: {
          companyMemberId: memberId,
        },
      });

      if (!res.errors) {
        Message.success('The attendance has been successfully closed.', {
          title: 'Success',
        });

        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to close attendance for user',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPendingApproveReferenceImageCompanyMembers = () => {
    const members = queryData?.company?.members || [];

    let pendingMembers = members.filter(
      (member) =>
        member?.referenceImage?.status ===
        CompanyMemberReferenceImageStatus.PendingApproval,
    );

    if (!isAdmin) {
      pendingMembers = pendingMembers.filter(
        (member) => member?.id === currentMember?.id,
      );
    }

    return pendingMembers;
  };

  const tabs: { label: string; value: string }[] = [
    {
      label: 'Time Entries',
      value: 'timeEntries',
    },
    {
      label: `Approval (${
        getPendingApproveReferenceImageCompanyMembers().length
      })`,
      value: 'approval',
    },
  ];

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: `Time`,
          },
          {
            name: `Attendance`,
          },
        ]}
      />

      <Card className={styles.wrapper}>
        <Typography.Paragraph className={styles['card-title']}>
          Attendance
        </Typography.Paragraph>

        <div>
          <Space className={styles.tabs}>
            {tabs.map((tab) => (
              <TabButton
                key={tab.value}
                active={activeTab === tab.value}
                onClick={() => handleChangeTab(tab.value)}
              >
                {tab.label}
              </TabButton>
            ))}
          </Space>
        </div>

        {activeTab === 'timeEntries' && (
          <TimeEntries
            loading={queryLoading}
            selectedDate={selectedDate}
            canClockOutForUsers={canClockOutForUsers}
            company={queryData?.company}
            daySummaries={queryData?.attendanceDaySummaries}
            daySummary={queryData?.attendanceDaySummary}
            weekSummary={queryData?.attendanceWeekSummary}
            monthSummary={queryData?.attendanceMonthSummary}
            onChangeSelectedDate={handleChangeSelectedDate}
            onClockOut={handleCloseAttendanceForUser}
          />
        )}

        {activeTab === 'approval' && (
          <ApprovalTab
            companyMembers={queryData?.company?.members}
            refetchQuery={refetchQuery}
          />
        )}
      </Card>
    </>
  );
};

const TabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) => {
  return (
    <div
      className={`${styles['tab-btn']} ${
        active ? styles['tab-btn-active'] : ''
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const attendanceListPageQuery = gql`
  query AttendanceListPage(
    $companyId: ID!
    $daySummaryInput: AttendanceDaySummaryInput!
    $selectedDate: DateTime!
    $weekSummaryInput: AttendanceWeekSummaryInput!
    $monthSummaryInput: AttendanceMonthSummaryInput!
  ) {
    company(id: $companyId) {
      ...TimeEntriesCompanyFragment
    }
    attendanceDaySummary(companyId: $companyId, input: $daySummaryInput) {
      ...AttendanceDayFragment
    }
    attendanceDaySummaries(selectedDate: $selectedDate, companyId: $companyId) {
      ...TimeEntriesAttendanceDaySummariesFragment
    }
    attendanceWeekSummary(companyId: $companyId, input: $weekSummaryInput) {
      ...TimeEntriesAttendanceWeekSummary
    }
    attendanceMonthSummary(companyId: $companyId, input: $monthSummaryInput) {
      ...TimeEntriesAttendanceMonthSummary
    }
  }
  ${attendanceDayFragment}
  ${timeEntriesFragments.company}
  ${timeEntriesFragments.attendanceDaySummaries}
  ${timeEntriesFragments.attendanceWeekSummary}
  ${timeEntriesFragments.attendanceMonthSummary}
`;

const closeAttendanceForUserMutation = gql`
  mutation CloseAttendanceForUser($companyMemberId: ID!) {
    closeAttendanceForUser(companyMemberId: $companyMemberId) {
      id
    }
  }
`;

const getNumberOfWeeksInAMonth = (selectedDate: Date): number[] => {
  const month = dayjs(selectedDate).get('M');
  const year = dayjs(selectedDate).get('y');
  const monthNumber = `${month + 1 < 10 ? '0' : ''}${month + 1}`;

  const lastDate = dayjs(`${year}-${monthNumber}-01`).endOf('month').date();

  const arr = [];
  for (let i = 1; i <= lastDate; i++) {
    const weekNumber = dayjs(
      `${year}-${monthNumber}-${i < 10 ? '0' : ''}${i}`,
    ).isoWeek();

    arr.push(weekNumber);
  }

  const counts = {};
  arr.forEach(function (x: number) {
    //@ts-ignore
    counts[x] = (counts[x] || 0) + 1;
  });

  const weeks = Object.entries(counts);

  const sortedWeeks = weeks.sort((a, b) => {
    //@ts-ignore
    return b[1] - a[1];
  });

  const weekNumbers = sortedWeeks.map((week) => +week[0]);

  return weekNumbers.sort((a, b) => a - b);
};

export default AttendanceListPage;
