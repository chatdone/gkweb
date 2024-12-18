import { Modal, Form, Input, DatePicker } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useEffect } from 'react';

import { FormLabel } from '@/components';

import type { BaseModalConfig, ArrayElement } from '@/types';

import type { CompanyHolidayPageQuery } from 'generated/graphql-types';

const FormItem = Form.Item;

type QueryHoliday = ArrayElement<CompanyHolidayPageQuery['holidays']>;

type Props = BaseModalConfig & {
  loading: boolean;
  holiday: QueryHoliday | null | undefined;
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
};

export type FormValues = {
  name: string;
  startDate: Date;
  endDate: Date;
};

export const EditCompanyHolidayModal = (props: Props) => {
  const { visible, onCancel, loading, holiday, onCreate, onUpdate } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (holiday) {
      form.setFieldsValue({
        name: holiday.name as string,
        startDate: dayjs(holiday.startDate).toDate(),
        endDate: dayjs(holiday.endDate).toDate(),
      });
    } else {
      form.resetFields();
    }
  }, [visible, holiday]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      if (holiday) {
        onUpdate(values);
      } else {
        onCreate(values);
      }
    });
  };

  return (
    <Modal
      title={`${holiday ? 'Edit' : 'Add'} Holiday`}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Form layout="vertical" form={form}>
        <FormItem
          label={
            <FormLabel
              label="Holiday Name"
              tooltip="Fill in the name of the holiday."
            />
          }
          field="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Insert holiday name" />
        </FormItem>

        <FormItem noStyle shouldUpdate>
          {(values) => (
            <FormItem
              label={
                <FormLabel
                  label="From"
                  tooltip="Select the start date of the holiday."
                />
              }
              field="startDate"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={(current) =>
                  values.endDate && current.isAfter(values.endDate)
                }
              />
            </FormItem>
          )}
        </FormItem>

        <FormItem noStyle shouldUpdate>
          {(values) => (
            <FormItem
              label={<FormLabel label="Until" tooltip="Until" />}
              field="Select the end date of the holiday."
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={(current) =>
                  values.startDate && current.isBefore(values.startDate)
                }
              />
            </FormItem>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
};
