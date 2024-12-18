import {
  Badge,
  Button,
  Divider,
  Dropdown,
  Menu,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  TreeSelectProps,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table/interface';
import { IconPlus } from '@arco-design/web-react/icon';
import { capitalize } from 'lodash-es';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  MdAdd,
  MdMoreVert,
  MdOutlineAttachFile,
  MdOutlineMessage,
  MdOutlinePause,
  MdOutlinePlayArrow,
} from 'react-icons/md';

import { EditableCell } from '@/components';
import { CascaderOption } from '@/components/SelectUserCascaderInput';
import TaskTimelinePicker from '@/components/TaskTimelinePIcker';

import AddTaskInput from '../../ProjectPage/TableView/AddTaskInput';
import EditableTaskName from '../../ProjectPage/TableView/EditableTaskName';
import MultiSelectDrawer from '../../ProjectPage/TableView/MultiSelectDrawer';
import styles from './SubtasksPanel.module.less';

import { useDisclosure, useDuration } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { formatToCurrency } from '@/utils/currency.utils';
import { getUTC } from '@/utils/date.utils';
import { alphabeticalSort } from '@/utils/sorter.utils';
import {
  getTaskRecurringCronString,
  getTaskReminderOptions,
} from '@/utils/task.utils';

import {
  TASK_PRIORITY_COLORS,
  TASK_RECURRING_CASCADER_OPTIONS,
} from '@/constants/task.constants';

import { ArrayElement, SelectOption, TaskRecurringType } from '@/types';

import {
  TaskModalPageQuery,
  TaskPriorityType,
  TaskUpdateInput,
} from 'generated/graphql-types';

type QueryTaskChildTask = ArrayElement<
  NonNullable<TaskModalPageQuery['task']>['childTasks']
>;

type QueryTimesheet = ArrayElement<
  TaskModalPageQuery['getTimesheetsByCompanyMember']
>;

type Props = {
  task: TaskModalPageQuery['task'];
  timesheets: TaskModalPageQuery['getTimesheetsByCompanyMember'];
  contacts: TaskModalPageQuery['contacts'];
  tagGroups: TaskModalPageQuery['tagGroups'];
  companyMemberOptions: SelectOption[];
  statusOptions: SelectOption[];
  onView: (task: QueryTaskChildTask) => void;
  onCreateSubtask: (name: string) => void;
  onUpdateSubtask: (task: QueryTaskChildTask, input: TaskUpdateInput) => void;
  onStartTimesheetEntry: (task: QueryTaskChildTask) => void;
  onStopTimesheet: (timesheet: QueryTimesheet) => void;
  onCreateRecurringTask: (task: QueryTaskChildTask, cronString: string) => void;
  onUpdateRecurringTask: (task: QueryTaskChildTask, cronString: string) => void;
  onRemoveRecurringTask: (task: QueryTaskChildTask) => void;
  onAssignTags: (task: QueryTaskChildTask, tagIds: string[]) => void;
  onDeleteTags: (task: QueryTaskChildTask, tagIds: string[]) => void;
  onAddWatchers: (task: QueryTaskChildTask, memberIds: string[]) => void;
  onRemoveWatchers: (task: QueryTaskChildTask, memberIds: string[]) => void;
  onAddTaskPics: (task: QueryTaskChildTask, picIds: string[]) => void;
  onRemoveTaskPics: (task: QueryTaskChildTask, picIds: string[]) => void;
  onAddTaskMembers: (task: QueryTaskChildTask, memberIds: string[]) => void;
  onDeleteTaskMembers: (task: QueryTaskChildTask, memberIds: string[]) => void;
  onUpdateProperties: (columns: string[]) => void;
  onMove: (tasks: QueryTaskChildTask[]) => void;
  onArchive: (input: {
    subtasks: QueryTaskChildTask[];
    callback?: () => void;
  }) => void;
  onDuplicate: (subtasks: QueryTaskChildTask[]) => void;
  onDelete: (input: {
    subtasks: QueryTaskChildTask[];
    callback?: () => void;
  }) => void;
  onOpenCustomColumnModal: (groupIds: string[]) => void;
  isAdminOrManager: boolean;
};

