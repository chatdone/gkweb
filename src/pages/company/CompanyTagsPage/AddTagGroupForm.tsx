import { Button, Form, Grid, Input } from '@arco-design/web-react';
import { MdAdd } from 'react-icons/md';

import { FormLabel } from '@/components';

import styles from './CompanyTagsPage.module.less';

const FormItem = Form.Item;

export type FormValues = {
  name: string;
  description: string;
};

type Props = {
  onSubmit: (values: FormValues) => void;
};

const AddTagGroupForm = (props: Props) => {
  const { onSubmit } = props;

  const [form] = Form.useForm<FormValues>();

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);

    form.resetFields();
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Grid.Row gutter={25}>
        <Grid.Col xs={24} xl={12}>
          <FormItem
            label={
              <FormLabel
                label="Group name"
                tooltip="Fill in the name for the tag group. Add a tag group to categorize the tags."
              />
            }
            field="name"
            rules={[{ required: true }]}
            labelCol={{ xs: 4, xl: 6 }}
            wrapperCol={{ xs: 20, xl: 18 }}
          >
            <Input
              placeholder="Write tag group name"
              showWordLimit
              maxLength={100}
            />
          </FormItem>
        </Grid.Col>

        {/* <Grid.Col xs={24} xl={12}>
          <FormItem
            label={<FormLabel label="Description" tooltip="Description" />}
            field="description"
            labelCol={{ xs: 4, xl: 5 }}
            wrapperCol={{ xs: 20, xl: 19 }}
          >
            <Input.TextArea
              autoSize
              placeholder="Write something about the group"
            />
          </FormItem>
        </Grid.Col> */}
      </Grid.Row>

      <Grid.Row justify="end">
        <Button
          className={styles['theme-button']}
          icon={<MdAdd />}
          htmlType="submit"
        >
          Add Group
        </Button>
      </Grid.Row>
    </Form>
  );
};

export default AddTagGroupForm;
