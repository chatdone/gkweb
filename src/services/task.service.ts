import apiService from './api.service';

import configs from '@/configs';

export const BASE_PATH = '/tasks';

const getTaskAttachment = async (taskAttachmentId: string) => {
  try {
    return apiService.get(
      `${BASE_PATH}/attachment/${taskAttachmentId}/download`,
      {
        responseType: 'blob',
      },
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

const downloadTaskAttachment = async (taskAttachmentId: string) => {
  const url = `${configs.env.API_URL}${BASE_PATH}/attachment/${taskAttachmentId}/download`;
  window.open(url);
};

export default { getTaskAttachment, downloadTaskAttachment };
