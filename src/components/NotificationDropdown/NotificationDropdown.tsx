import { Trigger, Badge, Spin } from '@arco-design/web-react';
import { ReactNode, useEffect } from 'react';

import NotificationPopup from './NotificationPopup';

import { useAppStore } from '@/stores/useAppStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

type Props = {
  children: ReactNode;
};

const NotificationDropdown = ({ children }: Props) => {
  const { unreadCount, refetchNotifications, loading } = useNotificationStore();

  useEffect(() => {
    refetchNotifications();

    const unsub = useAppStore.subscribe(() => {
      refetchNotifications();
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    //@ts-ignore
    <Trigger
      trigger="click"
      position="br"
      popup={() => <NotificationPopup />}
      popupAlign={{ bottom: 4 }}
    >
      <Badge count={loading ? <Spin size={15} /> : unreadCount} maxCount={99}>
        {children}
      </Badge>
    </Trigger>
  );
};

export default NotificationDropdown;
