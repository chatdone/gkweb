import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

type TimeScale = 'day' | 'month' | 'year';

export type TaskItem = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  actualStartDate: string | null | undefined;
  actualEndDate: string | null | undefined;
  color: string;
  subtasks?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    actualStartDate: string | null | undefined;
    actualEndDate: string | null | undefined;
    color: string;
  }[];
};

type Props = {
  title: string;
  scale: TimeScale;
  data: { id: string; name: string; tasks: TaskItem[] }[];
  onClickTask: (task: TaskItem) => void;
};

const TaskTimeline = (props: Props) => {
  const { title, scale, data, onClickTask } = props;

  return (
    <div className="overflow-auto bg-gray-50 p-3">
      <div className="flex">
        <LeftPanel title={title} data={data} />
        <RightPanel scale={scale} data={data} onClickTask={onClickTask} />
      </div>
    </div>
  );
};

export default TaskTimeline;
