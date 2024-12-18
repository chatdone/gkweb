import { Button, DatePicker } from '@arco-design/web-react';
import { IconLeft, IconRight } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';

type Props = {
  handleChangeDate: (date: dayjs.Dayjs) => void;
  selected: dayjs.Dayjs;
  submitTimesheet: () => void;
};

const TimesheetTrackingNav = (props: Props) => {
  const { submitTimesheet, selected, handleChangeDate } = props;
  return (
    <>
      <div className="flex items-center h-12 border-y border-gray-300 px-2">
        <div className="flex-1">
          <Button
            size="small"
            type={'text'}
            className="p-0"
            onClick={() => {
              handleChangeDate(selected.subtract(1, 'month'));
            }}
          >
            <IconLeft className="text-gray-400 ml-1" />
          </Button>
          <DatePicker.MonthPicker
            defaultPickerValue={props.selected}
            value={props.selected}
            triggerElement={
              <Button size="small" type={'text'}>
                <span className="text-gray-900 text-base font-heading">
                  {props.selected.format('MMMM YYYY')}
                </span>
              </Button>
            }
            onChange={(e) => {
              handleChangeDate(dayjs(e));
            }}
          />
          <Button
            size="small"
            type={'text'}
            className="p-0"
            onClick={() => {
              handleChangeDate(props.selected.add(1, 'month'));
            }}
          >
            <IconRight className="text-gray-400 ml-1" />
          </Button>
        </div>
        <div>
          <Button onClick={submitTimesheet} type={'text'} size="small">
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};
export default TimesheetTrackingNav;
