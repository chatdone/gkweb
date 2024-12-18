import { gql } from '@apollo/client';
import {
  Space,
  Typography,
  Avatar as ArcoAvatar,
  Grid,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import {
  MdChecklist,
  MdOutlineAttachFile,
  MdOutlineCalendarToday,
  MdOutlineModeComment,
} from 'react-icons/md';

import { Avatar } from '@/components';

import styles from './TaskListItem.module.less';

import { isTaskOverdue } from '@/utils/task.utils';

import { TaskBoardCategory, Task } from 'generated/graphql-types';

const AvatarGroup = ArcoAvatar.Group;

type Props = {
  task: Task | null | undefined;
  onClick: () => void;
};

export const fragment = gql`
  fragment TaskListItemFragment on Task {
    id
    name
    startDate
    endDate
    projectStatus {
      id
      color
      name
    }
    comments {
      id
    }
    checklists {
      id
    }
    members {
      id
      user {
        id
        email
        name
        profileImage
      }
    }
    attachments {
      id
    }
    project {
      id
      name
    }
  }
`;

const TaskListItem = (props: Props) => {
  const { task, onClick } = props;

  const isOverdue = isTaskOverdue(task);

  const showFooter =
    (task?.subtasks && task.subtasks.length > 0) ||
    (task?.attachments && task.attachments.length > 0) ||
    (task?.comments && task.comments.length > 0) ||
    (task?.members && task.members.length > 0);

  return (
    <div className={styles['task-list-item']} onClick={onClick}>
      <Grid.Row justify="space-between">
        <Typography.Text className={styles.title}>{task?.name}</Typography.Text>

        <Space>
          <MdOutlineCalendarToday
            className={`${styles.icon} ${isOverdue ? styles.overdue : ''}`}
          />

          <Typography.Text className={isOverdue ? styles.overdue : undefined}>
            {task?.startDate && task.endDate
              ? `${dayjs(task.startDate).format('D MMM YYYY')} - ${dayjs(
                  task.endDate,
                ).format('D MMM YYYY')}`
              : '-'}
          </Typography.Text>
        </Space>
      </Grid.Row>

      <Typography.Text className={styles.subtitle}>
        {task?.project?.name}
      </Typography.Text>

      {showFooter && (
        <Grid.Row justify="space-between">
          <Space size={15}>
            {task.checklists && task.checklists.length > 0 && (
              <Space>
                <MdChecklist className={styles['footer-icon']} />

                <Typography.Text>{`${
                  task.checklists.filter((checklist) => checklist?.checked)
                    .length
                }/${task.checklists.length}`}</Typography.Text>
              </Space>
            )}

            {task.comments && task.comments.length > 0 && (
              <Space>
                <MdOutlineModeComment className={styles['footer-icon']} />

                <Typography.Text>{task.comments.length}</Typography.Text>
              </Space>
            )}

            {task.attachments && task.attachments.length > 0 && (
              <Space>
                <MdOutlineAttachFile className={styles['footer-icon']} />

                <Typography.Text>{task.attachments.length}</Typography.Text>
              </Space>
            )}
          </Space>

          <AvatarGroup size={20}>
            {task.members?.map((member) => (
              <Avatar
                key={member?.id}
                name={member?.user?.name || member?.user?.email}
                imageSrc={member?.user?.profileImage}
              />
            ))}
          </AvatarGroup>
        </Grid.Row>
      )}
    </div>
  );
};

export default TaskListItem;
