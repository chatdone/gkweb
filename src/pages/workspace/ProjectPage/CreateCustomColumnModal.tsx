import { Form, Modal, Select, Input, Button } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';

import { FormLabel } from '@/components';

import { BaseModalConfig, SelectOption } from '@/types';

import { ProjectGroupCustomAttributeType } from 'generated/graphql-types';

export type FormValues = {
  groupIds: string[];
  name: string;
  type: ProjectGroupCustomAttributeType;
};

type Props = BaseModalConfig & {
  loading: boolean;
  groupIds: string[];
  onSubmit: (values: FormValues) => void;
  onEdit?: ({
    attributeId,
    groupId,
    name,
  }: {
    attributeId: string;
    groupId: string;
    name: string;
  }) => void;
  onDelete?: ({
    attributeId,
    groupId,
  }: {
    attributeId: string;
    groupId: string;
  }) => void;
  current?: {
    attributeId: string;
    name: string;
    type: ProjectGroupCustomAttributeType;
  };
};

const CreateCustomColumnModal = (props: Props) => {
  const { visible, onCancel, groupIds, onSubmit, current, onDelete, onEdit } =
    props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    visible && form.resetFields();
  }, [visible]);

  useEffect(() => {
    if (current) {
      form.setFieldValue('name', current.name);
      form.setFieldValue('type', current.type);
    }
  }, [current]);

  useEffect(() => {
    form.setFieldsValue({ groupIds });
  }, [groupIds]);

  const handleSubmit = () => {
    if (current) {
      onEdit?.({
        attributeId: current.attributeId,
        groupId: groupIds[0],
        name: form.getFieldValue('name') as string,
      });
      return;
    }

    form.validate().then((values) => {
      const input = { ...values, groupIds };
      onSubmit(input);
    });
  };

  const handleDelete = () => {
    if (current) {
      onDelete?.({
        attributeId: current?.attributeId as string,
        groupId: groupIds[0],
      });
    }
  };

  const typeOptions: SelectOption[] = [
    { label: 'Text', value: ProjectGroupCustomAttributeType.Text },
    { label: 'Number', value: ProjectGroupCustomAttributeType.Number },
  ];

  return (
    <Modal
      className="w-full max-w-sm"
      visible={visible}
      onCancel={onCancel}
      title={current ? 'Edit Custom Column' : 'Create Custom Column'}
      footer={
        <div className="flex justify-end">
          {current && (
            <Button
              onClick={handleDelete}
              className="mx-2"
              style={{ background: 'none' }}
              icon={<MdDelete color="red" />}
              iconOnly
            />
          )}
          <Button className="mx-2" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} className="mx-2" type="primary">
            {current ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        wrapperCol={{ span: 17 }}
        labelCol={{ span: 7 }}
        labelAlign="left"
      >
        <Form.Item
          field="type"
          label={<FormLabel label="Type" />}
          rules={[{ required: true }]}
        >
          <Select disabled={current ? true : false} options={typeOptions} />
        </Form.Item>

        <Form.Item
          field="name"
          label={<FormLabel label="Name" />}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCustomColumnModal;
