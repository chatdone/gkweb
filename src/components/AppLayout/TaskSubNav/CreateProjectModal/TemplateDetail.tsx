import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  Input,
  Menu,
} from '@arco-design/web-react';
import { random, set } from 'lodash-es';
import { useEffect, useState } from 'react';
import { MdAdd, MdMoreVert } from 'react-icons/md';

import TaskStatusInput from '@/components/TaskStatusInput';
import TooltipIcon from '@/components/TooltipIcon';

import { TASK_PROPERTY_OPTIONS } from '@/constants/task.constants';

import { ProjectTemplate } from 'generated/graphql-types';

type FormStatus = {
  id?: string;
  name: string;
  color: string;
  notify: boolean;
};

export type FormValues = {
  name: string;
  properties: string[];
  statuses: FormStatus[];
};

type Props = {
  template: ProjectTemplate | null | undefined;
  loading: boolean;
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
  onCancel: () => void;
  onDelete: () => void;
};

const defaultValues: FormValues = {
  name: '',
  properties: [],
  statuses: [],
};

const TemplateDetail = (props: Props) => {
  const { loading, template, onCreate, onUpdate, onCancel, onDelete } = props;

  const [values, setValues] = useState<FormValues>(defaultValues);

  useEffect(() => {
    const properties = template?.columns ? Object.keys(template?.columns) : [];

    const statuses: FormStatus[] =
      template?.statuses?.map((status) => ({
        id: status?.id as string,
        name: status?.name as string,
        color: status?.color as string,
        notify: status?.notify as boolean,
      })) || defaultStatuses;

    const newValues: FormValues = {
      ...defaultValues,
      name: template?.name || '',
      statuses,
      properties,
    };

    setValues(newValues);
  }, [template]);

  const handleChange = (field: string, value: unknown) => {
    const newValues = { ...values };
    set(newValues, field, value);

    setValues(newValues);
  };

  const handleAddCustomStatus = () => {
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

    setValues((prev) => ({
      ...prev,
      statuses: [
        ...prev.statuses,
        {
          name: '',
          color: customColors[randomColorIndex],
          notify: false,
        },
      ],
    }));
  };

  const handleRemoveCustomStatus = (index: number) => {
    const newStatuses = values.statuses.filter(
      (_, statusIndex) => statusIndex !== index,
    );

    setValues((prev) => ({ ...prev, statuses: newStatuses }));
  };

  const handleSubmit = async () => {
    template ? await onUpdate(values) : await onCreate(values);

    onCancel();
  };

  return (
    <div className="p-3">
      <div className="mb-4">
        <div className="mb-1">Template name</div>
        <Input
          className="bg-white"
          maxLength={100}
          value={values.name}
          onChange={(value) => handleChange('name', value)}
        />
      </div>

      <div className="mb-4">
        <div className="mb-1">Properties</div>

        <Checkbox.Group
          className="w-full"
          value={values.properties}
          onChange={(value) => handleChange('properties', value)}
        >
          <div className="grid grid-cols-2 md:grid-cols-3">
            {TASK_PROPERTY_OPTIONS.map((option) => (
              <div key={option.value}>
                <Checkbox value={option.value}>{option.label}</Checkbox>

                <TooltipIcon
                  iconClassName="text-gray-400"
                  trigger="click"
                  content={option.tooltip}
                />
              </div>
            ))}
          </div>
        </Checkbox.Group>
      </div>

      <div className="mb-4">
        <div className="mb-1">Status</div>

        <div className="grid grid-cols-2 gap-10">
          <div>
            {values.statuses.slice(0, 4).map((status, index) => (
              <div className="flex items-center" key={status.color}>
                <div className="px-1">
                  <Badge
                    color={status.color}
                    dotStyle={{ width: 12, height: 12 }}
                  />
                </div>

                <div className="flex-1">
                  <Input
                    className="px-2"
                    placeholder="Add a status name"
                    maxLength={50}
                    value={status.name}
                    onChange={(value) =>
                      handleChange(`statuses[${index}].name`, value)
                    }
                  />
                </div>

                <div className="flex items-center">
                  <Dropdown
                    trigger="click"
                    position="br"
                    droplist={
                      <Menu>
                        <Menu.Item key="notify">
                          <div className="flex w-32 items-center">
                            <div className="flex-1">Notification</div>

                            <Checkbox
                              checked={status.notify}
                              onChange={(checked) =>
                                handleChange(
                                  `statuses[${index}].notify`,
                                  checked,
                                )
                              }
                            />
                          </div>
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <div className="px-1">
                      <MdMoreVert className="text-gray-400" />
                    </div>
                  </Dropdown>

                  <TooltipIcon
                    iconClassName="text-gray-400"
                    trigger="click"
                    content={defaultStatusDescription[index]}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            {values.statuses.slice(4).map((status, index) => (
              <TaskStatusInput
                key={index}
                value={status}
                onChange={(value) =>
                  handleChange(`statuses[${index + 4}]`, value)
                }
                onDelete={() => handleRemoveCustomStatus(index + 4)}
              />
            ))}

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

      <div className="flex border-t border-gray-200 bg-gray-50 p-2">
        <div className="flex-1">
          <Button
            type="primary"
            size="small"
            loading={loading}
            onClick={handleSubmit}
          >
            Confirm
          </Button>

          <Button
            className="mr-2"
            size="small"
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>

        {template && (
          <Button size="small" type="text" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

const defaultStatusDescription = [
  'Represent new task, default status for all tasks',
  'Represent in progress task',
  'Represent completed task',
  'Represent problem, stuck, or rejected task',
];

const defaultStatuses = [
  {
    name: 'To do',
    color: 'blue',
    notify: false,
  },
  {
    name: 'Doing',
    color: 'gold',
    notify: false,
  },
  {
    name: 'Done',
    color: 'green',
    notify: false,
  },
  {
    name: 'On hold',
    color: 'red',
    notify: false,
  },
];

export default TemplateDetail;
