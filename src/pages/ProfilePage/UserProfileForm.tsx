import { gql } from '@apollo/client';
import {
  Space,
  Grid,
  Typography,
  Button,
  Form,
  Input,
  Upload,
  Skeleton,
} from '@arco-design/web-react';
import { IconCamera } from '@arco-design/web-react/icon';
import { isEmpty } from 'lodash-es';
import { useEffect } from 'react';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

import { TimezoneSelectInput, Avatar, PhoneInput } from '@/components';

import styles from './ProfilePage.module.less';

import { useResponsiveStore } from '@/stores/useResponsiveStores';

import { ProfilePageQuery } from 'generated/graphql-types';

const { Row, Col } = Grid;

export const userProfileFormFragment = gql`
  fragment UserProfileFormFragment on User {
    id
    name
    email
    contactNo
    profileImage
    profileImages {
      original
    }
    defaultTimezone
  }
`;

type Props = {
  user: ProfilePageQuery['currentUser'];
  onSubmit: (values: FormValues) => void;
  loading: boolean;
};

export type FormValues = {
  name: string;
  email: string;
  contactNo: string;
  profileImage: string | File;
  timezone: string;
};

const UserProfileForm = (props: Props) => {
  const { user, onSubmit, loading } = props;

  const { isMobile } = useResponsiveStore();

  const [form] = Form.useForm<FormValues>();

  const handleSubmit = () => {
    form.validate().then(() => {
      const values = form.getFields();

      onSubmit(values as FormValues);
    });
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name as string,
        email: user.email as string,
        contactNo: user.contactNo as string,
        profileImage: user.profileImage as string,
        timezone: user.defaultTimezone as string,
      });
    }
  }, [user]);

  return (
    <Form
      form={form}
      labelAlign="left"
      wrapperCol={{ span: isMobile ? 16 : 19 }}
      labelCol={{ span: isMobile ? 8 : 5 }}
    >
      <Row gutter={150}>
        <Col span={isMobile ? 24 : 4}>
          <Space className={styles['avatar-wrapper']} direction="vertical">
            <Form.Item noStyle shouldUpdate>
              {(values) =>
                !isEmpty(values) ? (
                  <Avatar
                    shape="square"
                    size={150}
                    triggerIcon={
                      <Upload
                        accept="image/png, image/jpeg"
                        showUploadList={false}
                        autoUpload={false}
                        onChange={(fileList, file) => {
                          file.originFile &&
                            form.setFieldValue('profileImage', file.originFile);
                        }}
                      >
                        <IconCamera />
                      </Upload>
                    }
                    triggerIconStyle={{
                      color: '#D6001C',
                      background: '#FFE5E9',
                      border: '2px solid #FFFFFF',
                    }}
                    imageSrc={
                      values.profileImage
                        ? typeof values.profileImage === 'object'
                          ? URL.createObjectURL(values.profileImage)
                          : values.profileImage
                        : undefined
                    }
                    name={values.name}
                  />
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
              A profile photo helps your teammates recognize you in GoKudos
            </Typography.Paragraph>
          </Space>
        </Col>

        <Col span={isMobile ? 24 : 18}>
          <Form.Item
            label="Full Name"
            field="name"
            rules={[{ required: true }]}
          >
            <Input showWordLimit maxLength={100} />
          </Form.Item>

          <Form.Item label="Email" field="email">
            <Input disabled />
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
            <PhoneInput />
          </Form.Item>

          <Form.Item label="Timezone" field="timezone">
            <TimezoneSelectInput />
          </Form.Item>

          <div className={styles['update-btn-container']}>
            <Button
              className={styles['theme-button']}
              loading={loading}
              onClick={handleSubmit}
              disabled={!user}
            >
              Update
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default UserProfileForm;