const SubtasksPanel = (props: Props) => {
  const {
    task,
    timesheets,
    contacts,
    tagGroups,
    companyMemberOptions,
    statusOptions,
    onView,
    onCreateSubtask,
    onUpdateSubtask,
    onStartTimesheetEntry,
    onStopTimesheet,
    onCreateRecurringTask,
    onRemoveRecurringTask,
    onUpdateRecurringTask,
    onAssignTags,
    onDeleteTags,
    onAddTaskPics,
    onAddWatchers,
    onRemoveTaskPics,
    onRemoveWatchers,
    onAddTaskMembers,
    onDeleteTaskMembers,
    onUpdateProperties,
    onMove,
    onArchive,
    onDuplicate,
    onDelete,
    onOpenCustomColumnModal,
    isAdminOrManager,
  } = props;

  const [selectedRows, setSelectedRows] = useState<QueryTaskChildTask[]>([]);
  const { isStartupPlan } = useAppStore();
  const modalState = {
    multiSelect: useDisclosure(),
  };

  useEffect(() => {
    setSelectedRows([]);
  }, [task]);

  useEffect(() => {
    if (selectedRows.length) {
      modalState.multiSelect.onOpen();
    } else {
      modalState.multiSelect.onClose();
    }
  }, [selectedRows.length]);

  const handleCloseMultiSelectDrawer = () => {
    setSelectedRows([]);
  };

  const handleSelectedRowChange = (
    selectedRowKeys: (string | number)[],
    selectedRows: QueryTaskChildTask[],
  ) => {
    setSelectedRows(selectedRows);
  };

  const handleMoveSelectedTasks = () => {
    onMove(selectedRows);
  };

  const handleDuplicateSelectedTasks = () => {
    onDuplicate(selectedRows);

    handleCloseMultiSelectDrawer();
  };

  const handleArchiveSelectedTasks = () => {
    onArchive({
      subtasks: selectedRows,
      callback: handleCloseMultiSelectDrawer,
    });
  };

  const handleDeleteSelectedTasks = () => {
    onDelete({
      subtasks: selectedRows,
      callback: handleCloseMultiSelectDrawer,
    });
  };

  const getTaskTimesheets = (taskId: string) => {
    return timesheets?.filter((sheet) => sheet?.activity?.task?.id === taskId);
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

  const customColumns = useMemo<ColumnProps[]>(() => {
    if (!task?.project?.groups) {
      return [];
    }
    const currentGroup = task?.project?.groups[0];

    const customColumns = (currentGroup?.customColumns?.map((col) => {
      return {
        key: col?.attribute?.id as string,
        title: col?.attribute?.name as string,
        width: 160,
        render: (_, item, index) => {
          const customValue = item?.customValues?.find(
            (cv: { attribute: { id: string } }) =>
              cv?.attribute?.id === col?.attribute?.id,
          );
          const value = customValue?.value;

          return <div key={index}>{value}</div>;
        },
        extra: { isEnabled: col?.enabled },
      };
    }) || []) as ColumnProps[];

    return customColumns;
  }, [task?.project?.groups]);

  const columns = useMemo<ColumnProps<QueryTaskChildTask>[]>(() => {
    const properties = task?.project?.projectSettings?.columns
      ? Object.keys(task.project.projectSettings.columns)
      : [];

    const enabledCustomColumns = customColumns.filter((col) => {
      // @ts-ignore
      return col?.extra?.isEnabled;
    });

    const enabledColumnsKeys = enabledCustomColumns
      .map((col) => col.key)
      .filter((col) => col) as string[];

    properties.push(...enabledColumnsKeys);

    const baseColumns: ColumnProps<QueryTaskChildTask>[] = [
      {
        key: 'name',
        title: 'Name',
        width: 300,
        sorter: alphabeticalSort('name'),
        render: (col, item) => {
          return (
            <EditableTaskName
              value={item?.name || ''}
              onClick={() => onView(item)}
              onUpdate={(value) =>
                onUpdateSubtask(item, { name: value.trim() })
              }
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
              onDuplicate([item]);
            } else if (key === 'move') {
              onMove([item]);
            } else if (key === 'archive') {
              onArchive({
                subtasks: [item],
              });
            } else if (key === 'delete') {
              onDelete({
                subtasks: [item],
              });
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
        width: 100,
        render: (col, item) => {
          return (
            <EditableCell
              type="single-select"
              value={item?.projectStatus?.id || undefined}
              options={statusOptions}
              onSubmit={(value) =>
                onUpdateSubtask(item, { projectStatusId: value })
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
            <Space className="cursor-pointer" size={15}>
              <Badge count={item?.comments?.length} dot>
                <MdOutlineMessage
                  className={`h-4 w-4 ${
                    item?.comments?.length === 0 && 'text-gray-300'
                  }`}
                />
              </Badge>

              <Badge count={item?.attachments?.length} dot>
                <MdOutlineAttachFile
                  className={`h-4 w-4 ${
                    item?.attachments?.length === 0 && 'text-gray-300'
                  }`}
                />
              </Badge>
            </Space>
          );
        },
      },
    ];

    let propertyColumns: ColumnProps<QueryTaskChildTask>[] = [
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
                onUpdateSubtask(item, {
                  startDate: getUTC(startDate),
                  endDate: getUTC(endDate),
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
          const activeTimesheet = timesheets?.find(
            (timesheet) => !timesheet?.endDate,
          );

          const { duration } = useDuration({
            date: activeTimesheet?.startDate,
          });

          return (
            <Button
              className="w-full text-center"
              size="mini"
              icon={
                activeTimesheet ? <MdOutlinePause /> : <MdOutlinePlayArrow />
              }
              type={activeTimesheet ? 'primary' : 'secondary'}
              status={activeTimesheet ? 'success' : undefined}
              onClick={() =>
                activeTimesheet
                  ? onStopTimesheet(activeTimesheet)
                  : onStartTimesheetEntry(item)
              }
            >
              {activeTimesheet ? duration : 'Start'}
            </Button>
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

            onUpdateSubtask(item, { priority: key as TaskPriorityType });
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
        title: 'Project value',
        width: 100,
        render: (col, item) => {
          return (
            <EditableCell
              type="number"
              placeholder="RM"
              precision={2}
              min={0}
              value={item?.projectedValue || undefined}
              onSubmit={(value) =>
                onUpdateSubtask(item, { projectedCost: +value })
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
        title: 'Targeted Effort',
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
                onUpdateSubtask(item, { plannedEffort: +value * 60 })
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
              onSubmit={(value) =>
                onUpdateSubtask(item, { dueReminder: value })
              }
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

    const assigneeColumn: ColumnProps<QueryTaskChildTask> = {
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

    const addPropertyColumn: ColumnProps<QueryTaskChildTask> = {
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
            ...propertyColumns.map((col) => ({
              label: col.title,
              value: col.key as string,
            })),
            ...(customColumns?.map((col) => ({
              label: col.title,
              value: col.key as string,
            })) || []),
          ]}
          value={properties}
          onChange={onUpdateProperties}
          dropdownRender={(menu) => (
            <div>
              {menu}
              <Divider style={{ margin: 0 }} />
              {isAdminOrManager && !isStartupPlan() && (
                <>
                  <Button
                    type="text"
                    size="mini"
                    className="w-full my-1"
                    onClick={() => {
                      const groupIds = task?.project?.groups
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

    propertyColumns = propertyColumns.filter((col) =>
      properties.includes(col.key as string),
    );

    return [
      ...baseColumns,
      ...propertyColumns, //@ts-ignore
      ...customColumns.filter((col) => col?.extra?.isEnabled),
      addPropertyColumn,
    ];
  }, [task, timesheets]);

  return (
    <>
      <div className="gk-table px-3 pb-3">
        <Table
          className={`rounded border border-gray-300 ${styles.table}`}
          size="small"
          columns={columns}
          scroll={{ x: true }}
          pagination={false}
          rowSelection={{
            selectedRowKeys: selectedRows.map((row) => row?.id as string),
            onChange: handleSelectedRowChange,
          }}
          noDataElement={<div>There's nothing here yet.</div>}
          data={task?.childTasks?.filter((task) => !task?.archived) || []}
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={15}>
                  <AddTaskInput
                    placeholder="+ Add new subtask"
                    onSubmit={(value) => onCreateSubtask(value.trim())}
                  />
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>

      <MultiSelectDrawer
        visible={modalState.multiSelect.visible}
        onCancel={handleCloseMultiSelectDrawer}
        itemTitle="subtask"
        selectedCount={selectedRows.length}
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

export default SubtasksPanel;
