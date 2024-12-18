import dayjs from 'dayjs';
import { get } from 'lodash-es';

import { StageType, Task } from 'generated/graphql-types';

const alphabeticalSort =
  <T>(field: string | ((data: T) => string)) =>
  (dataA: T, dataB: T) => {
    const isStringField = typeof field === 'string';
    const nameA = isStringField ? get(dataA, field) : field(dataA);
    const nameB = isStringField ? get(dataB, field) : field(dataB);

    return !nameA || !nameB ? (nameA ? -1 : 1) : nameA.localeCompare(nameB);
  };

const countSort =
  <T>(field: string | ((data: T) => number)) =>
  (dataA: T, dataB: T) => {
    const isStringField = typeof field === 'string';

    const numberA = isStringField ? get(dataA, field) : field(dataA);
    const numberB = isStringField ? get(dataB, field) : field(dataB);

    return numberA - numberB;
  };

const dateSort =
  <T>(field: string | ((data: T) => string | Date | dayjs.Dayjs)) =>
  (dataA: T, dataB: T) => {
    const isStringField = typeof field === 'string';

    const dateA = isStringField ? get(dataA, field) : field(dataA);
    const dateB = isStringField ? get(dataB, field) : field(dataB);

    const parsedDateA = dayjs(dateA);
    const parsedDateB = dayjs(dateB);

    return parsedDateA.isValid() && parsedDateB.isValid()
      ? parsedDateA.isAfter(parsedDateB)
        ? 1
        : -1
      : parsedDateA.isValid()
      ? -1
      : parsedDateB.isValid()
      ? 1
      : !parsedDateA.isValid()
      ? 1
      : -1;
  };

const taskDueDateSort = (taskA: Task | null, taskB: Task | null) => {
  const dueDateA = taskA?.dueDate;
  const dueDateB = taskB?.dueDate;

  if (!dueDateA) return 1;
  if (!dueDateB) return -1;

  const now = dayjs();
  const parseDueDateA = dayjs(dueDateA);
  const parseDueDateB = dayjs(dueDateB);

  const stageA = taskA.stageStatus;
  const stageB = taskB.stageStatus;

  const isStatusPendingA = stageA === StageType.Pending;
  const isStatusPendingB = stageB === StageType.Pending;

  // Due Today
  const isDueToday_a = now.isSame(parseDueDateA, 'day') && isStatusPendingA;
  const isDueToday_b = now.isSame(parseDueDateB, 'day') && isStatusPendingB;

  if (isDueToday_a && isDueToday_b)
    return parseDueDateA.isAfter(parseDueDateB) ? -1 : 1;
  if (isDueToday_a) return -1;
  if (isDueToday_b) return 1;

  // Overdue
  const isOverdue_a = now.isAfter(parseDueDateA, 'day') && isStatusPendingA;
  const isOverdue_b = now.isAfter(parseDueDateB, 'day') && isStatusPendingB;

  if (isOverdue_a && isOverdue_b)
    return parseDueDateB.isAfter(parseDueDateA) ? 1 : -1;
  if (isOverdue_a) return -1;
  if (isOverdue_b) return 1;

  // Pending
  const isPending_a = now.isBefore(parseDueDateA, 'day') && isStatusPendingA;
  const isPending_b = now.isBefore(parseDueDateB, 'day') && isStatusPendingB;

  if (isPending_a && isPending_b)
    return parseDueDateA.isAfter(parseDueDateB) ? -1 : 1;
  if (isPending_a) return -1;
  if (isPending_b) return 1;

  // Completed
  const isCompleted_a = stageA === StageType.Pass;
  const isCompleted_b = stageB === StageType.Pass;

  if (isCompleted_a && isCompleted_b)
    return parseDueDateB.isAfter(parseDueDateA) ? 1 : -1;
  if (isCompleted_a) return -1;
  if (isCompleted_b) return 1;

  return 1;
};

export { alphabeticalSort, countSort, dateSort, taskDueDateSort };
