import {
  AuthenticationResult,
  Configuration,
  EventType,
  InteractionType,
  PublicClientApplication,
} from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import type { ReactNode } from 'react';

import Configs from '@/configs';

const configuration: Configuration = {
  auth: {
    clientId: Configs.msal.APP_ID,
    redirectUri: Configs.msal.REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
};

const msalInstance = new PublicClientApplication(configuration);

const activeAccount = msalInstance.getActiveAccount();
const accounts = msalInstance.getAllAccounts();
if (!activeAccount && accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event) => {
  if (
    event.interactionType === InteractionType.Redirect &&
    event.eventType === EventType.LOGIN_SUCCESS &&
    event?.payload
  ) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const MsalProviderWithInstance = ({ children }: { children: ReactNode }) => {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export default MsalProviderWithInstance;
