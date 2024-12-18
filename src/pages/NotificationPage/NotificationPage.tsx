import { Card, Space, Typography, Spin, Button } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { groupBy } from 'lodash-es';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { MdCelebration, MdCheckCircle } from 'react-icons/md';

import { ContentHeader } from '@/components';
import EmptyNotification from '@/components/EmptyNotification';

import NotificationItem from './NotificationItem';
import styles from './NotificationPage.module.less';

import { useAppStore } from '@/stores/useAppStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

import {
  getNotifications,
  updateAllNotificationsAsRead,
  updateNotificationsAsRead,
} from '@/services/notification.service';

import { NotificationFilterType, NotificationModel } from '@/types';

const views: { label: string; value: NotificationFilterType }[] = [
  {
    label: 'All',
    value: NotificationFilterType.ALL,
  },
  {
    label: 'Unread',
    value: NotificationFilterType.UNREAD,
  },
  {
    label: 'Mentioned',
    value: NotificationFilterType.MENTIONED,
  },
  {
    label: 'Assigned to me',
    value: NotificationFilterType.ASSIGNED,
  },
];

type Group = {
  date: string;
  notifications: NotificationModel[];
};

const NotificationPage = () => {
  const { activeCompany } = useAppStore();
  const { refetchNotifications } = useNotificationStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [notificationGroups, setNotificationGroups] = useState<Group[]>([]);
  const [filterType, setFilterType] = useState<NotificationFilterType>(
    NotificationFilterType.ALL,
  );
  const [limit, setLimit] = useState<number>(50);
  const [lastElement, setLastElement] = useState<HTMLDivElement | null>(null);

  const prevCountRef = useRef<number>(0);

  useEffect(() => {
    if (activeCompany) {
      setFilterType(NotificationFilterType.ALL);
      setLimit(50);

      prevCountRef.current = 0;
    }
  }, [activeCompany]);

  useEffect(() => {
    handleLoadNotifications();
  }, [limit, filterType]);

  useEffect(() => {
    const groupNotifications = groupBy(notifications, (notification) =>
      dayjs(notification.createdAt).format('YYYY-MM'),
    );

    const newGroups = Object.entries(groupNotifications).map(
      ([key, value]) => ({
        date: key,
        notifications: value,
      }),
    );

    setNotificationGroups(newGroups);
  }, [notifications]);

  useEffect(() => {
    if (!lastElement) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        handleLoadMore();
      }
    });

    observer.observe(lastElement);

    return () => observer.disconnect();
  }, [lastElement, loading, hasMore]);

  const handleLoadNotifications = async () => {
    if (!activeCompany?.id) {
      return;
    }

    setLoading(true);

    try {
      const res = await getNotifications({
        companyId: activeCompany.id,
        filter: filterType,
        limit: limit,
      });

      setHasMore(res.data.data.notifications.length !== prevCountRef.current);
      setNotifications(res.data.data.notifications);

      prevCountRef.current = res.data.data.notifications.length;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeView = (type: NotificationFilterType) => {
    setLimit(50);
    setFilterType(type);
    prevCountRef.current = 0;
  };

  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return;
    }

    setLimit((prev) => prev + 50);
  };

  const handleClickNotification = (notification: NotificationModel) => {
    handleMarkNotificationAsRead(notification);
  };

  const handleMarkNotificationAsRead = async (
    notification: NotificationModel,
  ) => {
    if (!activeCompany?.id || notification.read) {
      return;
    }

    await updateNotificationsAsRead({
      companyId: activeCompany.id,
      notificationIds: [notification.id],
    });

    handleLoadNotifications();
    refetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    if (!activeCompany?.id) {
      return;
    }

    await updateAllNotificationsAsRead(activeCompany.id);

    handleLoadNotifications();
    refetchNotifications();
  };

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Notification',
          },
        ]}
        rightElement={
          <Button
            className={styles['theme-button']}
            icon={<MdCheckCircle />}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        }
      />

      <Card className={styles['card-wrapper']}>
        <Space className={styles.header}>
          {views.map((view) => (
            <TabButton
              key={view.value}
              active={filterType === view.value}
              onClick={() => handleChangeView(view.value)}
            >
              {view.label}
            </TabButton>
          ))}
        </Space>

        <Spin style={{ width: '100%' }} loading={loading}>
          {notificationGroups.length > 0 ? (
            <div className={styles.content}>
              <Space direction="vertical">
                {notificationGroups.map((item) => (
                  <NotificationGroup
                    key={item.date}
                    group={item}
                    onClickNotification={handleClickNotification}
                    onMarkAsRead={handleMarkNotificationAsRead}
                  />
                ))}
              </Space>

              {!hasMore && (
                <Space className={styles.footer} size={20}>
                  <MdCelebration />
                  <Typography.Text>End of notification</Typography.Text>
                </Space>
              )}

              <div ref={setLastElement} />
            </div>
          ) : (
            <div className={styles['empty-notifications']}>
              <EmptyNotification />
            </div>
          )}
        </Spin>
      </Card>
    </>
  );
};

const NotificationGroup = ({
  group,
  onClickNotification,
  onMarkAsRead,
}: {
  group: Group;
  onClickNotification: (notification: NotificationModel) => void;
  onMarkAsRead: (notification: NotificationModel) => void;
}) => {
  const { date, notifications } = group;

  return (
    <div className={styles['notification-group']}>
      <Typography.Title heading={5} className={styles.title}>
        {dayjs(date).format('MMMM YYYY')}
      </Typography.Title>

      <Space direction="vertical" size={0}>
        {notifications.map((item) => (
          <NotificationItem
            key={item.id}
            notification={item}
            onClick={() => onClickNotification(item)}
            onMarkAsRead={() => onMarkAsRead(item)}
          />
        ))}
      </Space>
    </div>
  );
};

const TabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) => {
  return (
    <div
      className={`${styles['tab-btn']} ${
        active ? styles['tab-btn-active'] : ''
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default NotificationPage;
