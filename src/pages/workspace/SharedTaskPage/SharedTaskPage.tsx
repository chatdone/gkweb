import { gql, useQuery } from '@apollo/client';
import { Badge, Tag } from '@arco-design/web-react';
import { capitalize } from 'lodash-es';
import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { Avatar } from '@/components';
import TaskTimelinePicker from '@/components/TaskTimelinePIcker';

import DetailsPanel from '../TaskModalPage/DetailsPanel';

import { getTaskReminderOptions } from '@/utils/task.utils';

import { DATE_LIST, MONTH_LIST } from '@/constants/date.constants';
import {
  taskRecurringDayOptions,
  TASK_PRIORITY_COLORS,
  TASK_RECURRING_CASCADER_OPTIONS,
} from '@/constants/task.constants';

import {
  SharedTaskPageQuery,
  SharedTaskPageQueryVariables,
} from 'generated/graphql-types';

const SharedTaskPage = () => {
  const { taskId } = useParams();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    SharedTaskPageQuery,
    SharedTaskPageQueryVariables
  >(sharedTaskPageQuery, {
    variables: {
      taskId: taskId as string,
    },
    skip: !taskId,
  });

  const getVisibleProperties = () => {
    if (!queryData?.task?.project?.projectSettings?.columns) {
      return [];
    }

    return Object.keys(queryData.task.project.projectSettings.columns);
  };

  const renderOptionalProperties = () => {
    const visibleProperties = getVisibleProperties();

    let properties = [
      {
        key: 'assignee',
        label: 'Assignee',
        component: () => {
          return queryData?.task?.members?.length ? (
            <Avatar.Group size={24}>
              {queryData.task.members.map((member) => (
                <Avatar
                  key={member?.id}
                  name={
                    member?.companyMember?.user?.name ||
                    member?.companyMember?.user?.email
                  }
                  imageSrc={member?.companyMember?.user?.profileImage}
                />
              ))}
            </Avatar.Group>
          ) : (
            '-'
          );
        },
      },
      {
        key: 'watchers',
        label: 'Watchers',
        component: () => {
          return queryData?.task?.watchers?.length ? (
            <Avatar.Group size={24}>
              {queryData.task.watchers.map((watcher) => (
                <Avatar
                  key={watcher?.companyMember?.id}
                  name={
                    watcher?.companyMember?.user?.name ||
                    watcher?.companyMember?.user?.email
                  }
                  imageSrc={watcher?.companyMember?.user?.profileImage}
                />
              ))}
            </Avatar.Group>
          ) : (
            '-'
          );
        },
      },
      {
        key: 'contacts',
        label: 'Contacts',
        component: () => {
          return queryData?.task?.pics?.length ? (
            <Avatar.Group size={24}>
              {queryData.task.pics.map((pic) => (
                <Avatar key={pic?.id} name={pic?.pic?.name} />
              ))}
            </Avatar.Group>
          ) : (
            '-'
          );
        },
      },
      {
        key: 'priority',
        label: 'Priority',
        component: () => {
          return queryData?.task?.priority ? (
            <Badge
              color={TASK_PRIORITY_COLORS[queryData.task.priority]}
              text={capitalize(queryData.task.priority.toString())}
            />
          ) : (
            '-'
          );
        },
      },
      {
        key: 'reminder',
        label: 'Reminder',
        component: () => {
          const options = getTaskReminderOptions(queryData?.task);
          const selectedOption = options.find(
            (option) => option.value === queryData?.task?.dueReminder,
          );

          return (
            <div>
              {queryData?.task?.startDate
                ? selectedOption?.label
                : 'Not Available'}
            </div>
          );
        },
      },
      {
        key: 'recurrence',
        label: 'Recurrence',
        component: () => {
          const value: string[] = [];

          const option = TASK_RECURRING_CASCADER_OPTIONS.find(
            (option) =>
              option.value ===
              queryData?.task?.templateTask?.recurringSetting?.intervalType,
          );

          option?.label && value.push(option.label);

          if (queryData?.task?.templateTask?.isRecurring) {
            if (
              queryData.task.templateTask.recurringSetting?.intervalType ===
              'DAILY'
            ) {
              queryData.task.templateTask.recurringSetting.skipWeekend
                ? value.push('Working day only')
                : value.push('Everyday');
            } else if (
              [
                'WEEKLY',
                'FIRST_WEEK',
                'SECOND_WEEK',
                'THIRD_WEEK',
                'FOURTH_WEEK',
                'MONTHLY',
              ].includes(
                queryData.task.templateTask.recurringSetting?.intervalType ||
                  '',
              )
            ) {
              const dayOption = taskRecurringDayOptions.find(
                (option) =>
                  option.value ===
                  queryData.task?.templateTask?.recurringSetting?.day,
              );

              dayOption?.label && value.push(dayOption.label);
            } else if (
              queryData.task.templateTask.recurringSetting?.intervalType ===
              'YEARLY'
            ) {
              const month = MONTH_LIST.find(
                (month) =>
                  month.value ===
                  queryData.task?.templateTask?.recurringSetting?.month,
              );
              const day = DATE_LIST.find(
                (day) =>
                  day.value ===
                  queryData.task?.templateTask?.recurringSetting?.day,
              );

              month && value.push(month.label);
              day && value.push(day.label);
            }
          }

          return <div>{value.join('/')}</div>;
        },
      },
      {
        key: 'tags',
        label: 'Tags',
        component: () => {
          return (
            <div>
              {queryData?.task?.tags?.length
                ? queryData.task.tags.map((tag) => tag?.name).join(',')
                : '-'}
            </div>
          );
        },
      },
    ];

    properties = properties.filter((property) =>
      visibleProperties.includes(property.key),
    );

    return properties.map((property) => (
      <RightPanelItem key={property.key} label={property.label}>
        {property.component()}
      </RightPanelItem>
    ));
  };

  return (
    <div className="bg-white">
      <div className="h-14 py-3">
        <h1>{queryData?.task?.name}</h1>
      </div>

      <hr />

      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-2">
          <div className="p-1">
            <div className="p-4 text-gray-600">
              {queryData?.task?.description || 'No Description'}
            </div>

            <DetailsPanel
              isSharedWithMe={true}
              task={queryData?.task}
              canAccessDedoco={false}
              refetchQuery={refetchQuery}
              onGoogleDriveOpen={() => {
                //
              }}
            />
          </div>
        </div>

        <div className="col-span-1 border-l border-gray-200">
          <div className="divide-y divide-gray-200 bg-white">
            <RightPanelItem label="Status">
              <Tag
                className="w-full cursor-pointer text-center"
                bordered
                color={queryData?.task?.projectStatus?.color || undefined}
              >
                {queryData?.task?.projectStatus?.name || 'No Status'}
              </Tag>
            </RightPanelItem>

            <RightPanelItem label="Timeline">
              <TaskTimelinePicker
                disabled
                value={[queryData?.task?.startDate, queryData?.task?.endDate]}
              />
            </RightPanelItem>

            {renderOptionalProperties()}
          </div>
        </div>
      </div>
    </div>
  );
};

