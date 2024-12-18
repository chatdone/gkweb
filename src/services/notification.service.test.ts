import faker from '@faker-js/faker';
import { random } from 'lodash-es';
import { describe, test, vi, beforeEach } from 'vitest';

import {
  apiService,
  getNotifications,
  BASE_PATH,
  getUnreadCount,
  updateNotificationsAsRead,
  updateAllNotificationsAsRead,
} from './notification.service';

import { NotificationFilterType } from '@/types';

let companyId: string;

beforeEach(() => {
  companyId = faker.datatype.uuid();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('getNotifications', () => {
  test('should be able to get all notifications', async () => {
    vi.spyOn(apiService, 'get').mockResolvedValue(true);

    const res = await getNotifications({
      companyId,
    });

    expect(apiService.get).toHaveBeenCalledWith(
      `${BASE_PATH}?companyId=${companyId}`,
    );
    expect(res).toBe(true);
  });

  test('should be able to limit number of notifications', async () => {
    vi.spyOn(apiService, 'get').mockResolvedValue(true);

    const res = await getNotifications({
      companyId,
      limit: 50,
    });

    expect(apiService.get).toHaveBeenCalledWith(
      `${BASE_PATH}?companyId=${companyId}&limit=${50}`,
    );
    expect(res).toBe(true);
  });

  test('should be able to filter notifications', async () => {
    vi.spyOn(apiService, 'get').mockResolvedValue(true);

    const res = await getNotifications({
      companyId,
      filter: NotificationFilterType.ASSIGNED,
    });

    expect(apiService.get).toHaveBeenCalledWith(
      `${BASE_PATH}?companyId=${companyId}&filter=${NotificationFilterType.ASSIGNED}`,
    );
    expect(res).toBe(true);
  });
});

describe('getUnreadCount', () => {
  test('should be able to get unread notifications count', async () => {
    vi.spyOn(apiService, 'get').mockResolvedValue(10);

    const res = await getUnreadCount(companyId);

    expect(apiService.get).toHaveBeenCalledWith(
      `${BASE_PATH}/unread-count?companyId=${companyId}`,
    );
    expect(res).toBe(10);
  });
});

describe('updateNotificationsAsRead', () => {
  test('should be able to update notification as read', async () => {
    vi.spyOn(apiService, 'patch').mockResolvedValue(true);

    const notificationIds = Array.from(
      { length: random(1, 6) },
      faker.datatype.uuid,
    );

    const res = await updateNotificationsAsRead({
      companyId,
      notificationIds,
    });

    expect(apiService.patch).toHaveBeenCalledWith(`${BASE_PATH}/read`, {
      companyId,
      notificationIds,
    });
    expect(res).toBe(true);
  });
});

describe('updateAllNotificationsAsRead', () => {
  test('should be able to update all notifications as read', async () => {
    vi.spyOn(apiService, 'patch').mockResolvedValue(true);

    const res = await updateAllNotificationsAsRead(companyId);

    expect(apiService.patch).toHaveBeenCalledWith(`${BASE_PATH}/read-all`, {
      companyId,
    });
    expect(res).toBe(true);
  });
});
