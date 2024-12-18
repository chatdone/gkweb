import {
  DatePicker,
  Form,
  FormInstance,
  Radio,
  Select,
} from '@arco-design/web-react';
import dayjs from 'dayjs';

import type { SelectOption } from '@/types';

const FormItem = Form.Item;

type Props = {
  form: FormInstance;
  workspaceOptions: SelectOption[];
};

const InvoiceForm = (props: Props) => {
  const { form, workspaceOptions } = props;

  const handleChangeDateRangeType = (value: string) => {
    if (value === 'custom') {
      return;
    }

    const field = getField('dateRange');

    if (value === 'now') {
      form.setFieldValue(field, [
        dayjs().startOf('month').toDate(),
        dayjs().endOf('month').toDate(),
      ]);
    } else if (value === 'last') {
      const lastMonth = dayjs().subtract(1, 'month');

      form.setFieldValue(field, [
        lastMonth.startOf('month').toDate(),
        lastMonth.endOf('month').toDate(),
      ]);
    }
  };

  const getDateRangeType = (values: { invoice: { dateRange: Date[] } }) => {
    const { dateRange } = values.invoice;

    const [start, end] = dateRange;

    const now = dayjs();
    const lastMonth = dayjs().subtract(1, 'month');

    if (now.startOf('month').isSame(start) && now.endOf('month').isSame(end)) {
      return 'now';
    } else if (
      lastMonth.startOf('month').isSame(start) &&
      lastMonth.endOf('month').isSame(end)
    ) {
      return 'last';
    }

    return 'custom';
  };

  const getField = (field: string) => `invoice.${field}`;

  return (
    <>
      <FormItem className="mb-0" label="Date Range">
        <FormItem shouldUpdate>
          {(values) => (
            <Radio.Group
              type="button"
              size="small"
              value={getDateRangeType(values)}
              options={[
                {
                  label: 'This month',
                  value: 'now',
                },
                {
                  label: 'Last month',
                  value: 'last',
                },
                {
                  label: 'Custom',
                  value: 'custom',
                },
              ]}
              onChange={handleChangeDateRangeType}
            />
          )}
        </FormItem>

        <FormItem field={getField('dateRange')} rules={[{ required: true }]}>
          <DatePicker.RangePicker style={{ width: '100%' }} />
        </FormItem>
      </FormItem>

      <FormItem
        label="Workspace"
        field={getField('workspaceId')}
        rules={[{ required: true }]}
      >
        <Select
          options={[{ label: 'All', value: 'all' }, ...workspaceOptions]}
        />
      </FormItem>
    </>
  );
};

export default InvoiceForm;
