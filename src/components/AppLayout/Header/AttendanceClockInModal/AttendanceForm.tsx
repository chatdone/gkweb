import {
  Button,
  Form,
  Grid,
  Input,
  Select,
  Space,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { escapeRegExp } from 'lodash-es';
import { useEffect } from 'react';
import { MdOutlineLocationOn } from 'react-icons/md';

import FormLabel from '../../../FormLabel';
import styles from './AttendanceClockInModal.module.less';

import { SelectOption } from '@/types';

const FormItem = Form.Item;

export type FormValues = {
  clockTime: string;
  comments: string;
  labelId?: string;
  locationId?: string;
  contactId?: string;
};

type Props = {
  activeType: 'in' | 'break' | 'out';
  timezone: string;
  attendanceLabelOptions: SelectOption[];
  locationOptions: SelectOption[];
  contactOptions: SelectOption[];
  loading: boolean;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
};

const AttendanceForm = (props: Props) => {
  const {
    activeType,
    timezone,
    attendanceLabelOptions,
    locationOptions,
    contactOptions,
    loading,
    onSubmit,
    onCancel,
  } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (activeType !== 'in') {
      form.resetFields(['labelId', 'locationId']);
    }
  }, [activeType]);

  useEffect(() => {
    form.setFieldValue(
      'clockTime',
      dayjs().tz(timezone).format('hh:mma, DD MMM YYYY'),
    );
  }, [activeType]);

  const handleSubmit = () => {
    form.validate().then((values) => onSubmit(values));
  };

  return (
    <Form form={form} layout="vertical">
      <FormItem
        label={
          <FormLabel label={`Clock Time (${timezone.replace('_', ' ')})`} />
        }
        field="clockTime"
        rules={[{ required: true }]}
      >
        <Input disabled />
      </FormItem>

      {activeType === 'in' && (
        <>
          <FormItem label={<FormLabel label="Activity" />} field="labelId">
            <Select
              showSearch
              placeholder="Please select"
              options={attendanceLabelOptions}
              filterOption={(inputValue, option) => {
                const regex = new RegExp(escapeRegExp(inputValue), 'i');

                return option.props.children.match(regex);
              }}
            />
          </FormItem>

          <FormItem label={<FormLabel label="Location" />} field="locationId">
            <Select
              showSearch
              suffixIcon={<MdOutlineLocationOn className={styles.icon} />}
              placeholder="Please select"
              options={locationOptions}
              filterOption={(inputValue, option) => {
                const regex = new RegExp(escapeRegExp(inputValue), 'i');

                return option.props.children.match(regex);
              }}
            />
          </FormItem>

          <FormItem label={<FormLabel label="Contact" />} field="contactId">
            <Select
              showSearch
              placeholder="Please select"
              options={contactOptions}
              filterOption={(inputValue, option) => {
                const regex = new RegExp(escapeRegExp(inputValue), 'i');

                return option.props.children.match(regex);
              }}
            />
          </FormItem>
        </>
      )}

      <FormItem label={<FormLabel label={`Notes`} />} field="comments">
        <Input.TextArea
          autoSize={{ minRows: 2 }}
          placeholder="Describe your activity"
        />
      </FormItem>

      <Grid.Row justify="end">
        <Space>
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>

          <Button
            className={styles['theme-button']}
            onClick={handleSubmit}
            loading={loading}
          >
            Save
          </Button>
        </Space>
      </Grid.Row>
    </Form>
  );
};

export default AttendanceForm;
