import { DatePicker, RangePickerProps } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { StageType } from 'generated/graphql-types';

type Config = {
  progressPercent: number;
  progressBg: string;
  progressBorder: string;
  textColor: string;
  bgColor: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

type Props = Pick<RangePickerProps, 'value' | 'onChange'> & {
  stage?: StageType;
  disabled?: boolean;
  containerClassName?: string;
  onClear?: () => void;
};

const TaskTimelinePicker = (props: Props) => {
  const { stage, disabled, containerClassName, onClear } = props;

  const [config, setConfig] = useState<Config>(defaultConfig);
  const [stateValue, setValue] = useState(props.value);

  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [isRange, setIsRange] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(false);

  const value = props.value || stateValue;

  useEffect(() => {
    const newConfig = { ...defaultConfig };

    const [start, end] = value || [];

    const isSameDate = start && end && dayjs(start).isSame(dayjs(end), 'date');

    if (isSameDate) {
      setIsRange(false);
    }

    const now = dayjs();
    const isOverdue = end && now.isAfter(dayjs(end));

    if (stage === StageType.Pass) {
      newConfig.progressBg = 'bg-green-500';
      newConfig.textColor = 'text-green-600';
      newConfig.progressPercent = 100;
    } else if (stage === StageType.Closed) {
      newConfig.progressBg = 'bg-gray-200';
      newConfig.progressPercent = 100;
      newConfig.textColor = 'text-gray-400';
    } else if (stage === StageType.Fail || isOverdue) {
      newConfig.progressBg = 'bg-red-500';
      newConfig.textColor = 'text-red-600';
      newConfig.bgColor = 'bg-red-50 font-bold';
    }

    if (start && end) {
      const parsedStart = dayjs(start);
      const parsedEnd = dayjs(end);

      let startFormat = "MMM D 'YY";
      let startTimeFormat = 'h:mmA';
      let endFormat = "MMM D 'YY";
      let endTimeFormat = 'h:mmA';

      if (parsedStart.isSame(parsedEnd, 'year')) {
        startFormat = 'MMM D';
        endFormat = 'MMM D';
      }

      const duration = parsedEnd.diff(parsedStart, 'h') + 1;
      const fromToday = now.diff(parsedStart, 'h') + 1;

      if (fromToday > 0) {
        if (fromToday < duration) {
          newConfig.progressPercent = (fromToday / duration) * 100;
        } else {
          newConfig.progressPercent = 100;
        }
      }

      if (parsedStart.minute() === 0) {
        startTimeFormat = 'hA';
      }

      if (parsedEnd.minute() === 0) {
        endTimeFormat = 'hA';
      }

      newConfig.startDate = parsedStart.format(startFormat);
      newConfig.startTime = parsedStart.format(startTimeFormat);

      newConfig.endDate = parsedEnd.format(endFormat);
      newConfig.endTime = parsedEnd.format(endTimeFormat);
    }

    setConfig(newConfig);
  }, [stage, value]);

  const handleChange = (dateString: string[], date: dayjs.Dayjs[]) => {
    if (!('value' in props)) {
      setValue(dateString);
    }

    props.onChange?.(dateString, date);
  };

  const handleSingleDateChange = (dateString: string, date: dayjs.Dayjs) => {
    if (!('value' in props)) {
      setValue([dateString, dateString]);
    }

    props.onChange?.([dateString, dateString], [date, date]);
  };

  return (
    <>
      {isRange ? (
        <DatePicker.RangePicker
          showTime={showTime}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          popupVisible={popupVisible}
          onVisibleChange={(visible) => setPopupVisible(!!visible)}
          shortcuts={[
            {
              text: 'Clear',
              value: () => {
                return [];
              },
            },
            {
              text: 'Date Only',
              value: () => {
                return [];
              },
            },
            {
              text: 'Show Time',
              value: () => {
                return [];
              },
            },
          ]}
          onSelectShortcut={(shortcut) => {
            if (shortcut.text === 'Clear') {
              onClear?.();

              setPopupVisible(false);
            } else if (shortcut.text === 'Date Only') {
              setIsRange(false);
            } else if (shortcut.text === 'Show Time') {
              setShowTime(!showTime);
            }
          }}
          triggerElement={
            <div className="cursor-pointer">
              <div
                className={`relative h-12 w-full ${config.bgColor} ${containerClassName}`}
              >
                <div
                  className={`absolute bottom-0 left-0 h-1 border ${config.progressBg} ${config.progressBorder}`}
                  style={{ width: `${config.progressPercent}%` }}
                />

                <div
                  className={`absolute top-0 left-0 flex h-full w-full items-center ${config.textColor}`}
                >
                  <div className="w-1/2 py-2 pl-2">
                    <div className="leading-none">{config.startDate}</div>
                    <div className="text-xs opacity-50">{config.startTime}</div>
                  </div>

                  <div className="w-1/2 border-l border-gray-200 py-2 pl-2">
                    <div className="leading-none">{config.endDate}</div>
                    <div className="text-xs opacity-50">{config.endTime}</div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      ) : (
        <DatePicker
          showTime={showTime}
          value={value?.[0]}
          onChange={handleSingleDateChange}
          disabled={disabled}
          popupVisible={popupVisible}
          onVisibleChange={(visible) => setPopupVisible(!!visible)}
          shortcuts={[
            {
              text: 'Clear',
              value: () => {
                return [];
              },
            },
            {
              text: 'Range',
              value: () => {
                return [];
              },
            },
            {
              text: 'Show Time',
              value: () => {
                return [];
              },
            },
          ]}
          onSelectShortcut={(shortcut) => {
            if (shortcut.text === 'Clear') {
              onClear?.();

              setPopupVisible(false);
            } else if (shortcut.text === 'Range') {
              setIsRange(true);
            } else if (shortcut.text === 'Show Time') {
              setShowTime(!showTime);
            }
          }}
          triggerElement={
            <div className="cursor-pointer">
              <div
                className={`relative h-12 w-full ${config.bgColor} ${containerClassName}`}
              >
                <div
                  className={`absolute bottom-0 left-0 h-1 border ${config.progressBg} ${config.progressBorder}`}
                  style={{ width: `${config.progressPercent}%` }}
                />

                <div
                  className={`absolute top-0 left-0 flex h-full w-full items-center ${config.textColor}`}
                >
                  <div className="w-1/2 py-2 pl-2">
                    <div className="leading-none">{config.startDate}</div>
                    <div className="text-xs opacity-50">{config.startTime}</div>
                  </div>

                  {isRange && (
                    <div className="w-1/2 border-l border-gray-200 py-2 pl-2">
                      <div className="leading-none">{config.endDate}</div>
                      <div className="text-xs opacity-50">{config.endTime}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
        />
      )}
    </>
  );
};

const defaultConfig: Config = {
  progressPercent: 0,
  progressBg: 'bg-gold-500',
  progressBorder: 'border-transparent',
  textColor: 'text-gray-900',
  bgColor: 'bg-gray-50',
  startDate: '-',
  startTime: '',
  endDate: '-',
  endTime: '',
};

export default TaskTimelinePicker;
