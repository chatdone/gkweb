import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type Props = {
  date: Date | null | undefined;
};

const useDuration = (props: Props) => {
  const { date } = props;

  const [duration, setDuration] = useState<string>('00:00:00');

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (!date) {
      setDuration('00:00:00');
    } else {
      interval = setInterval(() => {
        const duration = dayjs.duration(dayjs().diff(dayjs(date)));

        const totalHours = Math.floor(duration.asHours());
        const totalMinutes = duration.minutes();
        const remainingSeconds = duration.seconds();

        const totalHoursString = `${totalHours}`.padStart(2, '0');
        const totalMinutesString = `${totalMinutes}`.padStart(2, '0');
        const remainingSecondsString = `${remainingSeconds}`.padStart(2, '0');

        setDuration(
          `${totalHoursString}:${totalMinutesString}:${remainingSecondsString}`,
        );
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [date]);

  return { duration };
};

export default useDuration;
