import {
  Space,
  Tag,
  Button,
  Select,
  SelectProps,
} from '@arco-design/web-react';
import type { SelectHandle } from '@arco-design/web-react/es/Select/interface';
import { useState, useEffect, useRef } from 'react';
import { MdPersonAddAlt } from 'react-icons/md';

import Avatar from '../Avatar';
import styles from './UserSelectInput.module.less';

type Props = {
  options: SelectProps['options'];
  value?: string[];
  isReadOnly?: boolean;
  filterOption?: SelectProps['filterOption'];
  onChange?: (value: string[]) => void;
  onAdd?: (value: string) => void;
  onRemove?: (value: string) => void;
};

const UserSelectInput = (props: Props) => {
  const [showSelect, setShowSelect] = useState(false);
  const [stateValue, setValue] = useState(props.value);
  const value = props.value || stateValue || [];

  const isReadOnly = props.isReadOnly || false;

  const selectRef = useRef<SelectHandle>(null);

  useEffect(() => {
    if (props.value !== stateValue && props.value === undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    if (showSelect) {
      selectRef.current?.focus();
    }
  }, [showSelect]);

  const handleShowSelect = () => {
    setShowSelect(true);
  };

  const handleChange = (newValue: string) => {
    setShowSelect(false);

    const isNewValue = !value.includes(newValue);

    if (!isNewValue) {
      return;
    }

    const newArray = [...value, newValue];

    if (!('value' in props)) {
      setValue(newArray);
    }

    props.onChange?.(newArray);
    props.onAdd?.(newValue);
  };

  const handleRemoveUser = (id: string) => {
    const newValue = value.filter((val) => val !== id);

    if (!('value' in props)) {
      setValue(newValue);
    }

    props.onChange?.(newValue);
    props.onRemove?.(id);
  };

  return (
    <Space wrap>
      {value.map((id) => {
        const option = props.options?.find(
          (option) => typeof option === 'object' && option.value === id,
        );

        return (
          typeof option === 'object' && (
            <Tag
              key={id}
              className={styles.tag}
              icon={<Avatar size={16} name={option.label as string} />}
              closable={!isReadOnly}
              bordered
              onClose={() => handleRemoveUser(option.value as string)}
            >
              {option.label}
            </Tag>
          )
        );
      })}

      {!isReadOnly &&
        (showSelect ? (
          <Select
            ref={selectRef}
            showSearch
            options={props.options}
            onChange={handleChange}
            onBlur={() => setShowSelect(false)}
            filterOption={props.filterOption}
          />
        ) : (
          <Button
            data-testid="add-btn"
            shape="circle"
            icon={<MdPersonAddAlt />}
            onClick={handleShowSelect}
          />
        ))}
    </Space>
  );
};

export default UserSelectInput;
