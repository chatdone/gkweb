import MockDate from 'mockdate';
import { describe, test } from 'vitest';

import { isTaskOverdue, getTaskRecurringCronString } from './task.utils';

describe('isTaskOverdue', () => {
  const dueDate = '2022-09-06 12:00';

  describe('isTaskOverdue', () => {
    test('should return true if the task is overdue', () => {
      const isOverdue = isTaskOverdue({
        id: '',
        endDate: dueDate,
      });

      expect(isOverdue).toBe(true);
    });

    test('should return false if the task is not overdue', () => {
      MockDate.set('2022-09-01 12:00');

      const isOverdue = isTaskOverdue({
        id: '',
        endDate: dueDate,
      });

      expect(isOverdue).toBe(false);

      MockDate.reset();
    });
  });
});

describe('getTaskRecurringCronString', () => {
  test('should return daily cron string', () => {
    const cron = getTaskRecurringCronString({
      intervalType: 'DAILY',
    });

    expect(cron).toBe('0 0 * * *');
  });

  test('should return weekday cron string', () => {
    const cron = getTaskRecurringCronString({
      intervalType: 'DAILY',
      skipWeekend: true,
    });

    expect(cron).toBe('0 0 * * 1-5');
  });

  test('should return every first week of the month cron string', () => {
    const cron = getTaskRecurringCronString({
      intervalType: 'FIRST_WEEK',
      day: 2,
    });

    expect(cron).toBe('0 0 * * 2#1');
  });

  test('should return every second week of the month cron string', () => {
    const cron = getTaskRecurringCronString({
      intervalType: 'SECOND_WEEK',
      day: 5,
    });

    expect(cron).toBe('0 0 * * 5#2');
  });

  test('should return every third week of the month cron string', () => {
    const cron = getTaskRecurringCronString({
      intervalType: 'THIRD_WEEK',
      day: 0,
    });

    expect(cron).toBe('0 0 * * 0#3');
  });

  test('should return every fourth week of the month cron string', () => {
    const cron = getTaskRecurringCronString({
      intervalType: 'FOURTH_WEEK',
      day: 6,
    });

    expect(cron).toBe('0 0 * * 6L');
  });

  test('should return monthly cron string', () => {
    const cron = getTaskRecurringCronString({
      intervalType: 'MONTHLY',
      day: 20,
    });

    expect(cron).toBe('0 0 20 * *');
  });

  test('should return yearly cron string', () => {
    const cron = getTaskRecurringCronString({
      intervalType: 'YEARLY',
      day: 15,
      month: 3,
    });

    expect(cron).toBe('0 0 15 3 *');
  });
});
