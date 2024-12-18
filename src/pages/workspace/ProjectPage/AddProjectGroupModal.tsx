import { Form, Input, Modal } from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel } from '@/components';

import { BaseModalConfig } from '@/types';

export type FormValues = {
  name: string;
};

type Props = BaseModalConfig & {
  loading: boolean;
  onSubmit: (values: FormValues) => void;
};

const AddProjectGroupModal = (props: Props) => {
  const { visible, onCancel, loading, onSubmit } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    form.resetFields();
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
      title="Add Group"
      onOk={handleSubmit}
      okText="Add Group"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          field="name"
          label={<FormLabel label="Group name" />}
          rules={[{ required: true }]}
        >
          <Input placeholder="Add a group name" maxLength={100} showWordLimit />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProjectGroupModal;
