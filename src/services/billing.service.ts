import apiService from './api.service';

import configs from '@/configs';

export const BASE_PATH = '/billing';

const getInvoice = async (invoiceId: string) => {
  try {
    return apiService.get(`${BASE_PATH}/invoice/${invoiceId}/download`, {
      responseType: 'blob',
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const downloadInvoice = async (invoiceId: string) => {
  const url = `${configs.env.API_URL}${BASE_PATH}/invoice/${invoiceId}/download`;
  window.open(url);
};

export default { getInvoice, downloadInvoice };
