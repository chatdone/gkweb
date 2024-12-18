import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
} from '@arco-design/web-react';
import type { UploadItem } from '@arco-design/web-react/es/Upload';
import { useEffect } from 'react';

import type { BaseModalConfig, SelectOption } from '@/types';

const FormItem = Form.Item;

export type FormValues = {
  taskId: string;
  date: string;
  description?: string;
  amount: number;
  attachments: UploadItem[];
};

type Props = BaseModalConfig & {
  claim: unknown | undefined;
  loading: boolean;
  taskOptions: SelectOption[];
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
};

const EditClaimModal = (props: Props) => {
  const { visible, onCancel, loading, claim, taskOptions, onCreate, onUpdate } =
    props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      if (claim) {
        onUpdate(values);
      } else {
        onCreate(values);
      }
    });
  };

  return (
    <Modal
      className="w-full max-w-lg"
      visible={visible}
      onCancel={onCancel}
      title="Add Claim"
      onOk={handleSubmit}
      okText="Add Claim"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
    >
      <Form layout="vertical" form={form}>
        <FormItem field="taskId" label="Task">
          <Select showSearch options={taskOptions} />
        </FormItem>

        <FormItem field="date" label="Date">
          <DatePicker className="w-full" />
        </FormItem>

        <FormItem field="description" label="Description">
          <Input placeholder="Add description" />
        </FormItem>

        <FormItem field="amount" label="Amount">
          <InputNumber prefix="RM" precision={2} placeholder="0.00" />
        </FormItem>

        <FormItem field="attachments" label="Attachment">
          <Upload
            autoUpload={false}
            limit={1}
            showUploadList={{
              progressRender: () => <></>,
            }}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default EditClaimModal;
