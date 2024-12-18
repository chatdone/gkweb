import { gql } from '@apollo/client';
import { flatten } from 'lodash-es';
import create from 'zustand';

import { useAppStore } from './useAppStore';

import { ApolloClient } from '@/services';

import { ArrayElement, SelectOption } from '@/types';

import {
  WorkspaceStoreQuery,
  WorkspaceStoreQueryVariables,
} from 'generated/graphql-types';

export type QueryWorkspace = ArrayElement<WorkspaceStoreQuery['workspaces']>;

export type QueryProject = ArrayElement<
  NonNullable<QueryWorkspace>['projects']
>;

type WorkspaceStore = {
  activeWorkspace: QueryWorkspace;
  setActiveWorkspace: (workspace: QueryWorkspace) => void;
  workspaces: QueryWorkspace[];
  reload: (reset?: boolean) => Promise<void>;
  getWorkspaceProjectOptions: () => { [key: string]: SelectOption[] };
  getWorkspaceProjectGroupOptions: () => { [key: string]: SelectOption[] };
  getNotActiveWorkspaceOptions: () => SelectOption[];
  getProjectStatusesOptions: () => { [key: string]: SelectOption[] };
  getWorkspaceOptions: () => SelectOption[];
};

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  activeWorkspace: null,
  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
  workspaces: [],
  reload: async (reset) => {
    const activeWorkspace = get().activeWorkspace;
    const companyId = useAppStore.getState().activeCompany?.id;

    if (!companyId) {
      return;
    }

    const result = await ApolloClient.query<
      WorkspaceStoreQuery,
      WorkspaceStoreQueryVariables
    >({
      query: workspacesQuery,
      variables: {
        companyId: companyId as string,
      },
    });

    if (result.data.workspaces) {
      let newWorkspace = null;

      if (activeWorkspace && !reset) {
        newWorkspace = result.data.workspaces.find(
          (workspace) => workspace?.id === activeWorkspace?.id,
        );
      } else {
        newWorkspace = result.data.workspaces[0];
      }

      set({
        workspaces: result.data.workspaces,
        activeWorkspace: newWorkspace,
      });
    }
  },
  getWorkspaceProjectOptions: () => {
    const workspaces = get().workspaces;

    const options: { [key: string]: SelectOption[] } = {};

    workspaces.forEach((workspace) => {
      if (workspace?.id && workspace.projects) {
        options[workspace.id] = workspace.projects
          .filter((project) => !project?.archived)
          .map((project) => ({
            label: project?.name,
            value: project?.id as string,
          }));
      }
    });

    return options;
  },
  getWorkspaceProjectGroupOptions: () => {
    const options: { [key: string]: SelectOption[] } = {};

    const workspaces = get().workspaces;
    const projects = flatten(
      workspaces.map((workspace) => workspace?.projects || []),
    );

    projects.forEach((project) => {
      if (project?.id && project?.groups) {
        options[project.id] = project.groups.map((group) => ({
          label: group?.name,
          value: group?.id as string,
        }));
      }
    });

    return options;
  },
  getNotActiveWorkspaceOptions: () => {
    const activeWorkspace = get().activeWorkspace;
    const workspaces = get().workspaces;

    const nonActiveWorkspaces = workspaces.filter(
      (workspace) => workspace?.id !== activeWorkspace?.id,
    );

    return nonActiveWorkspaces.map((workspace) => ({
      label: workspace?.name,
      value: workspace?.id as string,
    }));
  },
  getProjectStatusesOptions: () => {
    const options: { [key: string]: SelectOption[] } = {};

    const workspaces = get().workspaces;
    const projects = flatten(
      workspaces.map((workspace) => workspace?.projects || []),
    );

    projects.forEach((project) => {
      if (project?.id && project?.projectStatuses) {
        options[project.id] = project.projectStatuses.map((status) => ({
          label: status?.name,
          value: status?.id as string,
        }));
      }
    });

    return options;
  },
  getWorkspaceOptions: () => {
    const workspaces = get().workspaces;

    return workspaces.map((workspace) => ({
      label: workspace?.name,
      value: workspace?.id as string,
    }));
  },
}));

const workspacesQuery = gql`
  query WorkspaceStore($companyId: ID!) {
    workspaces(companyId: $companyId) {
      id
      name
      bgColor
      visibility
      projects {
        id
        name
        visibility
        archived
        members {
          id
          user {
            id
            email
            name
          }
        }
        projectSettings {
          columns
        }
        groups {
          id
          name
        }
        projectStatuses {
          id
          color
          name
          notify
        }
        owners {
          companyMember {
            id
            user {
              id
            }
          }
        }
        visibilityWhitelist {
          teams {
            id
          }
          members {
            id
          }
        }
        createdBy {
          id
        }
      }
      visibilityWhitelist {
        teams {
          id
        }
        members {
          id
        }
      }
      createdBy {
        id
      }
    }
  }
`;
