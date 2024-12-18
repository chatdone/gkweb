import { Button, Select } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { escapeRegExp } from 'lodash-es';
import { useMemo, useState } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { KanbanBoard } from '@/components';
import type {
  Column,
  CardPositionChangePayload,
} from '@/components/KanbanBoard';
import Modal from '@/components/Modal';

import AddTaskButtonDropdown from '../AddTaskButtonDropdown';
import SearchFilter from '../SearchFilter';
import { FormValues as SearchTaskFormValues } from '../SearchTaskModal';
import { View } from '../TableView/TableView';
import styles from './KanbanView.module.less';
import TaskCard from './TaskCard';

import { useAppStore } from '@/stores/useAppStore';

import { countSort } from '@/utils/sorter.utils';
import { generateTaskPosition } from '@/utils/task.utils';

import { navigateCompanySubscriptionsPage } from '@/navigation';

import { ArrayElement, SelectOption } from '@/types';

import { CompanyMemberType, ProjectPageQuery } from 'generated/graphql-types';

type QueryTask = ArrayElement<
  NonNullable<ProjectPageQuery['project']>['tasks']
>;

type QueryTaskChildTask = ArrayElement<NonNullable<QueryTask>['childTasks']>;

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
  onChangeTaskPosition: (input: {
    task: QueryTask | QueryTaskChildTask;
    position: number;
    projectStatusId?: string;
    member?: { prevMemberId: string; newMemberId: string };
  }) => void;
};

const KanbanView = (props: Props) => {
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
    onChangeTaskPosition,
  } = props;

  const navigate = useNavigate();

  const { activeCompany, getCurrentMember } = useAppStore();

  const [view, setView] = useState<View>('status');

  const handleClearSearch = () => {
    onUpdateSearch(undefined);
  };

  const handleDragEnd = () => {
    if (
      activeCompany?.currentSubscription?.stripeSubscriptionId ||
      activeCompany?.currentSubscription?.package?.isCustom
    ) {
      return;
    }

    const currentMember = getCurrentMember();

    Modal.info({
      title: 'Reached Plan Limit',
      content:
        currentMember?.type === CompanyMemberType.Admin
          ? 'Kanban View is only available to SME plan and above.'
          : 'Kanban View is only available to SME plan and above, please contact your admin or company owner.',
      okText:
        currentMember?.type === CompanyMemberType.Admin
          ? 'Upgrade Plan'
          : undefined,
      onConfirm: () => {
        activeCompany?.slug &&
          navigateCompanySubscriptionsPage({
            navigate,
            companySlug: activeCompany.slug,
          });
      },
    });
  };

  const handleCardPositionChange = (
    payload: CardPositionChangePayload<QueryTask>,
  ) => {
    const position = generateTaskPosition({
      listLength: payload.beforeReorderedList.length,
      position: payload.destinationIndex,
      lastPosition: payload.beforeReorderedList.at(-1)?.posY,
      nextPosition: payload.reorderedList[payload.destinationIndex + 1]?.posY,
      prevPosition: payload.reorderedList[payload.destinationIndex - 1]?.posY,
    });

    if (view === 'member' && payload?.originalColumnId) {
      onChangeTaskPosition({
        task: payload.card,
        position,
        member: {
          newMemberId: payload.destinationColumnId,
          prevMemberId: payload?.originalColumnId,
        },
      });
      return;
    }

    onChangeTaskPosition({
      task: payload.card,
      position,
      projectStatusId:
        payload.card?.projectStatus?.id === payload.destinationColumnId
          ? undefined
          : payload.destinationColumnId,
    });
  };

  const handleChangeView = (value: View) => {
    setView(value);
  };

  const getVisibleTasks = () => {
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
        } else if (key === 'watcherIds') {
          allTasks = allTasks.filter((task) =>
            task?.watchers?.some(
              (watcher) =>
                watcher?.companyMember?.id &&
                value.includes(watcher.companyMember.id),
            ),
          );
        } else if (key === 'priority') {
          const values = value as string[];
          allTasks = allTasks.filter((task) =>
            values.some((value) => task?.priority?.includes(value)),
          );
        }
      });
    }

    return allTasks;
  };

  const getTaskByStatus = (statusId: string) => {
    const tasks = getVisibleTasks();

    return tasks
      .filter((task) => task?.projectStatus?.id === statusId)
      .sort(countSort((task) => task?.posY || 0));
  };

  const getTaskByAssignee = (assigneeId: string) => {
    const tasks = getVisibleTasks();

    const memberTasks = tasks
      .filter((task) =>
        task?.members?.some(
          (member) => member?.companyMember?.id === assigneeId,
        ),
      )
      .sort(countSort((task) => task?.posY || 0));

    return memberTasks;
  };

  const columns = useMemo<Column<QueryTask | QueryTaskChildTask>[]>(() => {
    if (!project?.projectStatuses) {
      return [];
    }

    if (view === 'member') {
      if (!project?.members) {
        return [];
      }
      return project?.members.map((member) => ({
        key: member?.companyMember?.id as string,
        title: (member?.user?.name || member?.user?.email) as string,
        data: getTaskByAssignee(member?.companyMember?.id as string),
      }));
    }

    return project.projectStatuses.map((status) => ({
      key: status?.id as string,
      title: status?.name as string,
      data: getTaskByStatus(status?.id as string),
    }));
  }, [project, searchValues, view]);

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

      <div className="bg-gray-50 p-3">
        <SearchFilter
          className="mb-4"
          values={searchValues}
          companyMemberOptions={companyMemberOptions}
          statusOptions={statusOptions}
          onClear={handleClearSearch}
          onUpdate={onUpdateSearch}
        />

        <div className={styles.kanban}>
          <KanbanBoard
            canDragCard={view === 'status' ? true : false}
            columns={columns}
            shouldUpdateOnDragEnd={
              !!activeCompany?.currentSubscription?.stripeSubscriptionId ||
              !!activeCompany?.currentSubscription?.package?.isCustom
            }
            renderCard={(item) => (
              <TaskCard task={item} onClick={() => onView(item)} />
            )}
            renderColumnFooter={() => (
              <Button
                size="mini"
                type="text"
                icon={<MdAdd />}
                className="mt-2"
                onClick={onAddTask}
              >
                Add Task
              </Button>
            )}
            onCardPositionChange={handleCardPositionChange}
            onDragEnd={handleDragEnd}
          />
        </div>
      </div>
    </>
  );
};

export default KanbanView;
