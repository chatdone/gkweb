import { Timeline, Space, Typography } from '@arco-design/web-react';
import { useEffect, useRef } from 'react';

import styles from './ActivityPanel.module.less';

const TimelineItem = Timeline.Item;

export type TimelineGroup = {
  title: string;
  children: {
    title: string;
    description: string;
  }[];
};

type Props = {
  groups: TimelineGroup[];
  hasMore: boolean;
  onReachEnd: () => void;
};

const ActivityPanel = (props: Props) => {
  const { groups, hasMore, onReachEnd } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wrapperRef.current?.querySelector('.arco-timeline-item-last');

    if (!node || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onReachEnd();
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [groups, hasMore]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <Timeline mode="left" labelPosition="relative" pending={hasMore}>
        {groups.map((group) => (
          <TimelineItem key={group.title} label={group.title}>
            <Space direction="vertical">
              {group.children.map((activity) => (
                <TimelineDescription
                  key={activity.title}
                  title={activity.title}
                  description={activity.description}
                />
              ))}
            </Space>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

const TimelineDescription = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Space className={styles['timeline-item']} direction="vertical" size={0}>
      <Typography.Text>{title}</Typography.Text>
      <Typography.Text className={styles.description}>
        {description}
      </Typography.Text>
    </Space>
  );
};

export default ActivityPanel;
