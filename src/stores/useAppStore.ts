import { gql } from '@apollo/client';
import { head, find } from 'lodash-es';
import create from 'zustand';
import { persist } from 'zustand/middleware';

import { ApolloClient } from '@/services';

import { userProfileFragment } from '@/fragments';

import { ArrayElement } from '@/types';

import { Company, User, CurrentUserQuery } from 'generated/graphql-types';

type QueryCompany = ArrayElement<
  NonNullable<CurrentUserQuery['currentUser']>['companies']
>;

type QueryCompanyMember = ArrayElement<NonNullable<QueryCompany>['members']>;

export type AppStoreState = {
  currentUser: CurrentUserQuery['currentUser'];
  setCurrentUser: (user: User) => void;
  clearSession: () => void;
  activeCompany: QueryCompany;
  isStartupPlan: () => boolean;
  setActiveCompany: (company: Company | null) => void;
  reloadUser: () => Promise<void>;
  getCurrentMember: () => QueryCompanyMember | undefined;
  returnTo: string | null | undefined;
  setReturnTo: (returnTo: string | null | undefined) => void;
};

const getActiveCompany = (
  user: User,
  currentActiveCompany?: Company | null,
) => {
  let activeCompany = null;

  if (currentActiveCompany) {
    const updatedCompany = user.companies?.find(
      (company) => company?.id === currentActiveCompany.id,
    );

    if (updatedCompany) {
      activeCompany = updatedCompany;
    }
  } else {
    if (user?.defaultCompany) {
      activeCompany = user.defaultCompany;
    } else {
      const firstCompany = head(user?.companies);
      activeCompany = firstCompany || null;
    }
  }

  return activeCompany;
};

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (user) =>
        set(() => {
          return { currentUser: user, activeCompany: getActiveCompany(user) };
        }),
      clearSession: () =>
        set(() => ({
          currentUser: null,
          activeCompany: null,
        })),
      activeCompany: null,
      setActiveCompany: (company: Company | null) =>
        set(() => ({ activeCompany: company })),
      isStartupPlan: () => {
        const company = get().activeCompany;

        const sub = company?.currentSubscription?.package?.name?.toLowerCase();

        if (sub && sub?.includes('startup')) {
          return true;
        }

        return false;
      },
      reloadUser: async () => {
        const result = await ApolloClient.query({
          query: reloadUserQuery,
        });
        if (result?.data?.currentUser) {
          const currentActiveCompany = get().activeCompany;
          const user = result.data.currentUser;
          set(() => ({
            currentUser: user,
            activeCompany: getActiveCompany(user, currentActiveCompany),
          }));
        }
      },
      getCurrentMember: () => {
        const user = get().currentUser;
        const activeCompany = get().activeCompany;

        if (!user?.id || !activeCompany?.id) {
          return null;
        }

        return find(activeCompany.members, (cm) => cm?.user?.id === user?.id);
      },
      returnTo: undefined,
      setReturnTo: (returnTo) => set(() => ({ returnTo })),
    }),
    {
      name: 'gk-app-persist',
      version: 0,
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.log('an error happened during hydration', error);
          }
        };
      },
    },
  ),
);

const reloadUserQuery = gql`
  query CurrentUser {
    currentUser {
      ...UserProfileFragment
    }
  }
  ${userProfileFragment}
`;
