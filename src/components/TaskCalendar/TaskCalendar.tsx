import { Button, DatePicker, Radio } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Calendar, Event, EventPropGetter, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import styles from './TaskCalendar.module.less';
import { dayjsLocalizer } from './localizer';

type Props<T> = {
  events: T[];
  onSelectEvent: (event: T) => void;
  eventPropGetter?: EventPropGetter<T>;
};

const TaskCalendar = <T extends Event>(props: Props<T>) => {
  const { events, onSelectEvent, eventPropGetter } = props;

  const [view, setView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs());

  const handleChangeView = (value: View) => {
    setView(value);
  };

  const handleUpdateDate = (date: dayjs.Dayjs) => {
    setCurrentDate(date);
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-gray-50 px-2 pt-4">
        <div>
          <Button
            className="p-0"
            size="small"
            type="text"
            onClick={() => {
              if (view === 'month' || view === 'agenda') {
                handleUpdateDate(currentDate.subtract(1, 'month'));
              } else if (view === 'week') {
                handleUpdateDate(currentDate.subtract(1, 'week'));
              } else if (view === 'day') {
                handleUpdateDate(currentDate.subtract(1, 'day'));
              }
            }}
          >
            <MdKeyboardArrowLeft className="ml-1 text-gray-400" />
          </Button>

          {(view === 'month' || view === 'agenda') && (
            <DatePicker.MonthPicker
              value={currentDate}
              triggerElement={
                <Button size="small" type="text">
                  <span className="font-heading text-base text-gray-900">
                    {view === 'agenda'
                      ? `${currentDate.format('MMM D, YYYY')} - ${currentDate
                          .add(30, 'day')
                          .format('MMM D, YYYY')}`
                      : currentDate.format('MMMM YYYY')}
                  </span>
                </Button>
              }
              onChange={(_, date) => handleUpdateDate(date)}
            />
          )}

          {view === 'week' && (
            <DatePicker.WeekPicker
              value={currentDate}
              triggerElement={
                <Button size="small" type="text">
                  <span className="font-heading text-base text-gray-900">
                    Week {currentDate.week()}, {currentDate.year()}
                  </span>
                </Button>
              }
              onChange={(_, date) => handleUpdateDate(date)}
            />
          )}

          {view === 'day' && (
            <DatePicker
              value={currentDate}
              triggerElement={
                <Button size="small" type="text">
                  <span className="font-heading text-base text-gray-900">
                    {currentDate.format('MMM D, YYYY')}
                  </span>
                </Button>
              }
              onChange={(_, date) => handleUpdateDate(date)}
            />
          )}

          <Button
            className="p-0"
            size="small"
            type="text"
            onClick={() => {
              if (view === 'month' || view === 'agenda') {
                handleUpdateDate(currentDate.add(1, 'month'));
              } else if (view === 'week') {
                handleUpdateDate(currentDate.add(1, 'week'));
              } else if (view === 'day') {
                handleUpdateDate(currentDate.add(1, 'day'));
              }
            }}
          >
            <MdKeyboardArrowRight className="ml-1 text-gray-400" />
          </Button>
        </div>

        <Radio.Group
          className="hidden md:inline-block"
          type="button"
          size="small"
          value={view}
          onChange={handleChangeView}
        >
          <Radio value="month">Month</Radio>
          <Radio value="week">Week</Radio>
          <Radio value="day">Day</Radio>
          <Radio value="agenda">Agenda</Radio>
        </Radio.Group>
      </div>

      <div className="bg-gray-50 p-3" style={{ height: 800 }}>
        <Calendar
          className={`${styles.calendar} gk-calendar`}
          popup
          localizer={dayjsLocalizer()}
          date={currentDate.toDate()}
          toolbar={false}
          events={events}
          view={view}
          eventPropGetter={eventPropGetter}
          onSelectEvent={onSelectEvent}
          onView={() => {
            // To silent error
          }}
          onNavigate={() => {
            // To silent error
          }}
        />
      </div>
    </div>
  );
};

export default TaskCalendar;
