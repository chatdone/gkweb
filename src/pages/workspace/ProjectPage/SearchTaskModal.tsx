import { Form, Input, Modal, Select } from '@arco-design/web-react';
import { IconCaretRight, IconCaretUp } from '@arco-design/web-react/icon';
import { ReactNode, useEffect, useState } from 'react';

import SelectUserInput from '@/components/SelectUserInput';
import TaskTimelinePicker from '@/components/TaskTimelinePIcker';

import { BaseModalConfig, SelectOption } from '@/types';

import { TaskPriorityType } from 'generated/graphql-types';

export type FormValues = {
  name?: string;
  statusId?: string;
  timeline?: string[];
  assigneeIds?: string[];
  watcherIds?: string[];
  priority?: string;
};

type Props = BaseModalConfig & {
  companyMemberOptions: SelectOption[];
  statusOptions?: SelectOption[];
  onSearch: (values: FormValues) => void;
};

const SearchTaskModal = (props: Props) => {
  const { visible, onCancel, companyMemberOptions, statusOptions, onSearch } =
    props;

  const [showFilter, setShowFilter] = useState(false);

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    visible && form.resetFields();
  }, [visible]);

  const handleToggleShowFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const handleSubmit = () => {
    form.validate().then((values) => {
      onSearch(values);
    });
  };

  const getPriorityOptions = () => {
    try {
      //enum
      const options = Object.entries(TaskPriorityType);

      return options.map(([key, value]) => {
        return {
          label: key,
          value,
        } as SelectOption;
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return (
    <Modal
      className="w-full max-w-lg"
      visible={visible}
      onCancel={onCancel}
      title="Search"
      okText="Search"
      onConfirm={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item field="name" label="Task name">
          <Input.Search allowClear placeholder="Enter keyword to search" />
        </Form.Item>

        <div
          className="my-4 flex cursor-pointer items-center px-1"
          onClick={handleToggleShowFilter}
        >
          <div className="mr-1 text-xs">
            {showFilter ? <IconCaretUp /> : <IconCaretRight />}
          </div>

          <div>Filters</div>
        </div>

        {showFilter && (
          <div className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
            {statusOptions && (
              <PropertyItem label="Status">
                <Form.Item noStyle field="statusId">
                  <Select options={statusOptions} />
                </Form.Item>
              </PropertyItem>
            )}

            <PropertyItem label="Timeline">
              <Form.Item noStyle field="timeline">
                <TaskTimelinePicker />
              </Form.Item>
            </PropertyItem>

            <PropertyItem label="Assignee">
              <Form.Item noStyle field="assigneeIds">
                <SelectUserInput options={companyMemberOptions} />
              </Form.Item>
            </PropertyItem>

            <PropertyItem label="Watchers">
              <Form.Item noStyle field="watcherIds">
                <SelectUserInput options={companyMemberOptions} />
              </Form.Item>
            </PropertyItem>

            <PropertyItem label="Priority">
              <Form.Item noStyle field="priority">
                <SelectUserInput options={getPriorityOptions()} />
              </Form.Item>
            </PropertyItem>
          </div>
        )}
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

export default SearchTaskModal;
