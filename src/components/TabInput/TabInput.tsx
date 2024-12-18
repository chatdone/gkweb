import { Tabs } from '@arco-design/web-react';
import { useState, useEffect } from 'react';

import styles from './TabInput.module.less';

type Props = {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
};

const TabInput = (props: Props) => {
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

    props.onChange && props.onChange(newValue);
  };

  return (
    <Tabs className={styles.tabs} activeTab={value} onChange={handleChange}>
      {props.options.map((option) => (
        <Tabs.TabPane key={option.value} title={option.label} />
      ))}
    </Tabs>
  );
};

export default TabInput;
