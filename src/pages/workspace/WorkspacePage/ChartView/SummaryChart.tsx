import dayjs from 'dayjs';
import { flatten, uniqBy } from 'lodash-es';

import styles from './Chart.module.less';

import { ArrayElement } from '@/types';

import { WorkspacePageQuery } from 'generated/graphql-types';

type QueryProject = ArrayElement<
  NonNullable<WorkspacePageQuery['workspace']>['projects']
>;

type QueryProjectGroup = ArrayElement<NonNullable<QueryProject>['groups']>;

type QueryTask = ArrayElement<NonNullable<QueryProjectGroup>['tasks']>;

type QueryTaskMember = ArrayElement<NonNullable<QueryTask>['members']>;

type QueryTaskComment = ArrayElement<NonNullable<QueryTask>['comments']>;

type QueryTaskAttachment = ArrayElement<NonNullable<QueryTask>['attachments']>;

type Props = {
  workspace: WorkspacePageQuery['workspace'];
};

const SummaryChart = (props: Props) => {
  const { workspace } = props;

  const getTotalGroupCount = () => {
    if (!workspace?.projects) {
      return 0;
    }

    return workspace.projects.reduce(
      (prev, project) => prev + (project?.groups?.length || 0),
      0,
    );
  };

  const getTotalTaskCount = () => {
    if (!workspace?.projects) {
      return 0;
    }

    return workspace.projects.reduce((prev, project) => {
      const parentTasks = flatten(
        project?.groups?.map((group) => group?.tasks),
      );
      const subtasks = flatten(
        parentTasks.map((task) =>
          task?.childTasks?.filter((task) => !task?.archived),
        ),
      );

      return prev + parentTasks.length + subtasks.length;
    }, 0);
  };

  const getTotalMemberCount = () => {
    if (!workspace?.projects) {
      return 0;
    }

    const allProjectMembers = workspace.projects.reduce<QueryTaskMember[]>(
      (prev, project) => {
        const parentTasks = flatten(
          project?.groups?.map((group) => group?.tasks),
        );
        const subtasks = flatten(
          parentTasks.map((task) =>
            task?.childTasks?.filter((task) => !task?.archived),
          ),
        );

        const allMembers = [...parentTasks, ...subtasks].reduce<
          QueryTaskMember[]
        >((prev, task) => [...prev, ...(task?.members || [])], []);

        return [...prev, ...allMembers];
      },
      [],
    );

    const uniqueMembers = uniqBy(allProjectMembers, 'user.id');

    return uniqueMembers.length;
  };

  const getTotalCommentCount = () => {
    if (!workspace?.projects) {
      return 0;
    }

    return workspace.projects.reduce((prev, project) => {
      const parentTasks = flatten(
        project?.groups?.map((group) => group?.tasks || []),
      );
      const subtasks = flatten(
        parentTasks.map((task) =>
          task?.childTasks?.filter((task) => !task?.archived),
        ),
      );

      const allComments = [...parentTasks, ...subtasks].reduce<
        QueryTaskComment[]
      >((prev, task) => [...prev, ...(task?.comments || [])], []);

      return prev + allComments.length;
    }, 0);
  };

  const getTotalAttachmentCount = () => {
    if (!workspace?.projects) {
      return 0;
    }

    return workspace.projects.reduce((prev, project) => {
      const parentTasks = flatten(
        project?.groups?.map((group) => group?.tasks),
      );
      const subtasks = flatten(
        parentTasks.map((task) =>
          task?.childTasks?.filter((task) => !task?.archived),
        ),
      );

      const allAttachments = [...parentTasks, ...subtasks].reduce<
        QueryTaskAttachment[]
      >((prev, task) => [...prev, ...(task?.attachments || [])], []);

      return prev + allAttachments.length;
    }, 0);
  };

  const getDuration = () => {
    if (!workspace?.projects) {
      return '0d';
    }

    const allProjectTimelines = workspace.projects.reduce<number[]>(
      (prev, project) => {
        const parentTasks = flatten(
          project?.groups?.map((group) => group?.tasks),
        );
        const subtasks = flatten(
          parentTasks.map((task) =>
            task?.childTasks?.filter((task) => !task?.archived),
          ),
        );

        const timelines = [...parentTasks, ...subtasks].reduce<number[]>(
          (prev, task) => {
            if (task?.startDate && task.endDate) {
              return [
                ...prev,
                dayjs(task.startDate).toDate().getTime(),
                dayjs(task.endDate).toDate().getTime(),
              ];
            }

            return prev;
          },
          [],
        );

        return [...prev, ...timelines];
      },
      [],
    );

    const min = allProjectTimelines.length
      ? Math.min(...allProjectTimelines)
      : undefined;
    const max = allProjectTimelines.length
      ? Math.max(...allProjectTimelines)
      : undefined;

    const duration =
      min && max ? dayjs(max).diff(dayjs(min), 'day', true).toFixed(2) : [];

    return `${duration}d`;
  };

  return (
    <div className={`w-full !bg-gray-50 ${styles.chart}`}>
      <header>Summary</header>

      <div className={styles.content}>
        <div className="grid grid-cols-3 gap-2">
          <SummaryItem title="Groups" value={getTotalGroupCount()} />
          <SummaryItem title="Tasks" value={getTotalTaskCount()} />
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
