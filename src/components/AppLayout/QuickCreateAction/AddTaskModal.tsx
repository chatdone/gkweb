import { Form, Input, Modal, Select } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { ReactNode, useEffect } from 'react';

import { FormLabel } from '@/components';
import SelectUserInput from '@/components/SelectUserInput';
import TaskTimelinePicker from '@/components/TaskTimelinePIcker';

import { TASK_NAME_MAX_LENGTH } from '@/constants/task.constants';

import { BaseModalConfig, SelectOption } from '@/types';

export type FormValues = {
  name: string;
  workspaceId: string;
  projectId: string;
  groupId: string;
  statusId?: string;
  timeline?: string[];
  assigneeIds?: string[];
};

type Props = BaseModalConfig & {
  loading: boolean;
  workspaceOptions: SelectOption[];
  workspaceProjectOptions: { [key: string]: SelectOption[] };
  projectGroupOptions: { [key: string]: SelectOption[] };
  companyMemberOptions: SelectOption[];
  projectStatusOptions: { [key: string]: SelectOption[] };
  onSubmit: (values: FormValues) => void;
};

const AddTaskModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    workspaceOptions,
    workspaceProjectOptions,
    projectGroupOptions,
    companyMemberOptions,
    projectStatusOptions,
    onSubmit,
  } = props;

  const [form] = Form.useForm<FormValues>();
  // @ts-ignore
  const workspaceId = Form.useWatch('workspaceId', form);
  // @ts-ignore
  const projectId = Form.useWatch('projectId', form);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        timeline: [dayjs().format(), dayjs().format()],
      });
    }
  }, [visible]);

  useEffect(() => {
    form.resetFields(['projectId', 'groupId', 'statusId']);
  }, [workspaceId]);

  useEffect(() => {
    form.resetFields(['groupId', 'statusId']);
  }, [projectId]);

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
      title="Add Task"
      onOk={handleSubmit}
      okText="Add Task"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          field="name"
          label={<FormLabel label="Task name" />}
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Add a task name"
            maxLength={TASK_NAME_MAX_LENGTH}
            showWordLimit
          />
        </Form.Item>

        <Form.Item className="mb-0" label="Properties">
          <div className="bg-gray-100 p-0.5">
            <div className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
              <PropertyItem label="Workspace">
                <Form.Item
                  field="workspaceId"
                  noStyle
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Please select"
                    options={workspaceOptions}
                  />
                </Form.Item>
              </PropertyItem>

              <PropertyItem label="Project">
                <Form.Item noStyle shouldUpdate>
                  {(values) => (
                    <Form.Item
                      field="projectId"
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Please select"
                        options={workspaceProjectOptions[values?.workspaceId]}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </PropertyItem>

              <PropertyItem label="Group">
                <Form.Item noStyle shouldUpdate>
                  {(values) => (
                    <Form.Item
                      field="groupId"
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Please select"
                        options={projectGroupOptions[values?.projectId]}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </PropertyItem>

              <PropertyItem label="Status">
                <Form.Item noStyle shouldUpdate>
                  {(values) => (
                    <Form.Item field="statusId" noStyle>
                      <Select
                        placeholder="Please select"
                        options={projectStatusOptions[values?.projectId]}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </PropertyItem>

              <PropertyItem label="Timeline" childrenWrapperClassName="pl-2">
                <Form.Item field="timeline" noStyle>
                  <TaskTimelinePicker />
                </Form.Item>
              </PropertyItem>

              <PropertyItem label="Assignee">
                <Form.Item field="assigneeIds" noStyle>
                  <SelectUserInput options={companyMemberOptions} />
                </Form.Item>
              </PropertyItem>
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const PropertyItem = ({
  label,
  children,
  childrenWrapperClassName,
}: {
  label: string;
  children: ReactNode;
  childrenWrapperClassName?: string;
}) => {
  return (
    <div className="flex items-center px-2 py-3">
      <div className="flex-1">{label}</div>

      <div className={`w-40 ${childrenWrapperClassName}`}>{children}</div>
    </div>
  );
};

export default AddTaskModal;
