import { Button } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { flatten } from 'lodash-es';
import { Event, EventPropGetter } from 'react-big-calendar';
import { MdSearch } from 'react-icons/md';

import TaskCalendar from '@/components/TaskCalendar';

import SearchFilter from '../ProjectPage/SearchFilter';
import { FormValues as SearchTaskFormValues } from '../ProjectPage/SearchTaskModal';

import { ArrayElement, SelectOption } from '@/types';

import { WorkspacePageQuery } from 'generated/graphql-types';

type QueryProject = ArrayElement<
  NonNullable<WorkspacePageQuery['workspace']>['projects']
>;

type QueryProjectGroup = ArrayElement<NonNullable<QueryProject>['groups']>;

type QueryTask = ArrayElement<NonNullable<QueryProjectGroup>['tasks']>;

type QueryTaskChildTask = ArrayElement<NonNullable<QueryTask>['childTasks']>;

interface TaskEvent extends Event {
  taskId: string;
  color: string;
  task: QueryTask;
}

type Props = {
  workspace: WorkspacePageQuery['workspace'];
  searchValues: SearchTaskFormValues | undefined;
  companyMemberOptions: SelectOption[];
  onSearch: () => void;
  onUpdateSearch: (values: SearchTaskFormValues | undefined) => void;
  onViewTask: (task: QueryTask) => void;
};

const CalendarView = (props: Props) => {
  const {
    workspace,
    searchValues,
    companyMemberOptions,
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
    if (!workspace?.projects) {
      return [];
    }

    const allProjectGroups = flatten(
      workspace.projects
        .filter((project) => !project?.archived)
        .map((project) => project?.groups || []),
    );
    const allParentTasks = flatten(
      allProjectGroups.map((group) => group?.tasks || []),
    );

    const allTasks = allParentTasks.reduce<(QueryTask | QueryTaskChildTask)[]>(
      (prev, task) => [...prev, task, ...(task?.childTasks || [])],
      [],
    );

    return allTasks.map((task) => ({
      title: task?.name as string,
      taskId: task?.id as string,
      color: task?.projectStatus?.color as string,
      start: dayjs(task?.startDate).toDate(),
      end: dayjs(task?.endDate).toDate(),
      task,
    }));
  };

  return (
    <>
      <div className="flex h-12 items-center justify-end border-b border-gray-300 px-2">
        <Button icon={<MdSearch />} onClick={onSearch} />
      </div>

      {!isSearchEmpty() && (
        <div className="bg-gray-50 p-3">
          <SearchFilter
            values={searchValues}
            companyMemberOptions={companyMemberOptions}
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
