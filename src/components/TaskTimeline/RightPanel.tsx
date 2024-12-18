import dayjs from 'dayjs';
import { flatten } from 'lodash-es';
import { CSSProperties, Fragment, useEffect, useState } from 'react';

import { TaskItem } from './TaskTimeline';
import styles from './TaskTimeline.module.less';

type ScaleHeader = {
  row1: { label: string; width: number }[];
  row2: { label: string; width: number }[];
};

type Body = {
  count: number;
  bars: {
    style: CSSProperties;
    actualStyle: CSSProperties | undefined;
    label: string;
    color: string;
    task: TaskItem;
    parentStyle?: CSSProperties;
  }[];
};

type Props = {
  scale: 'day' | 'month' | 'year';
  data: { id: string; name: string; tasks: TaskItem[] }[];
  onClickTask: (task: TaskItem) => void;
};

const RightPanel = (props: Props) => {
  const { scale, data, onClickTask } = props;

  const [header, setHeader] = useState<ScaleHeader>({
    row1: [],
    row2: [],
  });
  const [body, setBody] = useState<Body>({
    count: 0,
    bars: [],
  });
  const [timeFrame, setTimeFrame] = useState<{
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
  }>({
    start: dayjs().startOf('month'),
    end: dayjs().endOf('month'),
  });

  useEffect(() => {
    handleUpdateTimeFrame();
  }, [data]);

  useEffect(() => {
    handleUpdateHeader();
    handleUpdateBody();
  }, [data, scale, timeFrame]);

  const handleUpdateTimeFrame = () => {
    const dates: number[] = [];

    const tasks = flatten(data.map((item) => item.tasks));

    tasks.forEach((task) => {
      const start = dayjs(task.startDate).toDate();
      const end = dayjs(task.endDate).toDate();

      dates.push(start.getTime());
      dates.push(end.getTime());

      if (task.actualStartDate && task.actualEndDate) {
        const actualStart = dayjs(task.actualStartDate).toDate();
        const actualEnd = dayjs(task.actualEndDate).toDate();

        dates.push(actualStart.getTime());
        dates.push(actualEnd.getTime());
      }
    });

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    setTimeFrame({
      start: dayjs(minDate),
      end: dayjs(maxDate),
    });
  };

  const handleUpdateHeader = () => {
    switch (scale) {
      case 'day': {
        handleSetDayScaleHeader();
        break;
      }

      case 'month': {
        handleSetMonthScaleHeader();
        break;
      }

      case 'year': {
        handleSetYearScaleHeader();
        break;
      }
    }
  };

  const handleSetDayScaleHeader = () => {
    const output: ScaleHeader = {
      row1: [],
      row2: [],
    };

    let date = timeFrame.start.clone();

    while (date.isSameOrBefore(timeFrame.end, 'day')) {
      output.row1.push({
        label: date.format('MMM D, YYYY'),
        width: config.day.width * 24,
      });

      for (let hour = 0; hour < 24; hour++) {
        const time = hour > 12 ? hour - 12 : hour || 12;
        const twelveHourClock = hour < 12 ? 'AM' : 'PM';

        output.row2.push({
          label: `${time} ${twelveHourClock}`,
          width: config.day.width,
        });
      }

      date = date.add(1, 'day');
    }

    setHeader(output);
  };

  const handleSetMonthScaleHeader = () => {
    const output: ScaleHeader = {
      row1: [],
      row2: [],
    };

    let date = timeFrame.start.clone();

    while (date.isBefore(timeFrame.end.endOf('month'))) {
      const daysInMonth = date.daysInMonth();

      output.row1.push({
        label: date.format('MMM YYYY'),
        width: config.month.width * daysInMonth,
      });

      for (let day = 1; day <= daysInMonth; day++) {
        output.row2.push({
          label: day.toString(),
          width: config.month.width,
        });
      }

      date = date.add(1, 'month');
    }

    setHeader(output);
  };

  const handleSetYearScaleHeader = () => {
    const output: ScaleHeader = {
      row1: [],
      row2: [],
    };

    let date = timeFrame.start.clone();

    while (date.isSameOrBefore(timeFrame.end, 'year')) {
      const daysInYear = date.isLeapYear() ? 366 : 365;

      output.row1.push({
        label: date.year().toString(),
        width: config.year.width * daysInYear,
      });

      for (let month = 0; month < 12; month++) {
        const monthDate = date.month(month);

        output.row2.push({
          label: monthDate.format('MMM'),
          width: config.year.width * monthDate.daysInMonth(),
        });
      }

      date = date.add(1, 'year');
    }

    setHeader(output);
  };

  const handleUpdateBody = () => {
    const output: Body = {
      count: 0,
      bars: [],
    };

    const timeScale = config[scale].scale;
    const width = config[scale].width;
    const timelineStart =
      scale === 'year'
        ? timeFrame.start.startOf('year')
        : scale === 'month'
        ? timeFrame.start.startOf('month')
        : timeFrame.start.startOf('day');

    let barOffsetTop = 0;

    data.forEach((item) => {
      output.count += item.tasks.length || 2;

      item.tasks.forEach((task) => {
        const parentBar = generateBar({
          task,
          barOffsetTop,
          timelineStart,
          timeScale,
          width,
        });

        output.bars.push(parentBar);

        barOffsetTop++;

        task.subtasks?.forEach((subtask) => {
          output.count++;

          const subtaskBar = generateBar({
            task: subtask,
            barOffsetTop,
            timelineStart,
            timeScale,
            width,
            parent: task,
          });

          output.bars.push(subtaskBar);

          barOffsetTop++;
        });
      });
    });

    setBody(output);
  };

  const generateBar = ({
    task,
    barOffsetTop,
    timeScale,
    width,
    timelineStart,
    parent,
  }: {
    task: TaskItem;
    barOffsetTop: number;
    timeScale: 'day' | 'hour';
    width: number;
    timelineStart: dayjs.Dayjs;
    parent?: TaskItem;
  }) => {
    const start = dayjs(task.startDate);
    const end = dayjs(task.endDate);
    const actualStart = task.actualStartDate
      ? dayjs(task.actualStartDate)
      : null;
    const actualEnd = task.actualEndDate ? dayjs(task.actualEndDate) : null;
    const parentStart = parent?.startDate ? dayjs(parent.startDate) : null;
    const parentEnd = parent?.endDate ? dayjs(parent.endDate) : null;

    return {
      label: task.name,
      color: task.color || 'gray',
      style: {
        width: end.diff(start, timeScale, true) * width,
        top: `${barOffsetTop * 2}rem`,
        left: start.diff(timelineStart, timeScale, true) * width,
      },
      actualStyle:
        actualStart && actualEnd
          ? {
              top: `${barOffsetTop * 2 + 1.5}rem`,
              left: actualStart.diff(timelineStart, timeScale, true) * width,
              width:
                actualEnd.diff(actualStart, timeScale, true) * width || width,
            }
          : undefined,
      task,
      parentStyle:
        parentStart && parentEnd
          ? {
              width:
                parentEnd.diff(parentStart, timeScale, true) * width || width,
              left: parentStart.diff(timelineStart, timeScale, true) * width,
              top: `${barOffsetTop * 2}rem`,
            }
          : undefined,
    };
  };

  return (
    <div className="overflow-auto">
      <div className="min-w-fit">
        <div className="divide-y divide-gray-300 border-y border-r border-gray-300">
          <div className={styles.row}>
            {header.row1.map((item) => (
              <div
                key={item.label}
                className={styles.head}
                style={{ width: item.width }}
              >
                {item.label}
              </div>
            ))}
          </div>

          <div className={styles.row}>
            {header.row2.map((row, index) => (
              <div
                key={`${row.label}-${index}`}
                className={styles.head}
                style={{ width: row.width }}
              >
                {row.label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative border-y border-r border-gray-300">
          {body.bars.map((bar, index) => (
            <Fragment key={`${bar.label}-${index}`}>
              {bar.parentStyle && (
                <div className={styles['bar-parent']} style={bar.parentStyle} />
              )}

              <div
                className={`${styles.bar} ${bar.color} cursor-pointer`}
                style={bar.style}
                onClick={() => onClickTask(bar.task)}
              >
                <span>{bar.label}</span>
              </div>

              {bar.actualStyle && (
                <div
                  className={`${styles['bar-actual']} ${bar.color}`}
                  style={bar.actualStyle}
                />
              )}
            </Fragment>
          ))}

          {Array.from({ length: body.count }).map((_, index) => (
            <div key={index} className={`${styles.row} even:bg-gray-100`} />
          ))}
        </div>
      </div>
    </div>
  );
};

const config = {
  day: {
    width: 60,
    scale: 'hour',
  },
  month: {
    width: 30,
    scale: 'day',
  },
  year: {
    width: 5,
    scale: 'day',
  },
} as const;

export default RightPanel;
