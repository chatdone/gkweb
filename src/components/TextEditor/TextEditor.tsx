import { Tag } from '@arco-design/web-react';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import {
  LexicalComposer,
  InitialEditorStateType,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import type { EditorState, LexicalEditor } from 'lexical';
import { get } from 'lodash-es';
import type { ReactNode } from 'react';

import styles from './TextEditor.module.less';
import nodes from './nodes';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import MentionsPlugin, { Mention } from './plugins/MentionPlugin';
import ToolbarPlugin, { ToolbarPluginProps } from './plugins/ToolbarPlugin';
import theme from './theme';

type Props<T> = {
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  placeholder?: string;
  mentions?: Mention[];
  initialEditorState?: InitialEditorStateType;
  editable?: boolean;
  toolbarProps?: ToolbarPluginProps<T>;
  previewAttachmentsProps?: {
    upload?: {
      files?: File[];
      onRemove?: (file: File) => void;
    };
    link?: {
      attachments?: T[];
      onRemove?: (attachment: T) => void;
    };
  };
};

const TextEditor = <T,>(props: Props<T>) => {
  const {
    onChange,
    placeholder,
    mentions = [],
    initialEditorState,
    editable = true,
    toolbarProps,
    previewAttachmentsProps,
  } = props;

  return (
    <LexicalComposer
      initialConfig={{
        namespace: 'text-editor',
        nodes,
        theme,
        editable,
        onError: (error) => console.error(error),
        editorState: initialEditorState,
      }}
    >
      <div className={editable ? styles['editor-inner'] : undefined}>
        {editable && <ToolbarPlugin {...toolbarProps} />}

        <div className="p-[2px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={
                  editable
                    ? styles['editor-input']
                    : styles['read-only-editor-input']
                }
              />
            }
            placeholder={
              placeholder ? <Placeholder>{placeholder}</Placeholder> : ''
            }
          />
        </div>

        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        <AutoLinkPlugin />
        <LinkPlugin />
        <MentionsPlugin mentions={mentions} />
        <ClearEditorPlugin />
        <PreviewAttachments
          filesToUpload={previewAttachmentsProps?.upload?.files}
          onRemoveFile={previewAttachmentsProps?.upload?.onRemove}
          linkAttachments={previewAttachmentsProps?.link?.attachments}
          onRemoveLinkAttachment={previewAttachmentsProps?.link?.onRemove}
        />
      </div>
    </LexicalComposer>
  );
};

const Placeholder = ({ children }: { children: ReactNode }) => {
  return <div className={styles.placeholder}>{children}</div>;
};

const PreviewAttachments = <T,>({
  filesToUpload,
  linkAttachments,
  onRemoveLinkAttachment,
  onRemoveFile,
}: {
  filesToUpload?: File[];
  linkAttachments?: T[];
  onRemoveLinkAttachment?: (attachment: T) => void;
  onRemoveFile?: (file: File) => void;
}) => {
  const visible =
    (filesToUpload && filesToUpload.length > 0) ||
    (linkAttachments && linkAttachments.length > 0);

  if (!visible) {
    return null;
  }

  return (
    <div className="flex flex-wrap py-2 px-4">
      {linkAttachments?.map((attachment) => (
        <Tag
          key={get(attachment, 'id')}
          className="bg-white"
          closable
          onClose={() => onRemoveLinkAttachment?.(attachment)}
        >
          {get(attachment, 'name')}
        </Tag>
      ))}

      {filesToUpload?.map((file, index) => (
        <Tag
          key={index}
          className="bg-white"
          closable
          bordered
          onClose={() => onRemoveFile?.(file)}
        >
          {file.name}
        </Tag>
      ))}
    </div>
  );
};

export default TextEditor;
