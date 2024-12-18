import {
  Button,
  Form,
  Grid,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
} from '@arco-design/web-react';

import { Avatar, FormLabel } from '@/components';

import { QueryCompanyMember } from '../AttendanceListPage';
import styles from './ApprovalModal.module.less';

import type { BaseModalConfig } from '@/types';

import { CompanyMemberReferenceImageStatus } from 'generated/graphql-types';

type Props = BaseModalConfig & {
  loading: boolean;
  companyMember: QueryCompanyMember | undefined;
  onSubmit: (status: CompanyMemberReferenceImageStatus) => void;
};

const ApprovalModal = (props: Props) => {
  const { visible, onCancel, loading, companyMember, onSubmit } = props;

  const handleSubmitStatus = (status: CompanyMemberReferenceImageStatus) => {
    onSubmit(status);
  };

  return (
    <Modal
      title="Approval"
      visible={visible}
      maskClosable={!loading}
      escToExit={!loading}
      onCancel={onCancel}
      footer={null}
    >
      <Form layout="vertical">
        <Form.Item>
          <Grid.Row justify="center">
            <Avatar
              imageClassName={styles['reference-image']}
              size={150}
              shape="square"
              imageSrc={companyMember?.referenceImage?.imageUrl}
            />
          </Grid.Row>
        </Form.Item>

        <Form.Item
          label={<FormLabel label={'Name'} tooltip="Type member name" />}
          field="name"
          rules={[{ required: true }]}
        >
          <Input disabled placeholder="Type name" />
        </Form.Item>

        <Form.Item
          label={
            <FormLabel label="Employee Type" tooltip="Select Employee Type" />
          }
          rules={[{ required: true }]}
        >
          <Select disabled value={companyMember?.employeeType?.name || 'n/a'} />
        </Form.Item>

        <Form.Item label={<FormLabel label={'Position'} tooltip="Position" />}>
          <Input disabled value={companyMember?.position || ''} />
        </Form.Item>

        <Form.Item
          label={<FormLabel label="Hourly Rate" tooltip="Hourly rate" />}
          field="hourlyRate"
        >
          <InputNumber
            disabled
            value={companyMember?.hourlyRate || undefined}
          />
        </Form.Item>
      </Form>

      <Grid.Row justify="end">
        <Space>
          <Button
            loading={loading}
            onClick={() =>
              handleSubmitStatus(CompanyMemberReferenceImageStatus.Rejected)
            }
          >
            Reject
          </Button>

          <Button
            className={styles['theme-button']}
            loading={loading}
            onClick={() =>
              handleSubmitStatus(CompanyMemberReferenceImageStatus.Approved)
            }
          >
            Approve
          </Button>
        </Space>
      </Grid.Row>
    </Modal>
  );
};

export default ApprovalModal;
