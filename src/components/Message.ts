import { Notification, NotificationProps } from '@arco-design/web-react';
import { ReactNode } from 'react';

export type MessageOptions = {
  title?: string;
  duration?: number;
  position?: NotificationProps['position'];
};

const Message = {
  success: (message: ReactNode, options: MessageOptions = {}) => {
    const { title, duration } = options;

    Notification.success({
      content: message,
      title,
      duration,
    });
  },
  error: (message: string, options: MessageOptions = {}) => {
    const { title, duration, position } = options;

    Notification.error({
      content: message,
      title,
      duration,
      position,
    });
  },
  info: (message: string, options: MessageOptions = {}) => {
    const { title, duration } = options;

    Notification.info({
      content: message,
      title,
      duration,
    });
  },
  warning: (message: string, options: MessageOptions = {}) => {
    const { title, duration } = options;

    Notification.warning({
      content: message,
      title,
      duration,
    });
  },
  normal: (message: string, options: MessageOptions = {}) => {
    const { title, duration } = options;

    Notification.normal({
      content: message,
      title,
      duration,
    });
  },
};

export default Message;
