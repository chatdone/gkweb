import {
  Form,
  Modal,
  Cascader,
  DatePicker,
  Select,
  Input,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { escapeRegExp } from 'lodash-es';
import { useEffect } from 'react';

import { CascaderOption } from '@/components/SelectUserCascaderInput';

import { TERM_OPTIONS } from '@/constants/billing.constants';

import { ArrayElement, BaseModalConfig } from '@/types';

import { ProjectPageQuery } from 'generated/graphql-types';

type QueryInvoice = ArrayElement<ProjectPageQuery['billingInvoices']>;

export type FormValues = {
  customerId: string[];
  date: string;
  terms?: number;
  remarks?: string;
};

type Props = BaseModalConfig & {
  invoice: QueryInvoice | undefined;
  loading: boolean;
  customerOptions: CascaderOption[];
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
};

const EditInvoiceModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    invoice,
    customerOptions,
    onCreate,
    onUpdate,
  } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      if (invoice) {
        form.setFieldsValue({
          customerId: [invoice.contactPic?.contact?.id, invoice.contactPic?.id],
          date: dayjs(invoice.docDate).format(),
          terms: invoice.terms || undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      invoice ? onUpdate(values) : onCreate(values);
    });
  };

  return (
    <Modal
      className="w-full max-w-lg"
      visible={visible}
      onCancel={onCancel}
      title={invoice ? 'Edit Invoice' : 'Add Invoice'}
      onOk={handleSubmit}
      okText={invoice ? 'Edit Invoice' : 'Add Invoice'}
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
      autoFocus={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          date: new Date().toISOString(),
        }}
      >
        <Form.Item
          field="customerId"
          label="Customer"
          rules={[{ required: true }]}
        >
          <Cascader
            showSearch
            allowClear
            placeholder="Please select ..."
            options={customerOptions}
            filterOption={(input, option) => {
              return !!option.label.match(new RegExp(escapeRegExp(input), 'i'));
            }}
          />
        </Form.Item>

        <Form.Item
          field="date"
          label="Invoice Date"
          rules={[{ required: true }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item field="terms" label="Terms">
          <Select options={TERM_OPTIONS} />
        </Form.Item>

        <Form.Item field="remarks" label="Notes">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditInvoiceModal;
