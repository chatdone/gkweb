import { Button, Dropdown, Menu, Tag } from '@arco-design/web-react';
import dayjs from 'dayjs';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  EditorState,
  LexicalEditor,
} from 'lexical';
import { useEffect, useRef, useState } from 'react';
import { MdMoreVert } from 'react-icons/md';

import { Avatar, Mention, TextEditor } from '@/components';
import CommentBox from '@/components/CommentBox/CommentBox';

import { useAppStore } from '@/stores/useAppStore';

import { TASK_ATTACHMENT_ACCEPT_TYPE } from '@/constants/task.constants';

import { ArrayElement } from '@/types';

import { TaskComment, TaskModalPageQuery } from 'generated/graphql-types';

type QueryTaskComment = ArrayElement<
  NonNullable<TaskModalPageQuery['task']>['comments']
>;

type QueryTaskCommentAttachment = ArrayElement<
  NonNullable<QueryTaskComment>['attachments']
>;

type Props = {
  comment: QueryTaskComment;
  mentions: Mention[];
  attachments: NonNullable<TaskModalPageQuery['task']>['attachments'];
  onUpdate: (commentJsonString: string) => void;
  onReply: (input: {
    commentJsonString: string;
    files: File[];
    linkAttachments: QueryTaskCommentAttachment[];
  }) => void;
  onDelete: () => void;
  onViewAttachment: (attachment: QueryTaskCommentAttachment) => void;
  onUnlinkAttachment: (attachment: QueryTaskCommentAttachment) => void;
};

