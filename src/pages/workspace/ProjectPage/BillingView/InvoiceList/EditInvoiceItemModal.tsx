import {
  Form,
  Modal,
  Input,
  Select,
  InputNumber,
  Radio,
  Button,
} from '@arco-design/web-react';
import { useEffect } from 'react';

import { ArrayElement, BaseModalConfig, SelectOption } from '@/types';

import { ProjectPageQuery } from 'generated/graphql-types';

type QueryInvoice = ArrayElement<ProjectPageQuery['billingInvoices']>;

type QueryInvoiceItem = ArrayElement<NonNullable<QueryInvoice>['items']>;

export type FormValues = {
  type: 'task' | 'custom';
  description: string; // task Id or description text
  value: number;
  discountPercent: number;
  taxPercent: number;
};

type Props = BaseModalConfig & {
  invoiceItem: QueryInvoiceItem | undefined;
  loading: boolean;
  taskOptions: SelectOption[];
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
  onDelete: () => void;
};

const EditInvoiceItemModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    invoiceItem,
    taskOptions,
    onCreate,
    onUpdate,
    onDelete,
  } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      if (invoiceItem) {
        form.setFieldsValue({
          type: invoiceItem.task ? 'task' : 'custom',
          description: invoiceItem.task
            ? (invoiceItem.task.id as string)
            : (invoiceItem.itemName as string),
          value: invoiceItem.unitPrice as number,
          taxPercent: invoiceItem.taxPercentage || undefined,
          discountPercent: invoiceItem.discountPercentage || undefined,
        });
      } else {
        form.resetFields();
        form.setFieldValue('type', 'task');
      }
    }
  }, [visible]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      invoiceItem ? onUpdate(values) : onCreate(values);
    });
  };

  return (
    <Modal
      className="w-full max-w-lg"
      visible={visible}
      onCancel={onCancel}
      title={invoiceItem ? 'Edit Item' : 'Add Item'}
      onOk={handleSubmit}
      okText={invoiceItem ? 'Edit Item' : 'Add Item'}
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
      autoFocus={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item field="type" label="Type">
          <Radio.Group
            type="button"
            options={[
              {
                label: 'Task',
                value: 'task',
              },
              {
                label: 'Custom',
                value: 'custom',
              },
            ]}
            onChange={() => form.resetFields('description')}
          />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {(values) => (
            <Form.Item field="description" label="Description">
              {values.type === 'task' ? (
                <Select
                  showSearch
                  placeholder="Please select"
                  options={taskOptions}
                />
              ) : (
                <Input showWordLimit maxLength={50} />
              )}
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item field="value" label="Gross value">
          <InputNumber prefix="RM" placeholder="0.00" precision={2} min={0} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item field="discountPercent" label="Discount">
            <InputNumber suffix="%" placeholder="0.00" precision={2} min={0} />
          </Form.Item>

          <Form.Item field="taxPercent" label="Tax">
            <InputNumber suffix="%" placeholder="0.00" precision={2} min={0} />
          </Form.Item>
        </div>
      </Form>

      {!!invoiceItem && (
        <div>
          <Button className="px-0" type="text" onClick={onDelete}>
            Delete Item
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default EditInvoiceItemModal;
