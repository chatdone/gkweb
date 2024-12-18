import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Card,
  Space,
  Switch,
  Typography,
  Tooltip,
  Checkbox,
} from '@arco-design/web-react';
import { ReactNode } from 'react';
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdFaceUnlock,
  MdFingerprint,
  MdOutlineInfo,
} from 'react-icons/md';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';

import styles from './CompanyPoliciesPage.module.less';

import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';

import {
  CompanyMemberType,
  UpdateAttendanceSettingsInput,
  CompanyPoliciesPageQuery,
  CompanyPoliciesPageQueryVariables,
  UpdateAttendanceSettingsMutation,
  UpdateAttendanceSettingsMutationVariables,
} from 'generated/graphql-types';

const CompanyPoliciesPage = () => {
  const { activeCompany, getCurrentMember } = useAppStore();

  const currentMember = getCurrentMember();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    CompanyPoliciesPageQuery,
    CompanyPoliciesPageQueryVariables
  >(companyPoliciesPageQuery, {
    variables: {
      companyId: activeCompany?.id as string,
    },
    skip: !activeCompany?.id,
  });
  const [mutateUpdateAttendanceSettings] = useMutation<
    UpdateAttendanceSettingsMutation,
    UpdateAttendanceSettingsMutationVariables
  >(updateAttendanceSettingsMutation);

  const canEdit = currentMember?.type !== CompanyMemberType.Member;

  const handleUpdateAttendanceSetting = async (
    field: keyof UpdateAttendanceSettingsInput,
    value: boolean,
  ) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateUpdateAttendanceSettings({
        variables: {
          companyId: activeCompany.id,
          input: {
            [field]: value,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update setting',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Setting',
          },
          {
            name: 'Time Attendance',
          },
          {
            name: 'Policies',
          },
        ]}
      />

      <Card className={styles.wrapper}>
        <Typography.Paragraph className={styles['page-title']}>
          Policies
        </Typography.Paragraph>

        <div className={styles['content-wrapper']}>
          <Space direction="vertical" size={30}>
            <div>
              <SectionHeading
                title="Device restrictions"
                subtitle="Select the devices that members and managers are allowed to clock in and clock out"
              />

              <Space direction="vertical" size={15}>
                <PolicyCard
                  title="Mobile Apps"
                  tooltip="Toggle on if you allow users to clock in/out using the mobile apps."
                  description="Allow members and managers to clock in/out through application downloaded from Google Play Store or Apple App Store"
                  checked={!!queryData?.attendanceSettings?.allow_mobile}
                  onChange={(value) =>
                    handleUpdateAttendanceSetting('allow_mobile', value)
                  }
                  disabled={!canEdit}
                />

                <PolicyCard
                  title="Web Browser"
                  tooltip="Toggle on if you allow users to clock in/out using the web browser."
                  description="Access from devices with web browser such as Chrome, Safari, Firefox, Opera, Edge and etc."
                  checked={!!queryData?.attendanceSettings?.allow_web}
                  onChange={(value) =>
                    handleUpdateAttendanceSetting('allow_web', value)
                  }
                  disabled={!canEdit}
                />
              </Space>
            </div>

            <div>
              <SectionHeading
                title="Verification requirements"
                subtitle="Require members and managers to clock in with additional verification methods in Mobile Apps."
              />

              <Space direction="vertical" size={15}>
                <PolicyCard
                  title="Required verification on clock in option"
                  tooltip="Toggle on if you require users to verify upon clocking in. This feature is only available in the mobile apps."
                  checked={
                    !!queryData?.attendanceSettings?.require_verification
                  }
                  onChange={(value) =>
                    handleUpdateAttendanceSetting('require_verification', value)
                  }
                  disabled={!canEdit}
                >
                  {queryData?.attendanceSettings?.require_verification && (
                    <Space size={20}>
                      <ClockInOptionCheckbox
                        icon={<MdFaceUnlock className={styles.icon} />}
                        title="Facial Recognition"
                        description="Optional Facial (2D) verification"
                        checked={!!queryData?.attendanceSettings?.enable_2d}
                        onChange={(value) =>
                          handleUpdateAttendanceSetting('enable_2d', value)
                        }
                        disabled={!canEdit}
                      />

                      <ClockInOptionCheckbox
                        icon={<MdFingerprint className={styles.icon} />}
                        title="Biometric phone recognition"
                        description="Optional biometric phone verification"
                        checked={
                          !!queryData?.attendanceSettings?.enable_biometric
                        }
                        onChange={(value) =>
                          handleUpdateAttendanceSetting(
                            'enable_biometric',
                            value,
                          )
                        }
                        disabled={!canEdit}
                      />
                    </Space>
                  )}
                </PolicyCard>

                <PolicyCard
                  title="Required location verification on clock in option"
                  tooltip="Toggle on if you require users to verify the location upon clocking in. This feature is only available in the mobile apps."
                  checked={!!queryData?.attendanceSettings?.require_location}
                  onChange={(value) =>
                    handleUpdateAttendanceSetting('require_location', value)
                  }
                  disabled={!canEdit}
                />
              </Space>
            </div>
          </Space>
        </div>
      </Card>
    </>
  );
};

