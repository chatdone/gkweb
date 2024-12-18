import { AppState, Auth0Provider } from '@auth0/auth0-react';
import type { ReactNode } from 'react';

import { useAppStore } from '@/stores/useAppStore';

const Auth0ProviderWithHistory = ({ children }: { children: ReactNode }) => {
  const { setReturnTo } = useAppStore();

  const handleRedirectCallback = (appState?: AppState) => {
    setReturnTo(appState?.returnTo);
  };

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_TENANT}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      redirectUri={`${window.location.origin}/login`}
      scope={'openid profile email offline_access'}
      onRedirectCallback={handleRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
