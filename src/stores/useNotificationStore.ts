import create from 'zustand';

import { useAppStore } from './useAppStore';

import {
  getUnreadCount,
  getNotifications,
} from '@/services/notification.service';

import { NotificationModel, NotificationFilterType } from '@/types';

type NotificationStoreState = {
  filterType: NotificationFilterType;
  notifications: NotificationModel[];
  unreadCount: number;
  loading: boolean;
  refetchNotifications: () => Promise<void>;
  setFilterType: (type: NotificationFilterType) => void;
};

export const useNotificationStore = create<NotificationStoreState>(
  (set, get) => ({
    filterType: NotificationFilterType.ALL,
    unreadCount: 0,
    notifications: [],
    loading: false,
    refetchNotifications: async () => {
      const activeCompany = useAppStore.getState().activeCompany;

      if (activeCompany?.id) {
        set({ loading: true });

        try {
          const unreadRes = await getUnreadCount(activeCompany.id);
          const notificationRes = await getNotifications({
            companyId: activeCompany.id,
            limit: 10,
            filter: get().filterType,
          });

          if (unreadRes.data) {
            set({ unreadCount: unreadRes.data.data.unreadCount });
          }

          if (notificationRes.data) {
            set({
              notifications: notificationRes.data.data.notifications,
            });
          }
        } catch (error) {
          console.error(error);
        } finally {
          set({ loading: false });
        }
      }
    },
    setFilterType: (type) => {
      set({ filterType: type });

      get().refetchNotifications();
    },
  }),
);
