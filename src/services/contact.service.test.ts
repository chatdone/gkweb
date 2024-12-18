import faker from '@faker-js/faker';
import { describe, test, vi } from 'vitest';

import apiService from './api.service';
import ContactService from './contact.service';

vi.mock('./api.service', () => ({
  default: {
    get: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('exportContacts', () => {
  test('should be able to export contacts', async () => {
    const companyId = faker.datatype.uuid();
    const userId = faker.datatype.uuid();
    const groupId = faker.datatype.uuid();
    const keyword = faker.random.word();

    vi.mocked(apiService.get).mockResolvedValue(true);

    await ContactService.exportContacts({
      companyId,
      userId,
      groupId,
      keyword,
    });

    expect(apiService.get).toHaveBeenCalledWith('/reports/contacts', {
      responseType: 'blob',
      params: {
        company_id: companyId,
        user_id: userId,
        group_id: groupId,
        keyword,
      },
    });
  });
});
