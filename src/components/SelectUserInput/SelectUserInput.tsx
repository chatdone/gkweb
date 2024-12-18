import {
  Input,
  Select,
  Avatar as ArcoAvatar,
  SelectProps,
} from '@arco-design/web-react';
import { escapeRegExp } from 'lodash-es';
import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import Avatar from '../Avatar';

import { SelectOption } from '@/types';

type Props = {
  options: SelectOption[];
  defaultValue?: string[];
  value?: string[];
  placeholder?: string;
  onChange?: (value: string[]) => void;
  filterValue?: string[];
  mode?: SelectProps['mode'] | 'single';
};

const SelectUserInput = (props: Props) => {
  const {
    options,
    defaultValue,
    placeholder,
    filterValue,
    mode = 'multiple',
  } = props;

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [stateValue, setValue] = useState(props.value || defaultValue);
  const value = props.value || stateValue || [];

  useEffect(() => {
    if (props.value !== stateValue && props.value === undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  const handleClearSearch = () => {
    setSearchKeyword('');
  };

  const handleChange = (newValue: string[]) => {
    if (!('value' in props)) {
      setValue(newValue);
    }

    props.onChange?.(newValue);
  };

  const getVisibleOptions = () => {
    let filteredOptions = [...options];

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      filteredOptions = filteredOptions.filter((option) =>
        (option.label as string).match(regex),
      );
    }

    if (filterValue) {
      filteredOptions = filteredOptions.filter(
        (option) => !filterValue.includes(option.value as string),
      );
    }

    return filteredOptions;
  };

  return (
    <Select
      mode={mode === 'single' ? undefined : mode}
      placeholder={placeholder}
      options={getVisibleOptions()}
      value={value}
      triggerProps={{
        autoAlignPopupWidth: false,
        autoAlignPopupMinWidth: true,
      }}
      triggerElement={
        <div className="w-full">
          {value?.length ? (
            <ArcoAvatar.Group size={24}>
              {props.options
                .filter((option) => value?.includes(option.value as string))
                .map((option) => (
                  <Avatar
                    key={option.value}
                    name={option.label as string}
                    imageSrc={option?.extra?.profileImage}
                    showTooltip
                  />
                ))}
            </ArcoAvatar.Group>
          ) : (
            <div className="cursor-pointer px-1 hover:bg-gray-200">
              <MdAdd className="text-gray-600 hover:text-gray-900" />
            </div>
          )}
        </div>
      }
      dropdownRender={(menu) => (
        <>
          {menu}

          <hr />

          <div className="p-2">
            <Input.Search
              allowClear
              value={searchKeyword}
              onChange={(value) => setSearchKeyword(value)}
            />
          </div>
        </>
      )}
      onVisibleChange={(visible) => visible && handleClearSearch()}
      onChange={handleChange}
    />
  );
};

export default SelectUserInput;
