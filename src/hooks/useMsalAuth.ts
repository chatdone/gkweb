import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';

import Configs from '@/configs';

const useMsalAuth = () => {
  const { instance: msalInstance, inProgress } = useMsal();

  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
    msalInstance as PublicClientApplication,
    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      account: msalInstance.getActiveAccount()!,
      scopes: Configs.msal.SCOPES,
      interactionType: InteractionType.Popup,
    },
  );

  const login = async () => {
    const res = await msalInstance.loginPopup({
      scopes: Configs.msal.SCOPES,
      prompt: 'select_account',
    });

    if (res?.account) {
      msalInstance.setActiveAccount(res.account);
    }
  };

  const loginRedirect = () => {
    msalInstance.loginRedirect({
      scopes: Configs.msal.SCOPES,
      prompt: 'select_account',
    });
  };

  const logout = async () => {
    await msalInstance.logoutPopup({
      account: getActiveAccount(),
    });
    await msalInstance.setActiveAccount(null);
  };

  const getActiveAccount = () => {
    return msalInstance.getActiveAccount();
  };

  return {
    login,
    loginRedirect,
    logout,
    authProvider,
    inProgress,
    getActiveAccount,
  };
};

export default useMsalAuth;
