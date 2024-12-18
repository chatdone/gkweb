import { Button, Grid, Space, Spin, Typography } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import Avatar from '../Avatar';
import EmptyNotification from '../EmptyNotification';
import MarkdownText from '../MarkdownText';
import styles from './NotificationPopup.module.less';

import { useAppStore } from '@/stores/useAppStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

import {
  updateAllNotificationsAsRead,
  updateNotificationsAsRead,
} from '@/services/notification.service';

import { notificationCalendarFormat } from '@/constants/date.constants';

import { NotificationModel, NotificationFilterType } from '@/types';

const views = [
  {
    label: 'All',
    value: NotificationFilterType.ALL,
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

const NotificationPopup = () => {
  const { activeCompany } = useAppStore();
  const {
    loading,
    notifications,
    refetchNotifications,
    setFilterType,
    filterType,
  } = useNotificationStore();

  const handleChangeViewMode = (type: NotificationFilterType) => {
    setFilterType(type);
  };

  const handleClickNotification = (notification: NotificationModel) => {
    handleMarkNotificationAsRead(notification);
  };

  const handleMarkAllAsRead = async () => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      await updateAllNotificationsAsRead(activeCompany.id);

      refetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkNotificationAsRead = async (
    notification: NotificationModel,
  ) => {
    if (!activeCompany?.id || notification.read) {
      return;
    }

    try {
      await updateNotificationsAsRead({
        companyId: activeCompany.id,
        notificationIds: [notification.id],
      });

      refetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const getNotificationPagePath = () => {
    return `/${activeCompany?.slug}/notifications`;
  };

  return (
    <div className={styles.popup}>
      <div className={styles.header}>
        <Space>
          {views.map((type) => (
            <Button
              key={type.value}
              shape="round"
              type={type.value === filterType ? 'default' : 'text'}
              onClick={() => handleChangeViewMode(type.value)}
            >
              {type.label}
            </Button>
          ))}
        </Space>
      </div>

      <Spin loading={loading} style={{ width: '100%' }}>
        {notifications.length > 0 ? (
          <>
            <Space className={styles.content} direction="vertical" size={0}>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleClickNotification(notification)}
                />
              ))}
            </Space>

            <Grid.Row className={styles.footer}>
              <Grid.Col span={12}>
                <Button type="text" long onClick={handleMarkAllAsRead}>
                  Mark all as read
                </Button>
              </Grid.Col>

              <Grid.Col span={12}>
                <Link to={getNotificationPagePath()}>
                  <Button type="text" long>
                    View All
                  </Button>
                </Link>
              </Grid.Col>
            </Grid.Row>
          </>
        ) : (
          <EmptyNotification />
        )}
      </Spin>
    </div>
  );
};

const NotificationItem = ({
  notification,
  onClick,
}: {
  notification: NotificationModel;
  onClick: () => void;
}) => {
  const { read, message, createdAt, createdBy, groupType } = notification;

  //FIXME: Need a better way to handle this
  const action = message?.includes('has been deleted by') ? '' : 'Added you';
  const createdByName = createdBy?.name || createdBy?.picName;

  return (
    <div
      className={`${styles['notification-item']} ${read ? '' : styles.unread} `}
      onClick={onClick}
    >
      <Space align="start">
        {groupType !== 'ATTENDANCE' && (
          <Avatar
            size={36}
            name={createdByName}
            imageSrc={createdBy?.profileImage}
          />
        )}

        <div>
          {createdByName && (
            <Typography.Paragraph>
              <Typography.Text className={styles.user}>
                {createdByName}
              </Typography.Text>{' '}
              {action}
            </Typography.Paragraph>
          )}

          <MarkdownText className={styles['markdown-txt']} markdown={message} />

          <Typography.Paragraph className={styles.date}>
            {dayjs(createdAt).calendar(null, notificationCalendarFormat)}
          </Typography.Paragraph>
        </div>
      </Space>
    </div>
  );
};

export default NotificationPopup;
