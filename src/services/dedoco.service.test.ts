import faker from '@faker-js/faker';
import { random } from 'lodash-es';
import { describe, test, vi, afterEach } from 'vitest';

import apiService from './api.service';
import DedocoService, {
  BASE_PATH,
  InitDocumentSigningInput,
  CancelDocumentSigningInput,
} from './dedoco.service';

vi.mock('./api.service', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('initDocumentSigning', () => {
  test('should be able to init document signing', async () => {
    const companyId = faker.datatype.uuid();
    const taskId = faker.datatype.uuid();
    const taskBoardId = faker.datatype.uuid();
    const userId = faker.datatype.uuid();
    const attachmentIds = Array.from(
      { length: random(1, 5) },
      faker.datatype.uuid,
    );

    const input: InitDocumentSigningInput = {
      companyId,
      taskId,
      taskBoardId,
      userId,
      attachmentIds,
    };

    vi.mocked(apiService.post).mockResolvedValue(true);

    const res = await DedocoService.initDocumentSigning(input);

    expect(apiService.post).toHaveBeenCalledWith(`${BASE_PATH}/workflow`, {
      attachment_ids: attachmentIds,
      card_id: taskId,
      user_id: userId,
      company_id: companyId,
      job_id: taskBoardId,
    });
    expect(res).toBe(true);
  });
});

describe('getDocumentsStatuses', () => {
  test('should be able to get document statuses', async () => {
    const companyId = faker.datatype.uuid();
    const taskId = faker.datatype.uuid();

    vi.mocked(apiService.get).mockResolvedValue(true);

    const res = await DedocoService.getDocumentsStatuses({
      companyId,
      taskId,
    });

    expect(apiService.get).toHaveBeenCalledWith(
      `${BASE_PATH}/workflow/${companyId}/${taskId}`,
    );
    expect(res).toBe(true);
  });
});

describe('getDocument', () => {
  test('should be able to get document', async () => {
    const path = faker.datatype.string();

    vi.mocked(apiService.get).mockResolvedValue(true);

    const res = await DedocoService.getDocument({
      path,
    });

    expect(apiService.get).toHaveBeenCalledWith(
      `${BASE_PATH}/document/updated?path=${path}`,
    );
    expect(res).toBe(true);
  });
});

describe('cancelDocumentSigning', () => {
  test('should be able to cancel document signing', async () => {
    const companyId = faker.datatype.uuid();
    const taskId = faker.datatype.uuid();
    const workflowId = faker.datatype.uuid();
    const documentId = faker.datatype.number();

    const input: CancelDocumentSigningInput = {
      companyId,
      documentId,
      taskId,
      workflowId,
    };

    vi.mocked(apiService.delete).mockResolvedValue(true);

    const res = await DedocoService.cancelDocumentSigning(input);

    expect(apiService.delete).toHaveBeenCalledWith(
      `${BASE_PATH}/workflow/${companyId}/${documentId}/${workflowId}/${taskId}`,
    );
    expect(res).toBe(true);
  });
});
