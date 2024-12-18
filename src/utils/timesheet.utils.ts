import { Dayjs } from 'dayjs';

const convertYearMonthDayToDateString = (input: {
  year: number;
  month: number;
  day: number;
}) => {
  const { year, month, day } = input;
  try {
    return `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
  } catch (err) {
    console.error(err);
  }
};

const isSameDateTimesheetApproval = (input: {
  day: number;
  month: number;
  year: number;
  selected: Dayjs;
  i: number;
}) => {
  const { selected, i, day, month, year } = input;
  try {
    return (
      day === i &&
      month === selected?.get('month') + 1 &&
      year === selected?.get('year')
    );
  } catch (err) {
    console.error(err);
  }
};

export { convertYearMonthDayToDateString, isSameDateTimesheetApproval };
