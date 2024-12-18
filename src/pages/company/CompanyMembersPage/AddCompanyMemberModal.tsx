import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
} from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel } from '@/components';

import { companyMemberTypeOptions } from '@/constants/company.constants';

import type { BaseModalConfig, SelectOption } from '@/types';

import type { CompanyMemberType } from 'generated/graphql-types';

const FormItem = Form.Item;

type Props = BaseModalConfig & {
  loading: boolean;
  employeeTypeOptions: SelectOption[];
  onSubmit: (values: FormValues) => void;
};

export type FormValues = {
  email: string;
  position: string;
  role: CompanyMemberType;
  employeeTypeId?: string;
  hourlyRate?: number;
};

const AddCompanyMemberModal = (props: Props) => {
  const { visible, onCancel, loading, employeeTypeOptions, onSubmit } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    form.resetFields();
  }, [visible]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title="Add member"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
    >
      <Form layout="vertical" form={form}>
        <FormItem
          label={
            <FormLabel
              label="Email"
              tooltip="Fill in the email address to invite user to the company."
            />
          }
          field="email"
          rules={[{ required: true, type: 'email' }]}
        >
          <Input
            showWordLimit
            maxLength={100}
            placeholder="Type an email to send invitation"
          />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Position"
              tooltip="Fill in the position for the user."
            />
          }
          field="position"
          rules={[{ required: true }]}
        >
          <Input placeholder="Type a position" />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Role"
              tooltip={
                <>
                  Select a role for the user. Different roles will have
                  different access in the company. <br />
                  <br />- Admin has access to all the data in the company.
                  <br />- The manager has access to the data of their own team
                  only.
                  <br />- Member has limited access to the settings.
                  <br />
                  <br />
                  Note: It will also be depending on the permission set.
                </>
              }
            />
          }
          field="role"
          rules={[{ required: true }]}
        >
          <Select options={companyMemberTypeOptions} />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Work Schedules"
              tooltip="It is the work schedule of the member and it can be added in the Settings."
            />
          }
          field="employeeTypeId"
        >
          <Select options={employeeTypeOptions} />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Hourly Rate"
              tooltip="It will be used to calculate the cost of the project task if you are subscribing the Project Management Tool module."
            />
          }
          field="hourlyRate"
        >
          <InputNumber min={0} precision={2} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default AddCompanyMemberModal;
