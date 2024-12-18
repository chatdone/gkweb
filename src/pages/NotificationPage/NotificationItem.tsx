import {
  Button,
  Dropdown,
  Menu,
  Space,
  Typography,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { upperFirst } from 'lodash-es';
import { SyntheticEvent } from 'react';
import {
  MdAlarm,
  MdInsertChartOutlined,
  MdMoreVert,
  MdOutlineMiscellaneousServices,
  MdTaskAlt,
} from 'react-icons/md';

import { MarkdownText } from '@/components';

import styles from './NotificationItem.module.less';

import { NotificationModel } from '@/types';

type Props = {
  notification: NotificationModel;
  onClick: () => void;
  onMarkAsRead: () => void;
};

const NotificationItem = (props: Props) => {
  const { notification, onClick, onMarkAsRead } = props;

  const handleClickMenuItem = (key: string, event: SyntheticEvent) => {
    event.stopPropagation();

    if (key === 'read') {
      onMarkAsRead();
    }
  };

  const getIconByGroupType = () => {
    switch (notification.groupType) {
      case 'ATTENDANCE':
        return <MdAlarm className={styles['notification-icon']} />;

      case 'TASK':
        return <MdTaskAlt className={styles['notification-icon']} />;

      case 'PROJECT':
        return (
          <MdInsertChartOutlined className={styles['notification-icon']} />
        );

      default:
        return (
          <MdOutlineMiscellaneousServices
            className={styles['notification-icon']}
          />
        );
    }
  };

  return (
    <div
      className={`${styles['notification-item']} ${
        notification.read ? '' : styles.unread
      }`}
      onClick={onClick}
    >
      {getIconByGroupType()}

      <div className={styles.content}>
        <Space size={15}>
          <Typography.Text className={styles.title}>
            {upperFirst(notification.groupType.toLowerCase())}
          </Typography.Text>

          <Typography.Text className={styles.date}>
            {dayjs(notification.createdAt).format('DD MMM YY [at] hh:mm A')}
          </Typography.Text>
        </Space>

        <MarkdownText
          className={styles['markdown-txt']}
          markdown={notification.message}
        />
      </div>

      <Dropdown
        position="br"
        droplist={
          <Menu
            onClickMenuItem={handleClickMenuItem}
            onClick={(e) => e.stopPropagation()}
          >
            <Menu.Item key="read">Mark as read</Menu.Item>
          </Menu>
        }
      >
        <Button icon={<MdMoreVert />} type="text" size="small" />
      </Dropdown>

      <div className={styles.divider} />
    </div>
  );
};

export default NotificationItem;
