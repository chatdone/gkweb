import {
  Modal,
  Form,
  Input,
  Radio,
  Select,
  Checkbox,
  Button,
} from '@arco-design/web-react';
import { random } from 'lodash-es';
import { useEffect, useState } from 'react';
import { MdAdd, MdArrowDropUp, MdArrowRight } from 'react-icons/md';

import { FormLabel, SelectUserInput, TooltipIcon } from '@/components';
import TaskStatusInput from '@/components/TaskStatusInput';

import { useAppStore } from '@/stores/useAppStore';

import { TASK_PROPERTY_OPTIONS } from '@/constants/task.constants';

import type { BaseModalConfig, SelectOption } from '@/types';

import {
  TaskBoard,
  ProjectVisibility,
  CompanyMemberType,
  CommonVisibility,
} from 'generated/graphql-types';

type FormStatus = {
  id?: string;
  name: string;
  color: string;
  notify: boolean;
};

export type FormValues = {
  name: string;
  visibility: {
    type: ProjectVisibility;
    teamIds?: string[];
    memberIds?: string[];
  };
  description?: string;
  properties: string[];
  statuses: FormStatus[];
  ownerIds: string[];
};

type Props = BaseModalConfig & {
  loading: boolean;
  project: TaskBoard | null | undefined;
  companyTeamOptions: SelectOption[];
  companyMemberOptions: SelectOption[];
  onUpdate: (values: FormValues) => void;
};

const EditProjectModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    project,
    companyTeamOptions,
    companyMemberOptions,
    onUpdate,
  } = props;

  const { currentUser, getCurrentMember } = useAppStore();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentType, setType] = useState<CommonVisibility>();

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      setType(
        (project?.visibility || CommonVisibility.Public) as CommonVisibility,
      );

      form.resetFields();

      const properties = project?.projectSettings?.columns
        ? Object.keys(project.projectSettings?.columns)
        : [];

      const statuses =
        project?.projectStatuses?.map((status) => ({
          id: status?.id as string,
          name: status?.name as string,
          color: status?.color as string,
          notify: status?.notify as boolean,
        })) || [];

      form.setFieldsValue({
        name: project?.name as string,
        properties,
        statuses,
        ownerIds: project?.owners?.map((owner) => owner?.companyMember?.id),
        visibility: {
          type: project?.visibility as unknown as ProjectVisibility,
          teamIds: project?.visibilityWhitelist?.teams?.map((team) => team?.id),
          memberIds: project?.visibilityWhitelist?.members?.map(
            (member) => member?.id,
          ),
        },
      });
    }
  }, [visible, project]);

  const handleToggleShowAdvance = () => {
    setShowAdvanced((prev) => !prev);
  };

  const handleAddCustomStatus = () => {
    const prevStatuses = form.getFieldValue('statuses') as FormStatus[];

    const customColors = [
      'orangered',
      'orange',
      'lime',
      'cyan',
      'purple',
      'pinkpurple',
      'magenta',
      'gray',
    ];

    const randomColorIndex = random(0, customColors.length);

    form.setFieldValue('statuses', [
      ...prevStatuses,
      {
        name: '',
        color: customColors[randomColorIndex],
        notify: false,
      },
    ]);
  };

  const handleRemoveCustomStatus = (index: number) => {
    const prevStatuses = form.getFieldValue('statuses') as FormStatus[];

    const newStatuses = prevStatuses.filter(
      (_, statusIndex) => statusIndex !== index,
    );
    form.setFieldValue('statuses', newStatuses);
  };

  const handleSubmit = () => {
    form.validate().then(() => {
      const values = form.getFields() as FormValues;

      onUpdate(values);
    });
  };

  const getCanEditProjectVisibility = () => {
    if (!project) {
      return false;
    }

    const companyMember = getCurrentMember();

    return (
      companyMember?.type === CompanyMemberType.Admin ||
      companyMember?.type === CompanyMemberType.Manager ||
      project.createdBy?.id === currentUser?.id ||
      project.owners?.some(
        (owner) => owner?.companyMember?.user?.id === currentUser?.id,
      )
    );
  };

  return (
    <Modal
      className="w-full max-w-lg"
      title="Edit Project"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
    >
      <Form layout="vertical" form={form}>
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

        {getCanEditProjectVisibility() && (
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

        <Form.Item className="mb-0" label="Project Settings" shouldUpdate>
          {(values) => (
            <div className="mt-2 rounded bg-gray-100 p-3">
              <div className="mb-4">
                <div className="mb-1">Properties</div>

                <Form.Item noStyle field="properties">
                  <Checkbox.Group className="w-full">
                    <div className="grid grid-cols-2 md:grid-cols-3">
                      {TASK_PROPERTY_OPTIONS.map((option) => (
                        <div key={option.value}>
                          <Checkbox value={option.value}>
                            {option.label}
                          </Checkbox>

                          <TooltipIcon
                            iconClassName="text-gray-400"
                            trigger="click"
                            content={option.tooltip}
                          />
                        </div>
                      ))}
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              </div>

              <div className="mb-4">
                <div className="mb-1">Status</div>

                <div className="grid grid-cols-2 gap-10">
                  <div>
                    {values?.statuses?.slice(0, 4)?.map(
                      (
                        status: {
                          id?: string;
                          color: string;
                          name: string;
                          notify: boolean;
                        },
                        index: number,
                      ) => (
                        <div
                          key={status.id || index}
                          className="flex items-center"
                        >
                          <TaskStatusInput
                            value={status}
                            onChange={(value) =>
                              form.setFieldValue(
                                // @ts-ignore
                                `statuses[${index}]`,
                                value,
                              )
                            }
                          />

                          <TooltipIcon
                            iconClassName="text-gray-400"
                            trigger="click"
                            content={defaultStatusDescription[index]}
                          />
                        </div>
                      ),
                    )}
                  </div>

                  <div>
                    <div>
                      {values?.statuses?.slice(4)?.map(
                        (
                          status: {
                            id?: string;
                            color: string;
                            name: string;
                            notify: boolean;
                          },
                          index: number,
                        ) => (
                          <TaskStatusInput
                            key={status.id || index}
                            value={status}
                            onChange={(value) =>
                              form.setFieldValue(
                                // @ts-ignore
                                `statuses[${index + 4}]`,
                                value,
                              )
                            }
                            onDelete={() => handleRemoveCustomStatus(index + 4)}
                          />
                        ),
                      )}

                      <Button
                        className="px-1"
                        type="text"
                        onClick={handleAddCustomStatus}
                      >
                        <div className="text-gray-600 hover:text-red-600">
                          <MdAdd className="mr-1" /> Add custom status
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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

const defaultStatusDescription = [
  'Represent new task, default status for all tasks',
  'Represent in progress task',
  'Represent completed task',
  'Represent problem, stuck, or rejected task',
];

export default EditProjectModal;
