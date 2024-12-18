import { Modal, Form, Input } from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel, ColorInput } from '@/components';

import type { ArrayElement, BaseModalConfig } from '@/types';

import { CompanyActivityLabelsPageQuery } from 'generated/graphql-types';

type QueryAttendanceLabel = ArrayElement<
  CompanyActivityLabelsPageQuery['attendanceLabels']
>;

type Props = BaseModalConfig & {
  loading: boolean;
  activityLabel: QueryAttendanceLabel | undefined;
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
};

export type FormValues = {
  name: string;
  description: string;
  color: string;
};

const FormItem = Form.Item;

export const EditCompanyActivityLabelModal = (props: Props) => {
  const { visible, onCancel, loading, activityLabel, onCreate, onUpdate } =
    props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      if (activityLabel) {
        form.setFieldsValue({
          name: activityLabel.name as string,
          description: activityLabel.description as string,
          color: activityLabel.color as string,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, activityLabel]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      if (activityLabel) {
        onUpdate(values);
      } else {
        onCreate(values);
      }
    });
  };

  return (
    <Modal
      title={`${activityLabel ? 'Edit' : 'Add'} Label`}
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
              label="Name"
              tooltip="Fill in the name for the activity label. Users will be able to select the activity upon clocking in."
            />
          }
          field="name"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Insert label name"
            showWordLimit
            maxLength={100}
          />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Description"
              tooltip="Fill in the description for the activity label."
            />
          }
          field="description"
        >
          <Input.TextArea
            placeholder="Insert a description here"
            showWordLimit
            maxLength={200}
          />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Label Color"
              tooltip="Select a color for the activity label."
            />
          }
          field="color"
          rules={[{ required: true }]}
        >
          <ColorInput.Circle
            pickerProps={{
              colors: [
                '#E64E59',
                '#4E5969',
                '#00B42A',
                '#0FC6C2',
                '#FF7D00',
                '#3491FA',
                '#F7BA1E',
                '#9FDB1D',
                '#D91AD9',
                '#722ED1',
                '#F77234',
              ],
              circleSize: 25,
              circleSpacing: 15,
            }}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};
