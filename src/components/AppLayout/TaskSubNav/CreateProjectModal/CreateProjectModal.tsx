import { Modal, Form, Input, Radio, Select } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import {
  MdOutlineDashboard,
  MdArrowDropUp,
  MdArrowRight,
} from 'react-icons/md';

import { FormLabel, SelectUserInput } from '@/components';

import { FormValues as TemplateFormValues } from './TemplateDetail';
import TemplateList from './TemplateList';

import type { BaseModalConfig, SelectOption } from '@/types';

import { ProjectTemplate, ProjectVisibility } from 'generated/graphql-types';

export type FormValues = {
  name: string;
  visibility: {
    type: ProjectVisibility;
    teamIds?: string[];
    memberIds?: string[];
  };
  templateId?: string;
  ownerIds: string[];
};

type Props = BaseModalConfig & {
  loading: boolean;
  templateLoading: boolean;
  templates: (ProjectTemplate | null)[] | null | undefined;
  companyTeamOptions: SelectOption[];
  companyMemberOptions: SelectOption[];
  onCreate: (values: FormValues) => void;
  onCreateTemplate: (values: TemplateFormValues) => void;
  onUpdateTemplate: (
    template: ProjectTemplate | null,
    values: TemplateFormValues,
  ) => void;
  onDeleteTemplate: (
    template: ProjectTemplate | null,
    callback: () => void,
  ) => void;
};

const CreateProjectModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    templateLoading,
    companyTeamOptions,
    companyMemberOptions,
    templates,
    onCreate,
    onCreateTemplate,
    onUpdateTemplate,
    onDeleteTemplate,
  } = props;

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);

  const [form] = Form.useForm<FormValues>();

  //@ts-ignore
  const visibilityType = Form.useWatch('visibility.type', form);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        templateId: templates?.[0]?.id as string,
      });
    }
  }, [visible, templates?.length]);

  useEffect(() => {
    form.setFieldsValue({
      visibility: {
        type: visibilityType,
      },
    });
  }, [visibilityType]);

  const handleToggleShowAdvance = () => {
    setShowAdvanced((prev) => !prev);
  };

  const handleShowTemplateSelection = () => {
    setShowTemplateSelection(true);
  };

  const handleHideTemplateSelection = () => {
    setShowTemplateSelection(false);
  };

  const handleSubmit = () => {
    form.validate().then(() => {
      const values = form.getFields() as FormValues;

      onCreate(values);
    });
  };

  const getTemplateLabelById = (templateId: string) => {
    return templates?.find((template) => template?.id === templateId)?.name;
  };

  return (
    <Modal
      className="w-full max-w-lg"
      title="Add Project"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Add Project"
      confirmLoading={loading}
      okButtonProps={{ disabled: templateLoading }}
      cancelButtonProps={{ disabled: loading || templateLoading }}
      maskClosable={!loading && !templateLoading}
      escToExit={!loading && !templateLoading}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          visibility: { type: ProjectVisibility.Public },
        }}
      >
        <Form.Item
          field="name"
          label={<FormLabel label="Project name" />}
          rules={[{ required: true }]}
        >
          <Input
            allowClear
            placeholder="Add a project name"
            showWordLimit
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          field="visibility.type"
          label={<FormLabel label="Visibility" />}
        >
          <Radio.Group
            type="button"
            options={[
              {
                label: 'Public',
                value: ProjectVisibility.Public,
              },
              {
                label: 'Private',
                value: ProjectVisibility.Private,
              },
              {
                label: 'Custom',
                value: ProjectVisibility.Specific,
              },
            ]}
          />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {(values) =>
            values?.visibility?.type === ProjectVisibility.Specific && (
              <>
                <Form.Item field="visibility.teamIds" label="Teams">
                  <Select
                    showSearch
                    mode="multiple"
                    options={companyTeamOptions}
                  />
                </Form.Item>

                <Form.Item field="visibility.memberIds" label="Members">
                  <Select
                    showSearch
                    mode="multiple"
                    options={companyMemberOptions}
                  />
                </Form.Item>
              </>
            )
          }
        </Form.Item>

        <hr className="mb-4" />

        <Form.Item className="mb-0" label="Project Template" shouldUpdate>
          {(values) =>
            showTemplateSelection ? (
              <TemplateList
                templates={templates}
                selectedTemplateId={values.templateId}
                loading={templateLoading}
                onCreate={onCreateTemplate}
                onUpdate={onUpdateTemplate}
                onChangeTemplate={(id) => {
                  form.setFieldValue('templateId', id);
                  handleHideTemplateSelection();
                }}
                onCancel={handleHideTemplateSelection}
                onDeleteTemplate={onDeleteTemplate}
              />
            ) : (
              <div
                className="flex cursor-pointer items-center bg-gray-100 py-1.5 px-3 hover:bg-gray-200"
                onClick={handleShowTemplateSelection}
              >
                <div className="flex-1">
                  {getTemplateLabelById(values?.templateId)}
                </div>
                <MdOutlineDashboard className="text-gray-600" />
              </div>
            )
          }
        </Form.Item>

        <hr className="my-4" />

        <Form.Item noStyle shouldUpdate>
          {(values) =>
            values.visibility !== 'private' && (
              <>
                <div
                  className="flex cursor-pointer items-center px-1"
                  onClick={handleToggleShowAdvance}
                >
                  <div className="mr-1 text-xl">
                    {showAdvanced ? <MdArrowDropUp /> : <MdArrowRight />}
                  </div>
                  <div>Advanced</div>
                </div>

                {showAdvanced && (
                  <div className="mb-4 grid rounded bg-gray-50 px-3 md:grid-cols-2">
                    <div className="py-3">
                      <div>Project owners</div>

                      <Form.Item noStyle field="ownerIds">
                        <SelectUserInput options={companyMemberOptions} />
                      </Form.Item>
                    </div>
                  </div>
                )}
              </>
            )
          }
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;
