import { Select } from '@arco-design/web-react';
import type { SelectHandle } from '@arco-design/web-react/es/Select/interface';
import { forwardRef, useEffect, useState } from 'react';
import PhoneInput, {
  Country,
  getCountryCallingCode,
} from 'react-phone-number-input';

import styles from './PhoneInput.module.less';
import PhoneInputWithoutCountry from './PhoneInputWithoutCountry';

type Props = { value?: string; onChange?: (value: string) => void };

const MyPhoneInput = (props: Props) => {
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
    <PhoneInput
      className={styles['phone-input']}
      defaultCountry="MY"
      onChange={handleChange}
      value={value}
      addInternationalOption={false}
      international={false}
      inputComponent={CustomPhoneInput}
      countrySelectComponent={CountrySelect}
      countryOptionsOrder={['MY', '...']}
    />
  );
};

const CustomPhoneInput = forwardRef<
  HTMLInputElement,
  { value: string; onChange: (e: unknown) => void }
>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className="arco-input arco-input-size-default"
    />
  );
});

const CountrySelect = forwardRef<
  SelectHandle,
  {
    value: Country;
    options: Array<{ label: string; value: Country }>;
    onChange: (country: Country) => void;
  }
>((props, ref) => {
  const { value, options, onChange, ...rest } = props;

  return (
    <Select
      ref={ref}
      {...rest}
      value={value}
      showSearch
      onChange={(value) => {
        onChange(value);
      }}
      filterOption={(inputValue, option) => {
        return option.props.children.indexOf(inputValue) >= 0;
      }}
      options={options.map((option) => ({
        label: `+${getCountryCallingCode(option.value)}`,
        value: option.value,
      }))}
    />
  );
});

MyPhoneInput.Input = PhoneInputWithoutCountry;

export default MyPhoneInput;
