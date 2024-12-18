import { Modal as ArcoModal } from '@arco-design/web-react';
import type { ConfirmProps } from '@arco-design/web-react/es/Modal/confirm';

import { open } from './ConfirmationModal';

const Modal = {
  confirm: (props: ConfirmProps) =>
    ArcoModal.confirm({
      okText: 'Confirm',
      okButtonProps: {
        style: {
          background: '#d6001c',
        },
      },
      ...props,
    }),
  info: (props: ConfirmProps) =>
    ArcoModal.info({
      okText: 'Confirm',
      okButtonProps: {
        style: {
          background: '#d6001c',
        },
      },
      ...props,
    }),
  error: (props: ConfirmProps) =>
    ArcoModal.error({
      okText: 'Confirm',
      okButtonProps: {
        style: {
          background: '#d6001c',
        },
      },
      ...props,
    }),
  confirmV2: open,
};

export default Modal;
