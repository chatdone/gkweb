import {
  Space,
  InputNumber,
  Typography,
  SpaceProps,
  InputNumberProps,
} from '@arco-design/web-react';
import { useState, useEffect } from 'react';

import styles from './MinMaxInput.module.less';

type MinMax = {
  min: number | undefined;
  max: number | undefined;
};

type Props = {
  value?: MinMax;
  onChange?: (value: MinMax) => void;
  showSplit?: boolean;
  size?: SpaceProps['size'];
  minInputProps?: Omit<InputNumberProps, 'value' | 'onChange'>;
  maxInputProps?: Omit<InputNumberProps, 'value' | 'onChange'>;
};

const MinMaxInput = (props: Props) => {
  const { showSplit = true, size, minInputProps, maxInputProps } = props;

  const [stateValue, setValue] = useState(props.value);
  const value = props.value || stateValue || { min: undefined, max: undefined };

  useEffect(() => {
    if (props.value !== stateValue && props.value === undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  const handleChange = (newValue: MinMax) => {
    if (!('value' in props)) {
      setValue(newValue);
    }

    props.onChange && props.onChange(newValue);
  };

  return (
    <Space className={styles.wrapper} size={size}>
      <InputNumber
        value={value.min}
        placeholder="Min"
        onChange={(val) => handleChange({ ...value, min: val })}
        {...minInputProps}
      />

      {showSplit && <Typography.Text>-</Typography.Text>}

      <InputNumber
        value={value.max}
        placeholder="Max"
        onChange={(val) => handleChange({ ...value, max: val })}
        {...maxInputProps}
      />
    </Space>
  );
};

export default MinMaxInput;
