import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Input, Pagination } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { escapeRegExp } from 'lodash-es';
import { useState } from 'react';
import { MdKeyboardBackspace } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';

import Message from '@/components/Message';
import Modal from '@/components/Modal';
import MoveProjectModal, { FormValues } from '@/components/MoveProjectModal';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

import { getErrorMessage } from '@/utils/error.utils';

import { ArrayElement } from '@/types';

import {
  WorkspaceArchivedProjectsPageQuery,
  WorkspaceArchivedProjectsPageQueryVariables,
  UpdateProjectsArchivedStateMutation,
  UpdateProjectsArchivedStateMutationVariables,
  MoveProjectsToWorkspaceMutation,
  MoveProjectsToWorkspaceMutationVariables,
} from 'generated/graphql-types';

type QueryProject = ArrayElement<
  NonNullable<WorkspaceArchivedProjectsPageQuery['workspace']>['projects']
>;

const WorkspaceArchivedProjectsPage = () => {
  const { workspaceId } = useParams();

  const { activeCompany } = useAppStore();
  const { getWorkspaceOptions, reload } = useWorkspaceStore();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    WorkspaceArchivedProjectsPageQuery,
    WorkspaceArchivedProjectsPageQueryVariables
  >(workspaceArchivedProjectsPageQuery, {
    variables: {
      workspaceId: workspaceId as string,
    },
    skip: !workspaceId,
  });
  const [
    mutateUpdateProjectArchivedState,
    { loading: mutateUpdateProjectArchivedStateLoading },
  ] = useMutation<
    UpdateProjectsArchivedStateMutation,
    UpdateProjectsArchivedStateMutationVariables
  >(updateProjectArchivedState);
  const [
    mutateMoveProjectsToWorkspace,
    { loading: mutateMoveProjectsToWorkspaceLoading },
  ] = useMutation<
    MoveProjectsToWorkspaceMutation,
    MoveProjectsToWorkspaceMutationVariables
  >(moveProjectsToWorkspaceMutation);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [performProject, setPerformProject] = useState<QueryProject>();

  const modalState = {
    move: useDisclosure(),
  };

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleUpdatePageIndex = (pageNumber: number) => {
    setPageIndex(pageNumber);
  };

  const handleCloseModal = () => {
    setPerformProject(undefined);

    modalState.move.onClose();
  };

  const handleRestoreProject = (project: QueryProject) => {
    if (workspaceId === 'DEFAULT_WORKSPACE') {
      setPerformProject(project);

      modalState.move.onOpen();
    } else {
      Modal.confirmV2({
        title: 'Unarchive Project',
        content: 'Do you want to unarchive this project?',
        okText: 'Unarchive Project',
        onConfirm: async () => {
          await handleUnarchiveProject(project);
        },
      });
    }
  };

  const handleSubmitMoveProject = async (values: FormValues) => {
    if (!performProject?.id) {
      return;
    }

    try {
      const res = await mutateUpdateProjectArchivedState({
        variables: {
          input: {
            projectIds: [performProject.id],
            archived: false,
          },
        },
      });

      if (!res.errors) {
        await handleMoveProject({
          projectId: performProject.id,
          workspaceId: values.workspaceId,
        });

        refetchQuery();
        handleCloseModal();
        reload();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to unarchive project',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnarchiveProject = async (project: QueryProject) => {
    if (!project?.id) {
      return;
    }

    try {
      const res = await mutateUpdateProjectArchivedState({
        variables: {
          input: {
            projectIds: [project.id],
            archived: false,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
        reload();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to unarchive project',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoveProject = async ({
    projectId,
    workspaceId,
  }: {
    projectId: string;
    workspaceId: string;
  }) => {
    try {
      const res = await mutateMoveProjectsToWorkspace({
        variables: {
          input: {
            sourceWorkspaceId: workspaceId,
            projectIds: [projectId],
            destinationWorkspaceId: workspaceId,
          },
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to move project to workspace',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getVisibleProjects = () => {
    if (!queryData?.workspace?.projects) {
      return [];
    }

    let projects = queryData.workspace.projects.filter(
      (project) => project?.archived,
    );

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      projects = projects.filter((project) => project?.name?.match(regex));
    }

    return projects;
  };

  return (
    <>
      <div className="bg-white">
        <div className="flex h-14 items-center pt-4">
          <h1>{queryData?.workspace?.name}</h1>
        </div>

        <div className="px-5 pt-4">
          <Link
            to={`/${activeCompany?.slug}/workspace/${workspaceId}`}
            className="text-gray-400 hover:text-brand-500"
          >
            <MdKeyboardBackspace /> Back
          </Link>
        </div>

        <div className="flex border-b border-gray-300 px-5 pb-2">
          <h2 className="flex-1 p-0">Archived Projects</h2>

          <div>
            <Input.Search
              allowClear
              placeholder="Enter keyword to search"
              value={searchKeyword}
              onChange={handleUpdateSearchKeyword}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-3">
          <div className="divide-y divide-gray-200 rounded border border-gray-200">
            {getVisibleProjects()
              .slice(pageIndex - 1, (pageIndex - 1) * 10 + 10)
              .map((project) => (
                <ProjectItem
                  key={project?.id}
                  project={project}
                  onRestore={() => handleRestoreProject(project)}
                />
              ))}
          </div>

          <Pagination
            className="mt-4"
            total={getVisibleProjects().length}
            current={pageIndex}
            onChange={handleUpdatePageIndex}
          />
        </div>
      </div>

      <MoveProjectModal
        visible={modalState.move.visible}
        onCancel={handleCloseModal}
        loading={
          mutateUpdateProjectArchivedStateLoading ||
          mutateMoveProjectsToWorkspaceLoading
        }
        workspaceOptions={getWorkspaceOptions()}
        onSubmit={handleSubmitMoveProject}
      />
    </>
  );
};

const ProjectItem = ({
  project,
  onRestore,
}: {
  project: QueryProject;
  onRestore: () => void;
}) => {
  return (
    <div className="flex bg-white p-3">
      <div className="flex-1 pr-3">
        <div>
          <b>{project?.name}</b>
        </div>

        <div>
          {project?.archivedBy?.name || project?.archivedBy?.email}{' '}
          <span className="text-gray-500">
            {dayjs(project?.archivedAt).fromNow()}
          </span>
        </div>
      </div>

      <Button onClick={onRestore}>Restore</Button>
    </div>
  );
};

const workspaceArchivedProjectsPageQuery = gql`
  query WorkspaceArchivedProjectsPage($workspaceId: ID!) {
    workspace(id: $workspaceId) {
      id
      name
      projects {
        id
        name
        archived
        archivedAt
        archivedBy {
          id
          email
          name
        }
      }
    }
  }
`;

const updateProjectArchivedState = gql`
  mutation UpdateProjectsArchivedState(
    $input: UpdateProjectsArchivedStateInput!
  ) {
    updateProjectsArchivedState(input: $input) {
      id
    }
  }
`;

const moveProjectsToWorkspaceMutation = gql`
  mutation MoveProjectsToWorkspace($input: MoveProjectsToWorkspaceInput!) {
    moveProjectsToWorkspace(input: $input) {
      id
    }
  }
`;

export default WorkspaceArchivedProjectsPage;
