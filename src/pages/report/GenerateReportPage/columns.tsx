import { Space } from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { ReactNode } from 'react';

import { CompanyTag } from '@/components';

import { formatToCurrency } from '@/utils/currency.utils';
import { formatToHoursAndMinutes } from '@/utils/date.utils';

export type Footer = {
  key?: string;
  className?: string;
  colSpan?: number;
  content?: ReactNode;
};

type ReportColumn = {
  columns: ColumnProps[];
  keyOptions: { label: string; value: string }[];
  initialKeys: string[];
  summary?: (payload: {
    data: unknown[];
    visibleKeys: string[];
    visibleColumns: ColumnProps[];
  }) => Footer[];
};

const taskColumns: ColumnProps[] = [
  {
    key: 'task',
    title: 'Task',
    dataIndex: 'name',
    width: 200,
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'statusLabel',
    width: 200,
  },
  {
    key: 'dueDate',
    title: 'Due Date',
    dataIndex: 'dueDate',
    width: 200,
  },
  {
    key: 'createdDate',
    title: 'Created Date',
    dataIndex: 'createdAt',
    width: 200,
  },
  {
    key: 'team',
    title: 'Team',
    dataIndex: 'teamTitle',
    width: 200,
  },
  {
    key: 'assignee',
    title: 'Assignee',
    dataIndex: 'assignee',
    width: 200,
  },
  {
    key: 'board',
    title: 'Board',
    dataIndex: 'boardName',
    width: 200,
  },
  {
    key: 'boardDescription',
    title: 'Board Description',
    dataIndex: 'taskBoardDescription',
    width: 200,
  },
  {
    key: 'type',
    title: 'Type',
    dataIndex: 'taskBoardType',
    width: 200,
  },
  {
    key: 'contact',
    title: 'Contact',
    dataIndex: 'contactName',
    width: 200,
  },
  {
    key: 'pic',
    title: 'PIC',
    dataIndex: 'pics',
    width: 200,
  },
  {
    key: 'tags',
    title: 'Tags',
    width: 200,
    render: (col, item) => {
      const { tagColors, tagNames } = item;

      const names = tagNames?.split(', ');
      const colors = tagColors?.split(', ');

      const tags = names?.map((name: string, index: number) => ({
        label: name,
        color: colors[index],
      }));

      return (
        <Space>
          {tags?.map((tag: { label: string; color: string }, index: number) => (
            <CompanyTag key={index} color={tag.color}>
              {tag.label}
            </CompanyTag>
          ))}
        </Space>
      );
    },
  },
];

const attendanceColumns: ColumnProps[] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'memberName',
    width: 200,
  },
  {
    key: 'activity',
    title: 'Activity',
    dataIndex: 'activity',
    width: 200,
  },
  {
    key: 'employeeType',
    title: 'Employee Type',
    dataIndex: 'employeeType',
    width: 200,
  },
  {
    key: 'workedHours',
    title: 'Worked Hours',
    width: 200,
    render: (col, item) => {
      return item.workedHours ? formatToHoursAndMinutes(item.workedHours) : '-';
    },
  },
  {
    key: 'overtime',
    title: 'Overtime',
    width: 200,
    render: (col, item) => {
      return item.overtime ? formatToHoursAndMinutes(item.overtime) : '-';
    },
  },
  {
    key: 'break',
    title: 'Break Hours',
    width: 200,
    render: (col, item) => {
      return item.breakHours ? formatToHoursAndMinutes(item.breakHours) : '-';
    },
  },
  {
    key: 'note',
    title: 'Notes',
    dataIndex: 'comments',
    width: 200,
  },
  {
    key: 'location',
    title: 'Location',
    width: 200,
    render: (col, item) => {
      return item.locationName || '-';
    },
  },
  {
    key: 'date',
    title: 'Date',
    width: 200,
    render: (col, item) => {
      return dayjs(item.period).format('DD MMM YYYY');
    },
  },
  {
    key: 'contact',
    title: 'Contact',
    width: 200,
    render: (col, item) => {
      return item.contactName || '-';
    },
  },
  {
    key: 'tags',
    title: 'Tags',
    width: 200,
    render: (col, item) => {
      const { tagColors, tagNames } = item;

      const names = tagNames?.split(', ');
      const colors = tagColors?.split(', ');

      const tags = names?.map((name: string, index: number) => ({
        label: name,
        color: colors[index],
      }));

      return (
        <Space>
          {tags?.map((tag: { label: string; color: string }, index: number) => (
            <CompanyTag key={index} color={tag.color}>
              {tag.label}
            </CompanyTag>
          ))}
        </Space>
      );
    },
  },
];

