import { Button, Form, Input, InputNumber } from '@arco-design/web-react';
import { useEffect } from 'react';

import { CompanyInvoiceSettingsPageQuery } from 'generated/graphql-types';

export type FormValues = {
  prefix: string;
  startFrom?: number;
};

type Props = {
  company: CompanyInvoiceSettingsPageQuery['company'];
  queryLoading: boolean;
  loading: boolean;
  onSubmit: (values: FormValues) => void;
};

const SettingsForm = (props: Props) => {
  const { company, queryLoading, loading, onSubmit } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (company) {
      form.setFieldsValue({
        prefix: company.invoicePrefix || '',
        startFrom: company.invoiceStart || undefined,
      });
    }
  }, [company]);

  const handleSubmit = async () => {
    try {
      const values = await form.validate();

      onSubmit(values);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Form form={form} layout="vertical">
        <Form.Item field="prefix" label="Invoice Prefix">
          <Input
            className="max-w-sm"
            showWordLimit
            maxLength={100}
            placeholder="IV"
          />
        </Form.Item>

        <Form.Item field="startFrom" label="Start From">
          <InputNumber
            className="max-w-sm"
            placeholder="500000"
            precision={0}
          />
        </Form.Item>
      </Form>

      <Button
        type="primary"
        loading={loading}
        disabled={queryLoading}
        onClick={handleSubmit}
      >
        Save
      </Button>
    </>
  );
};

export default SettingsForm;
