import { Modal, Form, Input } from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel, ColorInput } from '@/components';

import type { BaseModalConfig, ArrayElement } from '@/types';

import type { CompanyTagGroupPageQuery } from 'generated/graphql-types';

const FormItem = Form.Item;

type QueryTag = ArrayElement<
  NonNullable<CompanyTagGroupPageQuery['tagGroup']>['tags']
>;

type Props = BaseModalConfig & {
  loading: boolean;
  tag: QueryTag | undefined;
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
};

export type FormValues = {
  name: string;
  color: string;
};

const EditTagModal = (props: Props) => {
  const { visible, onCancel, loading, tag, onCreate, onUpdate } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (tag) {
      form.setFieldsValue({
        name: tag.name as string,
        color: tag.color as string,
      });
    } else {
      form.resetFields();
    }
  }, [visible, tag]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      if (tag) {
        onUpdate(values);
      } else {
        onCreate(values);
      }
    });
  };

  return (
    <Modal
      title={`${tag ? 'Edit' : 'Add'} Tag`}
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
              label="Tag Name"
              tooltip="Fill in the name for the tag."
            />
          }
          field="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Tag name" showWordLimit maxLength={100} />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Tag Color"
              tooltip="Select a color for the tag so it will be easier to differentiate each tag."
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
              circleSpacing: 20,
            }}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default EditTagModal;
