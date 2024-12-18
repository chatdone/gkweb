import { gql } from '@apollo/client';
import {
  Button,
  DatePicker,
  Grid,
  Input,
  Select,
  Space,
  Table,
  Typography,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { head, uniqBy } from 'lodash-es';
import { useMemo, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import FilterDropdown from '@/components/FilterDropdown';

import styles from './TimeEntries.module.less';
import dailyColumns from './dailyColumns';
import monthlyColumns from './monthlyColumns';
import weeklyColumns from './weeklyColumns';

import { useAppStore } from '@/stores/useAppStore';

import { navigateAttendanceDetails } from '@/navigation';

import { ArrayElement, SelectOption } from '@/types';

import { EmployeeType, AttendanceListPageQuery } from 'generated/graphql-types';

type QueryDaySummary = ArrayElement<
  NonNullable<AttendanceListPageQuery['attendanceDaySummary']>
>;

type QueryWeekSummary = ArrayElement<
  NonNullable<AttendanceListPageQuery['attendanceWeekSummary']>
>;

type QueryMonthSummary = ArrayElement<
  NonNullable<AttendanceListPageQuery['attendanceMonthSummary']>
>;

type FilterFormValues = {
  type: 'all' | 'company' | 'personal';
  dealOwnerId: string;
  dealStage: string;
};

type SummaryType = 'daily' | 'weekly' | 'monthly';

const summaryTypeOptions: SelectOption[] = [
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
];

type Props = {
  loading: boolean;
  canClockOutForUsers: boolean;
  selectedDate: Date;
  company: AttendanceListPageQuery['company'];
  daySummary: AttendanceListPageQuery['attendanceDaySummaries'];
  daySummaries: AttendanceListPageQuery['attendanceDaySummaries'];
  weekSummary: AttendanceListPageQuery['attendanceWeekSummary'];
  monthSummary: AttendanceListPageQuery['attendanceMonthSummary'];
  onChangeSelectedDate: (date: Date) => void;
  onClockOut: (memberId: string) => void;
};

const TimeEntries = (props: Props) => {
  const {
    loading,
    selectedDate,
    company,
    daySummaries,
    daySummary,
    weekSummary,
    monthSummary,
    canClockOutForUsers,
    onChangeSelectedDate,
    onClockOut,
  } = props;

  const navigate = useNavigate();

  const { activeCompany } = useAppStore();

  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('all');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('all');
  const [summaryType, setSummaryType] = useState<SummaryType>('daily');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filterValues, setFilterValues] = useState<FilterFormValues>({
    type: 'all',
    dealOwnerId: '',
    dealStage: '',
  });

  const timezone = company?.defaultTimezone || 'Asia/Kuala_Lumpur';

  const handleChangeSchedule = (value: string) => {
    setSelectedScheduleId(value);
  };

  const handleChangeSummaryType = (type: SummaryType) => {
    setSummaryType(type);
  };

  const handleSetSelectedDateToToday = () => {
    onChangeSelectedDate(dayjs().toDate());
  };

  const handleChangeSelectedDate = (date: dayjs.Dayjs) => {
    onChangeSelectedDate(date.toDate());
  };

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleChangeTimezone = (value: string) => {
    setSelectedTimezone(value);
  };

  const handleUpdateFilter = (values: FilterFormValues) => {
    setFilterValues(values);
  };

  const handleClickDaySummaryRow = (summary: QueryDaySummary) => {
    if (!activeCompany?.slug || !summary?.companyMember?.id) {
      return;
    }

    navigateAttendanceDetails(
      navigate,
      activeCompany.slug,
      summary.companyMember.id,
    );
  };

  const handleClickWeekSummaryRow = (summary: QueryWeekSummary) => {
    if (!activeCompany?.slug || !summary?.companyMember?.id) {
      return;
    }

    navigateAttendanceDetails(
      navigate,
      activeCompany.slug,
      summary.companyMember.id,
    );
  };

  const getWorkScheduleOptions = (): SelectOption[] => {
    if (!company?.employeeTypes) {
      return [
        {
          label: `All (0)`,
          value: 'all',
        },
      ];
    }

    const options: SelectOption[] = company.employeeTypes.map((type) => ({
      label: type?.name,
      value: type?.id as string,
    }));

    options.unshift({
      label: `All (${options.length})`,
      value: 'all',
    });

    options.push({
      label: '(No Schedule)',
      value: 'noSchedule',
    });

    return options;
  };

  const getTimezoneOptions = (): SelectOption[] => {
    if (!company?.employeeTypes) {
      return [];
    }

    const options: SelectOption[] = company.employeeTypes.map((type) => {
      const timezone = head(type?.workDaySettings)?.timezone as string;

      return {
        label: timezone.replace('_', ' '),
        value: timezone,
      };
    });

    return [{ label: 'All', value: 'all' }, ...uniqBy(options, 'value')];
  };

  const getIsValidTimezone = (
    memberTimezone: string | null | undefined,
    employeeType: EmployeeType | null | undefined,
  ) => {
    return (
      selectedTimezone === 'all' ||
      memberTimezone === selectedTimezone ||
      (selectedTimezone === company?.defaultTimezone && !employeeType)
    );
  };

  const visibleDaySummary = useMemo<QueryDaySummary[]>(() => {
    if (!company?.members || !daySummary) {
      return [];
    }

    let data: QueryDaySummary[] = [];

    company.members?.forEach((member) => {
      const memberTimezone = head(
        member?.employeeType?.workDaySettings,
      )?.timezone;

      const isValidTimezone = getIsValidTimezone(
        memberTimezone,
        member?.employeeType,
      );

      if (isValidTimezone) {
        const foundSummary = daySummary.find(
          (summary) => summary?.companyMember?.id === member?.id,
        );

        if (!foundSummary) {
          data.push({ companyMember: member });
        } else {
          foundSummary && data.push(foundSummary);
        }
      }
    });

    if (selectedScheduleId === 'noSchedule') {
      data = data.filter((summary) => !summary?.companyMember?.employeeType);
    } else if (selectedScheduleId !== 'all') {
      data = data.filter(
        (summary) =>
          summary?.companyMember?.employeeType?.id === selectedScheduleId,
      );
    }

    if (searchKeyword) {
      const regex = new RegExp(searchKeyword, 'i');

      data = data.filter((summary) => {
        const displayName =
          summary?.companyMember?.user?.name ||
          summary?.companyMember?.user?.email;

        return displayName?.match(regex);
      });
    }

    return data;
  }, [
    daySummary,
    company,
    selectedTimezone,
    selectedScheduleId,
    searchKeyword,
  ]);

  const visibleWeekSummary = useMemo(() => {
    if (!company?.members || !weekSummary) {
      return [];
    }

    let data: QueryWeekSummary[] = [];

    company.members.forEach((member) => {
      const memberTimezone = head(
        member?.employeeType?.workDaySettings,
      )?.timezone;

      const isValidTimezone = getIsValidTimezone(
        memberTimezone,
        member?.employeeType,
      );

      if (isValidTimezone) {
        const foundSummary = weekSummary.find(
          (summary) => summary?.companyMember?.id === member?.id,
        );

        if (!foundSummary) {
          data.push({ companyMember: member });
        } else {
          foundSummary && data.push(foundSummary);
        }
      }
    });

    if (selectedScheduleId === 'noSchedule') {
      data = data.filter((summary) => !summary?.companyMember?.employeeType);
    } else if (selectedScheduleId !== 'all') {
      data = data.filter(
        (summary) =>
          summary?.companyMember?.employeeType?.id === selectedScheduleId,
      );
    }

    if (searchKeyword) {
      const regex = new RegExp(searchKeyword, 'i');

      data = data.filter((summary) => {
        const displayName =
          summary?.companyMember?.user?.name ||
          summary?.companyMember?.user?.email;

        return displayName?.match(regex);
      });
    }

    return data;
  }, [
    weekSummary,
    company,
    selectedTimezone,
    selectedScheduleId,
    searchKeyword,
  ]);

  const visibleMonthSummary = useMemo(() => {
    if (!company?.members || !monthSummary) {
      return [];
    }

    let data: QueryMonthSummary[] = [];

    company.members?.forEach((member) => {
      const memberTimezone = head(
        member?.employeeType?.workDaySettings,
      )?.timezone;

      const isValidTimezone = getIsValidTimezone(
        memberTimezone,
        member?.employeeType,
      );

      if (isValidTimezone) {
        const foundSummary = monthSummary.find(
          (summary) => summary?.companyMember?.id === member?.id,
        );

        if (!foundSummary) {
          data.push({ companyMember: member });
        } else {
          foundSummary && data.push(foundSummary);
        }
      }
    });

    if (selectedScheduleId === 'noSchedule') {
      data = data.filter((summary) => !summary?.companyMember?.employeeType);
    } else if (selectedScheduleId !== 'all') {
      data = data.filter(
        (summary) =>
          summary?.companyMember?.employeeType?.id === selectedScheduleId,
      );
    }

    if (searchKeyword) {
      const regex = new RegExp(searchKeyword, 'i');

      data = data.filter((summary) => {
        const displayName =
          summary?.companyMember?.user?.name ||
          summary?.companyMember?.user?.email;

        return displayName?.match(regex);
      });
    }

    return data;
  }, [
    monthSummary,
    company,
    selectedTimezone,
    selectedScheduleId,
    searchKeyword,
  ]);

  return (
    <Space className={styles.wrapper} direction="vertical" size={20}>
      <Grid.Row justify="space-between">
        <Space>
          <Typography.Text>Schedule:</Typography.Text>

          <Select
            className={styles['schedule-select']}
            showSearch
            loading={loading}
            options={getWorkScheduleOptions()}
            value={selectedScheduleId}
            onChange={handleChangeSchedule}
          />
        </Space>

        <Space>
          <Input
            className={styles['search-input']}
            suffix={<MdSearch />}
            placeholder="Search member"
            value={searchKeyword}
            onChange={handleUpdateSearchKeyword}
          />

          <FilterDropdown
            fields={[]}
            value={filterValues}
            onUpdate={handleUpdateFilter}
          />
        </Space>
      </Grid.Row>

      <Grid.Row justify="space-between">
        <Space>
          <Typography.Text>List By:</Typography.Text>

          <Select
            className={styles['summary-type-select']}
            options={summaryTypeOptions}
            value={summaryType}
            onChange={handleChangeSummaryType}
          />

          {summaryType === 'daily' && (
            <DatePicker
              timezone={timezone}
              format={'DD MMM YYYY'}
              value={selectedDate}
              onChange={(_, date) => handleChangeSelectedDate(date)}
            />
          )}

          {summaryType === 'weekly' && (
            <DatePicker.WeekPicker
              timezone={timezone}
              format={'DD MMM YYYY'}
              dayStartOfWeek={1}
              value={dayjs(selectedDate).weekday(0)}
              onChange={(_, date) => handleChangeSelectedDate(date)}
            />
          )}

          {summaryType === 'monthly' && (
            <DatePicker.MonthPicker
              timezone={timezone}
              format={'MMM YYYY'}
              value={selectedDate}
              onChange={(_, date) => handleChangeSelectedDate(date)}
            />
          )}

          <Button onClick={handleSetSelectedDateToToday}>Today</Button>
        </Space>

        <Space>
          <Typography.Text>Timezone:</Typography.Text>

          <Select
            className={styles['timezone-select']}
            loading={loading}
            options={getTimezoneOptions()}
            value={selectedTimezone}
            onChange={handleChangeTimezone}
          />
        </Space>
      </Grid.Row>

      {summaryType === 'daily' && (
        <Table
          rowKey={(record) => record?.companyMember?.id as string}
          loading={loading}
          columns={dailyColumns({
            onClockOut: canClockOutForUsers ? onClockOut : undefined,
          })}
          data={visibleDaySummary}
          border={false}
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleClickDaySummaryRow(record),
          })}
        />
      )}

      {summaryType === 'weekly' && (
        <Table
          columns={weeklyColumns(selectedDate)}
          data={visibleWeekSummary}
          border={false}
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleClickWeekSummaryRow(record),
          })}
        />
      )}

      {summaryType === 'monthly' && (
        <Table
          className={styles['monthly-table']}
          columns={monthlyColumns(selectedDate, daySummaries)}
          data={visibleMonthSummary}
          border={false}
          pagination={false}
        />
      )}
    </Space>
  );
};

