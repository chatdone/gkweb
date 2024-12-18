import dayjs from 'dayjs';
import { isEqual } from 'lodash-es';

import { SelectOption, TaskRecurringType } from '@/types';

import { Task } from 'generated/graphql-types';

const isTaskOverdue = (task: Task | null | undefined) => {
  return task?.endDate && dayjs().isAfter(dayjs(task.endDate), 'day');
};

const getTaskRecurringCronString = ({
  intervalType,
  month = 1,
  day = 1,
  skipWeekend,
}: {
  intervalType: TaskRecurringType;
  month?: number;
  day?: number;
  skipWeekend?: boolean;
}) => {
  switch (intervalType) {
    case 'DAILY':
      return skipWeekend ? '0 0 * * 1-5' : '0 0 * * *';

    case 'WEEKLY':
      return `0 0 * * ${day}`;

    case 'FIRST_WEEK':
      return `0 0 * * ${day}#1`;

    case 'SECOND_WEEK':
      return `0 0 * * ${day}#2`;

    case 'THIRD_WEEK':
      return `0 0 * * ${day}#3`;

    case 'FOURTH_WEEK':
      return `0 0 * * ${day}L`;

    case 'MONTHLY':
      return `0 0 ${day} * *`;

    case 'YEARLY':
      return `0 0 ${day} ${month} *`;
  }
};

const formatTimeline = (startDate: string | Date, endDate: string | Date) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  let startFormat = 'MMM D, YYYY';
  let endFormat = 'MMM D, YYYY';

  if (start.isSame(end, 'year')) {
    if (start.isSame(end, 'month')) {
      startFormat = 'MMM D';
      endFormat = 'D';
    } else {
      startFormat = 'MMM D';
      endFormat = 'MMM D';
    }
  }

  return `${start.format(startFormat)} - ${end.format(endFormat)}`;
};

const getTaskReminderOptions = (
  task: Task | null | undefined,
): SelectOption[] => {
  if (!task?.startDate) {
    return [];
  }

  const date = dayjs(task.startDate);

  return [
    {
      label: 'At Time of Due Date',
      value: date.toISOString(),
    },
    {
      label: '1 Day Before',
      value: date.subtract(1, 'd').toISOString(),
    },
    {
      label: '2 Days Before',
      value: date.subtract(2, 'd').toISOString(),
    },
  ];
};

const getStatusesUpdate = (
  initialStatuses:
    | ({
        id?: string | null | undefined;
        name?: string | null | undefined;
        color?: string | null | undefined;
        notify?: boolean | null | undefined;
      } | null)[]
    | null
    | undefined,
  updatedStatuses: {
    id?: string;
    name: string;
    color: string;
    notify: boolean;
  }[],
) => {
  const newStatusesToCreate = updatedStatuses.filter((status) => !status.id);

  const statusesToUpdate = updatedStatuses
    .filter((status) => status.id)
    .filter((status) => {
      const foundStatus = initialStatuses?.find(
        (initialStatus) => initialStatus?.id === status.id,
      );

      return !isEqual(
        {
          id: foundStatus?.id,
          name: foundStatus?.name,
          color: foundStatus?.color,
          notify: foundStatus?.notify,
        },
        status,
      );
    });

  const statusesToDelete =
    initialStatuses?.filter(
      (status) =>
        !updatedStatuses.some((updateStatus) => updateStatus.id === status?.id),
    ) || [];

  return { newStatusesToCreate, statusesToUpdate, statusesToDelete };
};

const getVisibilityUpdate = (
  initialVisibility: {
    teamIds: string[];
    memberIds: string[];
  },
  updateVisibility: {
    teamIds: string[];
    memberIds: string[];
  },
) => {
  const teamsToAdd = updateVisibility.teamIds.filter(
    (id) => !initialVisibility.teamIds.includes(id),
  );
  const teamsToRemove = initialVisibility.teamIds.filter(
    (id) => !updateVisibility.teamIds.includes(id),
  );

  const membersToAdd = updateVisibility.memberIds.filter(
    (id) => !initialVisibility.memberIds.includes(id),
  );
  const membersToRemove = initialVisibility.memberIds.filter(
    (id) => !updateVisibility.memberIds.includes(id),
  );

  return {
    add: { teamIds: teamsToAdd, memberIds: membersToAdd },
    remove: { teamIds: teamsToRemove, memberIds: membersToRemove },
  };
};

const generateTaskPosition = (input: {
  position: number;
  nextPosition?: number | null;
  prevPosition?: number | null;
  lastPosition?: number | null;
  listLength: number;
}) => {
  const { position, nextPosition, prevPosition, lastPosition, listLength } =
    input;

  const buffer = 65535;

  if (position === 0) {
    if (listLength === 0) {
      return buffer / 2;
    } else if (nextPosition) {
      return nextPosition / 2;
    }
  } else if (position === listLength && lastPosition) {
    return lastPosition + buffer;
  } else if (nextPosition && prevPosition) {
    return (nextPosition + prevPosition) / 2;
  }

  return 0;
};

export {
  isTaskOverdue,
  getTaskRecurringCronString,
  formatTimeline,
  getTaskReminderOptions,
  getStatusesUpdate,
  getVisibilityUpdate,
  generateTaskPosition,
};
