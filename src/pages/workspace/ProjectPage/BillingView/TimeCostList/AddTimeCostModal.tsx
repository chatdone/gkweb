import { Form, Modal, DatePicker } from '@arco-design/web-react';
import { useEffect } from 'react';

import { BaseModalConfig } from '@/types';

export type FormValues = {
  dateRange: string[];
};

type Props = BaseModalConfig & {
  loading: boolean;
  onSubmit: (values: FormValues) => void;
};

const AddTimeCostModal = (props: Props) => {
  const { visible, onCancel, loading, onSubmit } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    visible && form.resetFields();
  }, [visible]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      className="w-full max-w-lg"
      visible={visible}
      onCancel={onCancel}
      title="Add Time Cost"
      onOk={handleSubmit}
      okText="Add Time Cost"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          field="timeline"
          label="Date & Time"
          rules={[{ required: true }]}
        >
          <DatePicker.RangePicker className="w-full" showTime />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTimeCostModal;
