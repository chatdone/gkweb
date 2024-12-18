import {
  Modal,
  Form,
  Input,
  Grid,
  Button,
  Space,
} from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel } from '@/components';

import styles from './ContactListPage.module.less';

import type { BaseModalConfig, ArrayElement } from '@/types';

import type { ContactListPageQuery } from 'generated/graphql-types';

type QueryContactGroup = ArrayElement<
  NonNullable<ContactListPageQuery['contactGroups']>
>;

const FormItem = Form.Item;

type Props = BaseModalConfig & {
  loading: boolean;
  contactGroup: QueryContactGroup | undefined;
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
  onDelete: () => void;
};

export type FormValues = {
  name: string;
};

export const EditContactGroupModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    contactGroup,
    onCreate,
    onUpdate,
    onDelete,
  } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      if (contactGroup) {
        form.setFieldsValue({
          name: contactGroup.name as string,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, contactGroup]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      if (contactGroup) {
        onUpdate(values);
      } else {
        onCreate(values);
      }
    });
  };

  return (
    <Modal
      title={`${contactGroup ? 'Edit' : 'Create'} Group`}
      visible={visible}
      onCancel={onCancel}
      maskClosable={!loading}
      footer={
        <Grid.Row
          style={{ flexDirection: 'row-reverse' }}
          justify="space-between"
        >
          <Space>
            <Button onClick={onCancel} disabled={loading}>
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

          {contactGroup && (
            <Button
              className={styles['edit-group-button']}
              type="text"
              onClick={onDelete}
            >
              Delete Group
            </Button>
          )}
        </Grid.Row>
      }
    >
      <Form layout="vertical" form={form}>
        <FormItem
          label={
            <FormLabel
              label="Group name"
              tooltip="Fill in your contact group name to categorize your contacts."
            />
          }
          field="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Customer A" maxLength={100} showWordLimit />
        </FormItem>
      </Form>
    </Modal>
  );
};
