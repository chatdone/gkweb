import { flatten } from 'lodash-es';
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

const MembersChart = (props: Props) => {
  const { workspace } = props;

  const data = useMemo(() => {
    if (!workspace?.projects) {
      return [];
    }

    const memberStatuses = workspace.projects.reduce<{
      [key: string]: { [key: string]: string | number };
    }>((prev, project) => {
      const tasks = flatten(
        project?.groups?.map((group) => group?.tasks || []),
      );
      const allTasks = tasks.reduce<(QueryTask | QueryTaskChildTask)[]>(
        (prev, task) => [...prev, task, ...(task?.childTasks || [])],
        [],
      );
      const tasksWithStatus = allTasks.filter(
        (task) => task?.projectStatus?.id,
      );

      tasksWithStatus.forEach((task) => {
        const statusId = task?.projectStatus?.id as string;

        task?.members?.forEach((member) => {
          if (member?.companyMember?.id) {
            if (prev[member.companyMember.id]) {
              if (prev[member.companyMember.id][statusId]) {
                (prev[member.companyMember.id][statusId] as number)++;
              } else {
                prev[member.companyMember.id][statusId] = 1;
              }
            } else {
              prev[member.companyMember.id] = {
                id: member.companyMember.id,
                name: (member.companyMember.user?.name ||
                  member.companyMember.user?.email) as string,
                [statusId]: 1,
              };
            }
          }
        });
      });

      return prev;
    }, {});

    return Object.values(memberStatuses);
  }, [workspace?.projects]);

  const statusData = useMemo(() => {
    if (!workspace?.projects) {
      return [];
    }

    return workspace.projects.reduce<
      { id: string; name: string; color: string }[]
    >((prev, project) => {
      if (project?.projectStatuses) {
        const items = project.projectStatuses.map((status) => ({
          id: status?.id as string,
          name: status?.name as string,
          color: status?.color as string,
        }));

        return [...prev, ...items];
      }

      return prev;
    }, []);
  }, [workspace?.projects]);

  return (
    <div className={`w-full ${styles.chart}`}>
      <header>Members</header>

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
                key={status.name}
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

export default MembersChart;
