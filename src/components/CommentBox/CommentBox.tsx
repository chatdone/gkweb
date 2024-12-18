import { Button } from '@arco-design/web-react';
import { EditorState, LexicalEditor, CLEAR_EDITOR_COMMAND } from 'lexical';
import { get } from 'lodash-es';
import { ReactNode, useRef, useState } from 'react';

import { TextEditor, Mention } from '@/components';

type Props<T> = {
  mentions: Mention[];
  onSubmit: (input: {
    commentJsonString: string;
    files: File[];
    linkAttachments: T[];
  }) => void;
  submitText?: string;
  placeholder?: string;
  extraAction?: ReactNode;
  attachments?: T[];
  accept?: string;
  canUploadAttachment?: boolean;
  canLinkAttachment?: boolean;
  linkTooltip?: string;
};

const CommentBox = <T,>(props: Props<T>) => {
  const {
    mentions,
    onSubmit,
    submitText = 'Add Comment',
    placeholder = 'Add a comment',
    extraAction,
    attachments,
    accept,
    canLinkAttachment = true,
    canUploadAttachment = true,
    linkTooltip,
  } = props;

  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [linkAttachments, setLinkAttachments] = useState<T[]>([]);

  const editorRef = useRef<{
    editorState: EditorState;
    editor: LexicalEditor;
  }>();

  const handleEditorStateChange = (
    editorState: EditorState,
    editor: LexicalEditor,
  ) => {
    editorRef.current = { editor, editorState };
  };

  const handleAddFile = (file: File) => {
    setFilesToUpload((prev) => [...prev, file]);
  };

  const handleRemoveFile = (file: File) => {
    setFilesToUpload((prev) => prev.filter((prevFile) => prevFile !== file));
  };

  const handleLinkAttachment = (attachment: T) => {
    if (
      linkAttachments.some((link) => get(link, 'id') === get(attachment, 'id'))
    ) {
      return;
    }

    setLinkAttachments((prev) => [...prev, attachment]);
  };

  const handleRemoveLinkAttachment = (attachment: T) => {
    setLinkAttachments((prev) =>
      prev.filter(
        (prevAttachment) =>
          get(prevAttachment, 'id') !== get(attachment, 'id '),
      ),
    );
  };

  const handleSubmit = () => {
    if (!editorRef.current) {
      return;
    }

    let isEmpty = false;

    editorRef.current.editorState.read(() => {
      const content = Array.from(
        editorRef.current?.editorState._nodeMap || [],
      )[1][1].getTextContent();

      isEmpty = content.length === 0;
    });

    if (isEmpty) {
      return;
    }

    onSubmit({
      commentJsonString: JSON.stringify(editorRef.current.editorState),
      files: filesToUpload,
      linkAttachments,
    });

    // @ts-ignore
    editorRef.current.editor.dispatchCommand(CLEAR_EDITOR_COMMAND, {});
    setLinkAttachments([]);
    setFilesToUpload([]);
  };

  return (
    <div>
      <TextEditor
        placeholder={placeholder}
        mentions={mentions}
        onChange={handleEditorStateChange}
        toolbarProps={{
          uploadProps: canUploadAttachment
            ? {
                accept,
                onAdd: handleAddFile,
              }
            : undefined,
          linkAttachmentProps: canLinkAttachment
            ? {
                attachmentList: attachments,
                onSelect: handleLinkAttachment,
                tooltip: linkTooltip,
              }
            : undefined,
        }}
        previewAttachmentsProps={{
          upload: canUploadAttachment
            ? {
                files: filesToUpload,
                onRemove: handleRemoveFile,
              }
            : undefined,
          link: canLinkAttachment
            ? {
                attachments: linkAttachments,
                onRemove: handleRemoveLinkAttachment,
              }
            : undefined,
        }}
      />

      <div className="mt-2 flex justify-end">
        {extraAction}

        <Button type="primary" onClick={handleSubmit}>
          {submitText}
        </Button>
      </div>
    </div>
  );
};

export default CommentBox;
