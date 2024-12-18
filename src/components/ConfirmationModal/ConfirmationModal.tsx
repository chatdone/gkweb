import { Modal } from '@arco-design/web-react';
import { useState } from 'react';

import { BaseModalConfig } from '@/types';

export type Config = {
  title: string;
  content: string;
  onConfirm?: (() => void) | (() => Promise<unknown>);
  okText?: string;
  afterClose: () => void;
};

type Props = BaseModalConfig & Config;

const ConfirmationModal = (props: Props) => {
  const { visible, onCancel, title, content, okText, afterClose, onConfirm } =
    props;

  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    setLoading(true);

    try {
      await onConfirm?.();

      onCancel();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className="w-full max-w-sm"
      visible={visible}
      onCancel={onCancel}
      title={title}
      okText={okText}
      cancelText="Cancel"
      okButtonProps={{ status: 'danger' }}
      focusLock
      autoFocus={false}
      afterClose={afterClose}
      onConfirm={handleConfirm}
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      escToExit={!loading}
      maskClosable={!loading}
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmationModal;
