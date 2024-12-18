import dayjs from 'dayjs';
import { groupBy } from 'lodash-es';
import { useMemo } from 'react';

import ActivityLogs from './ActivityLogs';

import { dateSort } from '@/utils/sorter.utils';

import { ArrayElement } from '@/types';

import { TaskModalPageQuery } from 'generated/graphql-types';

type QueryTaskActivity = ArrayElement<
  NonNullable<TaskModalPageQuery['task']>['taskActivities']
>;

type Props = {
  taskActivities: NonNullable<TaskModalPageQuery['task']>['taskActivities'];
};

const ActivitiesPanel = (props: Props) => {
  const { taskActivities } = props;

  const sortedGroupedActivities = useMemo(() => {
    if (!taskActivities) {
      return [];
    }

    const groupedActivities = groupBy(taskActivities, (activity) =>
      dayjs(activity?.createdAt).fromNow(),
    );

    const sortedGrouped = Object.entries(groupedActivities);
    sortedGrouped.sort(dateSort('[0]'));

    const groupedByUsers: QueryTaskActivity[][] = [];

    sortedGrouped.forEach(([, value]) => {
      const groupedByUser = groupBy(value, 'createdBy.id');

      Object.values(groupedByUser).forEach((group) => {
        const sorted = group.sort(dateSort('createdAt'));

        groupedByUsers.push(sorted.reverse());
      });
    });

    return groupedByUsers;
  }, [taskActivities]);

  return (
    <div className="m-2 p-2">
      {sortedGroupedActivities.map((group, index) => (
        <ActivityLogs key={index} activities={group} />
      ))}
    </div>
  );
};

export default ActivitiesPanel;
