import { Attendance, AttendanceType } from 'generated/graphql-types';

type AttendanceTimeSummary = {
  worked: number;
  breaks: number;
  overtime: number;
  tracked: number;
};

const getAttendancesSummary = (
  attendances: Attendance[],
): AttendanceTimeSummary => {
  const initialValue: AttendanceTimeSummary = {
    worked: 0,
    breaks: 0,
    overtime: 0,
    tracked: 0,
  };

  return attendances.reduce((prev, attendance) => {
    if (attendance?.type === AttendanceType.Break) {
      prev.breaks += attendance?.timeTotal || 0;
    } else if (attendance?.type === AttendanceType.Clock) {
      prev.worked += attendance?.worked || 0;
      prev.overtime += attendance?.overtime || 0;
    }

    return prev;
  }, initialValue);
};

export { getAttendancesSummary };
