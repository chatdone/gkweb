import { Modal, Form, Select } from '@arco-design/web-react';
import { useEffect } from 'react';

import type { BaseModalConfig, SelectOption } from '@/types';

export type FormValues = {
  workspaceId: string;
};

type Props = BaseModalConfig & {
  loading: boolean;
  workspaceOptions: SelectOption[];
  onSubmit: (values: FormValues) => void;
};

const DuplicateProjectModal = (props: Props) => {
  const { visible, onCancel, loading, workspaceOptions, onSubmit } = props;

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
      title="Duplicate Project"
      onOk={handleSubmit}
      okText="Duplicate Project"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Duplicate project to"
          field="workspaceId"
          rules={[{ required: true }]}
        >
          <Select options={workspaceOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DuplicateProjectModal;
