import type { User as Auth0User } from '@auth0/auth0-react';
import Cookies from 'js-cookie';

import Configs from '@/configs';

export type SessionInfo = {
  token: string;
  user: Auth0User;
};

const { SESSION_COOKIE_KEY } = Configs.session;

const useAuth0Session = () => {
  const getToken = (): string | null => {
    const jsonString = Cookies.get(SESSION_COOKIE_KEY);
    if (!jsonString) {
      return null;
    }

    const sessionInfo = JSON.parse(jsonString);
    const { token } = sessionInfo;
    return token;
    // return 'LreVvSvwfQBSf8HVqc5PfPkeZOJ2my4mmvSsdHGFfXZw0ditYXET1bHJ8qCYrDTFefe0NGxkh62HER6N4YuZEcMMeSqs491OXvgyW2dwzJ7HfCFn93tZY5IIZLxBXkmB3SqeggVDaOVSXKjRYpX0zS3l6jWNz7moBbLszkL1PjS7ziAv3U6pd3SJHKR0RjIcyzIfSzr66QV9t0MOisQJvBLzRWhew4dNCcn27GOGeliNq8KNjGl2RpewVLVof7S1';
  };

  const getSession = (): unknown => {
    try {
      const jsonString = Cookies.get(SESSION_COOKIE_KEY);
      if (!jsonString) {
        return null;
      }

      const sessionInfo = JSON.parse(jsonString);

      return sessionInfo;
    } catch (error) {
      return null;
    }
    // return {
    //   token:
    //     'LreVvSvwfQBSf8HVqc5PfPkeZOJ2my4mmvSsdHGFfXZw0ditYXET1bHJ8qCYrDTFefe0NGxkh62HER6N4YuZEcMMeSqs491OXvgyW2dwzJ7HfCFn93tZY5IIZLxBXkmB3SqeggVDaOVSXKjRYpX0zS3l6jWNz7moBbLszkL1PjS7ziAv3U6pd3SJHKR0RjIcyzIfSzr66QV9t0MOisQJvBLzRWhew4dNCcn27GOGeliNq8KNjGl2RpewVLVof7S1',
    //   user: {
    //     name: 'Woon',
    //     nickname: 'Woon',
    //     picture:
    //       'https://gokudos-dev-public.s3.ap-southeast-1.amazonaws.com/images/production/bad0c9dd-d4ee-11eb-82fe-06d34cda4c54/dce509ba-6a2a-47d0-8742-3a335081abdc.png',
    //     email: 'woon@6biz.ai',
    //     email_verified: true,
    //     updated_at: '2023-04-14 02:49:35',
    //   },
    // };
  };

  const setSession = ({ token, user }: { token: string; user: Auth0User }) => {
    Cookies.set(
      SESSION_COOKIE_KEY,
      // '80f92d6b-54ed-4473-8fba-e01a80853a39',
      JSON.stringify({
        token,
        user,
      }),
    );
  };

  const clearSession = () => {
    Cookies.remove(SESSION_COOKIE_KEY);
  };

  return {
    getSession,
    setSession,
    clearSession,
    getToken,
  };
};

export default useAuth0Session;
