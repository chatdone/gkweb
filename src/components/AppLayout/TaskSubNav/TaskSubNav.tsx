import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Dropdown, Menu } from '@arco-design/web-react';
import { IconDown } from '@arco-design/web-react/icon';
import { toLower } from 'lodash-es';
import { SyntheticEvent, useEffect, useState } from 'react';
import {
  MdAdd,
  MdMoreVert,
  MdOutlineFolderOpen,
  MdSettings,
} from 'react-icons/md';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Message from '@/components/Message';

import Avatar from '../../Avatar';
import Modal from '../../Modal';
import MoveProjectModal, {
  FormValues as MoveProjectFormValues,
} from '../../MoveProjectModal';
import CreateProjectModal, {
  FormValues as CreateProjectFormValues,
} from './CreateProjectModal';
import { FormValues as TemplateFormValues } from './CreateProjectModal/TemplateDetail';
import DuplicateProjectModal, {
  FormValues as DuplicateProjectFormValues,
} from './DuplicateProjectModal';
import EditProjectModal, {
  FormValues as EditProjectFormValues,
} from './EditProjectModal';
import EditWorkspaceModal, {
  FormValues as WorkspaceFormValues,
} from './EditWorkspaceModal';
import ProjectTemplateGallery, {
  ProjectTemplateGalleryProps,
} from './ProjectTemplateGalleryModal/ProjectTemplateGalleryModal';
import styles from './TaskSubNav.module.less';

import { FormValues as ProjectGroupFormValues } from '@/pages/workspace/ProjectPage/AddProjectGroupModal';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';
import {
  useWorkspaceStore,
  QueryWorkspace,
  QueryProject,
} from '@/stores/useWorkspaceStore';

import { getErrorMessage } from '@/utils/error.utils';
import { getStatusesUpdate, getVisibilityUpdate } from '@/utils/task.utils';

import { TASK_PROPERTY_OPTIONS } from '@/constants/task.constants';

import {
  navigateCompanySubscriptionsPage,
  navigateProjectArchivedTasksPage,
  navigateProjectPage,
  navigateWorkspaceArchivedProjectsPage,
  navigateWorkspacePage,
} from '@/navigation';

import Configs from '@/configs';

import { ArrayElement, SelectOption } from '@/types';

import {
  ProjectTemplate,
  ProjectVisibility,
  CommonVisibility,
  CompanyMemberType,
  AddToProjectVisibilityWhitelistInput,
  RemoveFromProjectVisibilityWhitelistInput,
  TaskSubNavQuery,
  TaskSubNavQueryVariables,
  CreateWorkspaceMutation,
  CreateWorkspaceMutationVariables,
  UpdateWorkspaceMutation,
  UpdateWorkspaceMutationVariables,
  DeleteWorkspacesMutation,
  DeleteWorkspacesMutationVariables,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  DeleteProjectsMutation,
  DeleteProjectsMutationVariables,
  MoveProjectsToWorkspaceMutation,
  MoveProjectsToWorkspaceMutationVariables,
  CreateProjectTemplateMutation,
  CreateProjectTemplateMutationVariables,
  EditProjectTemplateMutation,
  EditProjectTemplateMutationVariables,
  CreateProjectTemplateStatusMutation,
  CreateProjectTemplateStatusMutationVariables,
  EditProjectTemplateStatusMutation,
  EditProjectTemplateStatusMutationVariables,
  DeleteProjectTemplateStatusesMutation,
  DeleteProjectTemplateStatusesMutationVariables,
  DeleteProjectTemplatesMutation,
  DeleteProjectTemplatesMutationVariables,
  EditProjectSettingsMutation,
  EditProjectSettingsMutationVariables,
  EditProjectStatusMutation,
  EditProjectStatusMutationVariables,
  AddToVisibilityWhitelistProjectMutation,
  AddToVisibilityWhitelistProjectMutationVariables,
  RemoveFromVisibilityWhitelistProjectMutation,
  RemoveFromVisibilityWhitelistProjectMutationVariables,
  CreateProjectStatusMutation,
  CreateProjectStatusMutationVariables,
  DeleteProjectStatusesMutation,
  DeleteProjectStatusesMutationVariables,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
  SetProjectVisibilityMutation,
  SetProjectVisibilityMutationVariables,
  CopyProjectMutation,
  CopyProjectMutationVariables,
  UpdateProjectsArchivedStateMutation,
  UpdateProjectsArchivedStateMutationVariables,
  RemoveFromWorkspaceVisibilityWhitelistMutation,
  RemoveFromWorkspaceVisibilityWhitelistMutationVariables,
  AddToWorkspaceVisibilityWhitelistMutation,
  AddToWorkspaceVisibilityWhitelistMutationVariables,
  AddToWorkspaceVisibilityWhitelistInput,
  RemoveFromWorkspaceVisibilityWhitelistInput,
  SetWorkspaceVisibilityMutation,
  SetWorkspaceVisibilityMutationVariables,
  CreateProjectGroupTaskSubMutation,
  CreateProjectGroupTaskSubMutationVariables,
  CreateTaskTaskSubNavMutation,
  CreateTaskTaskSubNavMutationVariables,
  CreateCustomColumnForGroupTaskSubNavMutation,
  CreateCustomColumnForGroupTaskSubNavMutationVariables,
  ProjectGroupCustomAttributeType,
} from 'generated/graphql-types';

type QueryProjectTemplate = ArrayElement<TaskSubNavQuery['projectTemplates']>;
export type QueryProjectTemplateGallery =
  TaskSubNavQuery['globalProjectTemplateGallery'];

