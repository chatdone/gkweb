import { Modal, Form, Input, Radio, Select } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

import { Avatar, FormLabel } from '@/components';

import { useAppStore } from '@/stores/useAppStore';
import { QueryWorkspace } from '@/stores/useWorkspaceStore';

import { WORKSPACE_COLORS } from '@/constants/task.constants';

import type { BaseModalConfig, SelectOption } from '@/types';

import { CommonVisibility, CompanyMemberType } from 'generated/graphql-types';

export type FormValues = {
  name: string;
  color: string;
  visibility: {
    type: CommonVisibility;
    teamIds?: string[];
    memberIds?: string[];
  };
};

type Props = BaseModalConfig & {
  loading: boolean;
  workspace: QueryWorkspace | undefined;
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
  companyTeamOptions: SelectOption[];
  companyMemberOptions: SelectOption[];
};

const EditWorkspaceModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    workspace,
    onCreate,
    onUpdate,
    companyTeamOptions,
    companyMemberOptions,
  } = props;
  const { currentUser, getCurrentMember } = useAppStore();
  const [form] = Form.useForm<FormValues>();
  const [currentType, setType] = useState<CommonVisibility>();

  useEffect(() => {
    if (visible) {
      setType(
        (workspace?.visibility || CommonVisibility.Public) as CommonVisibility,
      );
      form.setFieldsValue({
        name: workspace?.name as string,
        color: workspace?.bgColor as string,
        visibility: {
          type: workspace?.visibility as unknown as CommonVisibility,
          teamIds: workspace?.visibilityWhitelist?.teams?.map(
            (team) => team?.id,
          ),
          memberIds: workspace?.visibilityWhitelist?.members?.map(
            (member) => member?.id,
          ),
        },
      });
      if (!workspace) {
        form.resetFields();
      }
    }
  }, [visible, workspace]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      if (workspace) {
        onUpdate(values);
      } else {
        onCreate(values);
      }
    });
  };

  const getCanEditWorkspaceVisibility = () => {
    if (!workspace) {
      return false;
    }

    const companyMember = getCurrentMember();

    return (
      companyMember?.type === CompanyMemberType.Admin ||
      companyMember?.type === CompanyMemberType.Manager ||
      workspace.createdBy?.id === currentUser?.id
    );
  };

  return (
    <Modal
      className="w-full max-w-lg"
      title={`${workspace ? 'Edit' : 'Add'} Workspace`}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={workspace ? 'Save' : 'Add Workspace'}
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Form layout="vertical" form={form} initialValues={{ color: 'gray' }}>
        <div className="flex">
          <div>
            <Form.Item noStyle shouldUpdate>
              {(values) => (
                <Avatar
                  // className={`${styles['color-bg']} ${values.color}`}
                  className={`gk-bg ${values.color}`}
                  shape="square"
                  size={60}
                  name={values.name}
                />
              )}
            </Form.Item>
          </div>

          <div className="flex-1 pl-4">
            <Form.Item
              field="name"
              label={<FormLabel label="Workspace name" />}
              rules={[{ required: true }]}
            >
              <Input
                allowClear
                placeholder="Add a workspace name"
                showWordLimit
                maxLength={100}
              />
            </Form.Item>

            {getCanEditWorkspaceVisibility() && (
              <>
                <Form.Item
                  shouldUpdate
                  field="visibility.type"
                  label={<FormLabel label="Visibility" />}
                >
                  {(values) => {
                    return (
                      <Radio.Group
                        onChange={(val) => setType(val as CommonVisibility)}
                        type="button"
                        value={values?.visibility?.type}
                        options={[
                          {
                            label: 'Public',
                            value: CommonVisibility.Public,
                          },
                          {
                            label: 'Private',
                            value: CommonVisibility.Private,
                          },
                          {
                            label: 'Custom',
                            value: CommonVisibility.Specific,
                          },
                        ]}
                      />
                    );
                  }}
                </Form.Item>

                {currentType === CommonVisibility.Specific && (
                  <>
                    <Form.Item field="visibility.teamIds" label="Teams">
                      <Select
                        showSearch
                        mode="multiple"
                        options={companyTeamOptions}
                      />
                    </Form.Item>

                    <Form.Item
                      shouldUpdate
                      field="visibility.memberIds"
                      label="Members"
                    >
                      <Select
                        showSearch
                        mode="multiple"
                        options={companyMemberOptions}
                      />
                    </Form.Item>
                  </>
                )}
              </>
            )}

            <hr className="mb-4" />

            <Form.Item
              className="pr-8"
              field="color"
              label={<FormLabel label="Background color" />}
            >
              <Radio.Group>
                {WORKSPACE_COLORS.map((color) => (
                  <Radio key={color} value={color}>
                    {({ checked }) => {
                      return (
                        <div
                          key={color}
                          className={`gk-bg h-8 w-8 rounded-full ${color} ${
                            checked ? '' : 'border-8 border-white'
                          }`}
                        />
                      );
                    }}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default EditWorkspaceModal;
