import { gql } from '@apollo/client';
import {
  Space,
  Grid,
  Button,
  Typography,
  Form,
  Switch,
  TimePicker,
  Checkbox,
  Input,
} from '@arco-design/web-react';
import dayjs, { Dayjs } from 'dayjs';
import { get } from 'lodash-es';
import { useEffect } from 'react';

import { TimezoneSelectInput } from '@/components';

import styles from './CompanyWorkScheduleInfoPage.module.less';

import type { CompanyWorkScheduleInfoPageQuery } from 'generated/graphql-types';

type QueryEmployeeType = CompanyWorkScheduleInfoPageQuery['employeeType'];

export const editWorkScheduleFormFragment = gql`
  fragment EditWorkScheduleFormFragment on EmployeeType {
    id
    name
    hasOvertime
    workDaySettings {
      day
      open
      startHour
      endHour
      timezone
    }
  }
`;

type WorkDayFormValues = {
  active: boolean;
  startHour: Date;
  endHour: Date;
};

export type FormValues = {
  name: string;
  overtime: boolean;
  sunday: WorkDayFormValues;
  monday: WorkDayFormValues;
  tuesday: WorkDayFormValues;
  wednesday: WorkDayFormValues;
  thursday: WorkDayFormValues;
  friday: WorkDayFormValues;
  saturday: WorkDayFormValues;
};

type Props = {
  employeeType: QueryEmployeeType | undefined;
  loading: boolean;
  canEdit: boolean;
  onSubmit: (values: FormValues) => void;
};

const EditWorkScheduleForm = (props: Props) => {
  const { employeeType, loading, canEdit, onSubmit } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    handleReset();
  }, [employeeType]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      onSubmit(values);
    });
  };

  const handleReset = () => {
    if (!employeeType) {
      form.resetFields();
      return;
    }

    const workDays: { [key: string]: WorkDayFormValues } = {};
    employeeType.workDaySettings?.forEach((workDay) => {
      const key = workDay?.day?.toLowerCase() as string;

      const [startHours, startMinutes] = (workDay?.startHour as string).split(
        ':',
      );
      const [endHours, endMinutes] = (workDay?.endHour as string).split(':');

      const parsedStart = dayjs()
        .hour(+startHours)
        .minute(+startMinutes);
      const parsedEnd = dayjs()
        .hour(+endHours)
        .minute(+endMinutes);

      workDays[key] = {
        active: workDay?.open as boolean,
        startHour: parsedStart.toDate(),
        endHour: parsedEnd.toDate(),
      };
    });

    form.setFieldsValue({
      name: employeeType.name as string,
      overtime: employeeType.hasOvertime as boolean,
      ...workDays,
    });
  };

  return (
    <Form className={styles['form-wrapper']} form={form} labelAlign="left">
      <Grid.Row>
        <Grid.Col xs={24} lg={16} xxl={12}>
          <Form.Item label="Schedule name" field="name">
            <Input disabled={!canEdit} showWordLimit maxLength={100} />
          </Form.Item>

          <Form.Item label="Timezone">
            <TimezoneSelectInput
              value={employeeType?.workDaySettings?.[0]?.timezone || undefined}
              disabled
            />
          </Form.Item>

          <Form.Item label="Work Schedule">
            <Space direction="vertical" size={15}>
              <WorkDayFormItem
                label="Sunday"
                field="sunday"
                disabled={!canEdit}
              />
              <WorkDayFormItem
                label="Monday"
                field="monday"
                disabled={!canEdit}
              />
              <WorkDayFormItem
                label="Tuesday"
                field="tuesday"
                disabled={!canEdit}
              />
              <WorkDayFormItem
                label="Wednesday"
                field="wednesday"
                disabled={!canEdit}
              />
              <WorkDayFormItem
                label="Thursday"
                field="thursday"
                disabled={!canEdit}
              />
              <WorkDayFormItem
                label="Friday"
                field="friday"
                disabled={!canEdit}
              />
              <WorkDayFormItem
                label="Saturday"
                field="saturday"
                disabled={!canEdit}
              />
            </Space>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 5,
            }}
            field="overtime"
            shouldUpdate
          >
            {(values) => (
              <Checkbox checked={values.overtime} disabled={!canEdit}>
                Overtime
              </Checkbox>
            )}
          </Form.Item>

          {canEdit && (
            <Grid.Row justify="end">
              <Space>
                <Button disabled={loading} onClick={handleReset}>
                  Cancel
                </Button>

                <Button
                  className={styles['theme-button']}
                  loading={loading}
                  onClick={handleSubmit}
                >
                  Update
                </Button>
              </Space>
            </Grid.Row>
          )}
        </Grid.Col>
      </Grid.Row>
    </Form>
  );
};

const WorkDayFormItem = ({
  label,
  field,
  disabled,
}: {
  label: string;
  field: string;
  disabled?: boolean;
}) => {
  const getField = (key: string) => {
    return `${field}.${key}`;
  };

  return (
    <Grid.Row gutter={12} align="center">
      <Grid.Col span={5}>
        <Typography.Text>{label}</Typography.Text>
      </Grid.Col>

      <Grid.Col span={3}>
        <Form.Item noStyle field={getField('active')} shouldUpdate>
          {(values) => (
            <Switch
              checked={get(values, getField('active'))}
              size="small"
              disabled={disabled}
            />
          )}
        </Form.Item>
      </Grid.Col>

      <Grid.Col span={7}>
        <Form.Item
          noStyle
          field={getField('startHour')}
          getValueFromEvent={(valueString: string, value: Dayjs) => value}
        >
          <TimePicker
            use12Hours
            format="hh:mma"
            step={{ minute: 15 }}
            disabled={disabled}
          />
        </Form.Item>
      </Grid.Col>

      <Grid.Col span={2} style={{ textAlign: 'center' }}>
        <Typography.Text>to</Typography.Text>
      </Grid.Col>

      <Grid.Col span={7}>
        <Form.Item
          noStyle
          field={getField('endHour')}
          getValueFromEvent={(valueString: string, value: Dayjs) => value}
        >
          <TimePicker
            use12Hours
            format="hh:mma"
            step={{ minute: 15 }}
            disabled={disabled}
          />
        </Form.Item>
      </Grid.Col>
    </Grid.Row>
  );
};

export default EditWorkScheduleForm;
