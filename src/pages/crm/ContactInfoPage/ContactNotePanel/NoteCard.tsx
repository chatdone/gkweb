import {
  Space,
  Card,
  Button,
  Dropdown,
  Menu,
  Typography,
  Grid,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import {
  EditorState,
  LexicalEditor,
  $createTextNode,
  $getRoot,
  $createParagraphNode,
} from 'lexical';
import { useEffect, useRef, useState } from 'react';
import { MdMoreVert } from 'react-icons/md';

import { Avatar, Mention, TextEditor } from '@/components';

import styles from './NoteCard.module.less';

import { useAppStore } from '@/stores/useAppStore';

import type { ArrayElement } from '@/types';

import type { ContactInfoPageQuery } from 'generated/graphql-types';

type QueryContact = NonNullable<ContactInfoPageQuery['contact']>;
type QueryContactNote = ArrayElement<QueryContact['notes']>;

type Props = {
  note: QueryContactNote;
  mentions: Mention[];
  loading: boolean;
  onUpdate: (content: string) => void;
  onDelete: () => void;
};

const NoteCard = (props: Props) => {
  const { note, mentions, loading, onUpdate, onDelete } = props;

  const { currentUser } = useAppStore();

  const [edit, setEdit] = useState<boolean>(false);

  const editorRef = useRef<{
    editorState: EditorState;
    editor: LexicalEditor;
  }>();

  useEffect(() => {
    if (!loading) {
      setEdit(false);
    }
  }, [loading]);

  useEffect(() => {
    if (editorRef.current && note?.noteContent) {
      const updatedState = editorRef.current.editor.parseEditorState(
        note.noteContent,
      );

      editorRef.current.editor.setEditorState(updatedState);
    }
  }, [note]);

  const handleEditNote = () => {
    if (note?.user?.id !== currentUser?.id) {
      return;
    }

    setEdit(true);
  };

  const handleCancelEdit = () => {
    setEdit(false);
  };

  const handleClickMenuItem = (key: string) => {
    if (key === 'edit') {
      handleEditNote();
    } else if (key === 'delete') {
      onDelete();
    }
  };

  const handleEditorStateChange = (
    editorState: EditorState,
    editor: LexicalEditor,
  ) => {
    editorRef.current = { editor, editorState };
  };

  const handleSave = () => {
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

    onUpdate(JSON.stringify(editorRef.current.editorState));
  };

  const handleSetInitialEditorState = (editor: LexicalEditor) => {
    if (editorRef.current) {
      editor.setEditorState(editorRef.current.editorState);
    } else if (note?.noteContent) {
      const initialEditorState = editor.parseEditorState(note.noteContent);

      editor.setEditorState(initialEditorState);
    } else if (note?.content) {
      editor.update(() => {
        const root = $getRoot();
        const paragraphNode = $createParagraphNode();
        const textNode = $createTextNode(note.content as string);

        paragraphNode.append(textNode);

        root.append(paragraphNode);
      });
    }
  };

  return (
    <Card className={edit ? styles['edit-card'] : styles['note-card']}>
      {!edit && (
        <div>
          <Space direction="vertical" size={10}>
            <Space size={15}>
              <Avatar
                size={30}
                name={note?.user?.name || note?.user?.email}
                imageSrc={note?.user?.profileImage}
              />

              <div>
                <Typography.Paragraph className={styles.name}>
                  {note?.user?.name || note?.user?.email}
                </Typography.Paragraph>

                <Typography.Paragraph className={styles.date}>
                  {dayjs(note?.date).format('DD MMM YY [at] hh:mm A')}
                </Typography.Paragraph>
              </div>
            </Space>

            <div className={styles.content}>
              <TextEditor
                initialEditorState={handleSetInitialEditorState}
                onChange={handleEditorStateChange}
                editable={false}
              />
            </div>
          </Space>

          {currentUser?.id === note?.user?.id && (
            <Dropdown
              position="br"
              droplist={
                <Menu onClickMenuItem={handleClickMenuItem}>
                  <Menu.Item key="edit">Edit</Menu.Item>
                  <Menu.Item key="delete">Delete</Menu.Item>
                </Menu>
              }
            >
              <Button icon={<MdMoreVert />} type="text" />
            </Dropdown>
          )}
        </div>
      )}

      {edit && (
        <Space direction="vertical">
          <Space size={20} align="start">
            <Avatar
              size={30}
              name={note?.user?.name || note?.user?.email}
              imageSrc={note?.user?.profileImage}
            />

            <TextEditor
              placeholder="Write a note..."
              initialEditorState={handleSetInitialEditorState}
              mentions={mentions}
              onChange={handleEditorStateChange}
            />
          </Space>

          <Grid.Row justify="end">
            <Button onClick={handleCancelEdit} disabled={loading}>
              Cancel
            </Button>

            <Button
              className={styles['theme-button']}
              style={{ marginLeft: '0.5rem' }}
              onClick={handleSave}
              loading={loading}
            >
              Save
            </Button>
          </Grid.Row>
        </Space>
      )}
    </Card>
  );
};

export default NoteCard;
