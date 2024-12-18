import { Badge } from '@arco-design/web-react';
import { flatten } from 'lodash-es';
import { useMemo } from 'react';
import { PieChart, Pie, Tooltip } from 'recharts';

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

const StatusChart = (props: Props) => {
  const { workspace } = props;

  const data = useMemo(() => {
    if (!workspace?.projects) {
      return [];
    }

    const statuses = workspace.projects.reduce<{
      [key: string]: { name: string; color: string; value: number };
    }>((prev, project) => {
      const projectStatuses =
        project?.projectStatuses?.reduce<{
          [key: string]: { name: string; color: string; value: number };
        }>(
          (prev, status) => ({
            ...prev,
            [status?.id as string]: {
              name: status?.name as string,
              color: status?.color as string,
              value: 0,
            },
          }),
          {},
        ) || {};

      const tasks = flatten(
        project?.groups?.map((group) => group?.tasks || []),
      );
      const allTasks = tasks.reduce<(QueryTask | QueryTaskChildTask)[]>(
        (prev, task) => [...prev, task, ...(task?.childTasks || [])],
        [],
      );

      allTasks.forEach((task) => {
        const statusId = task?.projectStatus?.id;
        if (statusId) {
          projectStatuses[statusId].value++;
        }
      });

      return { ...prev, ...projectStatuses };
    }, {});

    return Object.values(statuses);
  }, [workspace?.projects]);

  return (
    <div className={`w-full ${styles.chart}`}>
      <header>Status</header>

      <div className={styles.content}>
        <div className="flex justify-center">
          <PieChart width={250} height={250}>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" />
            <Tooltip />
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
