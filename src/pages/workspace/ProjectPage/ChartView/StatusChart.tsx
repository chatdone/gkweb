import { Badge } from '@arco-design/web-react';
import { useMemo } from 'react';
import { PieChart, Pie } from 'recharts';

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

const StatusChart = (props: Props) => {
  const { project } = props;

  const getTaskCountByStatus = (statusId: string) => {
    if (!project?.tasks) {
      return 0;
    }

    const allTasks = project.tasks.reduce<(QueryTask | QueryTaskChildTask)[]>(
      (prev, task) => {
        return [...prev, task, ...(task?.childTasks || [])];
      },
      [],
    );

    return allTasks.filter(
      (task) => task?.projectStatus?.id === statusId && !task.archived,
    ).length;
  };

  const data = useMemo(() => {
    if (!project?.projectStatuses) {
      return [];
    }

    return project.projectStatuses.map((status) => ({
      name: status?.name as string,
      value: getTaskCountByStatus(status?.id as string),
      color: status?.color as string,
    }));
  }, [project]);

  return (
    <div className={`w-full ${styles.chart}`}>
      <header>Status</header>

      <div className={styles.content}>
        <div className="flex justify-center">
          <PieChart width={250} height={250}>
            <Pie
              data={
                data.every((item) => item.value === 0) ? [{ value: 1 }] : data
              }
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
            />
          </PieChart>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-y-2">
            {data.map((item) => (
              <div key={item.name}>
                <Badge
                  color={item.color}
                  // @ts-ignore
                  text={
                    <div>
                      {item.name}
                      <span className="ml-2 inline-block">({item.value})</span>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusChart;