const projectColumns: ColumnProps[] = [
  {
    key: 'task',
    title: 'Task',
    dataIndex: 'taskName',
    width: 200,
  },
  {
    key: 'project',
    title: 'Project',
    dataIndex: 'projectName',
    width: 200,
  },
  {
    key: 'owner',
    title: 'Project Owner',
    dataIndex: 'projectOwner',
    width: 200,
  },
  // {
  //   key: 'team',
  //   title: 'Team',
  //   dataIndex: 'teamName',
  //   width: 200,
  // },
  {
    key: 'assignee',
    title: 'Assignees',
    dataIndex: 'assignee',
    width: 200,
  },
  {
    key: 'status',
    title: 'Statuses',
    dataIndex: 'subStatus',
    width: 200,
  },
  {
    key: 'projectedCost',
    title: 'Projected Cost',
    dataIndex: 'projected_cost',
    width: 200,
  },
  {
    key: 'actualCost',
    title: 'Actual Cost',
    dataIndex: 'actual_cost',
    width: 200,
  },
  // {
  //   key: 'contact',
  //   title: 'Contact',
  //   dataIndex: 'contactName',
  //   width: 200,
  // },
  {
    key: 'targetedStart',
    title: 'Targeted Start',
    dataIndex: 'start_date',
    width: 200,
  },
  {
    key: 'targetedEnd',
    title: 'Targeted End',
    dataIndex: 'end_date',
    width: 200,
  },
  {
    key: 'actualStart',
    title: 'Actual Start',
    dataIndex: 'actual_start',
    width: 200,
  },
  {
    key: 'actualEnd',
    title: 'Actual End',
    dataIndex: 'actual_end',
    width: 200,
  },
  {
    key: 'effortSpent',
    title: 'Effort Spent',
    dataIndex: 'effort_spent',
    width: 200,
  },
  {
    key: 'variance',
    title: 'Variance',
    dataIndex: 'variance',
    width: 200,
  },
  {
    key: 'tags',
    title: 'Tags',
    width: 200,
    render: (col, item) => {
      const { tagColors, tagNames } = item;

      const names = tagNames?.split(', ');
      const colors = tagColors?.split(', ');

      const tags = names?.map((name: string, index: number) => ({
        label: name,
        color: colors[index],
      }));

      return (
        <Space>
          {tags?.map((tag: { label: string; color: string }, index: number) => (
            <CompanyTag key={index} color={tag.color}>
              {tag.label}
            </CompanyTag>
          ))}
        </Space>
      );
    },
  },
];

const invoiceColumns: ColumnProps[] = [
  {
    key: 'index',
    title: '#',
    width: 25,
    align: 'center',
    render: (col, item, index) => {
      return <div className="text-gray-300">{index + 1}</div>;
    },
  },
  {
    key: 'date',
    title: 'Date',
    width: 100,
    render: (col, item) => {
      return dayjs(item.date).format('MMM DD, YYYY');
    },
  },
  {
    key: 'docNo',
    title: 'Reference',
    dataIndex: 'reference',
    width: 100,
  },
  {
    key: 'customer',
    title: 'Customer',
    dataIndex: 'customer',
    width: 200,
  },
  {
    key: 'billed',
    title: 'Billed (RM)',
    dataIndex: 'billed',
    width: 100,
    align: 'right',
  },
  {
    key: 'balance',
    title: 'Balance (RM)',
    dataIndex: 'balance',
    width: 100,
    align: 'right',
  },
];

const reportColumns: Record<string, ReportColumn> = {
  task: {
    columns: taskColumns,
    keyOptions: taskColumns.map((column) => ({
      label: column.title as string,
      value: column.key as string,
    })),
    initialKeys: ['task', 'status', 'dueDate', 'team', 'assignee'],
  },
  attendance: {
    columns: attendanceColumns,
    keyOptions: attendanceColumns.map((column) => ({
      label: column.title as string,
      value: column.key as string,
    })),
    initialKeys: ['name', 'workedHours', 'overtime', 'break'],
  },
  project: {
    columns: projectColumns,
    keyOptions: projectColumns.map((column) => ({
      label: column.title as string,
      value: column.key as string,
    })),
    initialKeys: ['task', 'status', 'assignee'],
  },
  invoice: {
    columns: invoiceColumns,
    keyOptions: invoiceColumns.map((column) => ({
      label: column.title as string,
      value: column.key as string,
    })),
    initialKeys: ['index', 'date', 'docNo', 'customer', 'billed', 'balance'],
    summary: ({ data, visibleKeys, visibleColumns }) => {
      const items: Footer[] = [];

      if (visibleKeys.includes('billed')) {
        const totalBilled = data.reduce<number>(
          //@ts-ignore
          (prev, item) => prev + +item.billed,
          0,
        );

        items.push({
          key: 'billed',
          className: 'text-right font-bold',
          content: formatToCurrency(totalBilled),
        });
      }

      if (visibleKeys.includes('balance')) {
        const totalBalance = data.reduce<number>(
          //@ts-ignore
          (prev, item) => prev + +item.balance,
          0,
        );

        items.push({
          key: 'balance',
          className: 'text-right font-bold',
          content: formatToCurrency(totalBalance),
        });
      }

      if (items.length) {
        const firstItem = items[0];

        const index = visibleColumns.findIndex(
          (col) => col.key === firstItem.key,
        );

        items.unshift({
          colSpan: index,
        });
      }

      return items;
    },
  },
};

export default reportColumns;
