import { DatePicker, Form, Select, TreeSelect } from '@arco-design/web-react';
import type { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import { escapeRegExp } from 'lodash-es';

import type { SelectOption } from '@/types';

const FormItem = Form.Item;

type Props = {
  attendanceLabelOptions: SelectOption[];
  companyMemberOptions: SelectOption[];
  tagGroupTreeData: TreeDataType[];
  employeeTypeOptions: SelectOption[];
  contactOptions: SelectOption[];
};

const AttendanceForm = (props: Props) => {
  const {
    attendanceLabelOptions,
    companyMemberOptions,
    tagGroupTreeData,
    employeeTypeOptions,
    contactOptions,
  } = props;

  const getField = (field: string) => `attendance.${field}`;

  return (
    <>
      <FormItem
        label="Date Range"
        field={getField('dateRange')}
        rules={[{ required: true }]}
      >
        <DatePicker.RangePicker style={{ width: '100%' }} />
      </FormItem>

      <FormItem label="Member" field={getField('memberIds')}>
        <Select
          mode="multiple"
          allowClear
          options={companyMemberOptions}
          filterOption={(inputValue, option) => {
            const regex = new RegExp(escapeRegExp(inputValue), 'i');

            return option.props.children.match(regex);
          }}
        />
      </FormItem>

      <FormItem label="Activity" field={getField('activityLabelIds')}>
        <Select
          mode="multiple"
          allowClear
          options={attendanceLabelOptions}
          filterOption={(inputValue, option) => {
            const regex = new RegExp(escapeRegExp(inputValue), 'i');

            return option.props.children.match(regex);
          }}
        />
      </FormItem>

      <FormItem label="Employee Type" field={getField('employeeTypeId')}>
        <Select
          allowClear
          options={employeeTypeOptions}
          filterOption={(inputValue, option) => {
            const regex = new RegExp(escapeRegExp(inputValue), 'i');

            return option.props.children.match(regex);
          }}
        />
      </FormItem>

      <FormItem label="Contact" field={getField('contactIds')}>
        <Select
          allowClear
          mode="multiple"
          options={contactOptions}
          filterOption={(inputValue, option) => {
            const regex = new RegExp(escapeRegExp(inputValue), 'i');

            return option.props.children.match(regex);
          }}
        />
      </FormItem>

      <FormItem label="Tags" field={getField('tagIds')}>
        <TreeSelect
          multiple
          treeData={tagGroupTreeData}
          filterTreeNode={(inputText, node) => {
            return (
              node.props.title.toLowerCase().indexOf(inputText.toLowerCase()) >
              -1
            );
          }}
        />
      </FormItem>
    </>
  );
};

export default AttendanceForm;
