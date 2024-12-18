import {
  Modal,
  Form,
  Input,
  Space,
  Typography,
  Button,
  Upload,
} from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel, TimezoneSelectInput, Avatar } from '@/components';

import styles from './AddCompanyModal.module.less';

import type { BaseModalConfig } from '@/types';

const FormItem = Form.Item;

export type FormValues = {
  name: string;
  logo?: File;
  description?: string;
  timezone?: string;
};

type Props = BaseModalConfig & {
  loading: boolean;
  onSubmit: (values: FormValues) => void;
};

const AddCompanyModal = (props: Props) => {
  const { visible, onCancel, loading, onSubmit } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  const handleSubmit = () => {
    form.validate().then((value) => {
      onSubmit(value);
    });
  };

  return (
    <Modal
      title="Create Company"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
    >
      <Form
        className={styles.form}
        form={form}
        layout="vertical"
        initialValues={{
          description: '',
        }}
      >
        <Form.Item shouldUpdate>
          {(values) => (
            <Space size={40} align="start">
              <Avatar
                size={150}
                imageSrc={
                  values.logo ? URL.createObjectURL(values.logo) : undefined
                }
              />

              <Space direction="vertical" size={20}>
                <div>
                  <Typography.Paragraph className={styles.title}>
                    Company logo
                  </Typography.Paragraph>

                  <Typography.Paragraph>
                    Maximum upload size: 8MB
                  </Typography.Paragraph>
                </div>

                <Upload
                  accept="image/png, image/jpeg"
                  showUploadList={false}
                  autoUpload={false}
                  disabled={loading}
                  onChange={(fileList, file) => {
                    file.originFile &&
                      form.setFieldValue('logo', file.originFile);
                  }}
                >
                  <Button className={styles['theme-button']}>Browse</Button>
                </Upload>
              </Space>
            </Space>
          )}
        </Form.Item>

        <FormItem
          field="name"
          label={<FormLabel label="Company Name" tooltip="Company Name" />}
          rules={[{ required: true }]}
        >
          <Input placeholder="Tell us your company name" />
        </FormItem>

        <FormItem
          field="description"
          label={<FormLabel label="Description" tooltip="Description" />}
        >
          <Input placeholder="Write something about the company" />
        </FormItem>

        <FormItem
          field="timezone"
          label={<FormLabel label="Timezone" tooltip="Timezone" />}
        >
          <TimezoneSelectInput />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default AddCompanyModal;
