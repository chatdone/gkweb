import { Input, Cascader } from '@arco-design/web-react';
import { escapeRegExp } from 'lodash-es';
import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import Avatar from '../Avatar';

export type CascaderOption = {
  label: string;
  value: string;
  children: { label: string; value: string }[];
};

type Props = {
  options: CascaderOption[];
  value?: (string | string[])[];
  placeholder?: string;
  onChange?: (value: (string | string[])[]) => void;
};

const SelectUserCascaderInput = (props: Props) => {
  const { options, placeholder } = props;

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [stateValue, setValue] = useState(props.value);
  const value = props.value || stateValue || [];

  useEffect(() => {
    if (props.value !== stateValue && props.value === undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  const handleClearSearch = () => {
    setSearchKeyword('');
  };

  const handleChange = (newValue: (string | string[])[]) => {
    if (!props.value) {
      setValue(newValue);
    }

    props.onChange?.(newValue);
  };

  const getValueLabel = (value: string) => {
    let name = '';

    for (const opt of options) {
      const found = opt.children.find((child) => child.value === value);

      if (found) {
        name = found.label;
        break;
      }
    }

    return name;
  };

  return (
    <Cascader
      mode="multiple"
      placeholder={placeholder}
      inputValue={searchKeyword}
      options={options}
      value={value}
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
      // @ts-ignore
      filterOption={(input, node) => {
        return node.label.match(new RegExp(escapeRegExp(input), 'i'));
      }}
    >
      {value.length > 0 ? (
        <Avatar.Group size={24}>
          {value.map(([, value]) => {
            const name = getValueLabel(value);

            return name && <Avatar key={value} name={name} showTooltip />;
          })}
        </Avatar.Group>
      ) : (
        <div className="cursor-pointer px-1 hover:bg-gray-200">
          <MdAdd className="text-gray-600 hover:text-gray-900" />
        </div>
      )}
    </Cascader>
  );
};

export default SelectUserCascaderInput;
