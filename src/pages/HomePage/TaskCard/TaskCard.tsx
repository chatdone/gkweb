import { gql } from '@apollo/client';
import {
  Card,
  Typography,
  Divider,
  Grid,
  DatePicker,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { fragment } from '@/components/TaskListItem';

import styles from './TaskCard.module.less';
import TaskList from './TaskList';
import TaskListDrawer from './TaskListDrawer';

import { useDisclosure } from '@/hooks';
// import TaskSummary from './TaskSummary';
import { useAppStore } from '@/stores/useAppStore';
import { useResponsiveStore } from '@/stores/useResponsiveStores';

// import { isTaskOverdue } from '@/utils/task.utils';
import { navigateTaskPage } from '@/navigation';

import { ArrayElement } from '@/types';

import { HomePageQuery } from 'generated/graphql-types';

type QueryTask = ArrayElement<NonNullable<HomePageQuery['tasks']>>;

export const taskCardFragments = {
  task: gql`
    fragment TaskCardTaskFragment on Task {
      id
      name
      startDate
      endDate
      project {
        id
        name
      }
      projectStatus {
        id
        color
        name
      }
      checklists {
        id
        checked
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
      ...TaskListItemFragment
    }
    ${fragment}
  `,
};

type View = 'company' | 'member';

type Props = {
  loading: boolean;
  view: View;
  tasks: HomePageQuery['tasks'];
  sharedTasks: HomePageQuery['sharedWithMeTasks'];
  company: HomePageQuery['company'];
};

const TaskCard = (props: Props) => {
  const { loading, view, tasks, company, sharedTasks } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, activeCompany } = useAppStore();
  const { isMobile } = useResponsiveStore();

  const [filterDateRange, setFilterDateRange] = useState<dayjs.Dayjs[]>([
    dayjs().startOf('week'),
    dayjs().endOf('week'),
  ]);
  const [drawerType, setDrawerType] = useState<
    'pending' | 'overdue' | 'done'
  >();

  const { visible, onClose, onOpen } = useDisclosure();

  const handleUpdateFilterDateRange = (date: dayjs.Dayjs[]) => {
    setFilterDateRange(date);
  };

  // const handleClickSummary = (type?: 'pending' | 'overdue' | 'done') => {
  //   setDrawerType(type);

  //   onOpen();
  // };

  const handleViewTask = (task: QueryTask) => {
    //@ts-ignore
    if (!task?.id || !activeCompany?.slug || task?.children) {
      return;
    }

    navigateTaskPage({
      navigate,
      taskId: task.id,
      companySlug: activeCompany.slug,
      location,
    });
  };

  // const taskSummary = useMemo(() => {
  //   const initialValue = {
  //     pending: 0,
  //     overdue: 0,
  //     done: 0,
  //   };

  //   if (!tasks || !sharedTasks?.tasks) {
  //     return initialValue;
  //   }

  //   let viewTasks =
  //     view === 'company'
  //       ? tasks
  //       : tasks.filter((task) =>
  //           task?.members?.some(
  //             (member) => member?.user?.id === currentUser?.id,
  //           ),
  //         );

  //   if (view === 'member') {
  //     viewTasks = [...viewTasks, ...sharedTasks.tasks];
  //   }

  //   viewTasks = viewTasks.filter(
  //     (task) => !task?.archived && task?.published && !task.taskBoard?.archived,
  //   );

  //   return viewTasks.reduce((prev, current) => {
  //     if (current?.taskBoard?.category === TaskBoardCategory.Project) {
  //       return prev;
  //     }

  //     if (current?.stageStatus === StageType.Pass) {
  //       prev.done += 1;
  //     } else if (current?.stageStatus === StageType.Pending) {
  //       const isOverdue = isTaskOverdue(current);

  //       if (isOverdue) {
  //         prev.overdue += 1;
  //       } else {
  //         prev.pending += 1;
  //       }
  //     }

  //     return prev;
  //   }, initialValue);
  // }, [tasks, company, view, sharedTasks]);

  const visibleTasks = useMemo(() => {
    if (!tasks || !sharedTasks?.tasks) {
      return [];
    }

    const [startDate, endDate] = filterDateRange;

    let data = isMobile
      ? tasks
      : tasks.filter((task) => {
          return (
            task?.endDate &&
            dayjs(task.endDate).isBetween(startDate, endDate, 'day', '[]')
          );
        });

    if (view === 'member') {
      const tasks = sharedTasks.tasks.filter((task) => {
        return (
          task?.endDate &&
          dayjs(task.endDate).isBetween(startDate, endDate, 'day', '[]')
        );
      });

      data = data.filter((task) =>
        task?.members?.some((member) => member?.user?.id === currentUser?.id),
      );

      data = [...data, ...tasks];
    }

    return data;
  }, [tasks, filterDateRange, company, view, sharedTasks, isMobile]);

  return (
    <>
      <Card className={styles.wrapper}>
        <Typography.Paragraph className={styles.title}>
          {t('home.welcome', { name: currentUser?.name || currentUser?.email })}
        </Typography.Paragraph>

        <Divider />

        {/* { (
          <TaskSummary
            loading={loading}
            pending={taskSummary.pending}
            overdue={taskSummary.overdue}
            done={taskSummary.done}
            total={taskSummary.pending + taskSummary.overdue + taskSummary.done}
            onClick={handleClickSummary}
          />
        )} */}

        {/* {<Divider />} */}

        <Grid.Row
          className={styles['heading-container']}
          justify="space-between"
        >
          <Typography.Text className={styles['company-tasks-txt']}>
            {view === 'company' ? t('home.tasks.company') : t('home.tasks.own')}
          </Typography.Text>

          {!isMobile && (
            <DatePicker.RangePicker
              allowClear={false}
              value={filterDateRange}
              onChange={(_, date) => handleUpdateFilterDateRange(date)}
            />
          )}
        </Grid.Row>

        <TaskList
          loading={loading}
          tasks={visibleTasks}
          onViewTask={handleViewTask}
        />
      </Card>

      <TaskListDrawer
        visible={visible}
        onCancel={onClose}
        loading={loading}
        tasks={tasks}
        sharedTasks={sharedTasks}
        type={drawerType}
        onViewTask={handleViewTask}
      />
    </>
  );
};

export default TaskCard;
