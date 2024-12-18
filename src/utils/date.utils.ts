import dayjs from 'dayjs';
import humanizeDuration from 'humanize-duration';

const getUTC = (date?: Date | string | dayjs.Dayjs): string | undefined => {
  if (!date) {
    return;
  }
  return dayjs(date).utc().toISOString();
};

const formatToHoursAndMinutes = (
  seconds: number,
  format?: (hours: number, minutes: number) => string,
) => {
  const duration = dayjs.duration(seconds, 'seconds');

  const totalHours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  const hoursString = totalHours.toString().padStart(2, '0');
  const minutesString = minutes.toString().padStart(2, '0');

  return format?.(totalHours, minutes) || `${hoursString}h ${minutesString}m`;
};

const minutesToHoursAndMinutes = (totalMinutes: number): string => {
  const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: 'shortEn',
    delimiter: '',
    spacer: '',
    round: true,
    languages: {
      shortEn: {
        y: () => 'y',
        mo: () => 'mo',
        w: () => 'w',
        d: () => 'd',
        h: () => 'h',
        m: () => 'm',
        s: () => 's',
      },
    },
  });

  const hoursAndMinutes = shortEnglishHumanizer(totalMinutes * 60000);

  if (totalMinutes < 0) {
    return `-${hoursAndMinutes}`;
  }

  return `${hoursAndMinutes}`;
};

export { getUTC, formatToHoursAndMinutes, minutesToHoursAndMinutes };