export const timeEntriesFragments = {
  company: gql`
    fragment TimeEntriesCompanyFragment on Company {
      id
      defaultTimezone
      employeeTypes {
        id
        name
        workDaySettings {
          timezone
        }
      }
      members {
        id
        position
        hourlyRate
        user {
          id
          email
          name
          profileImage
        }
        referenceImage {
          status
          imageUrl
        }
        employeeType {
          id
          name
          workDaySettings {
            open
            timezone
          }
        }
      }
    }
  `,
  attendanceDaySummaries: gql`
    fragment TimeEntriesAttendanceDaySummariesFragment on AttendanceDaySummary {
      day
      month
      year
      tracked
      overtime
      firstAttendance {
        startDate
      }
      lastAttendance {
        endDate
      }
      companyMember {
        id
        employeeType {
          id
          name
          workDaySettings {
            open
            timezone
          }
        }
      }
    }
  `,
  attendanceWeekSummary: gql`
    fragment TimeEntriesAttendanceWeekSummary on AttendanceWeekSummary {
      trackedTotal
      monday
      tuesday
      wednesday
      thursday
      friday
      saturday
      sunday
      companyMember {
        id
        employeeType {
          id
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
  `,
  attendanceMonthSummary: gql`
    fragment TimeEntriesAttendanceMonthSummary on AttendanceMonthSummary {
      trackedTotal
      companyMember {
        id
        employeeType {
          id
          name
          workDaySettings {
            open
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
  `,
};

export default TimeEntries;
