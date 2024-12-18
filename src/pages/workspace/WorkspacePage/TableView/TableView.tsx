import {
  Badge,
  Button,
  Collapse,
  Dropdown,
  Menu,
  Space,
  Table,
} from '@arco-design/web-react';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { escapeRegExp, flatten, groupBy, uniqBy } from 'lodash-es';
import { useEffect, useState } from 'react';
import {
  MdMoreVert,
  MdOutlineAttachFile,
  MdOutlineMessage,
  MdSearch,
} from 'react-icons/md';

import { Avatar } from '@/components';
import TaskTimelinePicker from '@/components/TaskTimelinePIcker';

import SearchFilter from '../../ProjectPage/SearchFilter';
import { FormValues as SearchTaskFormValues } from '../../ProjectPage/SearchTaskModal';
import EditableTaskName from '../../ProjectPage/TableView/EditableTaskName';
import styles from './TableView.module.less';

import { alphabeticalSort } from '@/utils/sorter.utils';

import { ArrayElement, SelectOption } from '@/types';

import { WorkspacePageQuery } from 'generated/graphql-types';

type QueryProject = ArrayElement<
  NonNullable<WorkspacePageQuery['workspace']>['projects']
>;

type QueryProjectGroup = ArrayElement<NonNullable<QueryProject>['groups']>;

type QueryTask = ArrayElement<NonNullable<QueryProjectGroup>['tasks']>;

type QueryTaskChildTask = ArrayElement<NonNullable<QueryTask>['childTasks']>;

type Props = {
  workspace: WorkspacePageQuery['workspace'];
  searchValues: SearchTaskFormValues | undefined;
  companyMemberOptions: SelectOption[];
  onSearch: () => void;
  onUpdateSearch: (values: SearchTaskFormValues | undefined) => void;
  onUpdateProjectGroup: (group: QueryProjectGroup, title: string) => void;
  onDeleteProjectGroup: (group: QueryProjectGroup) => void;
  onViewProjectGroup: (group: QueryProjectGroup) => void;
};

