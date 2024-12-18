import { useEffect, useState } from 'react';
import {
  CirclePicker,
  CirclePickerProps,
  ColorChangeHandler,
} from 'react-color';

type Props = {
  value?: string | null;
  onChange?: (value: string) => void;
  pickerProps?: Omit<CirclePickerProps, 'onSwatchHover' | 'color' | 'width'>;
};

const CircleColorInput = (props: Props) => {
  const [stateValue, setValue] = useState(props.value);
  const value = props.value || stateValue || '';

  useEffect(() => {
    if (props.value !== stateValue && props.value === undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  const handleChange: ColorChangeHandler = (color) => {
    if (!('value' in props)) {
      setValue(color.hex);
    }

    props.onChange?.(color.hex);
  };

  return (
    <CirclePicker
      width="unset"
      color={value}
      onChangeComplete={handleChange}
      {...props.pickerProps}
    />
  );
};

export default CircleColorInput;
