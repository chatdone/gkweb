import dayjs from 'dayjs';
import { flatten, uniqBy } from 'lodash-es';

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

const SummaryChart = (props: Props) => {
  const { project } = props;

  const getAllTasks = () => {
    if (!project?.tasks) {
      return [];
    }

    const allTasks = project.tasks.reduce<(QueryTask | QueryTaskChildTask)[]>(
      (prev, task) => {
        return [...prev, task, ...(task?.childTasks || [])];
      },
      [],
    );

    return allTasks.filter((task) => !task?.archived);
  };

  const getTotalMemberCount = () => {
    const allMembers = flatten(getAllTasks().map((task) => task?.members));
    const uniqueMembers = uniqBy(allMembers, 'companyMember.id');

    return uniqueMembers.length;
  };

  const getTotalCommentCount = () => {
    return getAllTasks().reduce(
      (prev, task) => prev + (task?.comments?.length || 0),
      0,
    );
  };

  const getTotalAttachmentCount = () => {
    return getAllTasks().reduce(
      (prev, task) => prev + (task?.attachments?.length || 0),
      0,
    );
  };

  const getDuration = () => {
    const timelines = getAllTasks().reduce<number[]>((prev, task) => {
      if (task?.startDate && task.endDate) {
        return [
          ...prev,
          dayjs(task.startDate).toDate().getTime(),
          dayjs(task.endDate).toDate().getTime(),
        ];
      }

      return prev;
    }, []);

    const min = timelines.length ? Math.min(...timelines) : undefined;
    const max = timelines.length ? Math.max(...timelines) : undefined;

    const duration =
      min && max ? dayjs(max).diff(dayjs(min), 'day', true).toFixed(2) : [];

    return `${duration}d`;
  };

  return (
    <div className={`w-full !bg-gray-50 ${styles.chart}`}>
      <header>Summary</header>

      <div className={styles.content}>
        <div className="grid grid-cols-3 gap-2">
          <SummaryItem title="Groups" value={project?.groups?.length || 0} />
          <SummaryItem title="Tasks" value={getAllTasks().length} />
          <SummaryItem title="Members" value={getTotalMemberCount()} />
          <SummaryItem title="Duration" value={getDuration()} />
          <SummaryItem title="Conversation" value={getTotalCommentCount()} />
          <SummaryItem title="Files" value={getTotalAttachmentCount()} />
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => {
  return (
    <div className="rounded bg-white px-4 py-8 text-center shadow">
      {title}
      <div className="text-2xl">{value}</div>
    </div>
  );
};

export default SummaryChart;
