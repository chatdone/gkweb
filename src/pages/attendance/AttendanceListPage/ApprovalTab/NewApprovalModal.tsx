import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from '@arco-design/web-react';
import { Upload } from '@arco-design/web-react';
import { UploadItem } from '@arco-design/web-react/es/Upload';
import { useEffect } from 'react';

import { FormLabel } from '@/components';

import { QueryCompanyMember } from '../AttendanceListPage';

import type { BaseModalConfig, SelectOption } from '@/types';

export type FormValues = {
  memberId: string;
  uploadItems: UploadItem[];
};

type Props = BaseModalConfig & {
  loading: boolean;
  companyMembers: QueryCompanyMember[];
  companyMemberOptions: SelectOption[];
  onSubmit: (values: FormValues) => void;
};

const NewApprovalModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    companyMembers,
    companyMemberOptions,
    onSubmit,
  } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      onSubmit(values);
    });
  };

  const getSelectedCompanyMember = (memberId: string) => {
    return companyMembers.find((member) => member?.id === memberId);
  };

  return (
    <Modal
      title="New Approval"
      visible={visible}
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
      okText="Submit"
      onConfirm={handleSubmit}
      onCancel={onCancel}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label={
            <FormLabel
              label="Member"
              tooltip="Select a whitelisted member for the time attendance module."
            />
          }
          field="memberId"
          rules={[{ required: true }]}
        >
          <Select options={companyMemberOptions} />
        </Form.Item>

        <Form.Item
          label={
            <FormLabel
              label="Upload Reference Photo"
              tooltip="Upload a profile photo on behalf of the whitelisted member for the time attendance module."
            />
          }
          field="uploadItems"
          rules={[{ required: true }]}
          shouldUpdate
        >
          {(values) => (
            <Upload
              accept=".jpg, .png, .jpeg"
              autoUpload={false}
              limit={1}
              listType="picture-card"
              fileList={values.uploadItems}
            />
          )}
        </Form.Item>

        <Form.Item
          label={
            <FormLabel
              label="Employee Type"
              tooltip="It is the work schedule of the member and it can be added in the Settings."
            />
          }
          shouldUpdate
        >
          {(values) => (
            <Input
              disabled
              value={
                getSelectedCompanyMember(values.memberId)?.employeeType?.name ||
                ''
              }
            />
          )}
        </Form.Item>

        <Form.Item label={<FormLabel label="Position" />} shouldUpdate>
          {(values) => (
            <Input
              disabled
              value={getSelectedCompanyMember(values.memberId)?.position || ''}
            />
          )}
        </Form.Item>

        <Form.Item
          label={
            <FormLabel
              label="Hourly Rate"
              tooltip="It will be used to calculate the cost of the project task if you are subscribed to the Project Management Tool module."
            />
          }
          shouldUpdate
        >
          {(values) => (
            <InputNumber
              disabled
              value={
                getSelectedCompanyMember(values.memberId)?.hourlyRate ||
                undefined
              }
              precision={2}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewApprovalModal;
