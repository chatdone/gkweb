import { Modal, Form, Select } from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel } from '@/components';

import type { BaseModalConfig, SelectOption } from '@/types';

const FormItem = Form.Item;

type Props = BaseModalConfig & {
  loading: boolean;
  contactGroupOptions: SelectOption[];
  onSubmit: (values: FormValues) => void;
};

export type FormValues = {
  groupId: string;
};

export const SwitchGroupModal = (props: Props) => {
  const { visible, onCancel, loading, onSubmit, contactGroupOptions } = props;

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
      visible={visible}
      onCancel={onCancel}
      title="Switch Group"
      onOk={handleSubmit}
      okText="Save"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Form layout="vertical" form={form}>
        <FormItem
          label={<FormLabel label="Group" tooltip="Group" />}
          field="groupId"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              ...contactGroupOptions,
              {
                label: 'Unassigned',
                value: 'unassigned',
              },
            ]}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default SwitchGroupModal;
