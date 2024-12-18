import axios from 'axios';

import useAuth0Session from '@/hooks/useAuth0Session';

import configs from '@/configs';

import {
  NotificationFilterType,
  NotificationResponseModel,
  NotificationUnreadCountModel,
  UpdateNotificationResponseModel,
} from '@/types';

export const apiService = axios.create({
  baseURL: configs.env.NOTIFICATION_API_URL,
  timeout: 20000,
  withCredentials: true,
});

apiService.interceptors.request.use(function (request) {
  const { getToken } = useAuth0Session();
  const token = getToken();

  // TODO: add Bearer keyword
  request.headers = {
    Authorization: token ? `${token}` : '',
    version: 3,
  };

  return request;
});

apiService.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.log('notification api fail', error);
    return Promise.reject(error);
  },
);

export const BASE_PATH = '/notifications';

const getNotifications = async (input: {
  companyId: string;
  filter?: NotificationFilterType;
  limit?: number;
}) => {
  try {
    const { companyId, filter, limit } = input;

    let params = `companyId=${companyId}`;

    if (filter) {
      params += `&filter=${filter}`;
    }

    if (limit) {
      params += `&limit=${limit}`;
    }

    return apiService.get<NotificationResponseModel>(`${BASE_PATH}?${params}`);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getUnreadCount = async (companyId: string) => {
  try {
    return apiService.get<NotificationUnreadCountModel>(
      `${BASE_PATH}/unread-count?companyId=${companyId}`,
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateNotificationsAsRead = async (input: {
  companyId: string;
  notificationIds: string[];
}) => {
  try {
    return apiService.patch<UpdateNotificationResponseModel>(
      `${BASE_PATH}/read`,
      { ...input },
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateAllNotificationsAsRead = async (companyId: string) => {
  try {
    return apiService.patch(`${BASE_PATH}/read-all`, { companyId });
  } catch (error) {
    return Promise.reject(error);
  }
};

export {
  getNotifications,
  getUnreadCount,
  updateNotificationsAsRead,
  updateAllNotificationsAsRead,
};