const TaskSubNav = () => {
  const { projectId, workspaceId } = useParams();
  const navigate = useNavigate();

  const { activeCompany, getCurrentMember } = useAppStore();
  const { activeWorkspace, workspaces, setActiveWorkspace, reload } =
    useWorkspaceStore();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    TaskSubNavQuery,
    TaskSubNavQueryVariables
  >(taskSubNavQuery, {
    variables: {
      companyId: activeCompany?.id as string,
    },
    skip: !activeCompany?.id,
  });
  const [mutateCreateWorkspace, { loading: mutateCreateWorkspaceLoading }] =
    useMutation<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>(
      createWorkspaceMutation,
    );
  const [mutateUpdateWorkspace, { loading: mutateUpdateWorkspaceLoading }] =
    useMutation<UpdateWorkspaceMutation, UpdateWorkspaceMutationVariables>(
      updateWorkspaceMutation,
    );
  const [mutateDeleteWorkspaces] = useMutation<
    DeleteWorkspacesMutation,
    DeleteWorkspacesMutationVariables
  >(deleteWorkspacesMutation);
  const [mutateCreateProject, { loading: mutateCreateProjectLoading }] =
    useMutation<CreateProjectMutation, CreateProjectMutationVariables>(
      createProjectMutation,
    );
  const [mutateUpdateProject] = useMutation<
    UpdateProjectMutation,
    UpdateProjectMutationVariables
  >(updateProjectMutation);
  const [mutateDeleteProjects] = useMutation<
    DeleteProjectsMutation,
    DeleteProjectsMutationVariables
  >(deleteProjectsMutation);
  const [
    mutateMoveProjectsToWorkspace,
    { loading: mutateMoveProjectsToWorkspaceLoading },
  ] = useMutation<
    MoveProjectsToWorkspaceMutation,
    MoveProjectsToWorkspaceMutationVariables
  >(moveProjectsToWorkspaceMutation);
  const [
    mutateCreateProjectTemplate,
    { loading: mutateCreateProjectTemplateLoading },
  ] = useMutation<
    CreateProjectTemplateMutation,
    CreateProjectTemplateMutationVariables
  >(createProjectTemplateMutation);
  const [
    mutateEditProjectTemplate,
    { loading: mutateEditProjectTemplateLoading },
  ] = useMutation<
    EditProjectTemplateMutation,
    EditProjectTemplateMutationVariables
  >(editProjectTemplateMutation);
  const [mutateCreateProjectTemplateStatus] = useMutation<
    CreateProjectTemplateStatusMutation,
    CreateProjectTemplateStatusMutationVariables
  >(createProjectTemplateStatusMutation);
  const [mutateEditProjectTemplateStatus] = useMutation<
    EditProjectTemplateStatusMutation,
    EditProjectTemplateStatusMutationVariables
  >(editProjectTemplateStatusMutation);
  const [mutateDeleteProjectTemplateStatuses] = useMutation<
    DeleteProjectTemplateStatusesMutation,
    DeleteProjectTemplateStatusesMutationVariables
  >(deleteProjectTemplateStatusesMutation);
  const [mutateDeleteProjectTemplates] = useMutation<
    DeleteProjectTemplatesMutation,
    DeleteProjectTemplatesMutationVariables
  >(deleteProjectTemplatesMutation);
  const [mutateEditProjectSettings] = useMutation<
    EditProjectSettingsMutation,
    EditProjectSettingsMutationVariables
  >(editProjectSettingsMutation);
  const [mutateEditProjectStatus] = useMutation<
    EditProjectStatusMutation,
    EditProjectStatusMutationVariables
  >(editProjectStatusMutation);
  const [mutateCreateProjectStatus] = useMutation<
    CreateProjectStatusMutation,
    CreateProjectStatusMutationVariables
  >(createProjectStatusMutation);
  const [mutateDeleteProjectStatuses] = useMutation<
    DeleteProjectStatusesMutation,
    DeleteProjectStatusesMutationVariables
  >(deleteProjectStatusesMutation);

  const [mutateAddToVisibilityWhitelistProject] = useMutation<
    AddToVisibilityWhitelistProjectMutation,
    AddToVisibilityWhitelistProjectMutationVariables
  >(addToVisibilityWhitelistProjectMutation);

  const [mutateAddToVisibilityWhitelistWorkspace] = useMutation<
    AddToWorkspaceVisibilityWhitelistMutation,
    AddToWorkspaceVisibilityWhitelistMutationVariables
  >(addToWorkspaceVisibilityWhitelist);

  const [mutateRemoveFromVisibilityWhitelistProject] = useMutation<
    RemoveFromVisibilityWhitelistProjectMutation,
    RemoveFromVisibilityWhitelistProjectMutationVariables
  >(removeFromVisibilityWhitelistProjectMutation);

  const [mutateRemoveFromVisibilityWhitelistWorkspace] = useMutation<
    RemoveFromWorkspaceVisibilityWhitelistMutation,
    RemoveFromWorkspaceVisibilityWhitelistMutationVariables
  >(removeFromWorkspaceVisibilityWhitelistProjectMutation);

  const [mutateSetProjectVisibility] = useMutation<
    SetProjectVisibilityMutation,
    SetProjectVisibilityMutationVariables
  >(setProjectVisibilityMutation);

  const [mutateSetWorkspaceVisibility] = useMutation<
    SetWorkspaceVisibilityMutation,
    SetWorkspaceVisibilityMutationVariables
  >(setWorkspaceVisibilityMutation);

  const [mutateCopyProject, { loading: mutateCopyProjectLoading }] =
    useMutation<CopyProjectMutation, CopyProjectMutationVariables>(
      copyProjectMutation,
    );
  const [mutateUpdateProjectArchivedState] = useMutation<
    UpdateProjectsArchivedStateMutation,
    UpdateProjectsArchivedStateMutationVariables
  >(updateProjectArchivedState);

  const [mutateCreateProjectGroup] = useMutation<
    CreateProjectGroupTaskSubMutation,
    CreateProjectGroupTaskSubMutationVariables
  >(createProjectGroupMutation);

  const [mutateCreateTask] = useMutation<
    CreateTaskTaskSubNavMutation,
    CreateTaskTaskSubNavMutationVariables
  >(createTaskMutation);

  const [mutateCreateCustomColumnForGroup] = useMutation<
    CreateCustomColumnForGroupTaskSubNavMutation,
    CreateCustomColumnForGroupTaskSubNavMutationVariables
  >(createCustomColumnForGroupMutation);

  const [editWorkspace, setEditWorkspace] = useState<QueryWorkspace>();
  const [projectToPerform, setProjectToPerform] = useState<QueryProject>();
  const [updateProjectLoading, setUpdateProjectLoading] =
    useState<boolean>(false);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);

  const modalState = {
    workspace: useDisclosure(),
    createProject: useDisclosure(),
    editProject: useDisclosure(),
    move: useDisclosure(),
    duplicate: useDisclosure(),
    modalProjectTemplatesGallery: useDisclosure(),
  };

  useEffect(() => {
    if (projectId) {
      const workspace = workspaces.find((workspace) =>
        workspace?.projects?.some((project) => project?.id === projectId),
      );

      workspace && setActiveWorkspace(workspace);
    } else if (workspaceId) {
      const workspace = workspaces.find(
        (workspace) => workspace?.id === workspaceId,
      );

      workspace && setActiveWorkspace(workspace);
    }
  }, [projectId, workspaceId, workspaces]);

  const handleChangeWorkspace = (workspace: QueryWorkspace) => {
    setActiveWorkspace(workspace);
    setPopupVisible(false);
  };

  const handleBeforeDuplicateProject = (project: QueryProject) => {
    if (
      !activeCompany?.currentSubscription?.stripeSubscriptionId &&
      !activeCompany?.currentSubscription?.package?.isCustom
    ) {
      const currentMember = getCurrentMember();

      Modal.info({
        title: 'Reached Plan Limit',
        content:
          currentMember?.type === CompanyMemberType.Admin
            ? 'Project Duplication is only available to SME plan and above'
            : 'Project Duplication is only available to SME plan and above, please contact your admin or company owner"',
        okText:
          currentMember?.type === CompanyMemberType.Admin
            ? 'Upgrade Plan'
            : undefined,
        onConfirm: () => {
          activeCompany?.slug &&
            navigateCompanySubscriptionsPage({
              navigate,
              companySlug: activeCompany.slug,
            });
        },
      });
    } else {
      setProjectToPerform(project);
      modalState.duplicate.onOpen();
    }
  };

  const handleAddWorkspace = () => {
    modalState.workspace.onOpen();
    setPopupVisible(false);
  };

  const handleClickWorkspaceMenuItem = (key: string, event: SyntheticEvent) => {
    event.stopPropagation();

    if (!activeCompany?.slug || !activeWorkspace?.id) {
      return;
    }

    if (key === 'edit') {
      setEditWorkspace(activeWorkspace);

      modalState.workspace.onOpen();
    } else if (key === 'archive') {
      navigateWorkspaceArchivedProjectsPage({
        navigate,
        companySlug: activeCompany.slug,
        workspaceId: activeWorkspace.id,
      });
    } else if (key === 'delete') {
      handleOpenDeleteWorkspaceConfirmation();
    }
  };

  const handleClickProjectListMenuItem = (
    key: string,
    event: KeyboardEvent,
  ) => {
    if (!activeCompany?.slug || !activeWorkspace?.id) {
      return;
    }

    const openNewTab = event.metaKey;

    if (key === 'all') {
      if (openNewTab) {
        window.open(
          `${window.origin}/${activeCompany.slug}/workspace/${activeWorkspace.id}`,
        );
      } else {
        navigateWorkspacePage({
          navigate,
          companySlug: activeCompany.slug,
          workspaceId: activeWorkspace.id,
        });
      }
    } else {
      if (openNewTab) {
        window.open(
          `${window.origin}/${activeCompany.slug}/project/${key}`,
          '_blank',
        );
      } else {
        navigateProjectPage({
          navigate,
          companySlug: activeCompany.slug,
          projectId: key,
        });
      }
    }
  };

  const handleClickProjectMenuItem = ({
    project,
    key,
    event,
  }: {
    project: QueryProject;
    key: string;
    event: SyntheticEvent;
  }) => {
    event.stopPropagation();

    if (key === 'edit') {
      setProjectToPerform(project);

      modalState.editProject.onOpen();
    } else if (key === 'move') {
      setProjectToPerform(project);

      modalState.move.onOpen();
    } else if (key === 'duplicate') {
      handleBeforeDuplicateProject(project);
    } else if (key === 'archive') {
      handleOpenArchiveProjectConfirmation(project);
    } else if (key === 'archived-tasks') {
      activeCompany?.slug &&
        project?.id &&
        navigateProjectArchivedTasksPage({
          navigate,
          companySlug: activeCompany.slug,
          projectId: project.id,
        });
    } else if (key === 'delete') {
      handleOpenDeleteProjectConfirmation(project);
    }
  };

  const handleCloseWorkspaceModal = () => {
    modalState.workspace.onClose();

    setEditWorkspace(undefined);
  };

  const handleCloseEditProjectModal = () => {
    modalState.editProject.onClose();

    setProjectToPerform(undefined);
  };

  const handleCloseMoveProjectModal = () => {
    modalState.move.onClose();

    setProjectToPerform(undefined);
  };

  const handleCloseDuplicateProjectModal = () => {
    modalState.duplicate.onClose();

    setProjectToPerform(undefined);
  };

  const handleOpenDeleteWorkspaceConfirmation = () => {
    Modal.confirmV2({
      title: 'Delete Workspace',
      content: 'Do you want to delete this workspace?',
      okText: 'Delete Workspace',
      onConfirm: async () => {
        await handleDeleteWorkspace();
      },
    });
  };

  const handleOpenArchiveProjectConfirmation = (project: QueryProject) => {
    Modal.confirmV2({
      title: 'Archive Project',
      content: 'Do you want to archive this project?',
      okText: 'Archive Project',
      onConfirm: async () => {
        await handleArchiveProject(project);
      },
    });
  };

  const handleOpenDeleteProjectConfirmation = (project: QueryProject) => {
    Modal.confirmV2({
      title: 'Delete Project',
      content: 'Do you want to delete this project?',
      okText: 'Delete Project',
      onConfirm: async () => {
        await handleDeleteProject(project);
      },
    });
  };

  const handleOpenDeleteProjectTemplateConfirmation = (
    template: QueryProjectTemplate,
    callback: () => void,
  ) => {
    Modal.confirmV2({
      title: 'Delete Project Template',
      content: 'Do you want to delete this project template?',
      okText: 'Delete Project Template',
      onConfirm: async () => {
        await handleDeleteProjectTemplate(template);

        callback();
      },
    });
  };

  const handleCreateWorkspace = async (values: WorkspaceFormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateCreateWorkspace({
        variables: {
          input: {
            companyId: activeCompany.id,
            name: values.name.trim(),
            bgColor: values.color,
          },
        },
      });

      if (!res.errors) {
        reload();

        handleCloseWorkspaceModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create workspace',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateWorkspace = async (values: WorkspaceFormValues) => {
    if (!editWorkspace?.id) {
      return;
    }

    try {
      const res = await mutateUpdateWorkspace({
        variables: {
          input: {
            workspaceId: editWorkspace.id,
            name: values.name.trim(),
            bgColor: values.color,
          },
        },
      });

      if (values?.visibility) {
        await handleUpdateWorkspaceVisibility(values.visibility);
      }

      if (!res.errors) {
        reload();

        handleCloseWorkspaceModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update workspace',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!activeWorkspace?.id) {
      return;
    }

    try {
      const res = await mutateDeleteWorkspaces({
        variables: {
          input: {
            workspaceIds: [activeWorkspace.id],
          },
        },
      });

      if (!res.errors) {
        reload(true);
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete workspace',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateProject = async (values: CreateProjectFormValues) => {
    if (!activeCompany?.id || !activeWorkspace?.id) {
      return;
    }
    try {
      const res = await mutateCreateProject({
        variables: {
          input: {
            companyId: activeCompany.id,
            workspaceId: activeWorkspace.id,
            name: values.name.trim(),
            ownerIds: values.ownerIds,
            projectTemplateId: values.templateId,
            visibility: values.visibility.type,
          },
        },
      });

      if (!res.errors) {
        if (
          res.data?.createProject?.id &&
          values.visibility.type === ProjectVisibility.Specific
        ) {
          await handleAddToVisibilityWhitelistProject({
            projectId: res.data.createProject.id,
            memberIds: values.visibility.memberIds,
            teamIds: values.visibility.teamIds,
          });
        }

        reload();

        modalState.createProject.onClose();
        return res;
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create project',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProject = async (values: EditProjectFormValues) => {
    if (!projectToPerform?.id) {
      return;
    }

    setUpdateProjectLoading(true);

    try {
      const columns = values.properties.reduce(
        (prev, property) => ({ ...prev, [property]: true }),
        {},
      );

      const res = await mutateUpdateProject({
        variables: {
          input: {
            projectId: projectToPerform.id,
            name: values.name.trim(),
            ownerIds: values.ownerIds,
          },
        },
      });

      await handleUpdateProjectVisibility(values.visibility);
      await handleEditProjectSettings(columns);
      await handleUpdateProjectStatuses(values.statuses);

      if (!res.errors) {
        reload();

        handleCloseEditProjectModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update project',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateProjectLoading(false);
    }
  };

  const handleEditProjectSettings = async (
    columns: EditProjectSettingsMutationVariables['input']['columns'],
  ) => {
    if (!projectToPerform?.id) {
      return;
    }

    try {
      const res = await mutateEditProjectSettings({
        variables: {
          input: {
            projectId: projectToPerform.id,
            columns,
          },
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to edit project settings',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProjectStatuses = async (
    statuses: EditProjectFormValues['statuses'],
  ) => {
    if (!projectToPerform?.id) {
      return;
    }

    try {
      const { newStatusesToCreate, statusesToUpdate, statusesToDelete } =
        getStatusesUpdate(projectToPerform.projectStatuses, statuses);

      const createRes = await Promise.all(
        newStatusesToCreate.map((status) =>
          mutateCreateProjectStatus({
            variables: {
              input: {
                projectId: projectToPerform.id as string,
                name: status.name.trim(),
                color: status.color,
                notify: status.notify,
              },
            },
          }),
        ),
      );

      const updateRes = await Promise.all(
        statusesToUpdate.map((status) =>
          mutateEditProjectStatus({
            variables: {
              input: {
                projectStatusId: status.id as string,
                name: status.name.trim(),
                color: status.color,
                notify: status.notify,
              },
            },
          }),
        ),
      );

      if (statusesToDelete.length) {
        const deleteStatusIds = statusesToDelete.map(
          (status) => status?.id as string,
        );

        await handleDeleteProjectStatuses(deleteStatusIds);
      }

      if (createRes.some((res) => res.errors)) {
        Message.error('Failed to create one or more project status');
      }

      if (updateRes.some((res) => res.errors)) {
        Message.error('Failed to update one or more project status');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProjectVisibility = async (
    visibility: EditProjectFormValues['visibility'],
  ) => {
    if (!projectToPerform?.id) {
      return;
    }

    try {
      let res;

      // @ts-ignore
      if (projectToPerform.visibility !== visibility.type) {
        res = await mutateSetProjectVisibility({
          variables: {
            input: {
              projectId: projectToPerform.id,
              visibility: visibility.type,
            },
          },
        });
      }

      if (visibility.type === ProjectVisibility.Specific) {
        const { add, remove } = getVisibilityUpdate(
          {
            teamIds:
              projectToPerform.visibilityWhitelist?.teams?.map(
                (team) => team?.id as string,
              ) || [],
            memberIds:
              projectToPerform.visibilityWhitelist?.members?.map(
                (member) => member?.id as string,
              ) || [],
          },
          {
            teamIds: visibility.teamIds || [],
            memberIds: visibility.memberIds || [],
          },
        );

        if (add.teamIds.length || add.memberIds.length) {
          await handleAddToVisibilityWhitelistProject({
            projectId: projectToPerform.id,
            teamIds: add.teamIds,
            memberIds: add.memberIds,
          });
        }

        if (remove.teamIds.length || remove.memberIds.length) {
          await handleRemoveFromVisibilityWhitelistProject({
            projectId: projectToPerform.id,
            teamIds: remove.teamIds,
            memberIds: remove.memberIds,
          });
        }
      }

      if (res?.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to set project visibility',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateWorkspaceVisibility = async (
    visibility: WorkspaceFormValues['visibility'],
  ) => {
    if (!editWorkspace?.id) {
      return;
    }

    try {
      let res;

      // @ts-ignore
      if (editWorkspace.visibility !== visibility?.type) {
        res = await mutateSetWorkspaceVisibility({
          variables: {
            input: {
              workspaceId: editWorkspace?.id,
              visibility: visibility.type,
            },
          },
        });
      }

      if (visibility.type === CommonVisibility.Specific) {
        const { add, remove } = getVisibilityUpdate(
          {
            teamIds:
              editWorkspace.visibilityWhitelist?.teams?.map(
                (team) => team?.id as string,
              ) || [],
            memberIds:
              editWorkspace.visibilityWhitelist?.members?.map(
                (member) => member?.id as string,
              ) || [],
          },
          {
            teamIds: visibility.teamIds || [],
            memberIds: visibility.memberIds || [],
          },
        );

        if (add.teamIds.length || add.memberIds.length) {
          await handleAddToVisibilityWhitelistWorkspace({
            workspaceId: editWorkspace.id,
            teamIds: add.teamIds,
            memberIds: add.memberIds,
          });
        }

        if (remove.teamIds.length || remove.memberIds.length) {
          await handleRemoveFromVisibilityWhitelistWorkspace({
            workspaceId: editWorkspace.id,
            teamIds: remove.teamIds,
            memberIds: remove.memberIds,
          });
        }
      }

      if (res?.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to set project visibility',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoveProject = async (values: MoveProjectFormValues) => {
    if (!projectToPerform?.id || !activeWorkspace?.id) {
      return;
    }

    try {
      const res = await mutateMoveProjectsToWorkspace({
        variables: {
          input: {
            projectIds: [projectToPerform.id],
            sourceWorkspaceId: activeWorkspace.id,
            destinationWorkspaceId: values.workspaceId,
          },
        },
      });

      if (!res.errors) {
        reload();

        handleCloseMoveProjectModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to move project to another workspace',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDuplicateProject = async (values: DuplicateProjectFormValues) => {
    if (!projectToPerform?.id) {
      return;
    }

    try {
      const res = await mutateCopyProject({
        variables: {
          input: {
            projectId: projectToPerform.id,
            targetWorkspaceId: values.workspaceId,
          },
        },
      });

      if (!res.errors) {
        reload();

        handleCloseDuplicateProjectModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to duplicate project',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProject = async (project: QueryProject) => {
    if (!project?.id) {
      return;
    }

    try {
      const res = await mutateDeleteProjects({
        variables: {
          input: {
            projectIds: [project.id],
          },
        },
      });

      if (!res.errors) {
        if (projectId === project.id) {
          const workspace = workspaces.find((workspace) =>
            workspace?.projects?.some(
              (workspaceProject) => workspaceProject?.id === project?.id,
            ),
          );

          navigate(`/${activeCompany?.slug}/workspace/${workspace?.id}`);
        }

        reload();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete project',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProjectStatuses = async (projectStatusIds: string[]) => {
    try {
      const res = await mutateDeleteProjectStatuses({
        variables: {
          input: {
            projectStatusIds,
          },
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete project statuses',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateProjectTemplate = async (values: TemplateFormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const columns = values.properties.reduce(
        (prev, property) => ({ ...prev, [property]: true }),
        {},
      );

      const res = await mutateCreateProjectTemplate({
        variables: {
          input: {
            companyId: activeCompany.id,
            name: values.name.trim(),
            columns,
            statuses: values.statuses,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
        return res;
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create project template',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProjectTemplate = async (
    template: ProjectTemplate | null,
    values: TemplateFormValues,
  ) => {
    if (!template?.id) {
      return;
    }

    try {
      const columns = values.properties.reduce(
        (prev, property) => ({ ...prev, [property]: true }),
        {},
      );

      const res = await mutateEditProjectTemplate({
        variables: {
          input: {
            projectTemplateId: template.id,
            name: values.name.trim(),
            columns,
          },
        },
      });

      await handleUpdateProjectTemplateStatus(template, values.statuses);

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update project template',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProjectTemplateStatus = async (
    template: QueryProjectTemplate,
    statusFormValues: TemplateFormValues['statuses'],
  ) => {
    if (!template?.id) {
      return;
    }

    try {
      const { newStatusesToCreate, statusesToDelete, statusesToUpdate } =
        getStatusesUpdate(template.statuses, statusFormValues);

      const createRes = await Promise.all(
        newStatusesToCreate.map((status) =>
          mutateCreateProjectTemplateStatus({
            variables: {
              input: {
                projectTemplateId: template.id as string,
                name: status.name.trim(),
                color: status.color,
                notify: status.notify,
              },
            },
          }),
        ),
      );

      const updateRes = await Promise.all(
        statusesToUpdate.map((status) =>
          mutateEditProjectTemplateStatus({
            variables: {
              input: {
                projectTemplateStatusId: status.id as string,
                name: status.name.trim(),
                color: status.color,
                notify: status.notify,
              },
            },
          }),
        ),
      );

      if (statusesToDelete.length) {
        const deleteStatusIds = statusesToDelete.map(
          (status) => status?.id as string,
        );

        await handleDeleteProjectTemplateStatuses(deleteStatusIds);
      }

      if (createRes.some((res) => res.errors)) {
        Message.error('Failed to create one or more project template status');
      }

      if (updateRes.some((res) => res.errors)) {
        Message.error('Failed to update one or more project template status');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProjectTemplateStatuses = async (
    projectTemplateStatusIds: string[],
  ) => {
    try {
      const res = await mutateDeleteProjectTemplateStatuses({
        variables: {
          input: {
            projectTemplateStatusIds,
          },
        },
      });

      if (res.errors) {
        Message.error('Failed to delete project template statuses');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProjectTemplate = async (
    template: QueryProjectTemplate,
  ) => {
    if (!template?.id) {
      return;
    }

    try {
      const res = await mutateDeleteProjectTemplates({
        variables: {
          input: {
            projectTemplateIds: [template.id],
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete project template',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToVisibilityWhitelistProject = async (
    input: AddToProjectVisibilityWhitelistInput,
  ) => {
    try {
      const res = await mutateAddToVisibilityWhitelistProject({
        variables: {
          input,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add member(s) to project visibility whitelist',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToVisibilityWhitelistWorkspace = async (
    input: AddToWorkspaceVisibilityWhitelistInput,
  ) => {
    try {
      const res = await mutateAddToVisibilityWhitelistWorkspace({
        variables: {
          input,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add member(s) to workspace visibility whitelist',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFromVisibilityWhitelistProject = async (
    input: RemoveFromProjectVisibilityWhitelistInput,
  ) => {
    try {
      const res = await mutateRemoveFromVisibilityWhitelistProject({
        variables: {
          input,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add member(s) to project visibility whitelist',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFromVisibilityWhitelistWorkspace = async (
    input: RemoveFromWorkspaceVisibilityWhitelistInput,
  ) => {
    try {
      const res = await mutateRemoveFromVisibilityWhitelistWorkspace({
        variables: {
          input,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add member(s) to workspace visibility whitelist',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchiveProject = async (project: QueryProject) => {
    if (!project?.id) {
      return;
    }

    try {
      const res = await mutateUpdateProjectArchivedState({
        variables: {
          input: {
            projectIds: [project.id],
            archived: true,
          },
        },
      });

      if (!res.errors) {
        reload();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to archive project',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenProjectTemplatesGalleryModal = async () => {
    modalState.modalProjectTemplatesGallery.onOpen();
  };

  const handleCreateProjectGroup = async (
    createdProjectId: string,
    values: ProjectGroupFormValues,
  ) => {
    if (!createdProjectId) {
      return;
    }
    // console.log(JSON.stringify(DEFAULT_PROJECT_TEMPLATES_GALLERY));
    // return;

    try {
      const res = await mutateCreateProjectGroup({
        variables: {
          input: {
            projectId: createdProjectId,
            name: values.name,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        return res;
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create project group',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApplyTemplateGallery = async (
    previewTemplate: ProjectTemplateGalleryProps,
  ) => {
    try {
      const template = await handleCreateProjectTemplate({
        name: previewTemplate?.name,
        properties: previewTemplate?.fields
          ?.map((f) => {
            const defaultColumns = TASK_PROPERTY_OPTIONS?.map((o) => o.value);
            if (f?.includes('Due')) {
              return 'timeline';
            } else if (f?.includes('Budget')) {
              return 'value';
            }

            if (defaultColumns?.includes(f)) {
              return toLower(f);
            } else {
              return '';
            }
          })
          ?.filter((f) => f !== ''),
        statuses: previewTemplate.status?.map((s) => {
          return {
            name: s,
            color: 'green',
            notify: false,
          };
        }),
      });

      modalState.modalProjectTemplatesGallery.onClose();

      const templateId = template?.data?.createProjectTemplate?.id as string;
      const createdProject = await handleCreateProject({
        name: previewTemplate?.name,
        visibility: {
          type: ProjectVisibility.Public,
        },
        ownerIds: [],
        templateId: templateId,
      });

      const createdProjectId = createdProject?.data?.createProject
        ?.id as string;

      const groups = previewTemplate.groups || [];

      // create groups in parallel
      const groupMutations = groups.map((group) => {
        return handleCreateProjectGroup(createdProjectId, {
          name: group?.name,
        });
      });
      const createdGroups = await Promise.all(groupMutations);

      // create custom fields for first group
      if (
        createdGroups.length > 0 &&
        (previewTemplate?.customFields?.length || 0) > 0
      ) {
        const createdGroupId = createdGroups[0]?.data?.createProjectGroup
          ?.id as string;

        const customColumnMutations = previewTemplate?.customFields?.map(
          (field) => {
            return mutateCreateCustomColumnForGroup({
              variables: {
                input: {
                  groupId: createdGroupId,
                  name: field.name,
                  type:
                    field.type === ProjectGroupCustomAttributeType.Text
                      ? ProjectGroupCustomAttributeType.Text
                      : ProjectGroupCustomAttributeType.Number,
                },
              },
            });
          },
        );
        if (customColumnMutations) {
          await Promise.all(customColumnMutations);
        }
      }

      // create tasks in parallel for each group
      const taskMutations = groups.map((group, index) => {
        const createdGroupId = createdGroups[index]?.data?.createProjectGroup
          ?.id as string;

        const tasks = group?.tasks || [];
        const firstStatusId = createdProject?.data?.createProject
          ?.projectStatuses?.[0]?.id as string;

        return Promise.all(
          tasks.map((task) => {
            return mutateCreateTask({
              variables: {
                input: {
                  name: task,
                  projectId: createdProjectId,
                  groupId: createdGroupId,
                  projectStatusId: firstStatusId,
                },
              },
            });
          }),
        );
      });
      await Promise.all(taskMutations);

      Message.success('Template applied successfully');
      navigateProjectPage({
        navigate,
        companySlug: activeCompany?.slug as string,
        projectId: createdProjectId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getSelectableWorkspaces = () => {
    const projectWorkspace = workspaces.find((workspace) =>
      workspace?.projects?.some(
        (project) => project?.id === projectToPerform?.id,
      ),
    );

    return workspaces.filter(
      (workspace) => workspace?.id !== projectWorkspace?.id,
    );
  };

  const getWorkspaceOptions = (): SelectOption[] => {
    const selectableWorkspaces = getSelectableWorkspaces();

    return selectableWorkspaces.map((workspace) => ({
      label: workspace?.name,
      value: workspace?.id as string,
    }));
  };

  const getDuplicateProjectWorkspaceOptions = (): SelectOption[] => {
    const projectWorkspace = workspaces.find((workspace) =>
      workspace?.projects?.some(
        (project) => project?.id === projectToPerform?.id,
      ),
    );
    const selectableWorkspaces = getSelectableWorkspaces();

    const otherWorkspaceOptions = selectableWorkspaces.map((workspace) => ({
      label: workspace?.name,
      value: workspace?.id as string,
    }));

    return [
      { label: 'Same workspace', value: projectWorkspace?.id as string },
      ...otherWorkspaceOptions,
    ];
  };

  const getCompanyMemberOptions = (): SelectOption[] => {
    if (!activeCompany?.members) {
      return [];
    }

    return activeCompany.members.map((member) => ({
      label: member?.user?.name || member?.user?.email,
      value: member?.id as string,
      extra: {
        profileImage: member?.user?.profileImage,
      },
    }));
  };

  const getCompanyTeamOptions = (): SelectOption[] => {
    if (!queryData?.companyTeams) {
      return [];
    }

    return queryData.companyTeams.map((team) => ({
      label: team?.title,
      value: team?.id as string,
    }));
  };

  const isWorkspaceDefault = () => {
    return activeWorkspace?.id?.includes('DEFAULT');
  };

  const location = useLocation();

  useEffect(() => {
    const search = location?.search;

    if (search.includes('new-company')) {
      modalState.modalProjectTemplatesGallery.onOpen();
    }
  }, [location]);

  return (
    <>
      <div>
        <div className="p-2">
          <Dropdown
            trigger="click"
            popupVisible={popupVisible}
            onVisibleChange={setPopupVisible}
            droplist={
              <div className="w-72 bg-white">
                <Menu className={styles.selector}>
                  {getSelectableWorkspaces().map((workspace) => (
                    <Menu.Item
                      key={`${workspace?.id}`}
                      className="flex h-12 items-center"
                      onClick={() => handleChangeWorkspace(workspace)}
                    >
                      <Avatar
                        className={`gk-bg ${workspace?.bgColor}`}
                        shape="square"
                        size={32}
                        name={workspace?.name}
                      />

                      <span className="menu-text">{workspace?.name}</span>
                    </Menu.Item>
                  ))}
                </Menu>

                <hr className="my-2" />

                <Menu>
                  <Menu.Item key="add-workspace" onClick={handleAddWorkspace}>
                    <MdAdd className="align-[-2px]" />{' '}
                    <span className="menu-text">Add workspace</span>
                  </Menu.Item>
                </Menu>
              </div>
            }
          >
            <div className="menu border">
              <Avatar
                className={`gk-bg ${activeWorkspace?.bgColor}`}
                shape="square"
                size={32}
                name={activeWorkspace?.name}
              />

              <div className="menu-text">{activeWorkspace?.name}</div>

              <IconDown />
            </div>
          </Dropdown>
        </div>

        {isWorkspaceDefault() === false && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              type="outline"
              size="small"
              style={{
                width: '95%',
              }}
              icon={<MdSettings className="w-3 h-3 ml-2" />}
              onClick={() => {
                modalState.workspace.onOpen();
                setEditWorkspace(activeWorkspace);
              }}
            >
              Workspace Settings
            </Button>
          </div>
        )}

        <Menu
          className={styles.sidebar}
          selectedKeys={[projectId || '']}
          onClickMenuItem={handleClickProjectListMenuItem}
        >
          <Menu.Item
            key="all"
            className="!bg-gray-100 !pr-1 text-base hover:!bg-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-1">All projects</div>

              <Dropdown
                trigger="click"
                droplist={
                  <Menu onClickMenuItem={handleClickWorkspaceMenuItem}>
                    {activeWorkspace?.id !== 'DEFAULT_WORKSPACE' && (
                      <>
                        <Menu.Item key="edit">Edit Workspace</Menu.Item>
                        <hr />
                      </>
                    )}

                    <Menu.Item key="archive">View archived projects</Menu.Item>

                    {activeWorkspace?.id !== 'DEFAULT_WORKSPACE' && (
                      <>
                        <hr />
                        <Menu.Item key="delete">Delete Workspace</Menu.Item>
                      </>
                    )}
                  </Menu>
                }
              >
                <MdMoreVert
                  className="h-4 w-4"
                  onClick={(e) => e.stopPropagation()}
                />
              </Dropdown>
            </div>
          </Menu.Item>

          <Button
            long
            type="outline"
            size="small"
            icon={<MdAdd className="w-3 h-3 ml-2" />}
            onClick={modalState.createProject.onOpen}
          >
            Add Project
          </Button>
          {Configs.env.ENABLE_PROJECT_TEMPLATES && (
            <Button
              long
              type="text"
              size="small"
              className="text-gray-600 mt-2"
              // icon={<IconApps className="w-3 h-3 ml-2" />}
              onClick={handleOpenProjectTemplatesGalleryModal}
            >
              Project Templates
            </Button>
          )}

          <hr className="my-2" />

          {activeWorkspace?.projects
            ?.filter((project) => !project?.archived)
            .map((project) => (
              <Menu.Item
                key={`${project?.id}`}
                className="!bg-gray-100 !pr-1 text-base hover:!bg-gray-200"
              >
                <div className="flex items-center">
                  <div className="flex-1 truncate">
                    <MdOutlineFolderOpen className="mr-4 h-4 w-4 align-[-2px]" />{' '}
                    {project?.name}
                  </div>

                  <Dropdown
                    trigger="click"
                    droplist={
                      <Menu
                        onClickMenuItem={(key, event) =>
                          handleClickProjectMenuItem({
                            key,
                            event,
                            project,
                          })
                        }
                      >
                        <Menu.Item key="edit">Edit Project</Menu.Item>
                        <Menu.Item key="move">Move Project</Menu.Item>
                        <Menu.Item key="duplicate">Duplicate Project</Menu.Item>
                        <Menu.Item key="archive">Archive Project</Menu.Item>
                        <hr />
                        <Menu.Item key="archived-tasks">
                          View archived tasks
                        </Menu.Item>
                        <hr />
                        <Menu.Item key="delete">Delete Project</Menu.Item>
                      </Menu>
                    }
                  >
                    <MdMoreVert
                      className="h-4 w-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Dropdown>
                </div>
              </Menu.Item>
            ))}
        </Menu>
      </div>

      <EditWorkspaceModal
        visible={modalState.workspace.visible}
        companyMemberOptions={getCompanyMemberOptions()}
        companyTeamOptions={getCompanyTeamOptions()}
        onCancel={handleCloseWorkspaceModal}
        loading={mutateCreateWorkspaceLoading || mutateUpdateWorkspaceLoading}
        workspace={editWorkspace}
        onCreate={handleCreateWorkspace}
        onUpdate={handleUpdateWorkspace}
      />
      <CreateProjectModal
        visible={modalState.createProject.visible}
        onCancel={modalState.createProject.onClose}
        loading={mutateCreateProjectLoading}
        templateLoading={
          mutateCreateProjectTemplateLoading || mutateEditProjectTemplateLoading
        }
        templates={queryData?.projectTemplates}
        companyTeamOptions={getCompanyTeamOptions()}
        companyMemberOptions={getCompanyMemberOptions()}
        onCreate={handleCreateProject}
        onCreateTemplate={handleCreateProjectTemplate}
        onUpdateTemplate={handleUpdateProjectTemplate}
        onDeleteTemplate={handleOpenDeleteProjectTemplateConfirmation}
      />

      {Configs.env.ENABLE_PROJECT_TEMPLATES && (
        <ProjectTemplateGallery
          galleryOptions={queryData?.globalProjectTemplateGallery}
          visible={modalState.modalProjectTemplatesGallery.visible}
          onOpen={handleOpenProjectTemplatesGalleryModal}
          onClose={modalState.modalProjectTemplatesGallery.onClose}
          onApplyTemplateGallery={handleApplyTemplateGallery}
        />
      )}

      <EditProjectModal
        visible={modalState.editProject.visible}
        onCancel={handleCloseEditProjectModal}
        loading={updateProjectLoading}
        project={projectToPerform}
        companyTeamOptions={getCompanyTeamOptions()}
        companyMemberOptions={getCompanyMemberOptions()}
        onUpdate={handleUpdateProject}
      />

      <MoveProjectModal
        visible={modalState.move.visible}
        onCancel={handleCloseMoveProjectModal}
        loading={mutateMoveProjectsToWorkspaceLoading}
        workspaceOptions={getWorkspaceOptions()}
        onSubmit={handleMoveProject}
      />

      <DuplicateProjectModal
        visible={modalState.duplicate.visible}
        onCancel={handleCloseDuplicateProjectModal}
        loading={mutateCopyProjectLoading}
        workspaceOptions={getDuplicateProjectWorkspaceOptions()}
        onSubmit={handleDuplicateProject}
      />
    </>
  );
};

const taskSubNavQuery = gql`
  query TaskSubNav($companyId: ID!) {
    companyTeams(companyId: $companyId) {
      id
      title
    }
    projectTemplates(companyId: $companyId) {
      id
      name
      columns
      statuses {
        id
        name
        color
        notify
      }
    }

    globalProjectTemplateGallery {
      galleryTemplates
    }
  }
`;

const createWorkspaceMutation = gql`
  mutation CreateWorkspace($input: CreateWorkspaceInput!) {
    createWorkspace(input: $input) {
      id
    }
  }
`;

const updateWorkspaceMutation = gql`
  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {
    updateWorkspace(input: $input) {
      id
    }
  }
`;

const deleteWorkspacesMutation = gql`
  mutation DeleteWorkspaces($input: DeleteWorkspacesInput!) {
    deleteWorkspaces(input: $input) {
      id
    }
  }
`;

const createProjectMutation = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      projectStatuses {
        id
      }
    }
  }
`;

const deleteProjectsMutation = gql`
  mutation DeleteProjects($input: DeleteProjectsInput!) {
    deleteProjects(input: $input) {
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

const createProjectTemplateMutation = gql`
  mutation CreateProjectTemplate($input: ProjectTemplateInput!) {
    createProjectTemplate(input: $input) {
      id
    }
  }
`;

const editProjectTemplateMutation = gql`
  mutation EditProjectTemplate($input: ProjectTemplateEditInput!) {
    editProjectTemplate(input: $input) {
      id
    }
  }
`;

const createProjectTemplateStatusMutation = gql`
  mutation CreateProjectTemplateStatus(
    $input: CreateProjectTemplateStatusInput!
  ) {
    createProjectTemplateStatus(input: $input) {
      id
    }
  }
`;

const editProjectTemplateStatusMutation = gql`
  mutation EditProjectTemplateStatus($input: ProjectTemplateStatusEditInput!) {
    editProjectTemplateStatus(input: $input) {
      id
    }
  }
`;

const deleteProjectTemplateStatusesMutation = gql`
  mutation DeleteProjectTemplateStatuses(
    $input: ProjectTemplateStatusIdsInput!
  ) {
    deleteProjectTemplateStatuses(input: $input) {
      id
    }
  }
`;

const deleteProjectTemplatesMutation = gql`
  mutation DeleteProjectTemplates($input: DeleteProjectTemplateIdsInput!) {
    deleteProjectTemplates(input: $input) {
      id
    }
  }
`;

const editProjectSettingsMutation = gql`
  mutation EditProjectSettings($input: ProjectSettingsEditInput!) {
    editProjectSettings(input: $input) {
      columns
    }
  }
`;

const addToVisibilityWhitelistProjectMutation = gql`
  mutation AddToVisibilityWhitelistProject(
    $input: AddToProjectVisibilityWhitelistInput!
  ) {
    addToVisibilityWhitelistProject(input: $input) {
      id
    }
  }
`;

const addToWorkspaceVisibilityWhitelist = gql`
  mutation AddToWorkspaceVisibilityWhitelist(
    $input: AddToWorkspaceVisibilityWhitelistInput!
  ) {
    addToWorkspaceVisibilityWhitelist(input: $input) {
      id
    }
  }
`;

const removeFromVisibilityWhitelistProjectMutation = gql`
  mutation RemoveFromVisibilityWhitelistProject(
    $input: RemoveFromProjectVisibilityWhitelistInput!
  ) {
    removeFromVisibilityWhitelistProject(input: $input) {
      id
    }
  }
`;

const removeFromWorkspaceVisibilityWhitelistProjectMutation = gql`
  mutation RemoveFromWorkspaceVisibilityWhitelist(
    $input: RemoveFromWorkspaceVisibilityWhitelistInput!
  ) {
    removeFromWorkspaceVisibilityWhitelist(input: $input) {
      id
    }
  }
`;

const updateProjectMutation = gql`
  mutation UpdateProject($input: ProjectUpdateInput!) {
    updateProject(input: $input) {
      id
    }
  }
`;

const createProjectStatusMutation = gql`
  mutation CreateProjectStatus($input: CreateProjectStatusInput!) {
    createProjectStatus(input: $input) {
      id
    }
  }
`;

const editProjectStatusMutation = gql`
  mutation EditProjectStatus($input: ProjectStatusEditInput!) {
    editProjectStatus(input: $input) {
      id
    }
  }
`;

const deleteProjectStatusesMutation = gql`
  mutation DeleteProjectStatuses($input: DeleteProjectStatusInput!) {
    deleteProjectStatuses(input: $input) {
      id
    }
  }
`;

const setProjectVisibilityMutation = gql`
  mutation SetProjectVisibility($input: SetProjectVisibilityInput!) {
    setProjectVisibility(input: $input) {
      id
    }
  }
`;

const setWorkspaceVisibilityMutation = gql`
  mutation SetWorkspaceVisibility($input: SetWorkspaceVisibilityInput!) {
    setWorkspaceVisibility(input: $input) {
      id
    }
  }
`;

const copyProjectMutation = gql`
  mutation CopyProject($input: CopyProjectInput!) {
    copyProject(input: $input) {
      id
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

const createProjectGroupMutation = gql`
  mutation CreateProjectGroupTaskSub($input: CreateProjectGroupInput!) {
    createProjectGroup(input: $input) {
      id
    }
  }
`;

const createTaskMutation = gql`
  mutation CreateTaskTaskSubNav($input: TaskInput!) {
    createTask(input: $input) {
      id
    }
  }
`;

const createCustomColumnForGroupMutation = gql`
  mutation CreateCustomColumnForGroupTaskSubNav(
    $input: CreateCustomColumnForGroupInput!
  ) {
    createCustomColumnForGroup(input: $input) {
      group {
        id
      }
    }
  }
`;

export default TaskSubNav;