const RightPanelItem = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex px-2 py-3">
      <div className="flex-1">{label}</div>

      <div className="w-40">{children}</div>
    </div>
  );
};

const sharedTaskPageQuery = gql`
  query SharedTaskPage($taskId: ID!) {
    task(taskId: $taskId) {
      id
      name
      description
      startDate
      endDate
      projectedCost
      priority
      plannedEffort
      dueReminder
      projectStatus {
        id
        name
        color
      }
      project {
        id
        company {
          id
        }
        projectSettings {
          columns
        }
        projectStatuses {
          id
          name
          color
        }
      }
      checklists {
        id
        title
        checked
      }
      comments {
        id
        message
        messageContent
        createdAt
        createdBy {
          id
          name
          email
          profileImage
        }
        parentTaskComment {
          id
          messageContent
          message
          createdAt
          createdBy {
            id
            name
            email
            profileImage
          }
        }
        attachments {
          id
          name
          type
          url
          isExternal
          isDeleted
          createdBy {
            id
            email
            name
            profileImage
          }
        }
      }
      attachments {
        id
        name
        type
        createdAt
        url
        isExternal
        externalSource
        createdBy {
          id
          name
          email
          profileImage
        }
      }
      members {
        id
        companyMember {
          id
          user {
            id
            name
            email
            profileImage
          }
        }
      }
      watchers {
        companyMember {
          id
          user {
            id
            name
            email
            profileImage
          }
        }
      }
      pics {
        id
        contact {
          id
        }
        pic {
          id
          name
        }
      }
      tags {
        id
        name
      }
      templateTask {
        id
        isRecurring
        recurringSetting {
          intervalType
          day
          month
          skipWeekend
        }
      }
    }
  }
`;

export default SharedTaskPage;