const SectionHeading = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className={styles['section-header']}>
      <Typography.Paragraph className={styles.title}>
        {title}
      </Typography.Paragraph>
      <Typography.Paragraph>{subtitle}</Typography.Paragraph>
    </div>
  );
};

const PolicyCard = ({
  title,
  tooltip,
  checked,
  onChange,
  description,
  children,
  disabled,
}: {
  title: string;
  tooltip: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  description?: string;
  children?: ReactNode;
  disabled?: boolean;
}) => {
  return (
    <div className={styles['policy-card']}>
      <div
        className={`${styles['title-container']} ${
          children ? styles['with-children'] : ''
        }`}
      >
        <div>
          <Space>
            <Typography.Text className={styles.title}>{title}</Typography.Text>

            <Tooltip content={tooltip}>
              <MdOutlineInfo className={styles['tooltip-icon']} />
            </Tooltip>
          </Space>

          {description && (
            <Typography.Paragraph>{description}</Typography.Paragraph>
          )}
        </div>

        <Switch checked={checked} onChange={onChange} disabled={disabled} />
      </div>

      {children}
    </div>
  );
};

const ClockInOptionCheckbox = ({
  icon,
  title,
  description,
  checked,
  onChange,
  disabled,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <Checkbox checked={checked} onChange={onChange} disabled={disabled}>
      {({ checked }) => (
        <div
          className={`${styles['clock-in-option-card']} ${
            disabled ? styles.disabled : ''
          }`}
        >
          {checked ? (
            <MdCheckBox className={`${styles.checkbox} ${styles.checked}`} />
          ) : (
            <MdCheckBoxOutlineBlank className={styles.checkbox} />
          )}

          <Space direction="vertical">
            {icon}

            <Typography.Paragraph className={styles.title}>
              {title}
            </Typography.Paragraph>

            <Typography.Paragraph>{description}</Typography.Paragraph>
          </Space>
        </div>
      )}
    </Checkbox>
  );
};

const fragment = gql`
  fragment AttendanceSettingsFragment on AttendanceSettings {
    allow_mobile
    allow_web
    require_verification
    require_location
    enable_2d
    enable_biometric
  }
`;

const companyPoliciesPageQuery = gql`
  query CompanyPoliciesPage($companyId: ID!) {
    attendanceSettings(companyId: $companyId) {
      ...AttendanceSettingsFragment
    }
  }
  ${fragment}
`;

const updateAttendanceSettingsMutation = gql`
  mutation UpdateAttendanceSettings(
    $companyId: ID!
    $input: UpdateAttendanceSettingsInput!
  ) {
    updateAttendanceSettings(companyId: $companyId, input: $input) {
      ...AttendanceSettingsFragment
    }
  }
  ${fragment}
`;

export default CompanyPoliciesPage;
