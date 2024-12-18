import { gql } from '@apollo/client';
import {
  Button,
  Drawer,
  Form,
  Grid,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
  Upload,
  Switch,
} from '@arco-design/web-react';
import bytes from 'bytes';
import { useEffect } from 'react';
import { MdCancel, MdVerified } from 'react-icons/md';

import { Avatar } from '@/components';
import Message from '@/components/Message';

import styles from './EditCompanyMemberDrawer.module.less';

import { companyMemberTypeOptions } from '@/constants/company.constants';

import type { BaseModalConfig, ArrayElement, SelectOption } from '@/types';

import {
  CompanyMemberType,
  CompanyMemberReferenceImageStatus,
  CompanyMembersPageQuery,
} from 'generated/graphql-types';

const { Row, Col } = Grid;

type CompanyMemberQuery = ArrayElement<
  NonNullable<CompanyMembersPageQuery['company']>['members']
>;

export type FormValues = {
  position: string;
  role: CompanyMemberType;
  hourlyRate: number;
  employeeTypeId: string;
  active: boolean;
};

type Props = BaseModalConfig & {
  loading: boolean;
  uploadingReferenceImage: boolean;
  isAdmin: boolean;
  isManager: boolean;
  companyMember: CompanyMemberQuery | undefined;
  employeeTypeOptions: SelectOption[];
  onSubmit: (values: FormValues) => void;
  onUploadReferenceImage: (file: File) => void;
};

export const editCompanyMemberDrawerFragment = gql`
  fragment EditCompanyMemberDrawerFragment on CompanyMember {
    id
    active
    employeeType {
      id
      name
    }
  }
`;

const EditCompanyMemberDrawer = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    uploadingReferenceImage,
    isAdmin,
    isManager,
    companyMember,
    employeeTypeOptions,
    onSubmit,
    onUploadReferenceImage,
  } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (companyMember) {
      form.setFieldsValue({
        position: companyMember.position as string,
        hourlyRate: companyMember.hourlyRate as number,
        role: companyMember.type as CompanyMemberType,
        employeeTypeId: companyMember.employeeType?.id,
        active: companyMember.active as boolean,
      });
    }
  }, [companyMember]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      onSubmit(values);
    });
  };

  const handleUploadReferenceImage = (file: File) => {
    const limit = bytes('1MB');

    if (file.size > limit) {
      Message.info('Max file size limit is 1MB', {
        title: 'Exceed file size limit',
      });

      return;
    }

    onUploadReferenceImage(file);
  };

  return (
    <Drawer
      className={styles.drawer}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      cancelText="Close"
      width={640}
      title="View Profile"
      maskClosable={!loading}
      escToExit={!loading}
      closable={!loading}
      confirmLoading={loading}
      okButtonProps={{
        style: {
          background: '#d6001c',
        },
      }}
      cancelButtonProps={{
        disabled: loading,
      }}
    >
      <div className={styles['avatar-container']}>
        <Avatar
          size={150}
          shape="square"
          imageSrc={companyMember?.referenceImage?.imageUrl}
          imageClassName={styles['reference-image']}
        />

        <Space direction="vertical" size={20}>
          <div>
            <Space>
              <Typography.Text className={styles.title}>
                Profile Picture
              </Typography.Text>

              {companyMember?.referenceImage?.status ===
                CompanyMemberReferenceImageStatus.Approved && (
                <MdVerified className={styles['verified-icon']} />
              )}

              {companyMember?.referenceImage?.status ===
                CompanyMemberReferenceImageStatus.Rejected && (
                <MdCancel className={styles['rejected-icon']} />
              )}
            </Space>

            <Typography.Paragraph>
              Maximum upload size: 1MB
            </Typography.Paragraph>
          </div>

          <Space>
            <Upload
              showUploadList={false}
              autoUpload={false}
              accept="image/png, image/jpeg"
              disabled={loading}
              onChange={(_, file) => {
                file.originFile && handleUploadReferenceImage(file.originFile);
              }}
            >
              <Button
                className={styles['theme-button']}
                loading={uploadingReferenceImage}
              >
                Upload
              </Button>
            </Upload>
          </Space>
        </Space>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item label="Name">
          <Input value={companyMember?.user?.name as string} disabled />
        </Form.Item>

        <Form.Item label="Email">
          <Input value={companyMember?.user?.email as string} disabled />
        </Form.Item>

        <Form.Item label="Contact Number">
          <Input value={companyMember?.user?.contactNo as string} disabled />
        </Form.Item>

        <Row gutter={15}>
          <Col span={12}>
            <Form.Item label="Position" field="position">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Role" field="role">
              <Select
                options={
                  isManager
                    ? companyMemberTypeOptions.filter(
                        (option) => option.value !== CompanyMemberType.Admin,
                      )
                    : companyMemberTypeOptions
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={15}>
          {isAdmin && (
            <Col span={12}>
              <Form.Item label="Hourly Rate" field="hourlyRate">
                <InputNumber
                  min={0}
                  precision={2}
                  placeholder="Please fill in hourly rate"
                />
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
            <Form.Item label="Employee Type" field="employeeTypeId">
              <Select options={employeeTypeOptions} />
            </Form.Item>
          </Col>
        </Row>

        {/* <Form.Item label="Date of hire (only admin & manager can see)">
          <DatePicker style={datePickerStyle} />
        </Form.Item>

        <Form.Item label="Birth Date">
          <DatePicker style={datePickerStyle} />
        </Form.Item>

        <Form.Item label="Note (only admin & manager can see)">
          <Input.TextArea />
        </Form.Item> */}

        <div className={styles['space-between']}>
          <Typography.Text className={styles.title}>
            Active member
          </Typography.Text>

          <Form.Item noStyle shouldUpdate>
            {(values) => (
              <Form.Item noStyle field="active">
                <Switch checked={values.active} />
              </Form.Item>
            )}
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

// const datePickerStyle: CSSProperties = {
//   width: '100%',
// };

export default EditCompanyMemberDrawer;
