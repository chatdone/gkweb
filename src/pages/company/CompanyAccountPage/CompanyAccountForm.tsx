import { gql } from '@apollo/client';
import {
  Space,
  Grid,
  Typography,
  Button,
  Form,
  Input,
  Avatar,
  Upload,
  Checkbox,
  Skeleton,
} from '@arco-design/web-react';
import { IconCamera } from '@arco-design/web-react/icon';
import { isEmpty } from 'lodash-es';
import { useEffect } from 'react';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

import { PhoneInput, TimezoneSelectInput } from '@/components';

import styles from './CompanyAccountPage.module.less';

import { useResponsiveStore } from '@/stores/useResponsiveStores';

import { CompanyAccountPageQuery } from 'generated/graphql-types';

const { Row, Col } = Grid;

export const companyAccountFormFragments = {
  company: gql`
    fragment CompanyAccountFormCompanyFragment on Company {
      id
      name
      description
      defaultTimezone
      logoUrl
      address
      email
      phone
      website
      registrationCode
    }
  `,
  user: gql`
    fragment CompanyAccountFormUserFragment on User {
      id
      defaultCompany {
        id
      }
    }
  `,
};

export type FormValues = {
  name: string;
  description: string;
  timezone: string;
  defaultCompany: boolean;
  logo: string | File;
  address?: string;
  registrationCode?: string;
  contactNo?: string;
  email?: string;
  websiteUrl?: string;
};

type Props = {
  company: CompanyAccountPageQuery['company'];
  user: CompanyAccountPageQuery['currentUser'];
  loading: boolean;
  canEdit: boolean;
  onSubmit: (values: FormValues) => void;
};

const CompanyAccountForm = (props: Props) => {
  const { company, user, loading, canEdit, onSubmit } = props;

  const { isMobile } = useResponsiveStore();

  const [form] = Form.useForm<FormValues>();

  const handleSubmit = () => {
    form.validate().then(() => {
      const values = form.getFields();

      onSubmit(values as FormValues);
    });
  };

  useEffect(() => {
    if (company && user) {
      form.setFieldsValue({
        name: company.name as string,
        description: company.description as string,
        timezone: company.defaultTimezone as string,
        logo: company.logoUrl as string,
        defaultCompany: company.id === user.defaultCompany?.id,
        address: company.address || undefined,
        email: company.email || undefined,
        contactNo: company.phone || undefined,
        websiteUrl: company.website || undefined,
        registrationCode: company.registrationCode || undefined,
      });
    }
  }, [company, user]);

  return (
    <Form
      form={form}
      labelAlign="left"
      wrapperCol={{ span: isMobile ? 15 : 19 }}
      labelCol={{ span: isMobile ? 9 : 5 }}
    >
      <Row gutter={isMobile ? 0 : 150}>
        <Col span={isMobile ? 24 : 4}>
          <Space className={styles['avatar-wrapper']} direction="vertical">
            <Form.Item noStyle shouldUpdate>
              {(values) =>
                !isEmpty(values) ? (
                  <Avatar
                    style={{
                      backgroundColor: values.logo ? 'unset' : undefined,
                    }}
                    shape="square"
                    size={150}
                    triggerIcon={
                      canEdit ? (
                        <Upload
                          accept="image/png, image/jpeg"
                          showUploadList={false}
                          autoUpload={false}
                          onChange={(fileList, file) => {
                            file.originFile &&
                              form.setFieldValue('logo', file.originFile);
                          }}
                        >
                          <IconCamera />
                        </Upload>
                      ) : undefined
                    }
                    triggerIconStyle={{
                      color: '#D6001C',
                      background: '#FFE5E9',
                      border: '2px solid #FFFFFF',
                    }}
                  >
                    {values.logo ? (
                      <img
                        alt="logo"
                        src={
                          typeof values.logo === 'object'
                            ? URL.createObjectURL(values.logo)
                            : values.logo
                        }
                      />
                    ) : (
                      values.name[0]
                    )}
                  </Avatar>
                ) : (
                  <Skeleton
                    className={styles['profile-image-skeleton']}
                    animation
                    text={false}
                    image={{ size: 'large', shape: 'square' }}
                  />
                )
              }
            </Form.Item>

            <Typography.Paragraph className={styles.descriptions}>
              Upload your company logo to make it easier to identify your
              company
            </Typography.Paragraph>
          </Space>
        </Col>

        <Col span={isMobile ? 24 : 18}>
          <Form.Item
            label="Company Name"
            field="name"
            rules={[{ required: true }]}
          >
            <Input disabled={!canEdit} showWordLimit maxLength={100} />
          </Form.Item>

          <Form.Item label="Description" field="description">
            <Input.TextArea
              placeholder="Short Video Agency"
              disabled={!canEdit}
              showWordLimit
              maxLength={200}
            />
          </Form.Item>

          <Form.Item label="Timezone" field="timezone">
            <TimezoneSelectInput disabled={!canEdit} />
          </Form.Item>

          <Form.Item
            label="Email"
            field="email"
            rules={[
              {
                type: 'email',
              },
            ]}
          >
            <Input placeholder="support@gokudos.ai" />
          </Form.Item>

          <Form.Item
            label="Contact Number"
            field="contactNo"
            rules={[
              {
                validator: (value, callback) => {
                  if (value && !isPossiblePhoneNumber(value)) {
                    return callback('Invalid Phone Number');
                  }

                  callback();
                },
              },
            ]}
          >
            <PhoneInput.Input />
          </Form.Item>

          <Form.Item
            label="Website URL"
            field="websiteUrl"
            rules={[
              {
                type: 'url',
              },
            ]}
          >
            <Input placeholder="https://gokudos.ai" />
          </Form.Item>

          <Form.Item label="Address" field="address">
            <Input.TextArea
              placeholder="Company Address"
              showWordLimit
              maxLength={200}
            />
          </Form.Item>

          <Form.Item label="Registration Code" field="registrationCode">
            <Input placeholder="202005123456" showWordLimit maxLength={12} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: isMobile ? 9 : 5 }}>
            <Space size={20} align="start">
              <Form.Item field="defaultCompany" shouldUpdate>
                {(values) => <Checkbox checked={values.defaultCompany} />}
              </Form.Item>

              <div>
                <div>Set company as default</div>
                <div className={styles['checkbox-subtitle']}>
                  Always login with this company
                </div>
              </div>
            </Space>
          </Form.Item>

          {canEdit && (
            <div className={styles['update-btn-container']}>
              <Button
                className={styles['theme-button']}
                loading={loading}
                onClick={handleSubmit}
              >
                Update
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default CompanyAccountForm;
