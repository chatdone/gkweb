import {
  Button,
  Dropdown,
  Menu,
  Upload,
  Tooltip,
} from '@arco-design/web-react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { get } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MdAttachFile,
  MdFormatItalic,
  MdFormatUnderlined,
  MdOutlineFormatBold,
  MdOutlineImage,
} from 'react-icons/md';

const LowPriority = 1;

export type ToolbarPluginProps<T> = {
  uploadProps?: {
    accept?: string;
    onAdd?: (file: File) => void;
  };
  linkAttachmentProps?: {
    attachmentList?: T[];
    onSelect?: (attachment: T) => void;
    tooltip?: string;
  };
};

const ToolbarPlugin = <T,>(props: ToolbarPluginProps<T>) => {
  const { uploadProps, linkAttachmentProps } = props;

  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const toolbarRef = useRef(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const getToolbarItemClassName = (active: boolean) => {
    return active ? '!bg-white' : undefined;
  };

  return (
    <>
      <div ref={toolbarRef}>
        <Button.Group className="flex">
          <Button
            className={getToolbarItemClassName(isBold)}
            icon={<MdOutlineFormatBold />}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
          />
          <Button
            className={getToolbarItemClassName(isItalic)}
            icon={<MdFormatItalic />}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
          />
          <Button
            className={getToolbarItemClassName(isUnderline)}
            icon={<MdFormatUnderlined />}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
          />

          {linkAttachmentProps && (
            <Dropdown
              trigger="click"
              droplist={
                <Menu>
                  {linkAttachmentProps.attachmentList?.map((attachment) => (
                    <Menu.Item
                      key={get(attachment, 'id')}
                      onClick={() => linkAttachmentProps.onSelect?.(attachment)}
                    >
                      {get(attachment, 'name')}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Tooltip
                content={linkAttachmentProps.tooltip}
                getPopupContainer={() => window.document.body}
              >
                <Button aria-label="Attachment" icon={<MdAttachFile />} />
              </Tooltip>
            </Dropdown>
          )}

          {uploadProps && (
            <Upload
              autoUpload={false}
              showUploadList={false}
              accept={uploadProps.accept}
              onChange={(_, file) =>
                file.originFile && uploadProps.onAdd?.(file.originFile)
              }
            >
              <Button aria-label="Image" icon={<MdOutlineImage />} />
            </Upload>
          )}
        </Button.Group>

        {/* <Button
          // className={
          //   styles['toolbar-item spaced' + (isUnderline ? 'active' : '')]
          // }
          aria-label="Format list number"
          icon={<MdFormatListNumbered />}
        />

        <Button
          // className={
          //   styles['toolbar-item spaced' + (isUnderline ? 'active' : '')]
          // }
          aria-label="Format list number"
          icon={<MdFormatListBulleted />}
        /> */}
      </div>
    </>
  );
};

export default ToolbarPlugin;
