import { Modal, Form, Input, Select, DatePicker } from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel, UserSelectInput, TabInput } from '@/components';

import styles from './EditContactCallLogModal.module.less';

import type { BaseModalConfig } from '@/types';

const FormItem = Form.Item;

export type FormValues = {
  type: 'call' | 'meeting';
  picIds: string[];
  assigneeIds: string[];
  outcome: string;
  description: string;
  reminder: string;
  date: Date;
};

type Props = BaseModalConfig & {
  loading: boolean;
  callLog: unknown | null | undefined;
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
};

export const EditContactCallLogModal = (props: Props) => {
  const { visible, onCancel, loading, callLog, onCreate, onUpdate } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    form.resetFields();
  }, [visible]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      console.log(values);
      // if (callLog) {
      //   onUpdate(values);
      // } else {
      //   onCreate(values);
      // }
    });
  };

  const initialValues: FormValues = {
    type: 'call',
    picIds: [],
    assigneeIds: [],
    outcome: '',
    description: '',
    reminder: '',
    date: new Date(),
  };

  return (
    <Modal
      className={styles.modal}
      title={`${callLog ? 'Edit' : 'Add'} Call/ Meeting`}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Form
        className={styles.form}
        layout="vertical"
        form={form}
        initialValues={initialValues}
      >
        <FormItem field="type">
          <TabInput
            options={[
              {
                label: 'Call',
                value: 'call',
              },
              {
                label: 'Meeting',
                value: 'meeting',
              },
            ]}
          />
        </FormItem>

        <FormItem
          label={<FormLabel label="PIC" />}
          field="picIds"
          rules={[{ required: true }]}
        >
          <UserSelectInput
            options={[
              {
                label: 'Thomas Lee',
                value: 'b4c95fda-00cd-48f6-baef-6e935d1e26b4',
              },
            ]}
          />
        </FormItem>

        <FormItem
          label={<FormLabel label="Assignee" />}
          field="assigneeIds"
          rules={[{ required: true }]}
        >
          <UserSelectInput
            options={[
              {
                label: 'Thomas Lee',
                value: 'b4c95fda-00cd-48f6-baef-6e935d1e26b4',
              },
            ]}
          />
        </FormItem>

        <FormItem
          label={<FormLabel label="Outcome" />}
          field="outcome"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              {
                label: 'No answer',
                value: 'no_answer',
              },
            ]}
          />
        </FormItem>

        <FormItem label={<FormLabel label="Date & Time" />} field="date">
          <DatePicker
            showTime
            format={(value) => value.format('D MMM YYYY, hh:mma')}
            timepickerProps={{ use12Hours: true }}
          />
        </FormItem>

        <FormItem label={<FormLabel label="Reminder" />} field="reminder">
          <Select
            options={[
              {
                label: '1 day before',
                value: 'one_day_before',
              },
            ]}
          />
        </FormItem>

        <FormItem label={<FormLabel label="Description" />} field="description">
          <Input.TextArea />
        </FormItem>
      </Form>
    </Modal>
  );
};