const Comment = (props: Props) => {
  const {
    comment,
    mentions,
    attachments,
    onUpdate,
    onReply,
    onDelete,
    onViewAttachment,
    onUnlinkAttachment,
  } = props;

  const { currentUser } = useAppStore();

  const [editing, setEditing] = useState<boolean>(false);
  const [showReplyEditor, setShowReplyEditor] = useState<boolean>(false);

  const isOwner = comment?.createdBy?.id === currentUser?.id;

  const editorRef = useRef<{
    editorState: EditorState;
    editor: LexicalEditor;
  }>();

  const beforeEditEditorStateRef = useRef<EditorState>();

  useEffect(() => {
    editorRef.current?.editor.setEditable(editing);
  }, [editing]);

  const handleEditorStateChange = (
    editorState: EditorState,
    editor: LexicalEditor,
  ) => {
    editorRef.current = { editor, editorState };
  };

  const handleCancelEdit = () => {
    setEditing(false);

    if (beforeEditEditorStateRef.current) {
      editorRef.current?.editor.setEditorState(
        beforeEditEditorStateRef.current,
      );
    }
  };

  const handleCancelReply = () => {
    setShowReplyEditor(false);
  };

  const handleClickMenuItem = (key: string) => {
    if (key == 'reply') {
      setShowReplyEditor(true);
    } else if (key === 'edit') {
      setEditing(true);
    } else if (key === 'delete') {
      onDelete();
    }
  };

  const handleUpdateComment = () => {
    if (!editorRef.current) {
      return;
    }

    onUpdate(JSON.stringify(editorRef.current.editorState));

    setEditing(false);
  };

  const handleReplyComment = (input: {
    commentJsonString: string;
    files: File[];
    linkAttachments: QueryTaskCommentAttachment[];
  }) => {
    onReply(input);

    handleCancelReply();
  };

  const avatarNode = (
    <div className="p-2">
      <Avatar
        size={24}
        name={comment?.createdBy?.name || comment?.createdBy?.email}
        imageSrc={comment?.createdBy?.profileImage}
      />
    </div>
  );

  return (
    <div>
      <div className="flex">
        {!isOwner && avatarNode}

        <div
          className={`mb-2 flex-1 rounded border bg-white p-2 ${
            isOwner ? 'border-green-200 bg-green-50' : 'border-gray-200'
          }`}
        >
          {comment?.parentTaskComment && (
            <div className="mb-2 rounded bg-gray-100 p-2">
              <div className="flex text-xs">
                <div className="flex-1 opacity-50">
                  {comment.parentTaskComment.createdBy?.name ||
                    comment.parentTaskComment.createdBy?.email}
                </div>

                <div className="opacity-50">
                  {dayjs(comment.parentTaskComment.createdAt).format(
                    'MMM DD, YYYY',
                  )}
                </div>
              </div>

              <TextEditor
                initialEditorState={(editor) =>
                  handleSetInitialEditorState(editor, comment.parentTaskComment)
                }
                onChange={() => {
                  //
                }}
                editable={false}
              />
            </div>
          )}

          <div>
            {!editing && (
              <>
                <div className="flex text-xs">
                  <div className="flex-1 opacity-50">
                    {comment?.createdBy?.name || comment?.createdBy?.email}
                  </div>

                  <div className="opacity-50">
                    {dayjs(comment?.createdAt).format('MMM DD, YYYY')}
                  </div>

                  <div>
                    <Dropdown
                      droplist={
                        <Menu onClickMenuItem={handleClickMenuItem}>
                          <Menu.Item key="reply">Reply</Menu.Item>

                          {isOwner && (
                            <>
                              <Menu.Item key="edit">Edit</Menu.Item>
                              <hr />
                              <Menu.Item key="delete">Delete</Menu.Item>
                            </>
                          )}
                        </Menu>
                      }
                      trigger="click"
                    >
                      <div className="cursor-pointer px-0.5 hover:bg-gray-100">
                        <MdMoreVert className="text-gray-600 hover:text-gray-900" />
                      </div>
                    </Dropdown>
                  </div>
                </div>

                {comment?.attachments && comment?.attachments.length > 0 && (
                  <div className="flex flex-wrap items-center py-2">
                    {comment.attachments.map((attachment, index) => {
                      const extension = attachment?.type?.split('/')[1] || '';

                      return (
                        <Tag
                          key={index}
                          className="mr-2 h-8 cursor-pointer"
                          closable={!attachment?.isDeleted}
                          icon={
                            <Avatar
                              className={`gk-extension ${extension}`}
                              shape="square"
                              size={24}
                              name={extension.toUpperCase()}
                            />
                          }
                          onClick={() => {
                            if (!attachment?.isDeleted) {
                              attachment?.isExternal && attachment.url
                                ? window.open(attachment.url, '_blank')
                                : onViewAttachment(attachment);
                            }
                          }}
                          onClose={(e) => {
                            e.stopPropagation();

                            onUnlinkAttachment(attachment);
                          }}
                        >
                          <div className="ml-2">{attachment?.name}</div>
                        </Tag>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            <TextEditor
              initialEditorState={(editor) =>
                handleSetInitialEditorState(editor, comment)
              }
              onChange={handleEditorStateChange}
              editable={editing}
            />

            {editing && (
              <div className="mt-2 flex justify-end">
                <Button className="mr-2" onClick={handleCancelEdit}>
                  Cancel
                </Button>

                <Button type="primary" onClick={handleUpdateComment}>
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>

        {isOwner && avatarNode}
      </div>

      {showReplyEditor && (
        <div className="flex">
          <div
            className={`mb-2 flex-1 rounded border border-green-200 bg-green-50 p-2`}
          >
            <CommentBox
              mentions={mentions}
              attachments={attachments || []}
              accept={TASK_ATTACHMENT_ACCEPT_TYPE}
              linkTooltip={
                attachments?.length
                  ? undefined
                  : 'Please upload new attachment to link it to your comment'
              }
              submitText="Reply"
              onSubmit={handleReplyComment}
              extraAction={[
                <Button
                  key="cancel"
                  className="mr-2"
                  onClick={handleCancelReply}
                >
                  Cancel
                </Button>,
              ]}
            />
          </div>

          <div className="p-2">
            <Avatar
              size={24}
              name={currentUser?.name || currentUser?.email}
              imageSrc={currentUser?.profileImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const handleSetInitialEditorState = (
  editor: LexicalEditor,
  comment: TaskComment | null | undefined,
) => {
  if (comment?.messageContent) {
    const parsed = JSON.parse(comment.messageContent);

    if (parsed?.root) {
      const initialEditorState = editor.parseEditorState(
        comment.messageContent,
      );

      editor.setEditorState(initialEditorState);
    } else if (parsed?.blocks) {
      const text = parsed?.blocks[0]?.text || '';

      editor.update(() => {
        const root = $getRoot();
        const paragraphNode = $createParagraphNode();
        const textNode = $createTextNode(text);

        paragraphNode.append(textNode);

        root.append(paragraphNode);
      });
    }
  } else if (comment?.message) {
    editor.update(() => {
      const root = $getRoot();
      const paragraphNode = $createParagraphNode();
      const textNode = $createTextNode(comment.message as string);

      paragraphNode.append(textNode);

      root.append(paragraphNode);
    });
  }
};

export default Comment;
