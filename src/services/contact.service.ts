import apiService from './api.service';

import { downloadFile } from '@/utils/dom.utils';

const exportContacts = async (input: {
  userId: string;
  companyId: string;
  groupId?: string;
  keyword?: string;
}) => {
  try {
    const res = await apiService.get('/reports/contacts', {
      responseType: 'blob',
      params: {
        user_id: input.userId,
        company_id: input.companyId,
        group_id: input.groupId,
        keyword: input.keyword,
      },
    });

    const url = URL.createObjectURL(res.data);

    downloadFile({
      url,
      fileName: 'contact_export',
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export default { exportContacts };
