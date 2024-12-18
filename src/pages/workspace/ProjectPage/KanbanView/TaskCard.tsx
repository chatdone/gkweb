import { Tag, Avatar as ArcoAvatar, Badge } from '@arco-design/web-react';
import { MdOutlineAttachFile, MdOutlineMessage } from 'react-icons/md';

import { Avatar } from '@/components';
import TaskTimelinePicker from '@/components/TaskTimelinePIcker';

import { formatToCurrency } from '@/utils/currency.utils';

import { ArrayElement } from '@/types';

import { ProjectPageQuery } from 'generated/graphql-types';

type QueryTask = ArrayElement<
  NonNullable<ProjectPageQuery['project']>['tasks']
>;

type QueryTaskChildTask = ArrayElement<NonNullable<QueryTask>['childTasks']>;

type Props = {
  task: QueryTask | QueryTaskChildTask;
  onClick: () => void;
};

const TaskCard = (props: Props) => {
  const { task, onClick } = props;

  const hasActualCost = task?.actualCost !== null && task?.actualCost !== 0;
  const hasProjectedCost =
    task?.projectedCost !== null && task?.projectedCost !== 0;

  const isShowCost = hasActualCost || hasProjectedCost;

  return (
    <div
      className="mt-3 mb-4 rounded bg-white shadow hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="p-3">
        <header className="flex">
          <h3 className="flex-1">{task?.name}</h3>

          <Tag color={task?.projectStatus?.color || undefined} bordered>
            {task?.projectStatus?.name}
          </Tag>
        </header>

        <div className="text-gray-400">
          {task?.group?.name ||
            (task as QueryTaskChildTask)?.parentTask?.group?.name}
        </div>

        <div className="my-2 flex items-center">
          <ArcoAvatar.Group className="flex-1" size={24}>
            {task?.members?.map((member) => (
              <Avatar
                key={member?.id}
                name={member?.user?.name || member?.user?.email}
                imageSrc={member?.user?.profileImage}
              />
            ))}
          </ArcoAvatar.Group>

          <div className="flex items-center">
            <div>
              <Badge count={task?.comments?.length} dot>
                <MdOutlineMessage
                  className={`h-5 w-5 ${
                    task?.comments?.length === 0 && 'text-gray-300'
                  }`}
                />
              </Badge>
            </div>

            <div className="ml-1.5">
              <Badge count={task?.attachments?.length} dot>
                <MdOutlineAttachFile
                  className={`h-5 w-5 ${
                    task?.attachments?.length === 0 && 'text-gray-300'
                  }`}
                />
              </Badge>
            </div>
          </div>
        </div>
      </div>
      {isShowCost && <TotalCost task={task} />}
      <TaskTimelinePicker disabled value={[task?.startDate, task?.endDate]} />
    </div>
  );
};

const TotalCost = (data: { task: QueryTask | QueryTaskChildTask }) => {
  const actualCost = data?.task?.actualCost || 0;
  const projectedCost = data?.task?.projectedCost || 0;

  const colorIsAboveBudget = actualCost > projectedCost ? 'red' : 'green';

  return (
    <div className="bg-white shadow">
      <div>
        <div>
          <div className={`relative h-12 w-full`}>
            <div
              className={`absolute bottom-0 left-0 h-1 border-b border-gray-200`}
              style={{ width: '100%' }}
            />

            <div
              className={`absolute top-0 left-0 flex h-full w-full items-center`}
            >
              <div className="w-1/2 py-2 pl-2 bg-gray-100">
                <div className="leading-none">
                  RM{formatToCurrency(data?.task?.projectedCost || 0)}
                </div>
                <div className="text-xs opacity-50">Budget</div>
              </div>

              <div
                className={`w-1/2 py-2 pl-2 p-2 border-l bg-${colorIsAboveBudget}-50 text-${colorIsAboveBudget}-600 border-${colorIsAboveBudget}-500`}
              >
                <div className="leading-none">
                  RM{formatToCurrency(data?.task?.actualCost || 0)}
                </div>
                <div className="text-xs opacity-50">Actual</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
