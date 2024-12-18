import { DatePicker, Form, Radio, Select } from '@arco-design/web-react';
import { escapeRegExp } from 'lodash-es';

import type { SelectOption } from '@/types';

const FormItem = Form.Item;

type Props = {
  projectOptions: SelectOption[];
  projectOwnerOptions: SelectOption[];
  companyMemberOptions: SelectOption[];
  companyTeamOptions: SelectOption[];
  reportType: string;
};

const ProjectForm = (props: Props) => {
  const {
    projectOptions,
    projectOwnerOptions,
    companyMemberOptions,
    companyTeamOptions,
    reportType,
  } = props;

  const getField = (field: string) => `project.${field}`;

  return (
    <>
      <FormItem
        label="Report Type"
        field={getField('reportType')}
        rules={[{ required: true }]}
      >
        <Radio.Group
          options={[
            {
              label: 'Projects',
              value: 'project',
            },
            {
              label: 'Assignee',
              value: 'assignee',
            },
            {
              label: 'Team',
              value: 'team',
            },
          ]}
        />
      </FormItem>

      <FormItem label="Date Range" field={getField('dateRange')}>
        <DatePicker.RangePicker style={{ width: '100%' }} />
      </FormItem>

      {reportType === 'team' && (
        <FormItem
          rules={[{ required: reportType === 'team' }]}
          label="Team"
          field={getField('teamId')}
        >
          <Select
            allowClear
            options={companyTeamOptions}
            filterOption={(inputValue, option) => {
              const regex = new RegExp(escapeRegExp(inputValue), 'i');

              return option.props.children.match(regex);
            }}
          />
        </FormItem>
      )}

      {reportType === 'assignee' && (
        <FormItem
          label="Assignee"
          rules={[{ required: reportType === 'assignee' }]}
          field={getField('assigneeId')}
        >
          <Select
            allowClear
            options={companyMemberOptions}
            filterOption={(inputValue, option) => {
              const regex = new RegExp(escapeRegExp(inputValue), 'i');

              return option.props.children.match(regex);
            }}
          />
        </FormItem>
      )}

      {reportType === 'project' && (
        <FormItem label="Project" field={getField('projectIds')}>
          <Select
            mode="multiple"
            options={projectOptions}
            allowClear
            filterOption={(inputValue, option) => {
              const regex = new RegExp(escapeRegExp(inputValue), 'i');

              return option.props.children.match(regex);
            }}
          />
        </FormItem>
      )}

      <FormItem label="Project Owners" field={getField('projectOwnerIds')}>
        <Select mode="multiple" allowClear options={projectOwnerOptions} />
      </FormItem>
    </>
  );

  // return (
  //   <>
  //     <FormItem
  //       label="Type"
  //       field={getField('dateType')}
  //       rules={[{ required: true }]}
  //     >
  //       <Radio.Group
  //         options={[
  //           {
  //             label: 'Actual',
  //             value: 'actual',
  //           },
  //           {
  //             label: 'Targeted',
  //             value: 'targeted',
  //           },
  //         ]}
  //       />
  //     </FormItem>

  //     <FormItem
  //       label="Grouped By"
  //       field={getField('groupedBy')}
  //       rules={[{ required: true }]}
  //     >
  //       <Radio.Group
  //         options={[
  //           {
  //             label: 'Projects',
  //             value: 'projects',
  //           },
  //           {
  //             label: 'Tasks',
  //             value: 'tasks',
  //           },
  //         ]}
  //       />
  //     </FormItem>

  //     <FormItem
  //       label="Date Range"
  //       field={getField('dateRange')}
  //       rules={[{ required: true }]}
  //     >
  //       <DatePicker.RangePicker style={{ width: '100%' }} />
  //     </FormItem>

  //     <FormItem label="Project" field={getField('projectIds')}>
  //       <Select
  //         mode="multiple"
  //         options={projectOptions}
  //         allowClear
  //         filterOption={(inputValue, option) => {
  //           const regex = new RegExp(escapeRegExp(inputValue), 'i');

  //           return option.props.children.match(regex);
  //         }}
  //       />
  //     </FormItem>

  //     <FormItem label="Project Owners" field={getField('ownerIds')}>
  //       <Select mode="multiple" allowClear options={projectOwnerOptions} />
  //     </FormItem>

  //     <FormItem label="Assignee" field={getField('assigneeIds')}>
  //       <Select
  //         mode="multiple"
  //         allowClear
  //         options={companyMemberOptions}
  //         filterOption={(inputValue, option) => {
  //           const regex = new RegExp(escapeRegExp(inputValue), 'i');

  //           return option.props.children.match(regex);
  //         }}
  //       />
  //     </FormItem>
  //   </>
  // );
};

export default ProjectForm;
