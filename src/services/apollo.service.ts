import { from, ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';

import Message from '@/components/Message';

import useAuth0Session from '@/hooks/useAuth0Session';
import { useAppStore } from '@/stores/useAppStore';

import Configs from '@/configs';

import i18n from '@/i18n';

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
  console.log('response', response);
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );

      if (message === 'connect ECONNREFUSED 127.0.0.1:3306') {
        Message.error(i18n.t('errors.databaseError'));
      }
    });

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);

    Message.error(`${i18n.t('errors.networkError')}`);
  }

  if (response?.errors) {
    const notAuthenticated = response.errors.some((error) => {
      if (Array.isArray(error.extensions)) {
        error.extensions.some(
          (extension) => extension.code === 'UNAUTHENTICATED',
        );
      }

      return false;
    });

    if (notAuthenticated) {
      location.reload();
    }
  }
});

const authLink = setContext((_, { headers }) => {
  const { getToken } = useAuth0Session();
  const { activeCompany } = useAppStore.getState();
  const token = getToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-company-id': activeCompany?.id,
    },
  };
});

const uploadLink = createUploadLink({ uri: Configs.env.GRAPHQL_URL });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  //@ts-ignore
  link: from([errorLink, authLink, uploadLink]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
