import { Modal } from '@arco-design/web-react';

import DedocoVisualBuilder from '@/components/DedocoVisualBuilder';

import { BaseModalConfig } from '@/types';

import { TaskAttachment } from 'generated/graphql-types';

type Props = BaseModalConfig & {
  payload: {
    attachments: (TaskAttachment | null)[];
    taskId: string;
    companyId: string;
    userId: string;
    taskBoardId: string;
  };
  onComplete: () => void;
};

const DedocoModal = (props: Props) => {
  const { visible, onCancel, payload, onComplete } = props;

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Request Signature"
      footer={null}
      style={{ minWidth: '100%' }}
      unmountOnExit
    >
      <DedocoVisualBuilder
        payload={payload}
        onComplete={onComplete}
        onFail={onCancel}
      />
    </Modal>
  );
};

export default DedocoModal;
