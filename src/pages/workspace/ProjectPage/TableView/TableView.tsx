import {
  Table,
  Button,
  Collapse,
  Select,
  Badge,
  Dropdown,
  Menu,
  TreeSelectProps,
  Tag,
  Tooltip,
  Divider,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { IconPlus } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { capitalize, cloneDeep, escapeRegExp, head, uniqBy } from 'lodash-es';
import { cloneElement, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  MdAdd,
  MdDragIndicator,
  MdEdit,
  MdMoreVert,
  MdOutlineAttachFile,
  MdOutlineDelete,
  MdOutlineMessage,
  MdSearch,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { EditableCell } from '@/components';
import Modal from '@/components/Modal';
import { CascaderOption } from '@/components/SelectUserCascaderInput';
import TaskTimelinePicker from '@/components/TaskTimelinePIcker';

import AddTaskButtonDropdown from '../AddTaskButtonDropdown';
import SearchFilter from '../SearchFilter';
import { FormValues as SearchTaskFormValues } from '../SearchTaskModal';
import AddTaskInput from './AddTaskInput';
import EditableInputValue from './EditableInputValue';
import EditableTaskName from './EditableTaskName';
import MultiSelectDrawer from './MultiSelectDrawer';
import styles from './TableView.module.less';
import TimeTracking from './TimeTracking';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { formatToCurrency } from '@/utils/currency.utils';
import { getUTC } from '@/utils/date.utils';
import { reorder } from '@/utils/reorder.utils';
import { alphabeticalSort } from '@/utils/sorter.utils';
import {
  getTaskRecurringCronString,
  getTaskReminderOptions,
} from '@/utils/task.utils';

import {
  TASK_PRIORITY_COLORS,
  TASK_RECURRING_CASCADER_OPTIONS,
} from '@/constants/task.constants';

import { navigateCompanySubscriptionsPage } from '@/navigation';

import { ArrayElement, SelectOption, TaskRecurringType } from '@/types';

import {
  Timesheet,
  TaskPriorityType,
  TaskUpdateInput,
  ProjectPageQuery,
  CompanyMemberType,
  ProjectGroupCustomAttributeType,
} from 'generated/graphql-types';

type QueryTask = ArrayElement<
  NonNullable<ProjectPageQuery['project']>['tasks']
>;

type QueryTaskChildTask = ArrayElement<NonNullable<QueryTask>['childTasks']>;

type QueryTimesheet = ArrayElement<
  NonNullable<ProjectPageQuery['getTimesheetsByCompanyMember']>
>;

export type View = 'group' | 'status' | 'member';

type GroupTable = {
  id: string;
  title: string;
  editable: boolean;
  tasks: QueryTask[];
};

type Props = {
  project: ProjectPageQuery['project'];
  tagGroups: ProjectPageQuery['tagGroups'];
  contacts: ProjectPageQuery['contacts'];
  timesheets: ProjectPageQuery['getTimesheetsByCompanyMember'];
  searchValues: SearchTaskFormValues | undefined;
  companyMemberOptions: SelectOption[];
  statusOptions: SelectOption[];
  onView: (task: QueryTask) => void;
  onDelete: (tasks: QueryTask[], callback?: () => void) => void;
  onArchive: (payload: { tasks: QueryTask[]; callback?: () => void }) => void;
  onCreateTask: (payload: { groupId: string; name: string }) => void;
  onAddGroup: () => void;
  onAddTask: () => void;
  onAddSubtask: (task: QueryTask) => void;
  onImport: () => void;
  onUpdateProjectGroup: (groupId: string, title: string) => void;
  onDeleteProjectGroup: (groupId: string) => void;
  onSearch: () => void;
  onUpdateSearch: (values: SearchTaskFormValues | undefined) => void;
  onMove: (tasks: QueryTask[]) => void;
  onMoveSubtasks: (subtasks: QueryTaskChildTask[]) => void;
  onDuplicate: (tasks: QueryTask[]) => void;
  onDuplicateSubtasks: (subtasks: QueryTaskChildTask[]) => void;
  onUpdateProperties: (columns: string[]) => void;
  onUpdateTask: (task: QueryTask, input: TaskUpdateInput) => void;
  onAddTaskMembers: (task: QueryTask, memberIds: string[]) => void;
  onDeleteTaskMembers: (task: QueryTask, memberIds: string[]) => void;
  onStartTimesheetEntry: (task: QueryTask) => void;
  onStopTimesheet: (timesheet: QueryTimesheet) => void;
  onAssignTags: (task: QueryTask, tagIds: string[]) => void;
  onDeleteTags: (task: QueryTask, tagIds: string[]) => void;
  onAddWatchers: (task: QueryTask, memberIds: string[]) => void;
  onRemoveWatchers: (task: QueryTask, memberIds: string[]) => void;
  onAddTaskPics: (task: QueryTask, picIds: string[]) => void;
  onRemoveTaskPics: (task: QueryTask, picIds: string[]) => void;
  onCreateRecurringTask: (task: QueryTask, cronString: string) => void;
  onUpdateRecurringTask: (task: QueryTask, cronString: string) => void;
  onRemoveRecurringTask: (task: QueryTask) => void;
  onOpenCustomColumnModal: (
    groupIds: string[],
    current?: {
      attributeId: string;
      name: string;
      type: ProjectGroupCustomAttributeType;
    },
  ) => void;
  onReorderGroups: (input: {
    reorderedGroups: {
      groupId: string;
      ordering: number;
    }[];
  }) => Promise<void>;
  onAddCustomValueToTask: (input: {
    attributeId: string;
    value: string;
    taskId: string;
    groupId: string;
  }) => Promise<void>;
};
// handleAddCustomValueToTask
const TableView = (props: Props) => {
  const {
    project,
    tagGroups,
    contacts,
    timesheets,
    searchValues,
    companyMemberOptions,
    statusOptions,
    onView,
    onDelete,
    onArchive,
    onCreateTask,
    onAddGroup,
    onAddTask,
    onAddSubtask,
    onUpdateProjectGroup,
    onDeleteProjectGroup,
    onImport,
    onSearch,
    onUpdateSearch,
    onMove,
    onMoveSubtasks,
    onDuplicate,
    onDuplicateSubtasks,
    onUpdateProperties,
    onUpdateTask,
    onAddTaskMembers,
    onDeleteTaskMembers,
    onStartTimesheetEntry,
    onStopTimesheet,
    onAssignTags,
    onDeleteTags,
    onAddWatchers,
    onRemoveWatchers,
    onAddTaskPics,
    onRemoveTaskPics,
    onCreateRecurringTask,
    onUpdateRecurringTask,
    onRemoveRecurringTask,
    onOpenCustomColumnModal,
    onReorderGroups,
    onAddCustomValueToTask,
  } = props;

  const navigate = useNavigate();

  const { activeCompany, getCurrentMember, isStartupPlan } = useAppStore();

  const companyMember = getCurrentMember();

  const [view, setView] = useState<View>('group');
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<QueryTask[]>([]);
  const [selectedSubtasks, setSelectedSubtasks] = useState<
    QueryTaskChildTask[]
  >([]);
  const [groupTables, setGroupTables] = useState<GroupTable[]>([]);
  const isAdminOrManager =
    companyMember?.type === CompanyMemberType.Admin ||
    companyMember?.type === CompanyMemberType.Manager;

  const modalState = {
    multiSelect: useDisclosure(),
    customGroup: useDisclosure(),
  };

  useEffect(() => {
    setSelectedRows([]);
    setSelectedSubtasks([]);
  }, [project]);

  useEffect(() => {
    if (selectedRows.length || selectedSubtasks.length) {
      modalState.multiSelect.onOpen();
    } else {
      modalState.multiSelect.onClose();
    }
  }, [selectedRows.length, selectedSubtasks.length]);

  useEffect(() => {
    const groups = generateGroupTables();
    const groupIds = groups.map((group) => group.id);

    setGroupTables(groups);
    setActiveKeys(groupIds);
  }, [view, project, searchValues]);

  const handleChangeView = (value: View) => {
    setView(value);
  };

  const handleActiveKeysChange = (key: string, keys: string[]) => {
    setActiveKeys(keys);
  };

  const handleCloseMultiSelectDrawer = () => {
    setSelectedRows([]);
    setSelectedSubtasks([]);
  };

  const handleClearSearch = () => {
    onUpdateSearch(undefined);
  };

  const handleRowSelect = (selected: boolean, record: QueryTask) => {
    if (selected) {
      setSelectedRows((prev) => [...prev, record]);
    } else {
      setSelectedRows((prev) => prev.filter((task) => task?.id !== record?.id));
    }
  };

  const handleSubtasksRowSelect = (
    selected: boolean,
    record: QueryTaskChildTask,
  ) => {
    if (selected) {
      setSelectedSubtasks((prev) => [...prev, record]);
    } else {
      setSelectedSubtasks((prev) =>
        prev.filter((task) => task?.id !== record?.id),
      );
    }
  };

  const handleSelectAll = (selected: boolean, records: QueryTask[]) => {
    if (selected) {
      const uniq = uniqBy([...selectedRows, ...records], 'id');

      setSelectedRows(uniq);
    } else {
      setSelectedRows((prev) =>
        prev.filter(
          (task) => !records.some((record) => record?.id === task?.id),
        ),
      );
    }
  };

  const handleSubtasksSelectAll = (
    selected: boolean,
    records: QueryTaskChildTask[],
  ) => {
    if (selected) {
      const uniq = uniqBy([...selectedSubtasks, ...records], 'id');

      setSelectedSubtasks(uniq);
    } else {
      setSelectedSubtasks((prev) =>
        prev.filter(
          (task) => !records.some((record) => record?.id === task?.id),
        ),
      );
    }
  };

  const handleMoveSelectedTasks = () => {
    selectedRows.length
      ? onMove(selectedRows)
      : onMoveSubtasks(selectedSubtasks);
  };

  const handleDuplicateSelectedTasks = () => {
    selectedRows.length
      ? onDuplicate(selectedRows)
      : onDuplicateSubtasks(selectedSubtasks);
  };

  const handleArchiveSelectedTasks = () => {
    onArchive({
      tasks: selectedRows,
      callback: handleCloseMultiSelectDrawer,
    });
  };

  const handleDeleteSelectedTasks = () => {
    onDelete(selectedRows, handleCloseMultiSelectDrawer);
  };

  const handleDragEnd = (result: DropResult) => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const reordered = reorder(
      groupTables,
      result.source.index,
      result.destination.index,
    );

    const reorderedGroups = reordered.map((group, index) => {
      return {
        groupId: group.id,
        ordering: index + 1,
      };
    });

    onReorderGroups({ reorderedGroups });

    setActiveKeys(reordered.map((group) => group.id));
    setGroupTables(reordered);
  };

  const getTagGroupTreeData = (): TreeSelectProps['treeData'] => {
    if (!tagGroups) {
      return [];
    }

    return tagGroups.map((group) => ({
      id: group?.id as string,
      title: group?.name,
      value: group?.id as string,
      children: group?.tags?.map((tag) => ({
        id: tag?.id as string,
        title: tag?.name,
        value: tag?.id,
      })),
    }));
  };

  const getContactCascaderOptions = (): CascaderOption[] => {
    if (!contacts) {
      return [];
    }

    return contacts.map((contact) => ({
      label: contact?.name as string,
      value: contact?.id as string,
      children:
        contact?.pics?.map((pic) => ({
          label: pic?.name as string,
          value: pic?.id as string,
        })) || [],
    }));
  };

  const getVisibleTasks = () => {
    if (!project?.tasks) {
      return [];
    }

    let tasks = cloneDeep(project.tasks);

    tasks.forEach((task) => {
      if (task?.childTasks) {
        task.childTasks = task.childTasks.filter((task) => !task?.archived);
      }
    });

    if (searchValues) {
      Object.entries(searchValues).forEach(([key, value]) => {
        if (!value) {
          return;
        }
        console.log(key, value);
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

  const getTaskTimesheets = (taskId: string) => {
    return timesheets?.filter((sheet) => sheet?.activity?.task?.id === taskId);
  };

  const generateGroupTables = () => {
    let groups: GroupTable[] = [];

    if (view === 'group') {
      groups = (project?.groups || [])?.map((group) => ({
        id: group?.id as string,
        title: group?.name as string,
        editable: !group?.id?.includes('DEFAULT'),
        tasks: getTasksByGroup(group?.id as string),
      }));
    } else if (view === 'status') {
      groups = (project?.projectStatuses || []).map((status) => ({
        id: status?.id as string,
        title: status?.name as string,
        editable: false,
        tasks: getTasksByStatus(status?.id as string),
      }));
    } else if (view === 'member') {
      groups = (activeCompany?.members || []).map((member) => ({
        id: member?.id as string,
        title: (member?.user?.name || member?.user?.email) as string,
        editable: false,
        tasks: getTasksByMember(member?.id as string),
      }));
    }

    return groups;
  };

  const customColumns = useMemo<ColumnProps[]>(() => {
    if (!project?.groups) {
      return [];
    }

    const currentGroup = project?.groups?.filter((g) =>
      activeKeys.includes(g?.id as string),
    )[0];

    const customColumns = (currentGroup?.customColumns?.map((col) => {
      return {
        key: col?.attribute?.id as string,
        title: (
          <div className={styles.hovered}>
            {col?.attribute?.name}{' '}
            {isAdminOrManager && (
              <Button
                onClick={() => {
                  const groupIds = project?.groups
                    ?.map((group) => group?.id as string)
                    ?.filter((id) => id) as string[];
                  onOpenCustomColumnModal(groupIds, {
                    attributeId: col?.attribute?.id as string,
                    name: col?.attribute?.name as string,
                    type: col?.attribute
                      ?.type as ProjectGroupCustomAttributeType,
                  });
                }}
                iconOnly
                icon={<MdEdit />}
              />
            )}
          </div>
        ),
        width: 160,
        render: (_, item, index) => {
          const taskId = item?.id as string;
          const groupId = item?.group?.id as string;
          const group = project?.groups?.find((g) => g?.id === groupId);

          const attributeId =
            item?.customValues?.find(
              (cv: {
                attribute: {
                  name: string;
                  id: string;
                  type: ProjectGroupCustomAttributeType;
                };
              }) =>
                cv?.attribute?.name === col?.attribute?.name &&
                cv?.attribute?.type === col?.attribute?.type,
            )?.attribute?.id ||
            (group?.customColumns?.find(
              (cc) =>
                cc?.attribute?.name === col?.attribute?.name &&
                cc?.attribute?.type === col?.attribute?.type,
            )?.attribute?.id as string);

          const customValue = item?.customValues?.find(
            (cv: {
              attribute: {
                name: string;
                id: string;
                type: ProjectGroupCustomAttributeType;
              };
            }) => cv?.attribute?.id === attributeId,
          );

          const value = customValue?.value;

          if (col?.attribute?.type === ProjectGroupCustomAttributeType.Text) {
            return (
              <EditableInputValue
                key={index}
                className={item?.parentTask ? 'pl-4' : undefined}
                value={value}
                onUpdate={(value) => {
                  return onAddCustomValueToTask({
                    attributeId: attributeId,
                    value,
                    taskId,
                    groupId,
                  });
                }}
              />
            );
          }

          return (
            <EditableInputValue
              key={index}
              className={item?.parentTask ? 'pl-4' : undefined}
              value={value}
              type={'number'}
              onUpdate={(value) => {
                return onAddCustomValueToTask({
                  attributeId: attributeId,
                  value,
                  taskId,
                  groupId,
                });
              }}
            />
          );
        },
        extra: { isEnabled: col?.enabled },
      };
    }) || []) as ColumnProps[];

    return customColumns;
  }, [project?.groups, groupTables]);

  const columns = useMemo<ColumnProps<QueryTask>[]>(() => {
    const properties = project?.projectSettings?.columns
      ? Object.keys(project.projectSettings.columns)
      : [];

    const enabledCustomColumns = customColumns.filter((col) => {
      // @ts-ignore
      return col?.extra?.isEnabled;
    });

    const enabledColumnsKeys = enabledCustomColumns
      .map((col) => col.key)
      .filter((col) => col) as string[];

    properties.push(...enabledColumnsKeys);

    const baseColumns: ColumnProps<QueryTask>[] = [
      {
        key: 'name',
        title: 'Name',
        width: 300,
        sorter: alphabeticalSort('name'),
        render: (col, item) => {
          return (
            <EditableTaskName
              className={item?.parentTask ? 'pl-4' : undefined}
              value={item?.name || ''}
              onClick={() => onView(item)}
              onUpdate={(value) => onUpdateTask(item, { name: value.trim() })}
            />
          );
        },
      },
      {
        key: 'action',
        title: null,
        width: 30,
        render: (col, item) => {
          const handleClickMenuItem = (key: string) => {
            if (key === 'view') {
              onView(item);
            } else if (key === 'duplicate') {
              if (
                !activeCompany?.currentSubscription?.stripeSubscriptionId &&
                !activeCompany?.currentSubscription?.package?.isCustom
              ) {
                Modal.info({
                  title: 'Reached Plan Limit',
                  content:
                    companyMember?.type === CompanyMemberType.Admin
                      ? 'Task Duplication is only available to SME plan and above.'
                      : 'Task Duplication is only available to SME plan and above, please contact your admin or company owner.',
                  okText:
                    companyMember?.type === CompanyMemberType.Admin
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
              } else {
                item?.parentTask?.id
                  ? onDuplicateSubtasks([item])
                  : onDuplicate([item]);
              }
            } else if (key === 'move') {
              item?.parentTask?.id ? onMoveSubtasks([item]) : onMove([item]);
            } else if (key === 'archive') {
              onArchive({
                tasks: [item],
              });
            } else if (key === 'subtask') {
              onAddSubtask(item);
            } else if (key === 'delete') {
              onDelete([item]);
            }
          };

          return (
            <Dropdown
              trigger="click"
              droplist={
                <Menu onClickMenuItem={handleClickMenuItem}>
                  <Menu.Item key="view">View Detail</Menu.Item>
                  <Menu.Item key="duplicate">Duplicate</Menu.Item>
                  <Menu.Item key="move">Move</Menu.Item>
                  <Menu.Item key="archive">Archive</Menu.Item>
                  {!item?.parentTask?.id && (
                    <>
                      <hr />
                      <Menu.Item key="subtask">Add Subtask</Menu.Item>
                    </>
                  )}
                  <hr />
                  <Menu.Item key="delete">Delete</Menu.Item>
                </Menu>
              }
            >
              <Button
                type="text"
                size="small"
                icon={<MdMoreVert className="text-gray-600" />}
              />
            </Dropdown>
          );
        },
      },
      {
        key: 'status',
        title: 'Status',
        width: 150,
        render: (col, item) => {
          return (
            <EditableCell
              type="single-select"
              value={item?.projectStatus?.id || undefined}
              options={statusOptions}
              onSubmit={(value) =>
                onUpdateTask(item, { projectStatusId: value })
              }
              renderContent={(value) => (
                <EditableCellContent value={value}>
                  <Tag
                    className="w-full cursor-pointer text-center"
                    bordered
                    color={item?.projectStatus?.color || undefined}
                  >
                    {item?.projectStatus?.name}
                  </Tag>
                </EditableCellContent>
              )}
            />
          );
        },
      },

      {
        key: 'activity',
        title: 'Activity',
        width: 100,
        render: (col, item) => {
          return (
            <div className="cursor-pointer" onClick={() => onView(item)}>
              <Badge count={item?.comments?.length} dot>
                <MdOutlineMessage
                  className={`ml-1.5 h-4 w-4 ${
                    item?.comments?.length === 0 && 'text-gray-300'
                  }`}
                />
              </Badge>

              <Badge count={item?.attachments?.length} dot>
                <MdOutlineAttachFile
                  className={`ml-1.5 h-4 w-4 ${
                    item?.attachments?.length === 0 && 'text-gray-300'
                  }`}
                />
              </Badge>
            </div>
          );
        },
      },
    ];

    let propertyColumns: ColumnProps<QueryTask>[] = [
      {
        key: 'timeline',
        title: 'Due date',
        width: 160,
        render: (col, item) => {
          return (
            <TaskTimelinePicker
              containerClassName="-m-2"
              value={[item?.startDate, item?.endDate]}
              onChange={([startDate, endDate]) =>
                onUpdateTask(item, {
                  startDate: getUTC(startDate),
                  endDate: getUTC(endDate),
                })
              }
              onClear={() =>
                onUpdateTask(item, {
                  startDate: null,
                  endDate: null,
                })
              }
            />
          );
        },
      },
      {
        key: 'tracking',
        title: 'Tracking',
        width: 100,
        render: (col, item) => {
          const timesheets = getTaskTimesheets(item?.id as string);

          return (
            <TimeTracking
              timesheets={timesheets as Timesheet[]}
              onStart={() => {
                if (
                  !activeCompany?.currentSubscription?.stripeSubscriptionId &&
                  !activeCompany?.currentSubscription?.package?.isCustom
                ) {
                  Modal.info({
                    title: 'Reached Plan Limit',
                    content:
                      companyMember?.type === CompanyMemberType.Admin
                        ? 'Time Tracking is not available in your current plan'
                        : 'Time Tracking is not available in your current plan, please upgrade your plan or contact your admin',
                    okText:
                      companyMember?.type === CompanyMemberType.Admin
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
                } else {
                  onStartTimesheetEntry(item);
                }
              }}
              onStop={onStopTimesheet}
            />
          );
        },
      },

      {
        key: 'priority',
        title: 'Priority',
        width: 100,
        render: (col, item) => {
          const handleClickMenuItem = (key: string) => {
            if (key === item?.priority) {
              return;
            }

            onUpdateTask(item, { priority: key as TaskPriorityType });
          };

          return (
            <Dropdown
              trigger="click"
              droplist={
                <Menu onClickMenuItem={handleClickMenuItem}>
                  <Menu.Item key={TaskPriorityType.Low}>
                    <Badge color={TASK_PRIORITY_COLORS['LOW']} text="Low" />
                  </Menu.Item>

                  <Menu.Item key={TaskPriorityType.Medium}>
                    <Badge
                      color={TASK_PRIORITY_COLORS['MEDIUM']}
                      text="Medium"
                    />
                  </Menu.Item>

                  <Menu.Item key={TaskPriorityType.High}>
                    <Badge color={TASK_PRIORITY_COLORS['HIGH']} text="High" />
                  </Menu.Item>
                </Menu>
              }
            >
              <div className="cursor-pointer">
                {item?.priority ? (
                  <Badge
                    color={TASK_PRIORITY_COLORS[item.priority]}
                    text={capitalize(item.priority.toString())}
                  />
                ) : (
                  <div className="px-1 hover:bg-gray-200">
                    <MdAdd className="text-gray-600 hover:text-gray-900" />
                  </div>
                )}
              </div>
            </Dropdown>
          );
        },
      },
      {
        key: 'value',
        title: 'Budget',
        width: 120,
        render: (col, item) => {
          return (
            <EditableCell
              type="number"
              placeholder="RM"
              precision={2}
              min={0}
              value={item?.projectedCost || undefined}
              onSubmit={(value) =>
                onUpdateTask(item, { projectedCost: +value })
              }
              renderContent={(value) => (
                <EditableCellContent value={value}>
                  <div>{formatToCurrency(value as number)}</div>
                </EditableCellContent>
              )}
            />
          );
        },
      },
      {
        key: 'effort',
        title: 'Targeted Hours',
        width: 100,
        render: (col, item) => {
          return (
            <EditableCell
              type="number"
              placeholder="Hours"
              precision={2}
              min={0}
              value={item?.plannedEffort ? item.plannedEffort / 60 : undefined}
              onSubmit={(value) =>
                onUpdateTask(item, { plannedEffort: +value * 60 })
              }
              renderContent={() => (
                <EditableCellContent value={item?.plannedEffort}>
                  <div>{(item?.plannedEffort as number) / 60} hours</div>
                </EditableCellContent>
              )}
            />
          );
        },
      },
      {
        key: 'reminder',
        title: 'Reminder',
        width: 150,
        render: (col, item) => {
          const options = getTaskReminderOptions(item);
          const selectedOption = options.find(
            (option) => option.value === item?.dueReminder,
          );

          return item?.startDate ? (
            <EditableCell
              type="single-select"
              placeholder="Please select"
              options={options}
              value={(selectedOption?.value as string) || undefined}
              onSubmit={(value) => onUpdateTask(item, { dueReminder: value })}
              renderContent={(value) => {
                return (
                  <EditableCellContent value={value}>
                    <div>{selectedOption?.label}</div>
                  </EditableCellContent>
                );
              }}
            />
          ) : (
            <Tooltip content="Please set the task's timeline in order to use reminder">
              Not Available
            </Tooltip>
          );
        },
      },
      {
        key: 'recurrence',
        title: 'Recurrence',
        width: 190,
        render: (col, item) => {
          const value: string[] = [];

          if (item?.templateTask?.isRecurring) {
            value.push(
              item.templateTask.recurringSetting?.intervalType as string,
            );

            if (item.templateTask.recurringSetting?.intervalType === 'DAILY') {
              item.templateTask.recurringSetting.skipWeekend
                ? value.push('working_day')
                : value.push('everyday');
            } else if (
              [
                'WEEKLY',
                'FIRST_WEEK',
                'SECOND_WEEK',
                'THIRD_WEEK',
                'FOURTH_WEEK',
                'MONTHLY',
              ].includes(
                item.templateTask.recurringSetting?.intervalType as string,
              )
            ) {
              value.push(
                item.templateTask.recurringSetting?.day?.toString() as string,
              );
            } else if (
              item.templateTask.recurringSetting?.intervalType === 'YEARLY'
            ) {
              value.push(
                (
                  (item.templateTask.recurringSetting.month as number) + 1
                )?.toString() as string,
              );
              value.push(
                item.templateTask.recurringSetting.day?.toString() as string,
              );
            }
          }

          const options = item?.templateTask?.isRecurring
            ? [
                ...TASK_RECURRING_CASCADER_OPTIONS,
                {
                  label: 'Remove',
                  value: 'remove',
                },
              ]
            : TASK_RECURRING_CASCADER_OPTIONS;

          return (
            <EditableCell
              type="cascader"
              showInputOnly={!!item?.templateTask?.isRecurring}
              options={options}
              value={value}
              onSubmit={(value) => {
                if (
                  !activeCompany?.currentSubscription?.stripeSubscriptionId &&
                  !activeCompany?.currentSubscription?.package?.isCustom
                ) {
                  Modal.info({
                    title: 'Reached Plan Limit',
                    content:
                      companyMember?.type === CompanyMemberType.Admin
                        ? 'Task recurrence is only available to SME plan and above'
                        : 'Task recurrence is only available to SME plan and above, please contact the owner or admin.',
                    okText:
                      companyMember?.type === CompanyMemberType.Admin
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

                  return;
                }

                const castValue = value as (string | number)[];

                if (castValue[0] === 'remove') {
                  onRemoveRecurringTask(item);
                } else {
                  const cronString = getTaskRecurringCronString({
                    intervalType: castValue[0] as TaskRecurringType,
                    skipWeekend: castValue[1] === 'working_day',
                    day:
                      castValue[0] === 'YEARLY'
                        ? (castValue[2] as number)
                        : (castValue[1] as number),
                    month: castValue[1] as number,
                  });

                  item?.templateTask?.isRecurring
                    ? onUpdateRecurringTask(item, cronString)
                    : onCreateRecurringTask(item, cronString);
                }
              }}
              renderContent={(value) => (
                <EditableCellContent value={value}>
                  <></>
                </EditableCellContent>
              )}
            />
          );
        },
      },
      {
        key: 'tags',
        title: 'Tags',
        width: 150,
        render: (col, item) => {
          return (
            <EditableCell
              type="tree-select"
              treeData={getTagGroupTreeData()}
              value={item?.tags?.map((tag) => tag?.id as string)}
              showInputOnly
              onChange={(value) => {
                const tagIds = value.map((val) => val.value);

                const newTagIds = tagIds.filter(
                  (tagId) => !item?.tags?.some((tag) => tag?.id === tagId),
                );
                const tagIdsToRemove = item?.tags
                  ?.filter((tag) => !tagIds.includes(tag?.id as string))
                  .map((tag) => tag?.id as string);

                if (newTagIds.length) {
                  onAssignTags(item, newTagIds);
                }

                if (tagIdsToRemove?.length) {
                  onDeleteTags(item, tagIdsToRemove);
                }
              }}
            />
          );
        },
      },
      {
        key: 'watchers',
        title: 'Watchers',
        width: 160,
        render: (col, item) => {
          return (
            <EditableCell
              type="user-select"
              options={companyMemberOptions}
              value={item?.watchers?.map(
                (watcher) => watcher?.companyMember?.id as string,
              )}
              filterValue={item?.members?.map(
                (member) => member?.companyMember?.id as string,
              )}
              onSubmit={(value) => {
                const newMemberIds = value.filter(
                  (val) =>
                    !item?.watchers?.some(
                      (watcher) => watcher?.companyMember?.id === val,
                    ),
                );
                const memberIdsToRemove = item?.watchers
                  ?.filter(
                    (watcher) =>
                      !value.includes(watcher?.companyMember?.id as string),
                  )
                  .map((watcher) => watcher?.companyMember?.id as string);

                if (newMemberIds.length) {
                  onAddWatchers(item, newMemberIds);
                }

                if (memberIdsToRemove?.length) {
                  onRemoveWatchers(item, memberIdsToRemove);
                }
              }}
            />
          );
        },
      },
      {
        key: 'contacts',
        title: 'Contacts',
        width: 160,
        render: (col, item) => {
          const value = item?.pics?.map((taskPic) => [
            taskPic?.contact?.id as string,
            taskPic?.pic?.id as string,
          ]);
          const picIds = item?.pics?.map((pic) => pic?.pic?.id as string);

          return (
            <EditableCell
              type="user-cascader"
              showInputOnly
              options={getContactCascaderOptions()}
              value={value}
              onSubmit={(value) => {
                const finalPicIds = value.map((val) => val[1]);

                const picIdsToAdd = finalPicIds.filter(
                  (id) => !picIds?.includes(id),
                );
                const picIdsToRemove = picIds?.filter(
                  (id) => !finalPicIds.includes(id),
                );

                if (picIdsToAdd.length) {
                  onAddTaskPics(item, picIdsToAdd);
                }

                if (picIdsToRemove?.length) {
                  onRemoveTaskPics(item, picIdsToRemove);
                }
              }}
            />
          );
        },
      },
    ];

    const assigneeColumn: ColumnProps<QueryTask> = {
      key: 'assignee',
      title: 'Assignee',
      width: 160,
      render: (col, item) => {
        return (
          <EditableCell
            type="user-select"
            options={companyMemberOptions}
            value={item?.members?.map(
              (member) => member?.companyMember?.id as string,
            )}
            filterValue={item?.watchers?.map(
              (watcher) => watcher?.companyMember?.id as string,
            )}
            onSubmit={(value) => {
              const newMemberIds = value.filter(
                (val) =>
                  !item?.members?.some(
                    (member) => member?.companyMember?.id === val,
                  ),
              );
              const memberIdsToRemove = item?.members
                ?.filter(
                  (member) =>
                    !value.includes(member?.companyMember?.id as string),
                )
                .map((member) => member?.companyMember?.id as string);

              if (newMemberIds.length) {
                onAddTaskMembers(item, newMemberIds);
              }

              if (memberIdsToRemove?.length) {
                onDeleteTaskMembers(item, memberIdsToRemove);
              }
            }}
          />
        );
      },
    };

    const addPropertyColumn: ColumnProps<QueryTask> = {
      key: 'add',
      width: 160,
      title: (
        <Select
          mode="multiple"
          triggerElement={
            <div className="w-40">
              <Button icon={<MdAdd />} />
            </div>
          }
          options={[
            {
              label: assigneeColumn.title,
              value: assigneeColumn.key as string,
            },
            ...propertyColumns.map(
              (col) => ({
                label: col.title,
                value: col.key as string,
              }),
              {
                label: assigneeColumn.title,
                value: assigneeColumn.key as string,
              },
            ),
            ...(customColumns?.map((col) => ({
              label: col.title,
              value: col.key as string,
            })) || []),
          ]}
          value={properties}
          //What a mess, I'm sorry.
          onChange={(val) => {
            const currentSelections = properties;
            const newSelections = val as string[];

            const added = head(
              newSelections.filter((x) => !currentSelections?.includes(x)),
            ) as string;

            const removed = head(
              currentSelections.filter((x) => !newSelections?.includes(x)),
            ) as string;

            if (added?.length === 36 || removed?.length === 36) {
              const attributeIds = [added, removed];
              onUpdateProperties(attributeIds);
            } else {
              onUpdateProperties(val);
            }
          }}
          dropdownRender={(menu) => (
            <div>
              {menu}
              {isAdminOrManager && !isStartupPlan() && (
                <>
                  <Divider style={{ margin: 0 }} />
                  <Button
                    type="text"
                    size="mini"
                    className="w-full my-1"
                    onClick={() => {
                      const groupIds = project?.groups
                        ?.map((group) => group?.id as string)
                        ?.filter((id) => id) as string[];
                      onOpenCustomColumnModal(groupIds);
                    }}
                  >
                    <IconPlus />
                    Column
                  </Button>
                </>
              )}
            </div>
          )}
          dropdownMenuStyle={{ maxHeight: 150 }}
        />
      ),
    };

    if (properties.includes('assignee')) {
      baseColumns.splice(4, 0, assigneeColumn);
    }

    propertyColumns = propertyColumns.filter(
      (col) => col.key && properties.includes(col.key as string),
    );

    return [
      ...baseColumns,
      ...propertyColumns,
      //@ts-ignore
      ...customColumns.filter((col) => col?.extra?.isEnabled),
      addPropertyColumn,
    ];
  }, [project?.projectSettings?.columns, timesheets, customColumns]);

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

      <div className="bg-gray-50 p-3">
        <SearchFilter
          values={searchValues}
          companyMemberOptions={companyMemberOptions}
          statusOptions={statusOptions}
          onClear={handleClearSearch}
          onUpdate={onUpdateSearch}
        />

        <DragDropContext
          onBeforeDragStart={() => setActiveKeys([])}
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="group">
            {(provided) => (
              <Collapse
                className={styles.collapse}
                bordered={false}
                activeKey={activeKeys}
                onChange={handleActiveKeysChange}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {groupTables.map((group, index) => {
                  const item = (
                    <Collapse.Item
                      key={group.id}
                      name={group.id}
                      className="bg-gray-50 p-0"
                      extra={
                        <div className={styles.hovered2}>
                          <Button
                            type="text"
                            size="mini"
                            icon={<MdDragIndicator />}
                          />
                          <Button
                            className={styles.alwaysVisible}
                            size="mini"
                            type="text"
                            icon={
                              <MdOutlineDelete className="text-gray-600 hover:text-red-500" />
                            }
                            onClick={() => onDeleteProjectGroup(group.id)}
                          />
                        </div>
                      }
                      header={
                        <h2 className="py-0">
                          {group.editable ? (
                            <EditableCell
                              type="input"
                              value={group.title}
                              onSubmit={(value) => {
                                const trimmed = value.trim();
                                if (group.title !== trimmed) {
                                  onUpdateProjectGroup(group.id, trimmed);
                                }
                              }}
                            />
                          ) : (
                            group.title
                          )}
                        </h2>
                      }
                    >
                      <Table
                        className={`rounded border border-gray-300 ${styles.table}`}
                        size="small"
                        columns={columns}
                        scroll={{ x: true }}
                        pagination={false}
                        rowSelection={{
                          selectedRowKeys: selectedRows.map(
                            (row) => row?.id as string,
                          ),
                          onSelect: handleRowSelect,
                          onSelectAll: (selected) =>
                            handleSelectAll(selected, group.tasks),
                          checkboxProps: () => ({
                            disabled: selectedSubtasks.length > 0,
                          }),
                        }}
                        noDataElement={<div>There's nothing here yet.</div>}
                        data={group.tasks}
                        summary={() =>
                          view === 'group' && (
                            <Table.Summary>
                              <Table.Summary.Row>
                                <Table.Summary.Cell colSpan={4}>
                                  <AddTaskInput
                                    onSubmit={(value) =>
                                      onCreateTask({
                                        groupId: group.id,
                                        name: value,
                                      })
                                    }
                                  />
                                </Table.Summary.Cell>
                              </Table.Summary.Row>
                            </Table.Summary>
                          )
                        }
                        expandProps={{
                          rowExpandable: (record) =>
                            !!record?.childTasks?.length,
                        }}
                        expandedRowRender={(record) => {
                          return (
                            <Table
                              className={styles['expand-table']}
                              columns={columns}
                              pagination={false}
                              showHeader={false}
                              data={record?.childTasks || []}
                              rowSelection={{
                                selectedRowKeys: selectedSubtasks.map(
                                  (task) => task?.id as string,
                                ),
                                onSelect: handleSubtasksRowSelect,
                                onSelectAll: (selected) =>
                                  handleSubtasksSelectAll(
                                    selected,
                                    record?.childTasks || [],
                                  ),
                                checkboxProps: () => ({
                                  disabled: selectedRows.length > 0,
                                }),
                              }}
                              expandProps={{
                                rowExpandable: () => true,
                                icon: () => null,
                              }}
                              expandedRowRender={() => <></>}
                            />
                          );
                        }}
                      />
                    </Collapse.Item>
                  );

                  return (
                    <Draggable
                      key={group.id}
                      draggableId={group.id}
                      index={index}
                      isDragDisabled={false}
                    >
                      {(dragProvided) =>
                        cloneElement(item, {
                          ref: dragProvided.innerRef,
                          ...dragProvided.draggableProps,
                          ...dragProvided.dragHandleProps,
                        })
                      }
                    </Draggable>
                  );
                })}

                {provided.placeholder}
              </Collapse>
            )}
          </Droppable>
        </DragDropContext>

        {view === 'group' && (
          <Button
            className="mt-2"
            size="mini"
            type="text"
            icon={<MdAdd />}
            onClick={onAddGroup}
          >
            Add Group
          </Button>
        )}
      </div>

      <MultiSelectDrawer
        visible={modalState.multiSelect.visible}
        onCancel={handleCloseMultiSelectDrawer}
        itemTitle={selectedRows.length ? 'task' : 'subtask'}
        selectedCount={selectedRows.length || selectedSubtasks.length}
        onArchive={handleArchiveSelectedTasks}
        onDelete={handleDeleteSelectedTasks}
        onDuplicate={handleDuplicateSelectedTasks}
        onMove={handleMoveSelectedTasks}
      />
    </>
  );
};

const EditableCellContent = ({
  children,
  value,
}: {
  children: ReactNode;
  value: unknown | undefined;
}) => {
  return (Array.isArray(value) ? value.length > 0 : value) ? (
    <>{children}</>
  ) : (
    <div className="cursor-pointer px-1 hover:bg-gray-200">
      <MdAdd className="text-gray-600 hover:text-gray-900" />
    </div>
  );
};

export default TableView;
