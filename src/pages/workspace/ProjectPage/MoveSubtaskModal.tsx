import { Form, Modal, Select } from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel } from '@/components';

import { BaseModalConfig, SelectOption } from '@/types';

export type FormValues = {
  taskId: string;
};

type Props = BaseModalConfig & {
  loading: boolean;
  taskOptions: SelectOption[];
  onSubmit: (values: FormValues) => void;
};

const MoveSubtaskModal = (props: Props) => {
  const { visible, onCancel, loading, taskOptions, onSubmit } = props;

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
      className="w-full max-w-sm"
      visible={visible}
      onCancel={onCancel}
      title="Move Subtask"
      onOk={handleSubmit}
      okText="Move Subtask"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
    >
      <Form
        form={form}
        wrapperCol={{ span: 17 }}
        labelCol={{ span: 7 }}
        labelAlign="left"
      >
        <Form.Item
          field="taskId"
          label={<FormLabel label="Task" />}
          rules={[{ required: true }]}
        >
          <Select showSearch options={taskOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MoveSubtaskModal;
