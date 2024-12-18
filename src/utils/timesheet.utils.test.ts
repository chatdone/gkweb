import MockDate from 'mockdate';
import { describe, test } from 'vitest';

import { isTaskOverdue } from './task.utils';
import { convertYearMonthDayToDateString } from './timesheet.utils';

describe('convertYearMonthDayToDateString', () => {
  test('it should return the correct date', () => {
    const testObj = {
      year: 2021,
      month: 9,
      day: 6,
    };

    const result = convertYearMonthDayToDateString(testObj);

    expect(result).toBe('2021-09-06');
  });
});

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
