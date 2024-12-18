import { gql, useMutation } from '@apollo/client';
import bytes from 'bytes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AttachmentViewer, Mention } from '@/components';
import DedocoModal from '@/components/DedocoModal';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import AttachmentList from './AttachmentLIst';
import CheckList from './CheckList';
import Discussions from './Discussions';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { TaskService } from '@/services';

import { getErrorMessage } from '@/utils/error.utils';

import { navigateCompanySubscriptionsPage } from '@/navigation';

import { ArrayElement } from '@/types';

import {
  CompanyMemberType,
  ExternalAttachmentInput,
  LinkAttachmentToCommentInput,
  TaskModalPageQuery,
  CreateChecklistMutation,
  CreateChecklistMutationVariables,
  UpdateChecklistMutation,
  UpdateChecklistMutationVariables,
  DeleteChecklistsMutation,
  DeleteChecklistsMutationVariables,
  UploadTaskAttachmentMutation,
  UploadTaskAttachmentMutationVariables,
  LinkExternalAttachmentsMutation,
  LinkExternalAttachmentsMutationVariables,
  DeleteTaskAttachmentsMutation,
  DeleteTaskAttachmentsMutationVariables,
  PostTaskCommentMutation,
  PostTaskCommentMutationVariables,
  UpdateTaskCommentMutation,
  UpdateTaskCommentMutationVariables,
  DeleteTaskCommentMutation,
  DeleteTaskCommentMutationVariables,
  LinkAttachmentToCommentMutation,
  LinkAttachmentToCommentMutationVariables,
  UnlinkAttachmentFromCommentMutation,
  UnlinkAttachmentFromCommentMutationVariables,
} from 'generated/graphql-types';

type QueryChecklist = ArrayElement<
  NonNullable<TaskModalPageQuery['task']>['checklists']
>;

type QueryAttachment = ArrayElement<
  NonNullable<TaskModalPageQuery['task']>['attachments']
>;

type QueryTaskComment = ArrayElement<
  NonNullable<TaskModalPageQuery['task']>['comments']
>;

type QueryTaskCommentAttachment = ArrayElement<
  NonNullable<QueryTaskComment>['attachments']
>;

type DedocoVisualBuilderProps = {
  attachments: (QueryAttachment | null)[];
  taskId: string;
  companyId: string;
  userId: string;
  taskBoardId: string;
};

type Props = {
  task: TaskModalPageQuery['task'];
  canAccessDedoco: boolean;
  refetchQuery: () => void;
  onGoogleDriveOpen: (open: boolean) => void;
  isSharedWithMe?: boolean;
  onCompleteDedocoSigning?: () => void;
};

