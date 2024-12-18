import { Button, Form, Input } from '@arco-design/web-react';
import { useEffect } from 'react';

import { SqlAccountingInfoPageQuery } from 'generated/graphql-types';

export type FormValues = {
  code: string;
};

type Props = {
  company: SqlAccountingInfoPageQuery['company'];
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
        code: company.accountCode || '',
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
        <Form.Item field="code" label="Sale Code">
          <Input className="max-w-sm" showWordLimit maxLength={100} />
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
