import { Modal, Form, Input } from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel, TimezoneSelectInput } from '@/components';

import type { BaseModalConfig } from '@/types';

const FormItem = Form.Item;

type Props = BaseModalConfig & {
  loading: boolean;
  onSubmit: (values: FormValues) => void;
};

export type FormValues = {
  name: string;
  timezone: string;
};

const AddWorkScheduleModal = (props: Props) => {
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
      title="Add Work Schedule"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Form layout="vertical" form={form}>
        <FormItem
          label={
            <FormLabel
              label="Name"
              tooltip="Fill in the name for your work schedule."
            />
          }
          field="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter name" showWordLimit maxLength={100} />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Timezone"
              tooltip="Select a timezone for the work schedule."
            />
          }
          field="timezone"
          rules={[{ required: true }]}
        >
          <TimezoneSelectInput />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default AddWorkScheduleModal;
