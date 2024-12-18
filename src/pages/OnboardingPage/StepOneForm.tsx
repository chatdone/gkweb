import { Button, Form, Grid, Input } from '@arco-design/web-react';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

import { PhoneInput, TimezoneSelectInput } from '@/components';

import styles from './OnboardingPage.module.less';

const FormItem = Form.Item;

type Props = {
  loading: boolean;
  isInvitedPic: boolean;
  confirmTxt: string;
  onNext: () => void;
};

const StepOneForm = (props: Props) => {
  const { loading, isInvitedPic, onNext, confirmTxt } = props;

  return (
    <div style={{ padding: '0 2rem' }}>
      <FormItem label="Name" rules={[{ required: true }]} field="name">
        <Input />
      </FormItem>

      <FormItem
        label="Email"
        rules={[{ required: true, type: 'email' }]}
        field="email"
      >
        <Input disabled />
      </FormItem>

      <FormItem
        label="Contact Number"
        rules={[
          { required: true },
          {
            validator: (value, callback) => {
              if (value && !isPossiblePhoneNumber(value)) {
                return callback('Invalid Phone Number');
              }

              callback();
            },
          },
        ]}
        field="contactNo"
      >
        <PhoneInput />
      </FormItem>

      {!isInvitedPic && (
        <>
          <FormItem
            label="Company name"
            rules={[{ required: true }]}
            field="companyName"
          >
            <Input placeholder="Your company name here" />
          </FormItem>

          <FormItem
            label="Company Timezone"
            rules={[{ required: true }]}
            field="companyTimezone"
          >
            <TimezoneSelectInput />
          </FormItem>

          <FormItem label="Company Description" field="companyDescription">
            <Input.TextArea />
          </FormItem>
        </>
      )}

      <FormItem wrapperCol={{ span: 24 }}>
        <Grid.Row justify="end">
          <Button
            className={styles['theme-btn']}
            loading={loading}
            onClick={onNext}
          >
            {confirmTxt}
          </Button>
        </Grid.Row>
      </FormItem>
    </div>
  );
};

export default StepOneForm;
