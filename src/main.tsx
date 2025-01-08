import { ApolloProvider } from '@apollo/client';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import 'virtual:vite-plugin-sentry/sentry-config';

import ArcoConfig from './components/ArcoConfig';
import HubSpot from './components/HubSpot';
import ReloadPrompt from './components/ReloadPrompt';
import Router from './navigation/Router';
import Auth0ProviderWithHistory from './providers/Auth0ProviderWithHistory';
import MsalProvider from './providers/MsalProvider';
import './setupApp';

import { ApolloClient } from '@/services';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <MsalProvider>
      <Auth0ProviderWithHistory>
        <ApolloProvider client={ApolloClient}>
          <ArcoConfig>
            <Router />

            <ReloadPrompt />
            <HubSpot />
          </ArcoConfig>
        </ApolloProvider>
      </Auth0ProviderWithHistory>
    </MsalProvider>
  </BrowserRouter>,
);
