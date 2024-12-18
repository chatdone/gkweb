import {
  Badge,
  Checkbox,
  Dropdown,
  Input,
  Menu,
  Trigger,
} from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { MdMoreVert } from 'react-icons/md';

type Status = {
  name: string;
  color: string;
  notify: boolean;
};

type Props = {
  value?: Status;
  onChange?: (value: Status) => void;
  onDelete?: () => void;
};

const colors = [
  'orangered',
  'orange',
  'lime',
  'cyan',
  'purple',
  'pinkpurple',
  'magenta',
  'gray',
];

const TaskStatusInput = (props: Props) => {
  const [stateValue, setValue] = useState(props.value);
  const value = props.value ||
    stateValue || { color: 'gray', name: '', notify: false };

  useEffect(() => {
    if (props.value !== stateValue && props.value === undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  const handleChange = (field: keyof Status, newValue: string | boolean) => {
    const updatedValue = {
      ...value,
      [field]: newValue,
    };

    if (!('value' in props)) {
      setValue(updatedValue);
    }

    props.onChange && props.onChange(updatedValue);
  };

  return (
    <div className="flex items-center">
      <div className="px-1">
        <Trigger
          showArrow
          trigger="click"
          position="bl"
          popup={() => (
            <div className="grid grid-cols-4 gap-2 bg-white p-3">
              {colors.map((color) => (
                <Badge
                  key={color}
                  dotStyle={{ width: 12, height: 12 }}
                  color={color}
                  onClick={() => handleChange('color', color)}
                />
              ))}
            </div>
          )}
        >
          <Badge color={value.color} dotStyle={{ width: 12, height: 12 }} />
        </Trigger>
      </div>

      <div className="flex-1">
        <Input
          className="px-2"
          placeholder="Add a status name"
          value={value.name}
          onChange={(value) => handleChange('name', value)}
        />
      </div>

      <Dropdown
        trigger="click"
        position="br"
        droplist={
          <Menu>
            <Menu.Item key="notify">
              <div className="flex w-32 items-center">
                <div className="flex-1">Notification</div>

                <Checkbox
                  checked={value.notify}
                  onChange={(checked) => handleChange('notify', checked)}
                />
              </div>
            </Menu.Item>

            {props.onDelete && (
              <>
                <hr />
                <Menu.Item key="delete" onClick={props.onDelete}>
                  Delete
                </Menu.Item>
              </>
            )}
          </Menu>
        }
      >
        <div className="px-1">
          <MdMoreVert className="text-gray-400" />
        </div>
      </Dropdown>
    </div>
  );
};

export default TaskStatusInput;
