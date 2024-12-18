import { Button } from '@arco-design/web-react';
import { MdOutlinePause, MdOutlinePlayArrow } from 'react-icons/md';

import { useDuration } from '@/hooks';

import { Timesheet } from 'generated/graphql-types';

type Props = {
  timesheets: (Timesheet | null)[] | undefined;
  onStart: () => void;
  onStop: (timesheet: Timesheet | null) => void;
};

const TimeTracking = (props: Props) => {
  const { timesheets, onStart, onStop } = props;

  const activeTimesheet = timesheets?.find((timesheet) => !timesheet?.endDate);

  const { duration } = useDuration({
    date: activeTimesheet?.startDate,
  });

  return (
    <Button
      className="w-full text-center"
      size="mini"
      icon={activeTimesheet ? <MdOutlinePause /> : <MdOutlinePlayArrow />}
      type={activeTimesheet ? 'primary' : 'secondary'}
      status={activeTimesheet ? 'success' : undefined}
      onClick={() => (activeTimesheet ? onStop(activeTimesheet) : onStart())}
    >
      {activeTimesheet ? duration : 'Start'}
    </Button>
  );
};

export default TimeTracking;
