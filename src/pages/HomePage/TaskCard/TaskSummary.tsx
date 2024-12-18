import { Grid, Skeleton, Space, Typography } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';

import styles from './TaskSummary.module.less';

import { useResponsiveStore } from '@/stores/useResponsiveStores';

import Icons from '@/assets/icons';

type Props = {
  loading: boolean;
  pending: number;
  overdue: number;
  done: number;
  total: number;
  onClick: (type?: 'pending' | 'overdue' | 'done') => void;
};

const TaskSummary = (props: Props) => {
  const { loading, done, overdue, pending, total, onClick } = props;

  const { t } = useTranslation();

  return (
    <Grid.Row className={styles.wrapper} gutter={20}>
      <SummaryItem
        loading={loading}
        title={t('status.total')}
        iconSrc={Icons.task}
        count={total}
        onClick={() => onClick()}
      />
      <SummaryItem
        loading={loading}
        title={t('status.pending')}
        iconSrc={Icons.pendingTask}
        count={pending}
        onClick={() => onClick('pending')}
      />
      <SummaryItem
        loading={loading}
        title={t('status.overdue')}
        iconSrc={Icons.overdueTask}
        count={overdue}
        onClick={() => onClick('overdue')}
      />
      <SummaryItem
        loading={loading}
        title={t('status.done')}
        iconSrc={Icons.completedTask}
        count={done}
        onClick={() => onClick('done')}
      />
    </Grid.Row>
  );
};

const SummaryItem = ({
  loading,
  title,
  iconSrc,
  count,
  onClick,
}: {
  loading: boolean;
  title: string;
  iconSrc: string;
  count: number;
  onClick: () => void;
}) => {
  const { t } = useTranslation();

  const { isMobile } = useResponsiveStore();

  return (
    <Grid.Col xs={12} xl={6} onClick={onClick}>
      <Space className={styles['summary-item']} size={isMobile ? 12 : 20}>
        <div className={styles['icon-container']}>
          <img src={iconSrc} alt={title} />
        </div>

        <div>
          <Typography.Paragraph>
            {title} {t('tasks')}
          </Typography.Paragraph>

          <Skeleton loading={loading} text={{ rows: 1 }}>
            <Typography.Text className={styles.count}>{count}</Typography.Text>
          </Skeleton>
        </div>
      </Space>
    </Grid.Col>
  );
};

export default TaskSummary;
