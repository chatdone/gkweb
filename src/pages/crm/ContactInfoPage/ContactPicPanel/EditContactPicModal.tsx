import {
  Modal,
  Form,
  Input,
  Grid,
  Space,
  Button,
} from '@arco-design/web-react';
import { useEffect } from 'react';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

import { FormLabel, PhoneInput } from '@/components';

import styles from './ContactPicPanel.module.less';

import type { BaseModalConfig, ArrayElement } from '@/types';

import type { ContactInfoPageQuery } from 'generated/graphql-types';

type QueryContactPic = ArrayElement<
  NonNullable<ContactInfoPageQuery['contact']>['pics']
>;

const FormItem = Form.Item;

type Props = BaseModalConfig & {
  loading: boolean;
  contactPic: QueryContactPic | null | undefined;
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
  onDelete: () => void;
};

export type FormValues = {
  name: string;
  email: string;
  remarks: string;
  contactNo: string;
};

export const EditContactPicModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    contactPic,
    onCreate,
    onUpdate,
    onDelete,
  } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      if (contactPic) {
        form.setFieldsValue({
          name: contactPic.name as string,
          email: contactPic.user?.email as string,
          contactNo: contactPic.contactNo as string,
          remarks: contactPic.remarks as string,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, contactPic]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      if (contactPic) {
        onUpdate(values);
      } else {
        onCreate(values);
      }
    });
  };

  return (
    <Modal
      title={`${contactPic ? 'Edit' : 'Create'} Contact Person`}
      visible={visible}
      onCancel={onCancel}
      confirmLoading={loading}
      maskClosable={!loading}
      footer={null}
    >
      <Form layout="vertical" form={form}>
        <FormItem
          label={<FormLabel label="Name" tooltip="Enter your name" />}
          field="name"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Contact Person name here"
            showWordLimit
            maxLength={100}
          />
        </FormItem>

        <FormItem
          label={<FormLabel label="Email" tooltip="Enter email" />}
          field="email"
          rules={[
            {
              required: true,
              type: 'email',
            },
          ]}
        >
          <Input placeholder="johndoe@gokudos.ai" />
        </FormItem>

        <FormItem
          label={
            <FormLabel label="Contact Number" tooltip="Enter contact number" />
          }
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
        </FormItem>

        <FormItem
          label={<FormLabel label="Note" tooltip="Enter notes" />}
          field="remarks"
        >
          <Input placeholder="Description here" />
        </FormItem>
      </Form>

      <Grid.Row
        style={{ flexDirection: 'row-reverse' }}
        justify="space-between"
      >
        <Space>
          <Button disabled={loading} onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className={styles['theme-button']}
            loading={loading}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Space>

        {contactPic && (
          <Button
            className={styles['theme-btn-text']}
            type="text"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
      </Grid.Row>
    </Modal>
  );
};