const DetailsPanel = (props: Props) => {
  const {
    task,
    refetchQuery,
    canAccessDedoco,
    onGoogleDriveOpen,
    isSharedWithMe,
    onCompleteDedocoSigning,
  } = props;

  const navigate = useNavigate();

  const { activeCompany, currentUser, getCurrentMember } = useAppStore();

  const [mutateCreateChecklist] = useMutation<
    CreateChecklistMutation,
    CreateChecklistMutationVariables
  >(createChecklistMutation);
  const [mutateUpdateChecklist] = useMutation<
    UpdateChecklistMutation,
    UpdateChecklistMutationVariables
  >(updateChecklistMutation);
  const [mutateDeleteChecklists] = useMutation<
    DeleteChecklistsMutation,
    DeleteChecklistsMutationVariables
  >(deleteChecklistsMutation);
  const [
    mutateUploadTaskAttachment,
    { loading: mutateUploadTaskAttachmentLoading },
  ] = useMutation<
    UploadTaskAttachmentMutation,
    UploadTaskAttachmentMutationVariables
  >(uploadTaskAttachmentMutation);
  const [
    mutateLinkExternalAttachments,
    { loading: mutateLinkExternalAttachmentsLoading },
  ] = useMutation<
    LinkExternalAttachmentsMutation,
    LinkExternalAttachmentsMutationVariables
  >(linkExternalAttachmentsMutation);
  const [
    mutateDeleteTaskAttachments,
    { loading: mutateDeleteTaskAttachmentsLoading },
  ] = useMutation<
    DeleteTaskAttachmentsMutation,
    DeleteTaskAttachmentsMutationVariables
  >(deleteTaskAttachmentsMutation);
  const [mutatePostTaskComment] = useMutation<
    PostTaskCommentMutation,
    PostTaskCommentMutationVariables
  >(postTaskCommentMutation);
  const [mutateUpdateTaskComment] = useMutation<
    UpdateTaskCommentMutation,
    UpdateTaskCommentMutationVariables
  >(updateTaskCommentMutation);
  const [mutateDeleteTaskComment] = useMutation<
    DeleteTaskCommentMutation,
    DeleteTaskCommentMutationVariables
  >(deleteTaskCommentMutation);
  const [mutateLinkAttachmentToComment] = useMutation<
    LinkAttachmentToCommentMutation,
    LinkAttachmentToCommentMutationVariables
  >(linkAttachmentToCommentMutation);
  const [mutateUnlinkAttachmentFromComment] = useMutation<
    UnlinkAttachmentFromCommentMutation,
    UnlinkAttachmentFromCommentMutationVariables
  >(unlinkAttachmentFromCommentMutation);

  const [visualBuilderProps, setVisualBuilderProps] =
    useState<DedocoVisualBuilderProps>({
      attachments: [],
      taskId: '',
      companyId: '',
      userId: '',
      taskBoardId: '',
    });

  const modalState = {
    dedoco: useDisclosure(),
  };

  const handleViewAttachment = (attachment: QueryAttachment) => {
    AttachmentViewer.view({
      fileName: attachment?.name as string,
      createdAt: attachment?.createdAt,
      createdBy: attachment?.createdBy,
      onDownload: () => handleDownloadAttachment(attachment),
      getAttachment: async () => handleGetTaskAttachment(attachment),
    });
  };

  const handleGetTaskAttachment = async (attachment: QueryAttachment) => {
    if (!attachment?.id) {
      return;
    }

    try {
      const res = await TaskService.getTaskAttachment(attachment.id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadAttachment = async (attachment: QueryAttachment) => {
    attachment?.id && TaskService.downloadTaskAttachment(attachment.id);
  };

  const handleBeforeRequestSignature = (attachment: QueryAttachment) => {
    if (!canAccessDedoco) {
      return;
    }

    const title = 'Request Signature';

    Modal.confirmV2({
      title,
      content:
        'This will start the Dedoco signing flow and thus will immediately deduct your quota, do you want to continue?',
      okText: title,
      onConfirm: async () => handleSignatureRequest(attachment),
    });
  };

  const handleSignatureRequest = async (attachment: QueryAttachment) => {
    if (!canAccessDedoco) {
      return;
    }

    setVisualBuilderProps({
      attachments: [attachment],
      taskId: task?.id as string,
      companyId: activeCompany?.id as string,
      userId: currentUser?.id as string,
      taskBoardId: task?.project?.id as string,
    });

    modalState.dedoco.onOpen();
  };

  const handleCompleteDedocoSigning = () => {
    modalState.dedoco.onClose();

    onCompleteDedocoSigning?.();
  };

  const handleBeforeUploadAttachment = (file: File) => {
    const isVideo = file.type.includes('video');
    if (isVideo) {
      const limit = bytes('50MB');

      if (file.size > limit) {
        Message.error(
          'The file exceed the max file size allowed. Max file size allowed for video is 50MB',
          {
            title: `Failed to upload ${file.name}`,
          },
        );

        return;
      }
    }

    if (
      typeof activeCompany?.currentSubscription?.storageQuota === 'number' &&
      (activeCompany.currentSubscription.storageQuota === 0 ||
        file.size > activeCompany?.currentSubscription?.storageQuota)
    ) {
      const currentMember = getCurrentMember();

      Modal.info({
        title: 'Reached Plan Limit',
        content:
          currentMember?.type === CompanyMemberType.Admin
            ? 'Your company storage quota has reached its limit, please upgrade your plan.'
            : 'Your company storage quota has reached its limit, please contact your admin.',
        okText:
          currentMember?.type === CompanyMemberType.Admin
            ? 'Upgrade Plan'
            : undefined,
        onConfirm: () => {
          activeCompany.slug &&
            navigateCompanySubscriptionsPage({
              navigate,
              companySlug: activeCompany.slug,
            });
        },
      });

      return;
    }

    handleUploadAttachment(file);
  };

  const handleCreateChecklistItem = async (title: string) => {
    if (!task?.id) {
      return;
    }

    try {
      const res = await mutateCreateChecklist({
        variables: {
          taskId: task.id,
          input: {
            title: title.trim(),
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create checklist item',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateChecklistItem = async (
    item: QueryChecklist,
    input: { title?: string; checked?: boolean },
  ) => {
    if (!item?.id) {
      return;
    }

    try {
      const res = await mutateUpdateChecklist({
        variables: {
          checklistId: item.id,
          input,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateChecklist: {
            id: item.id,
            ...input,
            __typename: 'Checklist',
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update checklist item',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteChecklistItem = async (item: QueryChecklist) => {
    if (!item?.id) {
      return;
    }

    try {
      const res = await mutateDeleteChecklists({
        variables: {
          checklistIds: [item.id],
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete checklist item',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadAttachment = async (
    file: File,
    options: { commentId?: string; shouldRefetch: boolean } = {
      shouldRefetch: true,
    },
  ) => {
    if (!task?.id) {
      return;
    }

    try {
      const res = await mutateUploadTaskAttachment({
        variables: {
          taskId: task.id,
          attachment: file,
          commentId: options?.commentId,
        },
      });

      if (!res.errors) {
        options.shouldRefetch && refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to upload attachment',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLinkExternalAttachments = async (
    attachments: ExternalAttachmentInput[],
  ) => {
    if (!task?.id) {
      return;
    }

    try {
      const res = await mutateLinkExternalAttachments({
        variables: {
          input: {
            taskId: task.id,
            externalAttachments: attachments,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to link external attachment',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAttachment = async (attachment: QueryAttachment) => {
    if (!attachment?.id) {
      return;
    }

    try {
      const res = await mutateDeleteTaskAttachments({
        variables: {
          taskAttachmentIds: [attachment.id],
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete attachment',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostTaskComment = async ({
    commentJsonString,
    files,
    linkAttachments,
    replyComment,
  }: {
    commentJsonString: string;
    files: File[];
    linkAttachments: QueryAttachment[];
    replyComment?: QueryTaskComment;
  }) => {
    if (!task?.id) {
      return;
    }

    try {
      const res = await mutatePostTaskComment({
        variables: {
          input: {
            taskId: task.id,
            messageContent: commentJsonString,
            parentId: replyComment?.id,
          },
        },
      });

      if (!res?.errors) {
        const commentId = res.data?.postTaskComment?.id;
        if (commentId) {
          await Promise.all(
            files.map((file) =>
              handleUploadAttachment(file, {
                commentId,
                shouldRefetch: false,
              }),
            ),
          );

          await Promise.all(
            linkAttachments.map(
              (attachment) =>
                attachment?.id &&
                handleLinkAttachmentToComment({
                  commentId,
                  attachmentId: attachment.id,
                }),
            ),
          );
        }

        refetchQuery();
      } else {
        Message.error(getErrorMessage(res?.errors), {
          title: 'Failed to post comment',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTaskComment = async (
    comment: QueryTaskComment,
    commentJsonString: string,
  ) => {
    if (!comment?.id) {
      return;
    }

    try {
      const res = await mutateUpdateTaskComment({
        variables: {
          taskCommentId: comment.id,
          input: {
            messageContent: commentJsonString,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update comment',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLinkAttachmentToComment = async (
    input: LinkAttachmentToCommentInput,
  ) => {
    try {
      const res = await mutateLinkAttachmentToComment({
        variables: {
          input,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to link attachment to comment',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnlinkAttachmentFromComment = async (
    comment: QueryTaskComment,
    attachment: QueryTaskCommentAttachment,
  ) => {
    if (!comment?.id || !attachment?.id) {
      return;
    }

    try {
      const res = await mutateUnlinkAttachmentFromComment({
        variables: {
          input: {
            commentId: comment.id,
            attachmentId: attachment.id,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to unlink attachment from comment',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTaskComment = async (comment: QueryTaskComment) => {
    if (!comment?.id) {
      return;
    }

    try {
      const res = await mutateDeleteTaskComment({
        variables: {
          taskCommentId: comment.id,
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete comment',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMentionOptions = (): Mention[] => {
    if (!activeCompany || !task) {
      return [];
    }

    const isSharedWithMe = task?.project?.company?.id !== activeCompany?.id;

    const members = isSharedWithMe
      ? task.members?.map((member) => member?.companyMember)
      : activeCompany.members;

    const memberMentions: Mention[] =
      members?.map((member) => ({
        id: member?.id as string,
        name: member?.user?.name || (member?.user?.email as string),
      })) || [];

    const picMentions: Mention[] =
      task.pics?.map((pic) => ({
        id: pic?.pic?.id as string,
        name: pic?.pic?.name as string,
      })) || [];

    return [...memberMentions, ...picMentions];
  };

  return (
    <>
      <CheckList
        checklists={task?.checklists}
        isSharedWithMe={isSharedWithMe}
        onCreate={handleCreateChecklistItem}
        onUpdate={handleUpdateChecklistItem}
        onDelete={handleDeleteChecklistItem}
      />

      <AttachmentList
        attachments={task?.attachments}
        loading={
          mutateUploadTaskAttachmentLoading ||
          mutateLinkExternalAttachmentsLoading ||
          mutateDeleteTaskAttachmentsLoading
        }
        onUpload={handleBeforeUploadAttachment}
        onLinkExternalAttachments={handleLinkExternalAttachments}
        onGoogleDriveOpen={onGoogleDriveOpen}
        onDelete={handleDeleteAttachment}
        onDownload={handleDownloadAttachment}
        onPreview={handleViewAttachment}
        onRequestSignature={handleBeforeRequestSignature}
      />

      <Discussions
        comments={task?.comments}
        attachments={task?.attachments}
        mentions={getMentionOptions()}
        onPostComment={handlePostTaskComment}
        onUpdateComment={handleUpdateTaskComment}
        onDeleteComment={handleDeleteTaskComment}
        onUnlinkAttachmentFromComment={handleUnlinkAttachmentFromComment}
        onViewAttachment={handleViewAttachment}
      />

      <DedocoModal
        visible={modalState.dedoco.visible}
        onCancel={modalState.dedoco.onClose}
        payload={visualBuilderProps}
        onComplete={handleCompleteDedocoSigning}
      />
    </>
  );
};

const createChecklistMutation = gql`
  mutation CreateChecklist($taskId: ID!, $input: ChecklistInput!) {
    createChecklist(taskId: $taskId, input: $input) {
      id
    }
  }
`;

const updateChecklistMutation = gql`
  mutation UpdateChecklist($checklistId: ID!, $input: ChecklistUpdateInput!) {
    updateChecklist(checklistId: $checklistId, input: $input) {
      id
    }
  }
`;

const deleteChecklistsMutation = gql`
  mutation DeleteChecklists($checklistIds: [ID]!) {
    deleteChecklists(checklistIds: $checklistIds) {
      id
    }
  }
`;

const uploadTaskAttachmentMutation = gql`
  mutation UploadTaskAttachment(
    $taskId: ID!
    $attachment: Upload!
    $commentId: ID
  ) {
    uploadTaskAttachment(
      taskId: $taskId
      attachment: $attachment
      commentId: $commentId
    ) {
      id
    }
  }
`;

const linkExternalAttachmentsMutation = gql`
  mutation LinkExternalAttachments($input: LinkExternalAttachmentsInput!) {
    linkExternalAttachments(input: $input) {
      id
    }
  }
`;

const deleteTaskAttachmentsMutation = gql`
  mutation DeleteTaskAttachments($taskAttachmentIds: [ID]!) {
    deleteTaskAttachments(taskAttachmentIds: $taskAttachmentIds) {
      id
    }
  }
`;

const postTaskCommentMutation = gql`
  mutation PostTaskComment($input: PostCommentInput!) {
    postTaskComment(input: $input) {
      id
    }
  }
`;

const updateTaskCommentMutation = gql`
  mutation UpdateTaskComment(
    $taskCommentId: ID!
    $input: TaskCommentUpdateInput!
  ) {
    updateTaskComment(taskCommentId: $taskCommentId, input: $input) {
      id
    }
  }
`;

const deleteTaskCommentMutation = gql`
  mutation DeleteTaskComment($taskCommentId: ID!) {
    deleteTaskComment(taskCommentId: $taskCommentId) {
      id
    }
  }
`;

const linkAttachmentToCommentMutation = gql`
  mutation LinkAttachmentToComment($input: LinkAttachmentToCommentInput!) {
    linkAttachmentToComment(input: $input) {
      id
    }
  }
`;

const unlinkAttachmentFromCommentMutation = gql`
  mutation UnlinkAttachmentFromComment($input: LinkAttachmentToCommentInput!) {
    unlinkAttachmentFromComment(input: $input) {
      id
      attachments {
        id
      }
    }
  }
`;

export default DetailsPanel;
