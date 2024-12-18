import apiService from './api.service';

export const BASE_PATH = '/integrations/dedoco';

export type InitDocumentSigningInput = {
  attachmentIds: string[];
  taskId: string;
  userId: string;
  companyId: string;
  taskBoardId: string;
};

export type CancelDocumentSigningInput = {
  documentId: number;
  workflowId: string;
  taskId: string | null | undefined;
  companyId: string | null | undefined;
};

const initDocumentSigning = async (payload: InitDocumentSigningInput) => {
  try {
    const { attachmentIds, taskId, userId, companyId, taskBoardId } = payload;

    return apiService.post(`${BASE_PATH}/workflow`, {
      attachment_ids: attachmentIds,
      card_id: taskId,
      user_id: userId,
      company_id: companyId,
      job_id: taskBoardId,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const getDocumentsStatuses = async ({
  taskId,
  companyId,
}: {
  taskId: string;
  companyId: string;
}) => {
  try {
    return apiService.get(`${BASE_PATH}/workflow/${companyId}/${taskId}`);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getDocument = async ({ path }: { path: string }) => {
  try {
    return apiService.get(`${BASE_PATH}/document/updated?path=${path}`);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const cancelDocumentSigning = async (payload: CancelDocumentSigningInput) => {
  const { companyId, documentId, workflowId, taskId } = payload;
  try {
    return apiService.delete(
      `${BASE_PATH}/workflow/${companyId}/${documentId}/${workflowId}/${taskId}`,
    );
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

export default {
  initDocumentSigning,
  getDocumentsStatuses,
  getDocument,
  cancelDocumentSigning,
};
