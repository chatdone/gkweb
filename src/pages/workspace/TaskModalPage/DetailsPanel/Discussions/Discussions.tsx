import { IconCaretDown, IconCaretRight } from '@arco-design/web-react/icon';
import { cloneDeep } from 'lodash-es';
import { useState } from 'react';

import { Mention } from '@/components';
import CommentBox from '@/components/CommentBox/CommentBox';

import Comment from './Comment';

import { TASK_ATTACHMENT_ACCEPT_TYPE } from '@/constants/task.constants';

import { ArrayElement } from '@/types';

import { TaskModalPageQuery } from 'generated/graphql-types';

type QueryAttachment = ArrayElement<
  NonNullable<TaskModalPageQuery['task']>['attachments']
>;

type QueryTaskComment = ArrayElement<
  NonNullable<TaskModalPageQuery['task']>['comments']
>;

type QueryTaskCommentAttachment = ArrayElement<
  NonNullable<QueryTaskComment>['attachments']
>;

type Props = {
  comments: NonNullable<TaskModalPageQuery['task']>['comments'];
  attachments: NonNullable<TaskModalPageQuery['task']>['attachments'];
  mentions: Mention[];
  onPostComment: (input: {
    commentJsonString: string;
    files: File[];
    linkAttachments: QueryAttachment[];
    replyComment?: QueryTaskComment;
  }) => void;
  onUpdateComment: (
    comment: QueryTaskComment,
    commentJsonString: string,
  ) => void;
  onDeleteComment: (comment: QueryTaskComment) => void;
  onViewAttachment: (attachment: QueryTaskCommentAttachment) => void;
  onUnlinkAttachmentFromComment: (
    comment: QueryTaskComment,
    attachment: QueryTaskCommentAttachment,
  ) => void;
};

const Discussions = (props: Props) => {
  const {
    comments,
    attachments,
    mentions,
    onPostComment,
    onUpdateComment,
    onDeleteComment,
    onViewAttachment,
    onUnlinkAttachmentFromComment,
  } = props;

  const [expand, setExpand] = useState(true);

  const handleToggleExpand = () => {
    setExpand((prev) => !prev);
  };

  return (
    <div className="m-2 p-2">
      <div className="cursor-pointer font-bold" onClick={handleToggleExpand}>
        {expand ? <IconCaretDown /> : <IconCaretRight />}
        <span className="ml-1">Discussion</span>
      </div>

      {expand && (
        <div>
          <div className="my-2">
            <CommentBox
              mentions={mentions}
              attachments={attachments || []}
              accept={TASK_ATTACHMENT_ACCEPT_TYPE}
              linkTooltip={
                attachments?.length
                  ? undefined
                  : 'Please upload new attachment to link it to your comment'
              }
              onSubmit={onPostComment}
            />
          </div>

          {cloneDeep(comments)
            ?.reverse()
            .map((comment) => (
              <Comment
                key={comment?.id}
                comment={comment}
                mentions={mentions}
                attachments={attachments}
                onDelete={() => onDeleteComment(comment)}
                onUnlinkAttachment={(attachment) =>
                  onUnlinkAttachmentFromComment(comment, attachment)
                }
                onViewAttachment={onViewAttachment}
                onUpdate={(commentJsonString) =>
                  onUpdateComment(comment, commentJsonString)
                }
                onReply={(input) =>
                  onPostComment({ ...input, replyComment: comment })
                }
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Discussions;
