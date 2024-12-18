import { Chart, Axis, Line, Area } from 'bizcharts';
import dayjs from 'dayjs';
import { groupBy } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ChartTooltip, EmptyContent } from '@/components';

import styles from './TaskCard.module.less';

import Icons from '@/assets/icons';

import { HomePageQuery, TaskBoardCategory } from 'generated/graphql-types';

type QueryTasks = NonNullable<HomePageQuery['tasks']>;

type Props = {
  tasks: QueryTasks;
};

const TaskChart = (props: Props) => {
  const { tasks } = props;

  const { t } = useTranslation();

  const [chartData, setChartData] = useState<{ time: string; count: number }[]>(
    [],
  );

  useEffect(() => {
    if (tasks.length > 0) {
      // const tasksWithDueDate = tasks.filter((task) =>
      //   task?.taskBoard?.category === TaskBoardCategory.Project
      //     ? task.endDate
      //     : task?.dueDate,
      // );
      // const groupedTasks = groupBy(tasksWithDueDate, (task) =>
      //   dayjs(
      //     task?.taskBoard?.category === TaskBoardCategory.Project
      //       ? task.endDate
      //       : task?.dueDate,
      //   ).format('YYYY-MM-DD'),
      // );
      // const data = Object.entries(groupedTasks).map(([key, value]) => ({
      //   time: key,
      //   count: value.length,
      // }));
      // setChartData(data);
    } else {
      setChartData([]);
    }
  }, [tasks]);

  return (
    <Chart
      height={300}
      autoFit
      padding="auto"
      scale={{ type: 'time', count: { min: 0 } }}
      data={chartData}
      // placeholder
    >
      <Axis
        name="count"
        grid={{
          line: {
            style: {
              lineDash: [4, 4],
            },
          },
        }}
      />
      <Line
        shape="smooth"
        position="time*count"
        size={3}
        color="l (0) 0:#1EE7FF .57:#249AFF .85:#6F42FB"
      />
      <Area
        position="time*count"
        shape="smooth"
        color="l (90) 0:rgba(17, 126, 255, 0.5)  1:rgba(17, 128, 255, 0)"
      />

      <ChartTooltip
        showBadge={false}
        name="Tasks"
        config={{
          marker: {
            lineWidth: 3,
            stroke: '#4080FF',
            fill: '#ffffff',
            symbol: 'circle',
            r: 8,
          },
          crosshairs: {
            line: {
              style: {
                stroke: '#4080FF',
                lineDash: [5],
                lineWidth: 2,
              },
            },
          },
        }}
      />

      {chartData.length === 0 && (
        <div className={styles['empty-chart-container']}>
          <EmptyContent
            title={t('fills.nothingHere')}
            subtitle={t('fills.createTask')}
            iconSrc={Icons.emptyTasks}
          />
        </div>
      )}
    </Chart>
  );
};

export default TaskChart;
