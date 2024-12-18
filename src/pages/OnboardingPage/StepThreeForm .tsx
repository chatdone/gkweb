import {
  Button,
  Form,
  Grid,
  Input,
  Select,
  Space,
} from '@arco-design/web-react';
import { MdClose } from 'react-icons/md';

import styles from './OnboardingPage.module.less';

import { companyMemberTypeOptions } from '@/constants/company.constants';

const FormItem = Form.Item;

type Props = {
  loading: boolean;
  onSkip: () => void;
  onNext: () => void;
};

const StepThreeForm = (props: Props) => {
  const { loading, onNext, onSkip } = props;

  return (
    <div style={{ padding: '0 3rem' }}>
      <FormItem label="Add member" required>
        <Form.List field="inviteMembers">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((item, index) => (
                  <div key={item.key}>
                    <Grid.Row gutter={12}>
                      <Grid.Col span={11}>
                        <FormItem
                          field={`${item.field}.email`}
                          rules={[{ required: true, type: 'email' }]}
                        >
                          <Input placeholder="invite by email" />
                        </FormItem>
                      </Grid.Col>

                      <Grid.Col span={11}>
                        <FormItem
                          field={`${item.field}.role`}
                          rules={[{ required: true }]}
                        >
                          <Select options={companyMemberTypeOptions} />
                        </FormItem>
                      </Grid.Col>

                      <Grid.Col span={2}>
                        <Button
                          icon={<MdClose />}
                          type="text"
                          onClick={() => remove(index)}
                        />
                      </Grid.Col>
                    </Grid.Row>
                  </div>
                ))}

                <Button className={styles['icon-btn']} onClick={() => add()}>
                  Add more
                </Button>
              </div>
            );
          }}
        </Form.List>
      </FormItem>

      <FormItem wrapperCol={{ span: 24 }}>
        <Grid.Row justify="end">
          <Space>
            <Button onClick={onSkip} disabled={loading}>
              Skip
            </Button>

            <Button
              className={styles['theme-btn']}
              loading={loading}
              onClick={onNext}
            >
              Done
            </Button>
          </Space>
        </Grid.Row>
      </FormItem>
    </div>
  );
};

export default StepThreeForm;
