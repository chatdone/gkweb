import { Modal } from '@arco-design/web-react';
import type { PaymentMethod } from '@stripe/stripe-js';
import { useEffect, useRef, useState } from 'react';

import { StripeCardForm, StripeCardFormRef } from '@/components';

import type { BaseModalConfig } from '@/types';

type Props = BaseModalConfig & {
  onSubmit: (paymentMethod: PaymentMethod) => Promise<void>;
};

const AddPaymentMethodModal = (props: Props) => {
  const { visible, onCancel, onSubmit } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const stripRef = useRef<StripeCardFormRef>(null);

  useEffect(() => {
    if (visible) {
      stripRef.current?.clearValues();
    }
  }, [visible]);

  const handleSubmit = async () => {
    setLoading(true);

    const paymentMethod = await stripRef.current?.createPaymentMethod();

    paymentMethod && (await onSubmit(paymentMethod));

    setLoading(false);
  };

  return (
    <Modal
      title="Add Card"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <StripeCardForm ref={stripRef} />
    </Modal>
  );
};

export default AddPaymentMethodModal;
