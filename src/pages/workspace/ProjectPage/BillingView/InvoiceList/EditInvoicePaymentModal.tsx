import { Form, Modal, InputNumber, DatePicker } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useEffect } from 'react';

import { BaseModalConfig } from '@/types';

export type FormValues = {
  date: string;
  amount: number;
};

type Props = BaseModalConfig & {
  payment: unknown | undefined;
  loading: boolean;
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
};

const EditInvoicePaymentModal = (props: Props) => {
  const { visible, onCancel, loading, payment, onCreate, onUpdate } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      if (payment) {
        // form.setFieldsValue({
        // });
      } else {
        form.resetFields();
      }
    }
  }, [visible]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      payment ? onUpdate(values) : onCreate(values);
    });
  };

  return (
    <Modal
      className="w-full max-w-sm"
      visible={visible}
      onCancel={onCancel}
      title={payment ? 'Edit Payment' : 'Receive Payment'}
      onOk={handleSubmit}
      okText="Confirm"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
      autoFocus={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          date: dayjs().format(),
        }}
      >
        <Form.Item
          field="date"
          label="Date"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          field="amount"
          label="Amount"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber prefix="RM" placeholder="0.00" precision={2} min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditInvoicePaymentModal;
