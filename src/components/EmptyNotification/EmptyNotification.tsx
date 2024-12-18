import { Space, Typography } from '@arco-design/web-react';

import Icons from '@/assets/icons';

const EmptyNotification = () => {
  return (
    <Space
      style={{ width: '100%', paddingBottom: '1.5rem' }}
      direction="vertical"
      align="center"
    >
      <img src={Icons.emptyNotifications} alt="empty notifications" />

      <Typography.Paragraph style={{ fontWeight: '900' }}>
        You don't have any notifications!
      </Typography.Paragraph>

      <div style={{ textAlign: 'center' }}>
        <div>
          <Typography.Text>
            You'll be notified of changes or mentions in your work
          </Typography.Text>
        </div>
      </div>
    </Space>
  );
};

export default EmptyNotification;
