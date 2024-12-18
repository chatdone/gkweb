import { Select, SelectProps } from '@arco-design/web-react';
import { getTimeZones } from '@vvo/tzdb';
import { escapeRegExp } from 'lodash-es';
import { useMemo } from 'react';

const TimezoneSelectInput = (
  props: Omit<SelectProps, 'options' | 'showSearch' | 'filterOption'>,
) => {
  const timezoneOptions = useMemo<SelectProps['options']>(() => {
    const timezones = getTimeZones();

    const malaysiaTimezone = timezones.find(
      (value) => value.countryCode === 'MY',
    );
    const timezonesWithoutMalaysia = timezones.filter(
      (value) => value.countryCode !== 'MY',
    );

    const options = timezonesWithoutMalaysia.map((timezone) => ({
      label: timezone.rawFormat,
      value: timezone.name,
    }));

    malaysiaTimezone &&
      options.unshift({
        label: malaysiaTimezone.rawFormat,
        value: malaysiaTimezone.name,
      });

    return options;
  }, []);

  return (
    <Select
      showSearch
      options={timezoneOptions}
      filterOption={(inputValue, option) => {
        return option.props.children.match(
          new RegExp(escapeRegExp(inputValue), 'i'),
        );
      }}
      {...props}
    />
  );
};

export default TimezoneSelectInput;
