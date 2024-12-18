// import { displayTasksBy } from "../utils/_utils";
import { Button, DatePicker, Select } from '@arco-design/web-react';
import { IconLeft, IconRight } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';

type Props = {
  setSelected: (selected: dayjs.Dayjs) => void;
  selected: dayjs.Dayjs;
  state: string;
  setView: (view: string) => void;
  view: string;
};

const TimesheetApprovalNav = (props: Props) => {
  const { setSelected, selected, state, setView, view } = props;
  return (
    <>
      <div className="flex items-center h-12 border-y border-gray-300 px-2">
        <div className="flex-1">
          <Button
            size="small"
            className="p-0"
            onClick={() => {
              setSelected(selected.subtract(1, 'month'));
            }}
          >
            <IconLeft className="text-gray-400 ml-1" />
          </Button>
          <DatePicker.MonthPicker
            defaultPickerValue={selected}
            value={selected}
            triggerElement={
              <Button size="small">
                <span className="text-gray-900 text-base font-heading">
                  {selected.format('MMMM YYYY')}
                </span>
              </Button>
            }
            onChange={(e) => {
              // console.log(dayjs(e));
              setSelected(dayjs(e));
            }}
          />
          <Button
            size="small"
            className="p-0"
            onClick={() => {
              setSelected(selected.add(1, 'month'));
            }}
          >
            <IconRight className="text-gray-400 ml-1" />
          </Button>
        </div>
        {state !== 'member' && (
          <div>
            <Select
              value={view}
              onChange={(e) => {
                setView(e);
              }}
            >
              <Select.Option value="group">Group</Select.Option>
              <Select.Option value="member">Member</Select.Option>
            </Select>
          </div>
        )}
      </div>
    </>
  );
};
export default TimesheetApprovalNav;
