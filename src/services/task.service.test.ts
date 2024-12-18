import faker from '@faker-js/faker';
import { describe, test, vi } from 'vitest';

import apiService from './api.service';
import TaskService, { BASE_PATH } from './task.service';

import configs from '@/configs';

vi.mock('./api.service', () => ({
  default: {
    get: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('getTaskAttachment', () => {
  test("should be able to get task's attachment", async () => {
    const taskId = faker.datatype.uuid();

    vi.mocked(apiService.get).mockResolvedValue(true);

    const res = await TaskService.getTaskAttachment(taskId);

    expect(apiService.get).toHaveBeenCalledWith(
      `${BASE_PATH}/attachment/${taskId}/download`,
      {
        responseType: 'blob',
      },
    );
    expect(res).toBe(true);
  });
});

describe('downloadTaskAttachment', () => {
  test("should be able to download task's attachment", async () => {
    const taskAttachmentId = faker.datatype.uuid();

    TaskService.downloadTaskAttachment(taskAttachmentId);

    expect(window.open).toHaveBeenCalledWith(
      `${configs.env.API_URL}${BASE_PATH}/attachment/${taskAttachmentId}/download`,
    );
  });
});
