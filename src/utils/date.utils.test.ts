import { describe, test } from 'vitest';

import { formatToHoursAndMinutes, getUTC } from './date.utils';

describe('formatToHoursAndMinutes', () => {
  test('should format the total seconds in total hours and minutes format', () => {
    const result = formatToHoursAndMinutes(5400);

    expect(result).toBe('01h 30m');
  });

  test('able to custom format the value from generated hours and minutes with function', () => {
    const result = formatToHoursAndMinutes(
      5400,
      (hours, minutes) => `${hours}:${minutes}`,
    );

    expect(result).toBe('1:30');
  });
});

describe('getUTC', () => {
  test('should return UTC date time in ISO format', () => {
    const utc = getUTC(new Date('2022-09-16 12:45 +8'));

    expect(utc).toBe('2022-09-16T04:45:00.000Z');
  });
});
