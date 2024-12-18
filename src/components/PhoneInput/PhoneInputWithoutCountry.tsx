import { useEffect, useState } from 'react';
import Input from 'react-phone-number-input/input';

type Props = { value?: string; onChange?: (value: string) => void };

const PhoneInputWithoutCountry = (props: Props) => {
  const [stateValue, setValue] = useState(props.value);
  const value = props.value || stateValue || '';

  useEffect(() => {
    if (props.value !== stateValue && props.value === undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  const handleChange = (newValue: string) => {
    if (!('value' in props)) {
      setValue(newValue);
    }

    props.onChange?.(newValue);
  };

  return (
    <Input
      className="arco-input arco-input-size-default"
      value={value}
      onChange={handleChange}
    />
  );
};

export default PhoneInputWithoutCountry;
