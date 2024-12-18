import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import styles from './Chart.module.less';

import { ArrayElement } from '@/types';

import { WorkspacePageQuery } from 'generated/graphql-types';

type QueryTask = ArrayElement<
  NonNullable<
    ArrayElement<
      NonNullable<
        ArrayElement<NonNullable<WorkspacePageQuery['workspace']>['projects']>
      >['groups']
    >
  >['tasks']
>;

type QueryTaskChildTask = ArrayElement<NonNullable<QueryTask>['childTasks']>;

type Props = {
  workspace: WorkspacePageQuery['workspace'];
};

const GroupChart = (props: Props) => {
  const { workspace } = props;

  const data = useMemo(() => {
    if (!workspace?.projects) {
      return [];
    }

    const groupMap = workspace.projects.reduce<{
      [key: string]: { [key: string]: string | number };
    }>((prev, project) => {
      project?.groups?.forEach((group) => {
        const groupId = group?.id as string;
        if (!prev[groupId]) {
          prev[groupId] = {
            id: groupId,
            name: group?.name as string,
          };
        }

        const allTasks = group?.tasks?.reduce<
          (QueryTask | QueryTaskChildTask)[]
        >((prev, task) => [...prev, task, ...(task?.childTasks || [])], []);

        project?.projectStatuses?.forEach((status) => {
          const statusId = status?.id;
          const statusTasks = allTasks?.filter(
            (task) => task?.projectStatus?.id === statusId,
          );

          if (statusId) {
            prev[groupId][statusId] = statusTasks?.length || 0;
          }
        });
      });

      return prev;
    }, {});

    return Object.values(groupMap);
  }, [workspace?.projects]);

  const statusData = useMemo(() => {
    if (!workspace?.projects) {
      return [];
    }

    return workspace.projects.reduce<
      { id: string; name: string; color: string }[]
    >((prev, project) => {
      const projectStatuses =
        project?.projectStatuses?.map((status) => ({
          id: status?.id as string,
          name: status?.name as string,
          color: status?.color as string,
        })) || [];

      return [...prev, ...projectStatuses];
    }, []);
  }, [workspace?.projects]);

  return (
    <div className={`w-full ${styles.chart}`}>
      <header>Group</header>

      <div className={styles.content}>
        <div className="flex justify-center">
          <BarChart width={350} height={350} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Legend />

            {statusData.map((status) => (
              <Bar
                key={status.id}
                dataKey={status.id}
                stackId="a"
                color={status.color}
                fill={fill[status.color]}
                name={status.name}
              />
            ))}
          </BarChart>
        </div>
      </div>
    </div>
  );
};

const fill: { [key: string]: string } = {
  red: '#F53F3F',
  orangered: '#F77234',
  orange: '#FF7D00',
  gold: '#F7BA1E',
  yellow: '#FADC19',
  lime: '#9FDB1D',
  green: '#00B42A',
  cyan: '#14C9C9',
  blue: '#3491FA',
  purple: '#722ED1',
  pinkpurple: '#D91AD9',
  magenta: '#F5319D',
  gray: '#86909c',
};

export default GroupChart;
