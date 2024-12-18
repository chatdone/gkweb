import {
  Button,
  Card,
  DatePicker,
  Dropdown,
  DropdownProps,
  Form,
  Input,
  Select,
  Space,
  Checkbox,
  SelectProps,
  TreeSelect,
  InputNumber,
  Radio,
  RadioGroupProps,
} from '@arco-design/web-react';
import type { DeepPartial } from '@arco-design/web-react/es/Form/store';
import type { TreeSelectDataType } from '@arco-design/web-react/es/TreeSelect/interface';
import { get } from 'lodash-es';
import { ReactNode, useState } from 'react';
import { MdFilterList } from 'react-icons/md';

import CompanyTagInput from '../CompanyTagInput';
import FormLabel from '../FormLabel';
import MinMaxInput from '../MinMaxInput';
import styles from './FilterDropdown.module.less';

import { ArrayElement, SelectOption } from '@/types';

import { TagGroup } from 'generated/graphql-types';

const FormItem = Form.Item;

export type FilterField<T> = {
  label: string;
  field: keyof T;
  shouldRender?: (value: T) => boolean;
} & (
  | {
      type: 'input' | 'date' | 'dateRange' | 'checkbox';
    }
  | {
      type: 'select';
      options: SelectOption[] | ((value: T) => SelectOption[]);
      mode?: SelectProps['mode'];
      resetFields?: (keyof T)[];
      placeholder?: string;
    }
  | {
      type: 'tags';
      tagGroups: (TagGroup | null | undefined)[] | null | undefined;
    }
  | {
      type: 'tree-select';
      treeData: TreeSelectDataType[];
    }
  | {
      type: 'number';
      min?: number;
      precision?: number;
      placeholder?: string;
    }
  | {
      type: 'minMax';
      precision?: number;
    }
  | {
      type: 'radio-group';
      options: RadioGroupProps['options'];
      className?: string;
      render?: (option: ArrayElement<RadioGroupProps['options']>) => ReactNode;
    }
);

type Props<T> = {
  fields: FilterField<T>[];
  value: T;
  onUpdate: (value: T) => void;
  resetValue?: DeepPartial<T>;
  cardClassName?: string;
  position?: DropdownProps['position'];
};

const FilterDropdown = <T,>(props: Props<T>) => {
  const {
    fields,
    value,
    onUpdate,
    resetValue,
    cardClassName,
    position = 'br',
  } = props;

  const [popupVisible, setPopupVisible] = useState<boolean>(false);

  const handleUpdateFilter = (values: T) => {
    onUpdate(values);

    setPopupVisible(false);
  };

  return (
    <Dropdown
      droplist={
        <FilterForm
          cardClassName={cardClassName}
          fields={fields}
          values={value}
          onFilter={handleUpdateFilter}
          resetValue={resetValue}
        />
      }
      position={position}
      trigger="click"
      popupVisible={popupVisible}
      onVisibleChange={(visible) => {
        setPopupVisible(visible);
      }}
    >
      <Button icon={<MdFilterList />}>Filters</Button>
    </Dropdown>
  );
};

const FilterForm = <T,>({
  fields,
  values,
  onFilter,
  resetValue,
  cardClassName,
}: {
  fields: FilterField<T>[];
  values: T;
  onFilter: (values: T) => void;
  resetValue?: DeepPartial<T>;
  cardClassName?: string;
}) => {
  const [form] = Form.useForm<T>();

  const handleResetForm = () => {
    if (resetValue) {
      form.setFieldsValue(resetValue);
      onFilter(resetValue as T);
    } else {
      form.clearFields();
      onFilter({} as T);
    }
  };

  const handleSubmit = (values: T) => {
    onFilter(values);
  };

  const getFieldComponent = (field: FilterField<T>, value: T) => {
    switch (field.type) {
      case 'input':
        return <Input />;

      case 'checkbox':
        return <Checkbox checked={get(value, field.field)} />;

      case 'date':
        return <DatePicker allowClear />;

      case 'dateRange':
        return <DatePicker.RangePicker allowClear />;

      case 'select':
        return (
          <Select
            allowClear
            placeholder={field.placeholder}
            mode={field.mode}
            options={
              Array.isArray(field.options)
                ? field.options
                : field.options(value)
            }
            onChange={() => {
              field.resetFields && form.resetFields(field.resetFields);
            }}
          />
        );

      case 'tree-select':
        return <TreeSelect treeData={field.treeData} />;

      case 'tags':
        return <CompanyTagInput tagGroups={field.tagGroups} mode="select" />;

      case 'minMax':
        return (
          <MinMaxInput
            minInputProps={{ precision: field.precision }}
            maxInputProps={{ precision: field.precision }}
          />
        );

      case 'number':
        return (
          <InputNumber
            min={field.min}
            precision={field.precision}
            placeholder={field.placeholder}
          />
        );

      case 'radio-group':
        return field.render ? (
          <Radio.Group>
            {field.options?.map((option) => (
              <Radio
                key={typeof option === 'object' ? option.value : option}
                value={typeof option === 'object' ? option.value : option}
              >
                {() => field.render?.(option)}
              </Radio>
            ))}
          </Radio.Group>
        ) : (
          <Radio.Group options={field.options} />
        );
    }
  };

  return (
    <Card className={`${styles.wrapper} ${cardClassName}`}>
      <Form
        form={form}
        initialValues={values}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        labelAlign="left"
        onSubmit={handleSubmit}
      >
        <FormItem shouldUpdate noStyle>
          {(value) =>
            fields.map((field) => {
              const { shouldRender = () => true } = field;

              return (
                shouldRender(value) && (
                  <FormItem
                    key={field.field.toString()}
                    field={field.field}
                    label={<FormLabel label={field.label} />}
                  >
                    {getFieldComponent(field, value)}
                  </FormItem>
                )
              );
            })
          }
        </FormItem>

        <FormItem wrapperCol={{ span: 24 }}>
          <Space className={styles['button-space']}>
            <Button onClick={handleResetForm}>Reset</Button>

            <Button className={styles['theme-button']} htmlType="submit">
              Apply Filters
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>
  );
};

export default FilterDropdown;
