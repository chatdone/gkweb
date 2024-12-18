import {
  Button,
  ButtonProps,
  Select,
  Space,
  Tag,
} from '@arco-design/web-react';
import type {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import { useEffect, useRef, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { SelectOption } from '@/types';

type Props = {
  value: string[];
  options: SelectOption[];
  onAdd?: (id: string) => void;
  onRemove?: (id: string) => void;
  isReadOnly?: boolean;
  buttonProps?: ButtonProps;
  filterOption?: SelectProps['filterOption'];
};

const DynamicSelect = (props: Props) => {
  const {
    value,
    options,
    onAdd,
    onRemove,
    isReadOnly = false,
    buttonProps,
    filterOption,
  } = props;

  const [showSelect, setShowSelect] = useState(false);

  const selectRef = useRef<SelectHandle>(null);

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

    onAdd?.(newValue);
  };

  return (
    <Space wrap>
      {value.map((id) => {
        const option = props.options?.find((option) => option.value === id);

        return (
          option && (
            <Tag
              key={id}
              closable
              bordered
              onClose={() => onRemove?.(option.value as string)}
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
            options={options.filter(
              (option) => !value.includes(option.value as string),
            )}
            onChange={handleChange}
            onBlur={() => setShowSelect(false)}
            filterOption={filterOption}
          />
        ) : (
          <Button
            shape="circle"
            icon={<MdAdd />}
            onClick={handleShowSelect}
            {...buttonProps}
          />
        ))}
    </Space>
  );
};

export default DynamicSelect;
