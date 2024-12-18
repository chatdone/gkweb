import { flatten, uniqBy } from 'lodash-es';
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

import { ProjectPageQuery } from 'generated/graphql-types';

type QueryTask = ArrayElement<
  NonNullable<ProjectPageQuery['project']>['tasks']
>;

type QueryTaskChildTask = ArrayElement<NonNullable<QueryTask>['childTasks']>;

type Props = {
  project: ProjectPageQuery['project'];
};

const MembersChart = (props: Props) => {
  const { project } = props;

  const getTaskByMember = (memberId: string) => {
    if (!project?.tasks) {
      return [];
    }

    const allTasks = project.tasks.reduce<(QueryTask | QueryTaskChildTask)[]>(
      (prev, task) => {
        return [...prev, task, ...(task?.childTasks || [])];
      },
      [],
    );

    return allTasks.filter(
      (task) =>
        task?.members?.some(
          (member) => member?.companyMember?.id === memberId,
        ) && !task.archived,
    );
  };

  const data = useMemo(() => {
    if (!project?.tasks || !project.projectStatuses) {
      return [];
    }

    const allMembers = flatten(project.tasks.map((task) => task?.members));
    const uniqueMembers = uniqBy(allMembers, 'companyMember.id');

    return uniqueMembers.map((member) => {
      const tasks = getTaskByMember(member?.companyMember?.id as string);

      const statusCount =
        project?.projectStatuses?.reduce<{
          [key: string]: number;
        }>((prev, status) => {
          const statusTasks = tasks.filter(
            (task) => task?.projectStatus?.id === status?.id,
          );

          if (status?.id) {
            prev[status.id] = statusTasks.length;
          }

          return prev;
        }, {}) || {};

      return {
        name: member?.user?.name || member?.user?.email,
        ...statusCount,
      };
    });
  }, [project]);

  const statusData = useMemo(() => {
    if (!project?.projectStatuses) {
      return [];
    }

    return project.projectStatuses.map((status) => ({
      id: status?.id as string,
      name: status?.name as string,
      color: status?.color as string,
    }));
  }, [project]);

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
