import { TaskItem } from './TaskTimeline';
import styles from './TaskTimeline.module.less';

type Props = {
  title: string;
  data: { id: string; name: string; tasks: TaskItem[] }[];
  colHeight?: number;
};

const LeftPanel = (props: Props) => {
  const { title, data, colHeight = 2 } = props;

  return (
    <div className="divide-y divide-gray-300 border border-gray-300">
      <div
        className={`w-40 ${styles.head}`}
        style={{ height: `${colHeight * 2}rem` }}
      >
        {title}
      </div>

      {data.map((item) => {
        const totalSubtasks = item.tasks.reduce(
          (prev, task) => prev + (task.subtasks?.length || 0),
          0,
        );
        const totalTasks = item.tasks.length + totalSubtasks;

        return (
          <div
            key={item.id}
            className={styles.col}
            style={{ height: `${colHeight * totalTasks}rem` }}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
};

export default LeftPanel;
