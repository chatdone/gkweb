import { useMutation, gql } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import Message from '@/components/Message';

import Loader from '../../navigation/Loader';

import useAuth0Session from '@/hooks/useAuth0Session';
import { useAppStore } from '@/stores/useAppStore';

import {
  navigateHomePage,
  navigateOnboardingPage,
  navigateVerifyEmailPage,
} from '@/navigation';

import Configs from '@/configs';

import { userProfileFragment } from '@/fragments';

import { User } from 'generated/graphql-types';

const LoginPage = () => {
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();
  const state = location.state as { retryLogin?: boolean };
  const {
    user,
    isAuthenticated,
    getIdTokenClaims,
    loginWithRedirect,
    isLoading: isAuth0Loading,
    error: auth0Error,
  } = useAuth0();
  const { setSession } = useAuth0Session();

  const { setCurrentUser, clearSession, returnTo, setReturnTo } = useAppStore();

  const [mutateLoginUser, { data, error }] = useMutation(loginUserMutation);

  // TODO: Handle failed API login

  useEffect(() => {
    if (!window.Cypress) {
      return;
    }

    const token = localStorage.getItem('auth0Cypress');

    if (token) {
      setSession({ token, user: {} });

      mutateLoginUser();
    }
  }, []);

  useEffect(() => {
    if (window.Cypress) {
      return;
    }

    async function getToken() {
      const idToken = (await getIdTokenClaims())?.__raw;
      if (idToken) {
        setSession({ token: idToken, user: user || {} });

        mutateLoginUser();
      } else {
        throw new Error('No id token available');
      }
    }

    if (!isAuth0Loading) {
      if (auth0Error && !state?.retryLogin) {
        console.log("error: ", auth0Error.message);

        const isEmailNotVerified =
          auth0Error.message.match(new RegExp('verify', 'i')) &&
          auth0Error.message.match(new RegExp('email', 'i'));
        const isInvalidState = auth0Error.message.match(
          new RegExp('invalid state', 'i'),
        );

        if (isEmailNotVerified) {
          const email = auth0Error.message.match(/\((.*)\)/i)?.[1] as string;

          navigateVerifyEmailPage(navigate, email);
        } else if (isInvalidState) {
          setSearchParams(
            {},
            {
              replace: true,
            },
          );

          navigate(0);
        } else {
          Message.error(auth0Error.message, {
            title: `Failed to login ${auth0Error.message}`,
            duration: 0,
          });
        }
      } else {
        if (isAuthenticated) {
          getToken();
        } else {
          clearSession();
          loginWithRedirect();
        }
      }
    }
  }, [isAuthenticated, isAuth0Loading, auth0Error, state]);

  useEffect(() => {
    if (data) {
      const { loginUser } = data;
      handleLoginSuccess(loginUser);
    } else if (error) {
      console.error(error);
    }
  }, [data, error]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);

    if (shouldRunOnboarding(user)) {
      navigateOnboardingPage(navigate);
    } else {
      if (returnTo) {
        navigate(returnTo);

        setReturnTo(undefined);
      } else {
        const activeCompany = useAppStore.getState().activeCompany;

        if (user.companies?.length === 0) {
          navigate('/external/shared');
        } else {
          activeCompany?.slug && navigateHomePage(navigate, activeCompany.slug);
        }
      }
    }
  };

  const shouldRunOnboarding = (user: User) => {
    return (
      user.createdAt &&
      dayjs(user.createdAt).isAfter(Configs.v3ReleaseDate, 'day') &&
      user.signUpData?.inviteType !== 'member' &&
      !user.onboarding?.hasCompletedOnboarding
    );
  };

  if (isAuth0Loading) {
    return <></>;
  }

  return (
    <div>
      {!isAuthenticated && <Loader message="Redirecting you to login..." />}

      {isAuthenticated && <Loader />}
    </div>
  );
};

const loginUserMutation = gql`
  mutation LoginUserMutation {
    loginUser {
      ...UserProfileFragment
    }
  }
  ${userProfileFragment}
`;

export default LoginPage;
