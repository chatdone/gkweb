import { gql, useMutation, useQuery } from '@apollo/client';
import { Modal, Space, Typography, Grid } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

import Message from '../../../Message';
import styles from './AttendanceClockInModal.module.less';
import AttendanceForm, { FormValues } from './AttendanceForm';

import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';
import { alphabeticalSort } from '@/utils/sorter.utils';

import Icons from '@/assets/icons';

import { BaseModalConfig, SelectOption } from '@/types';

import {
  AttendanceType,
  HeaderQuery,
  CloseAttendanceEntryMutation,
  CloseAttendanceEntryMutationVariables,
  AttendanceClockInModalQuery,
  AttendanceClockInModalQueryVariables,
  StartAttendanceEntryMutation,
  StartAttendanceEntryMutationVariables,
} from 'generated/graphql-types';

type Props = BaseModalConfig & {
  currentAttendance: HeaderQuery['currentAttendance'];
  onClockAttendanceSuccess: () => void;
};

type ClockType = 'in' | 'break' | 'out';

export const AttendanceClockInModal = (props: Props) => {
  const { currentAttendance, onCancel, onClockAttendanceSuccess, visible } =
    props;

  const { activeCompany, getCurrentMember } = useAppStore();

  const activeCompanyMember = getCurrentMember();

  const { data: queryAttendanceData } = useQuery<
    AttendanceClockInModalQuery,
    AttendanceClockInModalQueryVariables
  >(attendanceClockInModalQuery, {
    variables: {
      companyId: activeCompany?.id as string,
    },
    skip: !activeCompany?.id,
  });
  const [
    mutateStartAttendanceEntry,
    { loading: mutateStartAttendanceEntryLoading },
  ] = useMutation<
    StartAttendanceEntryMutation,
    StartAttendanceEntryMutationVariables
  >(startAttendanceEntryMutation);
  const [
    mutateCloseAttendanceEntry,
    { loading: mutateCloseAttendanceEntryLoading },
  ] = useMutation<
    CloseAttendanceEntryMutation,
    CloseAttendanceEntryMutationVariables
  >(closeAttendanceEntryMutation);

  const [activeType, setActiveType] = useState<ClockType>('in');

  const timezone = 'Asia/Kuala_Lumpur';

  useEffect(() => {
    if (currentAttendance) {
      setActiveType('out');
    } else {
      setActiveType('in');
    }
  }, [currentAttendance]);

  const handleUpdateActiveType = (type: ClockType) => {
    setActiveType(type);
  };

  const handleSubmitForm = (values: FormValues) => {
    if (activeType !== 'out') {
      handleStartAttendanceEntry(values);
    } else {
      handleCloseAttendanceEntry(values);
    }
  };

  const handleStartAttendanceEntry = async (values: FormValues) => {
    if (!activeCompanyMember?.id) {
      return;
    }

    try {
      const res = await mutateStartAttendanceEntry({
        variables: {
          companyMemberId: activeCompanyMember.id,
          labelId: values.labelId,
          locationId: values.locationId,
          contactId: values.contactId,
          input: {
            type:
              activeType === 'break'
                ? AttendanceType.Break
                : AttendanceType.Clock,
            comments: values.comments,
          },
        },
      });

      if (!res.errors) {
        onClockAttendanceSuccess();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to start attendance',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseAttendanceEntry = async (values: FormValues) => {
    if (!activeCompanyMember?.id) {
      return;
    }

    try {
      const res = await mutateCloseAttendanceEntry({
        variables: {
          companyMemberId: activeCompanyMember.id,
          commentsOut: values.comments,
        },
      });

      if (!res.errors) {
        onClockAttendanceSuccess();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to close attendance',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAttendanceLabelOptions = (): SelectOption[] => {
    if (!queryAttendanceData?.attendanceLabels) {
      return [];
    }

    return queryAttendanceData.attendanceLabels
      .filter((label) => !label?.archived)
      .map((label) => ({
        label: label?.name,
        value: label?.id as string,
      }))
      .sort(alphabeticalSort('label'));
  };

  const getLocationOptions = (): SelectOption[] => {
    if (!queryAttendanceData?.locations) {
      return [];
    }

    return queryAttendanceData.locations
      .filter((label) => !label?.archived)
      .map((label) => ({
        label: label?.name,
        value: label?.id as string,
      }))
      .sort(alphabeticalSort('label'));
  };

  const getContactOptions = (): SelectOption[] => {
    if (!queryAttendanceData?.contacts) {
      return [];
    }

    return queryAttendanceData.contacts
      .map((label) => ({
        label: label?.name,
        value: label?.id as string,
      }))
      .sort(alphabeticalSort('label'));
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      okText={'Save'}
      title={
        activeType === 'in'
          ? 'Clock In'
          : activeType === 'break'
          ? 'Break'
          : 'Clock Out'
      }
      footer={null}
    >
      <Space className={styles.wrapper} direction="vertical">
        <Grid.Row className={styles['btn-group']} justify="space-between">
          <AttendanceTypeButton
            label="Clock In"
            imgSrc={Icons.clockIn}
            active={activeType === 'in'}
            onClick={() => handleUpdateActiveType('in')}
          />
          <AttendanceTypeButton
            label="Break"
            imgSrc={Icons.clockBreak}
            active={activeType === 'break'}
            onClick={() => handleUpdateActiveType('break')}
          />
          <AttendanceTypeButton
            label="Clock Out"
            imgSrc={Icons.clockOut}
            active={activeType === 'out'}
            onClick={() => handleUpdateActiveType('out')}
          />
        </Grid.Row>

        <AttendanceForm
          activeType={activeType}
          locationOptions={getLocationOptions()}
          attendanceLabelOptions={getAttendanceLabelOptions()}
          contactOptions={getContactOptions()}
          timezone={timezone}
          onSubmit={handleSubmitForm}
          onCancel={onCancel}
          loading={
            mutateStartAttendanceEntryLoading ||
            mutateCloseAttendanceEntryLoading
          }
        />
      </Space>
    </Modal>
  );
};

const AttendanceTypeButton = ({
  label,
  active,
  imgSrc,
  onClick,
}: {
  label: string;
  active: boolean;
  imgSrc: string;
  onClick: () => void;
}) => {
  return (
    <div
      className={`${styles['attendance-type-btn']} ${
        active ? styles['active'] : ''
      }`}
      onClick={onClick}
    >
      <Grid.Row justify="center">
        <Space direction="vertical">
          <img src={imgSrc} alt={label} />

          <Typography.Text>{label}</Typography.Text>
        </Space>
      </Grid.Row>
    </div>
  );
};

const attendanceClockInModalQuery = gql`
  query AttendanceClockInModal($companyId: ID!) {
    attendanceLabels(companyId: $companyId) {
      id
      name
      color
      archived
    }
    locations(companyId: $companyId) {
      id
      name
      archived
    }
    attendanceSettings(companyId: $companyId) {
      allowWeb
    }
    contacts(companyId: $companyId) {
      id
      name
    }
  }
`;

const startAttendanceEntryMutation = gql`
  mutation StartAttendanceEntry(
    $companyMemberId: ID!
    $input: StartAttendanceEntryInput!
    $locationId: ID
    $labelId: ID
    $contactId: ID
  ) {
    startAttendanceEntry(
      companyMemberId: $companyMemberId
      input: $input
      locationId: $locationId
      labelId: $labelId
      contactId: $contactId
    ) {
      id
    }
  }
`;

const closeAttendanceEntryMutation = gql`
  mutation CloseAttendanceEntry($companyMemberId: ID!, $commentsOut: String) {
    closeAttendance(
      companyMemberId: $companyMemberId
      commentsOut: $commentsOut
    ) {
      id
    }
  }
`;
