import { Button, Radio, Select } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { capitalize, cloneDeep, escapeRegExp } from 'lodash-es';
import { useState, useMemo } from 'react';
import { MdSearch } from 'react-icons/md';

import TaskTimeline, { TaskItem } from '@/components/TaskTimeline';

import AddTaskButtonDropdown from '../AddTaskButtonDropdown';
import SearchFilter from '../SearchFilter';
import { FormValues as SearchTaskFormValues } from '../SearchTaskModal';

import useBreakPoints from '@/hooks/useBreakPoints';
import { useAppStore } from '@/stores/useAppStore';

import { ArrayElement, SelectOption } from '@/types';

import { ProjectPageQuery } from 'generated/graphql-types';

type QueryTask = ArrayElement<
  NonNullable<ProjectPageQuery['project']>['tasks']
>;

type View = 'group' | 'status' | 'member';

type TimeScale = 'day' | 'month' | 'year';

type GroupTable = {
  id: string;
  name: string;
  tasks: TaskItem[];
};

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
  onView: (task: QueryTask) => void;
};

const TimelineView = (props: Props) => {
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
    onView,
  } = props;

  const { isMd } = useBreakPoints();
  const { activeCompany } = useAppStore();

  const [view, setView] = useState<View>('group');
  const [scale, setScale] = useState<TimeScale>('month');

  const handleChangeView = (value: View) => {
    setView(value);
  };

  const handleChangeTimeScale = (value: TimeScale) => {
    setScale(value);
  };

  const handleClearSearch = () => {
    onUpdateSearch(undefined);
  };

  const isSearchEmpty = () => {
    return (
      !searchValues || Object.values(searchValues).every((value) => !value)
    );
  };

  const getVisibleTasks = () => {
    if (!project?.tasks) {
      return [];
    }

    let tasks = cloneDeep(project.tasks).filter(
      (task) => task?.startDate && task.endDate,
    );

    tasks.forEach((task) => {
      if (task?.childTasks) {
        task.childTasks = task.childTasks.filter(
          (task) => !task?.archived && task?.startDate && task.endDate,
        );
      }
    });

    if (searchValues) {
      Object.entries(searchValues).forEach(([key, value]) => {
        if (!value) {
          return;
        }

        if (key === 'name') {
          const regex = new RegExp(escapeRegExp(value as string), 'i');

          tasks = tasks.filter((task) => task?.name?.match(regex));
        } else if (key === 'statusId') {
          tasks = tasks.filter((task) => task?.projectStatus?.id === value);
        } else if (key === 'timeline') {
          const [start, end] = value;

          tasks = tasks.filter(
            (task) =>
              task?.startDate &&
              task.endDate &&
              (dayjs(task.startDate).isBetween(start, end, null, '[]') ||
                dayjs(task.endDate).isBetween(start, end, null, '[]')),
          );
        } else if (key === 'assigneeIds') {
          tasks = tasks.filter((task) =>
            task?.members?.some(
              (member) =>
                member?.companyMember?.id &&
                value.includes(member.companyMember.id),
            ),
          );
        } else if (key === 'watcherIds') {
          tasks = tasks.filter((task) =>
            task?.watchers?.some(
              (watcher) =>
                watcher?.companyMember?.id &&
                value.includes(watcher.companyMember.id),
            ),
          );
        } else if (key === 'priority') {
          const values = value as string[];
          tasks = tasks.filter((task) =>
            values.some((value) => task?.priority?.includes(value)),
          );
        }
      });
    }

    return tasks;
  };

  // const getDefaultGroupTasks = () => {
  //   return getVisibleTasks().filter((task) => !task?.group?.id);
  // };

  const getTasksByGroup = (groupId: string) => {
    return getVisibleTasks().filter((task) => task?.group?.id === groupId);
  };

  const getTasksByStatus = (statusId: string) => {
    return getVisibleTasks().filter(
      (task) => task?.projectStatus?.id === statusId,
    );
  };

  const getTasksByMember = (memberId: string) => {
    return getVisibleTasks().filter((task) =>
      task?.members?.some((member) => member?.companyMember?.id === memberId),
    );
  };

  const visibleData = useMemo<GroupTable[]>(() => {
    let groups: GroupTable[] = [];

    if (view === 'group') {
      groups = (project?.groups || [])?.map((group) => {
        const tasks = getTasksByGroup(group?.id as string);

        return {
          id: group?.id as string,
          name: group?.name as string,
          editable: group?.id !== 'DEFAULT_GROUP',
          tasks: tasks.map((task) => ({
            id: task?.id as string,
            name: task?.name as string,
            startDate: task?.startDate as string,
            endDate: task?.endDate as string,
            color: task?.projectStatus?.color as string,
            actualStartDate: task?.actualStart,
            actualEndDate: task?.actualEnd,
            subtasks: task?.childTasks?.map((subtask) => ({
              id: subtask?.id as string,
              name: subtask?.name as string,
              startDate: subtask?.startDate as string,
              endDate: subtask?.endDate as string,
              color: subtask?.projectStatus?.color as string,
              actualStartDate: subtask?.actualStart,
              actualEndDate: subtask?.actualEnd,
            })),
          })),
        };
      });
    } else if (view === 'status') {
      groups = (project?.projectStatuses || []).map((status) => ({
        id: status?.id as string,
        name: status?.name as string,
        editable: false,
        tasks: getTasksByStatus(status?.id as string).map((task) => ({
          id: task?.id as string,
          name: task?.name as string,
          startDate: task?.startDate as string,
          endDate: task?.endDate as string,
          color: task?.projectStatus?.color as string,
          actualStartDate: task?.actualStart,
          actualEndDate: task?.actualEnd,
          subtasks: task?.childTasks?.map((subtask) => ({
            id: subtask?.id as string,
            name: subtask?.name as string,
            startDate: subtask?.startDate as string,
            endDate: subtask?.endDate as string,
            color: subtask?.projectStatus?.color as string,
            actualStartDate: subtask?.actualStart,
            actualEndDate: subtask?.actualEnd,
          })),
        })),
      }));
    } else if (view === 'member') {
      groups = (activeCompany?.members || []).map((member) => ({
        id: member?.id as string,
        name: (member?.user?.name || member?.user?.email) as string,
        editable: false,
        tasks: getTasksByMember(member?.id as string).map((task) => ({
          id: task?.id as string,
          name: task?.name as string,
          startDate: task?.startDate as string,
          endDate: task?.endDate as string,
          color: task?.projectStatus?.color as string,
          actualStartDate: task?.actualStart,
          actualEndDate: task?.actualEnd,
          subtasks: task?.childTasks?.map((subtask) => ({
            id: subtask?.id as string,
            name: subtask?.name as string,
            startDate: subtask?.startDate as string,
            endDate: subtask?.endDate as string,
            color: subtask?.projectStatus?.color as string,
            actualStartDate: subtask?.actualStart,
            actualEndDate: subtask?.actualEnd,
          })),
        })),
      }));
    }

    groups = groups.filter((group) => group.tasks.length);

    return groups;
  }, [view, project, searchValues]);

  return (
    <>
      <div className="flex h-12 items-center border-b border-gray-300 px-2">
        <AddTaskButtonDropdown
          onAddTask={onAddTask}
          onAddGroup={onAddGroup}
          onImport={onImport}
        />

        <div className="flex-1 pl-2">
          <Select
            className="w-24"
            placeholder="Please select"
            options={[
              {
                label: 'Group',
                value: 'group',
              },
              {
                label: 'Status',
                value: 'status',
              },
              {
                label: 'Member',
                value: 'member',
              },
            ]}
            value={view}
            onChange={handleChangeView}
          />
        </div>

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

      <div className="flex items-center bg-gray-50 px-2 pt-3">
        {isMd && (
          <Radio.Group
            type="button"
            size="small"
            options={timeScaleOptions}
            value={scale}
            onChange={handleChangeTimeScale}
          />
        )}

        {!isMd && (
          <Select
            className="w-24"
            bordered={false}
            options={timeScaleOptions}
            value={scale}
            onChange={handleChangeTimeScale}
          />
        )}
      </div>

      <TaskTimeline
        title={capitalize(view)}
        scale={scale}
        data={visibleData}
        onClickTask={onView}
      />
    </>
  );
};

const timeScaleOptions = [
  {
    label: 'Day',
    value: 'day',
  },
  {
    label: 'Month',
    value: 'month',
  },
  {
    label: 'Year',
    value: 'year',
  },
];

export default TimelineView;
