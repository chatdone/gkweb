import { Form, Modal, Select, DatePicker } from '@arco-design/web-react';
import { useEffect } from 'react';

import { SelectUserInput } from '@/components';

import { BaseModalConfig, SelectOption } from '@/types';

export type FormValues = {
  taskId: string;
  memberId: string;
  timeline: string[];
};

type Props = BaseModalConfig & {
  loading: boolean;
  taskOptions: SelectOption[];
  companyMemberOptions: SelectOption[];
  onSubmit: (values: FormValues) => void;
};

const AddTimeCostEntryModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    taskOptions,
    companyMemberOptions,
    onSubmit,
  } = props;

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
        <Form.Item field="taskId" label="Task" rules={[{ required: true }]}>
          <Select showSearch options={taskOptions} />
        </Form.Item>

        <Form.Item field="memberId" label="Member">
          <SelectUserInput mode="single" options={companyMemberOptions} />
        </Form.Item>

        <Form.Item field="timeline" label="Date & Time">
          <DatePicker.RangePicker className="w-full" showTime />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTimeCostEntryModal;