const TableView = (props: Props) => {
  const {
    workspace,
    searchValues,
    companyMemberOptions,
    onSearch,
    onUpdateSearch,
    onUpdateProjectGroup,
    onDeleteProjectGroup,
    onViewProjectGroup,
  } = props;

  const [activeKeys, setActiveKeys] = useState<string[]>();

  useEffect(() => {
    if (workspace?.projects && !activeKeys) {
      const keys = workspace.projects.map((project) => project?.id as string);

      setActiveKeys(keys);
    }
  }, [workspace]);

  const handleActiveKeysChange = (key: string, keys: string[]) => {
    setActiveKeys(keys);
  };

  const handleClearSearch = () => {
    onUpdateSearch(undefined);
  };

  const getAllProjectGroupTasks = (group: QueryProjectGroup) => {
    let allTasks = group?.tasks
      ?.reduce<(QueryTask | QueryTaskChildTask)[]>((prev, task) => {
        return [...prev, task, ...(task?.childTasks || [])];
      }, [])
      .filter((task) => !task?.archived);

    allTasks = getVisibleTasks(allTasks || []);

    return allTasks;
  };

  const getVisibleTasks = (tasks: (QueryTask | QueryTaskChildTask)[]) => {
    let clone = [...tasks];

    if (searchValues) {
      Object.entries(searchValues).forEach(([key, value]) => {
        if (!value) {
          return;
        }

        if (key === 'name') {
          const regex = new RegExp(escapeRegExp(value as string), 'i');

          clone = clone.filter((task) => task?.name?.match(regex));
        } else if (key === 'timeline') {
          const [start, end] = value;

          clone = clone.filter(
            (task) =>
              task?.startDate &&
              task.endDate &&
              (dayjs(task.startDate).isBetween(start, end, null, '[]') ||
                dayjs(task.endDate).isBetween(start, end, null, '[]')),
          );
        } else if (key === 'assigneeIds') {
          clone = clone.filter((task) =>
            task?.members?.some(
              (member) =>
                member?.companyMember?.id &&
                value.includes(member.companyMember.id),
            ),
          );
        } else if (key === 'watcherIds') {
          clone = clone.filter((task) =>
            task?.watchers?.some(
              (watcher) =>
                watcher?.companyMember?.id &&
                value.includes(watcher.companyMember.id),
            ),
          );
        } else if (key === 'priority') {
          const values = value as string[];
          clone = clone.filter((task) =>
            values.some((value) => task?.priority?.includes(value)),
          );
        }
      });
    }

    return clone;
  };

  const columns: ColumnProps<QueryProjectGroup>[] = [
    {
      title: 'Group',
      width: 300,
      sorter: alphabeticalSort('name'),
      render: (col, item) => {
        const canEdit = !item?.id?.includes('DEFAULT');

        return (
          <div className="">
            {canEdit ? (
              <EditableTaskName
                value={item?.name || ''}
                onClick={() => {
                  onViewProjectGroup(item);
                }}
                onUpdate={(value) => onUpdateProjectGroup(item, value.trim())}
              />
            ) : (
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onViewProjectGroup(item)}
              >
                {item?.name}
              </div>
            )}
          </div>
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
            onViewProjectGroup(item);
          } else if (key === 'delete') {
            onDeleteProjectGroup(item);
          }
        };

        return (
          <Dropdown
            trigger="click"
            droplist={
              <Menu onClickMenuItem={handleClickMenuItem}>
                <Menu.Item key="view">View Detail</Menu.Item>
                {!item?.id?.includes('DEFAULT') && (
                  <>
                    <hr />
                    <Menu.Item key="delete">Delete</Menu.Item>
                  </>
                )}
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
      title: 'No. of tasks',
      width: 100,
      align: 'center',
      render: (col, item) => {
        const allTasks = getAllProjectGroupTasks(item);

        return allTasks.length;
      },
    },
    {
      title: 'Status',
      width: 100,
      render: (col, item) => {
        const allTasks = getAllProjectGroupTasks(item);

        const tasksWithStatus =
          allTasks?.filter((task) => task?.projectStatus) || [];
        const statuses = groupBy(tasksWithStatus, 'projectStatus.id');
        const total = tasksWithStatus.length;

        return (
          <div className="flex">
            {Object.entries(statuses).map(([key, tasks]) => {
              const width = (tasks.length / total) * 100;
              const color = tasks[0]?.projectStatus?.color;

              return (
                <div
                  key={key}
                  className={`gk-bg h-6 border border-white ${color}`}
                  style={{ width: `${width}%` }}
                />
              );
            })}
          </div>
        );
      },
    },
    {
      title: 'Due Date',
      width: 160,
      render: (col, item) => {
        const allTasks = getAllProjectGroupTasks(item);

        const timelines =
          allTasks?.reduce<number[]>((prev, task) => {
            if (task?.startDate && task.endDate) {
              return [
                ...prev,
                dayjs(task?.startDate).toDate().getTime(),
                dayjs(task?.endDate).toDate().getTime(),
              ];
            }

            return prev;
          }, []) || [];

        const min = timelines.length ? Math.min(...timelines) : undefined;
        const max = timelines.length ? Math.max(...timelines) : undefined;

        const value = min && max ? [dayjs(min), dayjs(max)] : [];

        return (
          <TaskTimelinePicker
            containerClassName="-m-2"
            disabled
            value={value}
          />
        );
      },
    },
    {
      title: 'Assignee',
      width: 160,
      render: (col, item) => {
        const allTasks = getAllProjectGroupTasks(item);

        const members = flatten(allTasks.map((task) => task?.members));
        const uniqueMembers = uniqBy(members, 'companyMember.user.id');

        return (
          <Avatar.Group size={24}>
            {uniqueMembers.map((member) => (
              <Avatar
                key={member?.id}
                showTooltip
                name={
                  member?.companyMember?.user?.name ||
                  member?.companyMember?.user?.email
                }
                imageSrc={member?.companyMember?.user?.profileImage}
              />
            ))}
          </Avatar.Group>
        );
      },
    },
    {
      title: 'Activity',
      width: 100,
      render: (col, item) => {
        const allTasks = getAllProjectGroupTasks(item);

        const hasComments = allTasks?.some((task) => task?.comments?.length);
        const hasAttachments = allTasks?.some(
          (task) => task?.attachments?.length,
        );

        return (
          <Space className="cursor-pointer" size={15}>
            <Badge count={hasComments} dot>
              <MdOutlineMessage
                className={`h-4 w-4 ${!hasComments && 'text-gray-300'}`}
              />
            </Badge>

            <Badge count={hasAttachments} dot>
              <MdOutlineAttachFile
                className={`h-4 w-4 ${!hasAttachments && 'text-gray-300'}`}
              />
            </Badge>
          </Space>
        );
      },
    },
    {
      title: 'Watchers',
      width: 160,
      render: (col, item) => {
        const allTasks = getAllProjectGroupTasks(item);

        const watchers = flatten(allTasks?.map((task) => task?.watchers));
        const uniqueWatchers = uniqBy(watchers, 'companyMember.id');

        return (
          <Avatar.Group size={24}>
            {uniqueWatchers.map((watcher) => (
              <Avatar
                key={watcher?.companyMember?.id}
                showTooltip
                name={
                  watcher?.companyMember?.user?.name ||
                  watcher?.companyMember?.user?.email
                }
                imageSrc={watcher?.companyMember?.user?.profileImage}
              />
            ))}
          </Avatar.Group>
        );
      },
    },
    {
      title: 'Contacts',
      width: 160,
      render: (col, item) => {
        const allTasks = getAllProjectGroupTasks(item);

        const pics = flatten(allTasks?.map((task) => task?.pics));
        const uniquePics = uniqBy(pics, 'pic.id');

        return (
          <Avatar.Group size={24}>
            {uniquePics.map((pic) => (
              <Avatar key={pic?.pic?.id} showTooltip name={pic?.pic?.name} />
            ))}
          </Avatar.Group>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex h-12 items-center justify-end border-b border-gray-300 px-2">
        <Button icon={<MdSearch />} onClick={onSearch} />
      </div>

      <div className="bg-gray-50 p-3">
        <SearchFilter
          values={searchValues}
          companyMemberOptions={companyMemberOptions}
          onClear={handleClearSearch}
          onUpdate={onUpdateSearch}
        />

        <Collapse
          className={styles.collapse}
          bordered={false}
          activeKey={activeKeys}
          onChange={handleActiveKeysChange}
        >
          {workspace?.projects
            ?.filter((project) => !project?.archived)
            .map((project) => (
              <Collapse.Item
                key={project?.id}
                name={`${project?.id}`}
                className="bg-gray-50 p-0"
                header={<h2 className="py-0">{project?.name}</h2>}
              >
                <Table
                  className={`rounded border border-gray-300 ${styles.table}`}
                  size="small"
                  columns={columns}
                  scroll={{ x: true }}
                  pagination={false}
                  rowSelection={
                    {
                      // selectedRowKeys: selectedRows.map((row) => row.id),
                      // onSelect: handleRowSelect,
                      // onSelectAll: (selected) =>
                      //   handleSelectAll(selected, group.data),
                    }
                  }
                  noDataElement={<div>There's nothing here yet.</div>}
                  data={project?.groups || []}
                />
              </Collapse.Item>
            ))}
        </Collapse>
      </div>
    </>
  );
};

export default TableView;
