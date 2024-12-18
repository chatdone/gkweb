import { gql } from '@apollo/client';
import { Button, ButtonProps, Space, Typography } from '@arco-design/web-react';
import loadable from '@loadable/component';
import dayjs from 'dayjs';
import {
  MdAlarmOff,
  MdOutlineAlarmOn,
  MdOutlineFreeBreakfast,
  MdOutlineLocationOn,
} from 'react-icons/md';

import Modal from '../../../Modal';
import styles from './AttendanceClockIn.module.less';

import { useDuration, useDisclosure } from '@/hooks';

import { AttendanceType, HeaderQuery } from 'generated/graphql-types';

const AttendanceClockInModal = loadable(
  () => import('../AttendanceClockInModal'),
);
const CompanyTag = loadable(() => import('../../../CompanyTag'));

export const attendanceClockInFragments = {
  attendance: gql`
    fragment AttendanceClockInAttendanceFragment on Attendance {
      id
      startDate
      type
      label {
        id
        name
        color
      }
    }
  `,
  attendanceSettings: gql`
    fragment AttendanceClockInAttendanceSettingsFragment on AttendanceSettings {
      allowWeb
    }
  `,
};

type Props = {
  buttonProps: ButtonProps;
  currentAttendance: HeaderQuery['currentAttendance'];
  attendanceSettings: HeaderQuery['attendanceSettings'];
  refetchQuery: () => void;
};

const AttendanceClockIn = (props: Props) => {
  const { buttonProps, currentAttendance, attendanceSettings, refetchQuery } =
    props;

  const { duration } = useDuration({
    date: dayjs(currentAttendance?.startDate).toDate(),
  });

  const { visible, onClose, onOpen } = useDisclosure();

  const handleBeforeStartClockIn = () => {
    if (!attendanceSettings?.allowWeb) {
      Modal.info({
        title: 'Device Restricted',
        content: (
          <div style={{ textAlign: 'center' }}>
            Web is restricted to clock in based on the company's policies
          </div>
        ),
      });

      return;
    }

    onOpen();
  };

  const handleSuccessClockAttendance = () => {
    refetchQuery();

    onClose();
  };

  return (
    <>
      {currentAttendance ? (
        <Button className={styles['button-container']} onClick={onOpen}>
          <Space className={styles['attendance-clock-in-container']}>
            <MdOutlineAlarmOn className={styles['start']} />

            {currentAttendance.type === AttendanceType.Break && (
              <MdOutlineFreeBreakfast />
            )}

            <Typography.Text>{duration}</Typography.Text>

            {currentAttendance?.type === AttendanceType.Break && (
              <CompanyTag className={styles['break-tag']}>Break</CompanyTag>
            )}

            {currentAttendance?.label?.name && (
              <CompanyTag
                icon={
                  <MdOutlineLocationOn
                    style={{
                      color: currentAttendance?.label?.color || 'initial',
                    }}
                    className={styles['company-tag-icon']}
                  />
                }
                key={currentAttendance?.label?.name}
                color={currentAttendance?.label?.color as string}
              >
                {currentAttendance?.label?.name}
              </CompanyTag>
            )}

            <MdAlarmOff className={styles['stop']} />
          </Space>
        </Button>
      ) : (
        <Button {...buttonProps} onClick={handleBeforeStartClockIn} />
      )}

      <AttendanceClockInModal
        currentAttendance={currentAttendance}
        visible={visible}
        onCancel={onClose}
        onClockAttendanceSuccess={handleSuccessClockAttendance}
      />
    </>
  );
};

export default AttendanceClockIn;
