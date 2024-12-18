import { Button, Grid, Typography } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { head } from 'lodash-es';
import { ReactNode, useState } from 'react';

import { Avatar } from '@/components';

import styles from './ActivityLogs.module.less';

import { useAppStore } from '@/stores/useAppStore';

import { ArrayElement } from '@/types';

import { TaskActionType, TaskModalPageQuery } from 'generated/graphql-types';

type QueryTaskActivity = ArrayElement<
  NonNullable<TaskModalPageQuery['task']>['taskActivities']
>;

type Props = {
  activities: QueryTaskActivity[];
};

const ActivityLogs = (props: Props) => {
  const { activities } = props;

  const { currentUser } = useAppStore();

  const [showCount, setShowCount] = useState<number>(5);

  const firstActivity = head(activities);

  const handleShowMore = () => {
    setShowCount((prev) => prev + 5);
  };

  return (
    <div className="flex">
      <div className="p-2">
        <Avatar
          size={24}
          name={
            firstActivity?.createdBy?.name || firstActivity?.createdBy?.email
          }
          imageSrc={firstActivity?.createdBy?.profileImage}
        />
      </div>

      <div
        className={`mb-2 flex-1 rounded border bg-white p-2 ${
          currentUser?.id === firstActivity?.createdBy?.id
            ? 'border-green-200 bg-green-50'
            : 'border-gray-200'
        } ${styles.logs}`}
      >
        <div>
          <div className="mb-2 flex text-xs">
            <div className="flex-1 opacity-50">
              {firstActivity?.createdBy?.name ||
                firstActivity?.createdBy?.email}
            </div>

            <div className="opacity-50">
              {dayjs(firstActivity?.createdAt).fromNow()}
            </div>
          </div>

          <div>
            {activities.slice(0, showCount).map((activity) => (
              <Grid.Row
                key={activity?.id}
                className="mb-1 text-xs"
                justify="space-between"
                align="center"
              >
                {getActivityMessage(activity)}
              </Grid.Row>
            ))}

            {activities.length - 1 > showCount && (
              <Grid.Row className="mt-4" justify="center">
                <Button type="text" onClick={handleShowMore}>
                  Show More
                </Button>
              </Grid.Row>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getActivityMessage = (
  activity: QueryTaskActivity | undefined,
): ReactNode => {
  const picName =
    activity?.targetPic?.user?.name ||
    activity?.targetPic?.user?.email ||
    '[User Deleted]';

  const assigneeName =
    activity?.targetMember?.user?.name ||
    activity?.targetMember?.user?.email ||
    '[User Deleted]';

  const attachmentName = activity?.attachment?.name;

  switch (activity?.actionType) {
    case TaskActionType.TaskCreated: {
      return <Typography.Paragraph>created this task</Typography.Paragraph>;
    }

    case TaskActionType.AssigneeAdded: {
      return (
        <Typography.Paragraph>
          assigned a member <b>{assigneeName}</b> to this task.
        </Typography.Paragraph>
      );
    }

    case TaskActionType.AssigneeRemoved: {
      return (
        <Typography.Paragraph>
          removed a member <b>{assigneeName}</b> from this task.
        </Typography.Paragraph>
      );
    }

    case TaskActionType.PicAdded: {
      return (
        <Typography.Paragraph>
          assigned an external party <b>{picName}</b> to this task.
        </Typography.Paragraph>
      );
    }

    case TaskActionType.PicRemoved: {
      return (
        <Typography.Paragraph>
          removed an external party <b>{picName}</b> from this task.
        </Typography.Paragraph>
      );
    }

    case TaskActionType.AttachmentUploaded: {
      return (
        <Typography.Paragraph>
          uploaded a file <b>{attachmentName}</b>.
        </Typography.Paragraph>
      );
    }

    case TaskActionType.AttachmentRemoved: {
      return (
        <Typography.Paragraph>
          removed file <b>{attachmentName}</b>.
        </Typography.Paragraph>
      );
    }

    case TaskActionType.TaskArchived: {
      return <Typography.Paragraph>archived this task.</Typography.Paragraph>;
    }

    case TaskActionType.TaskUnarchived: {
      return <Typography.Paragraph>unarchived this task.</Typography.Paragraph>;
    }

    case TaskActionType.TaskRemoved: {
      return <Typography.Paragraph>removed this task.</Typography.Paragraph>;
    }

    case TaskActionType.UpdatedDueDate: {
      return activity.fromDate ? (
        <Typography.Paragraph>
          updated the due date from{' '}
          <b>{dayjs(activity.fromDate).format('hh:mmA, DD MMM YYYY')}</b> to{' '}
          <b>{dayjs(activity?.toDate).format('hh:mmA, DD MMM YYYY')}</b>.
        </Typography.Paragraph>
      ) : (
        <Typography.Paragraph>
          updated the due date to{' '}
          <b>{dayjs(activity?.toDate).format('hh:mmA, DD MMM YYYY')}</b>.
        </Typography.Paragraph>
      );
    }

    case TaskActionType.UpdatedTeamStatus: {
      return (
        <Typography.Paragraph>
          updated the status to <b>{activity?.toCardStatus?.label}</b>.
        </Typography.Paragraph>
      );
    }

    case TaskActionType.UpdatedStartDate: {
      return activity.fromDate ? (
        <Typography.Paragraph>
          changed the start date from{' '}
          <b>{dayjs(activity.fromDate).format('hh:mmA, DD MMM YYYY')}</b> to{' '}
          <b>{dayjs(activity?.toDate).format('hh:mmA, DD MMM YYYY')}</b>.
        </Typography.Paragraph>
      ) : (
        <Typography.Paragraph>
          set the start date to{' '}
          <b>{dayjs(activity?.toDate).format('hh:mmA, DD MMM YYYY')}</b>.
        </Typography.Paragraph>
      );
    }

    case TaskActionType.UpdatedEndDate: {
      return activity.fromDate ? (
        <Typography.Paragraph>
          changed the end date from{' '}
          <b>{dayjs(activity.fromDate).format('hh:mmA, DD MMM YYYY')}</b> to{' '}
          <b>{dayjs(activity?.toDate).format('hh:mmA, DD MMM YYYY')}</b>.
        </Typography.Paragraph>
      ) : (
        <Typography.Paragraph>
          set the end date to{' '}
          <b>{dayjs(activity?.toDate).format('hh:mmA, DD MMM YYYY')}</b>.
        </Typography.Paragraph>
      );
    }

    default: {
      return <div />;
    }
  }
};

export default ActivityLogs;
