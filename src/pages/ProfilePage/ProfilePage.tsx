import { gql, useMutation, useQuery } from '@apollo/client';
import { Card, Space, Typography, Button, Grid } from '@arco-design/web-react';
import { useState } from 'react';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';

import styles from './ProfilePage.module.less';
import UserProfileForm, {
  userProfileFormFragment,
  FormValues,
} from './UserProfileForm';

import { useAppStore } from '@/stores/useAppStore';

import { Auth0Service } from '@/services';

import i18n from '@/i18n';

import {
  ProfilePageQuery,
  ProfilePageQueryVariables,
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  SetDefaultUserTimezoneMutation,
  SetDefaultUserTimezoneMutationVariables,
  UploadProfileImageMutation,
  UploadProfileImageMutationVariables,
} from 'generated/graphql-types';

const ProfilePage = () => {
  const { reloadUser } = useAppStore();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    ProfilePageQuery,
    ProfilePageQueryVariables
  >(profilePageQuery);
  const [mutateUpdateProfile, { loading: mutateUpdateProfileLoading }] =
    useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(
      updateProfileMutation,
    );
  const [
    mutateSetDefaultUserTimezone,
    { loading: mutateSetDefaultUserTimezoneLoading },
  ] = useMutation<
    SetDefaultUserTimezoneMutation,
    SetDefaultUserTimezoneMutationVariables
  >(updateUserTimezoneMutation);
  const [
    mutateUploadProfileImage,
    { loading: mutateUploadProfileImageLoading },
  ] = useMutation<
    UploadProfileImageMutation,
    UploadProfileImageMutationVariables
  >(uploadProfileImageMutation);

  const [resetPasswordLoading, setResetPasswordLoading] =
    useState<boolean>(false);

  const handleUpdateProfile = async (values: FormValues) => {
    try {
      let shouldRefetch = false;

      const res = await mutateUpdateProfile({
        variables: {
          input: {
            name: values.name.trim(),
            contact_no: values.contactNo,
          },
        },
      });

      if (!res.errors) {
        shouldRefetch = true;
      } else {
        Message.error(i18n.t('errors.requestError'));
      }

      if (values.timezone) {
        const updateTimezoneRes = await mutateSetDefaultUserTimezone({
          variables: {
            timezone: values.timezone,
          },
        });

        if (!updateTimezoneRes.errors) {
          shouldRefetch = true;
        } else {
          Message.error(i18n.t('errors.requestError'));
        }
      }

      if (values.profileImage && typeof values.profileImage === 'object') {
        const uploadProfileImageRes = await mutateUploadProfileImage({
          variables: {
            attachment: values.profileImage,
          },
        });

        if (!uploadProfileImageRes.errors) {
          shouldRefetch = true;
        } else {
          Message.error(i18n.t('errors.requestError'));
        }
      }

      if (shouldRefetch) {
        refetchQuery();
        reloadUser();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = async () => {
    if (!queryData?.currentUser?.email) {
      return;
    }

    setResetPasswordLoading(true);

    try {
      await Auth0Service.sendChangePasswordEmail(queryData.currentUser.email);

      Message.success("We've just sent you an email to reset your password.");
    } catch (error) {
      console.error(error);
    } finally {
      setResetPasswordLoading(false);
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
            name: 'My Profile',
          },
        ]}
      />

      <Space className={styles.wrapper} direction="vertical" size={20}>
        <Card className={styles['profile-card']}>
          <UserProfileForm
            user={queryData?.currentUser}
            onSubmit={handleUpdateProfile}
            loading={
              mutateUpdateProfileLoading ||
              mutateSetDefaultUserTimezoneLoading ||
              mutateUploadProfileImageLoading
            }
          />
        </Card>

        <Card className={styles['reset-password-card']}>
          <Grid.Row className={styles.container} justify="space-between">
            <div>
              <Typography.Paragraph className={styles.title}>
                Password
              </Typography.Paragraph>
              <Typography.Paragraph>
                We will send you an email to reset your password in GoKudos.
              </Typography.Paragraph>
            </div>

            <Button
              className={styles['theme-btn-text']}
              type="text"
              loading={resetPasswordLoading}
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </Grid.Row>
        </Card>
      </Space>
    </>
  );
};

const profilePageQuery = gql`
  query ProfilePage {
    currentUser {
      ...UserProfileFormFragment
    }
  }
  ${userProfileFormFragment}
`;

const updateProfileMutation = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
    }
  }
`;

const updateUserTimezoneMutation = gql`
  mutation SetDefaultUserTimezone($timezone: String!) {
    setDefaultUserTimezone(timezone: $timezone) {
      id
    }
  }
`;

const uploadProfileImageMutation = gql`
  mutation UploadProfileImage($attachment: Upload!) {
    uploadProfileImage(attachment: $attachment) {
      id
    }
  }
`;

export default ProfilePage;
