import { Button } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { escapeRegExp } from 'lodash-es';
import { Event, EventPropGetter } from 'react-big-calendar';
import { MdSearch } from 'react-icons/md';

import TaskCalendar from '@/components/TaskCalendar';

import AddTaskButtonDropdown from '../AddTaskButtonDropdown';
import SearchFilter from '../SearchFilter';
import { FormValues as SearchTaskFormValues } from '../SearchTaskModal';

import { ArrayElement, SelectOption } from '@/types';

import { ProjectPageQuery } from 'generated/graphql-types';

type QueryTask = ArrayElement<
  NonNullable<ProjectPageQuery['project']>['tasks']
>;

type QueryTaskChildTask = ArrayElement<NonNullable<QueryTask>['childTasks']>;

interface TaskEvent extends Event {
  taskId: string;
  color: string;
  task: QueryTask;
}

type Props = {
  project: ProjectPageQuery['project'];
  searchValues: SearchTaskFormValues | undefined;
  companyMemberOptions: SelectOption[];
  statusOptions: SelectOption[];
  onAddTask: () => void;
  onAddGroup: () => void;
  onImport: () => void;
  onSearch: () => void;
  onUpdateSearch: (values: SearchTaskFormValues | undefined) => void;
  onViewTask: (task: QueryTask) => void;
};

const CalendarView = (props: Props) => {
  const {
    project,
    searchValues,
    companyMemberOptions,
    statusOptions,
    onAddTask,
    onAddGroup,
    onImport,
    onSearch,
    onUpdateSearch,
    onViewTask,
  } = props;

  const handleClearSearch = () => {
    onUpdateSearch(undefined);
  };

  const isSearchEmpty = () => {
    return (
      !searchValues || Object.values(searchValues).every((value) => !value)
    );
  };

  const eventPropGetter: EventPropGetter<TaskEvent> = (event) => {
    return {
      className: event.color,
    };
  };

  const getEvents = (): TaskEvent[] => {
    if (!project?.tasks) {
      return [];
    }

    let allTasks = project.tasks
      .reduce<(QueryTask | QueryTaskChildTask)[]>((prev, task) => {
        return [...prev, task, ...(task?.childTasks || [])];
      }, [])
      .filter((task) => !task?.archived);

    if (searchValues) {
      Object.entries(searchValues).forEach(([key, value]) => {
        if (!value) {
          return;
        }

        if (key === 'name') {
          const regex = new RegExp(escapeRegExp(value as string), 'i');

          allTasks = allTasks.filter((task) => task?.name?.match(regex));
        } else if (key === 'statusId') {
          allTasks = allTasks.filter(
            (task) => task?.projectStatus?.id === value,
          );
        } else if (key === 'timeline') {
          const [start, end] = value;

          allTasks = allTasks.filter(
            (task) =>
              task?.startDate &&
              task.endDate &&
              (dayjs(task.startDate).isBetween(start, end, null, '[]') ||
                dayjs(task.endDate).isBetween(start, end, null, '[]')),
          );
        } else if (key === 'assigneeIds') {
          allTasks = allTasks.filter((task) =>
            task?.members?.some(
              (member) =>
                member?.companyMember?.id &&
                value.includes(member.companyMember.id),
            ),
          );
        }
      });
    }

    const tasks: TaskEvent[] = allTasks.map((task) => ({
      title: task?.name as string,
      taskId: task?.id as string,
      color: task?.projectStatus?.color as string,
      start: dayjs(task?.startDate).toDate(),
      end: dayjs(task?.endDate).toDate(),
      task,
    }));

    return tasks;
  };

  return (
    <>
      <div className="flex h-12 items-center justify-between border-b border-gray-300 px-2">
        <AddTaskButtonDropdown
          onAddTask={onAddTask}
          onAddGroup={onAddGroup}
          onImport={onImport}
        />

        <Button icon={<MdSearch />} onClick={onSearch} />
      </div>

      {!isSearchEmpty() && (
        <div className="bg-gray-50 p-3">
          <SearchFilter
            values={searchValues}
            companyMemberOptions={companyMemberOptions}
            statusOptions={statusOptions}
            onClear={handleClearSearch}
            onUpdate={onUpdateSearch}
          />
        </div>
      )}

      <TaskCalendar
        events={getEvents()}
        eventPropGetter={eventPropGetter}
        onSelectEvent={(event) => onViewTask(event.task)}
      />
    </>
  );
};

export default CalendarView;
