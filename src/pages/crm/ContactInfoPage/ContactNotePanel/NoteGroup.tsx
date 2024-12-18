import { Space, Typography } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useState } from 'react';

import { Mention } from '@/components';

import NoteCard from './NoteCard';
import styles from './NoteGroup.module.less';

import type { ArrayElement } from '@/types';

import type { ContactInfoPageQuery } from 'generated/graphql-types';

type QueryContact = NonNullable<ContactInfoPageQuery['contact']>;
type QueryContactNote = ArrayElement<QueryContact['notes']>;

type Props = {
  month: string;
  notes: QueryContactNote[];
  mentions: Mention[];
  onUpdate: (note: QueryContactNote, content: string) => void;
  onDelete: (note: QueryContactNote) => void;
};

const NoteGroup = (props: Props) => {
  const { month, notes, mentions, onUpdate, onDelete } = props;

  const [updatingNoteIds, setUpdatingNoteIds] = useState<string[]>([]);

  const handleUpdateNote = async (note: QueryContactNote, content: string) => {
    setUpdatingNoteIds((prev) => [...prev, note?.id as string]);

    await onUpdate(note, content);

    setUpdatingNoteIds((prev) => prev.filter((id) => id !== note?.id));
  };

  return (
    <div className={styles['note-group-container']}>
      <Typography.Title heading={5}>
        {dayjs(month).format('MMMM YYYY')}
      </Typography.Title>

      <Space direction="vertical" size={10}>
        {notes.map((note) => (
          <NoteCard
            key={note?.id}
            note={note}
            mentions={mentions}
            loading={updatingNoteIds.includes(note?.id as string)}
            onUpdate={(content) => handleUpdateNote(note, content)}
            onDelete={() => onDelete(note)}
          />
        ))}
      </Space>
    </div>
  );
};

export default NoteGroup;
