import { Form, Modal, Select } from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel } from '@/components';

import { BaseModalConfig, SelectOption } from '@/types';

export type FormValues = {
  workspaceId: string;
  projectId: string;
  groupId: string;
};

type Props = BaseModalConfig & {
  loading: boolean;
  workspaceOptions: SelectOption[];
  workspaceProjectOptions: { [key: string]: SelectOption[] };
  projectGroupOptions: { [key: string]: SelectOption[] };
  onSubmit: (values: FormValues) => void;
};

const MoveTaskModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    workspaceOptions,
    workspaceProjectOptions,
    projectGroupOptions,
    onSubmit,
  } = props;

  const [form] = Form.useForm<FormValues>();
  // @ts-ignore
  const workspaceId = Form.useWatch('workspaceId', form);
  // @ts-ignore
  const projectId = Form.useWatch('projectId', form);

  useEffect(() => {
    visible && form.resetFields();
  }, [visible]);

  useEffect(() => {
    form.resetFields(['projectId', 'groupId']);
  }, [workspaceId]);

  useEffect(() => {
    form.resetFields(['groupId']);
  }, [projectId]);

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
      title="Move Task"
      onOk={handleSubmit}
      okText="Move Task"
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
          field="workspaceId"
          label={<FormLabel label="Workspace" />}
          rules={[{ required: true }]}
        >
          <Select options={workspaceOptions} />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {(values) => (
            <Form.Item
              field="projectId"
              label={<FormLabel label="Project" />}
              rules={[{ required: true }]}
            >
              <Select options={workspaceProjectOptions[values?.workspaceId]} />
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {(values) => (
            <Form.Item
              field="groupId"
              label={<FormLabel label="Group" />}
              rules={[{ required: true }]}
            >
              <Select options={projectGroupOptions[values?.projectId]} />
            </Form.Item>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MoveTaskModal;
