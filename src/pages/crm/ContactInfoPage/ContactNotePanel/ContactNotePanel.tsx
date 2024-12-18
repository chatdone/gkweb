import { gql, useMutation } from '@apollo/client';
import { Space, Input, Typography } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { escapeRegExp, groupBy } from 'lodash-es';
import { useMemo, useState } from 'react';
import { MdSearch } from 'react-icons/md';

import { Mention, CommentBox } from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import styles from './ContactNotePanel.module.less';
import NoteGroup from './NoteGroup';

import { useAppStore } from '@/stores/useAppStore';

import { getUTC } from '@/utils/date.utils';
import { getErrorMessage } from '@/utils/error.utils';

import Icons from '@/assets/icons';

import { ArrayElement } from '@/types';

import type {
  ContactInfoPageQuery,
  CreateContactNoteMutation,
  CreateContactNoteMutationVariables,
  UpdateContactNoteMutation,
  UpdateContactNoteMutationVariables,
  DeleteContactNotesMutation,
  DeleteContactNotesMutationVariables,
} from 'generated/graphql-types';

type QueryContact = NonNullable<ContactInfoPageQuery['contact']>;
type QueryContactNote = ArrayElement<QueryContact['notes']>;

export const contactNotePanelFragment = gql`
  fragment ContactNotePanelFragment on ContactNote {
    id
    noteContent
    content
    date
    user {
      id
      email
      name
      profileImage
    }
  }
`;

type Props = {
  contactId: string;
  contactNotes: QueryContact['notes'];
  refetchQuery: () => void;
};

const ContactNotePanel = (props: Props) => {
  const { contactId, contactNotes, refetchQuery } = props;

  const { currentUser, activeCompany } = useAppStore();

  const [mutateCreateNote] = useMutation<
    CreateContactNoteMutation,
    CreateContactNoteMutationVariables
  >(createContactNoteMutation);
  const [mutateUpdateContactNote] = useMutation<
    UpdateContactNoteMutation,
    UpdateContactNoteMutationVariables
  >(updateContactNoteMutation);
  const [mutateDeleteContactNotes] = useMutation<
    DeleteContactNotesMutation,
    DeleteContactNotesMutationVariables
  >(deleteContactNotesMutation);

  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const noteGroups = useMemo(() => {
    if (!contactNotes) {
      return [];
    }

    let notes = contactNotes;

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'im');

      notes = notes.filter((note) => {
        const parsedNoteContent = note?.noteContent
          ? JSON.parse(note.noteContent)
          : undefined;

        const content = parsedNoteContent
          ? (parsedNoteContent.root.children[0].children[0].text as string)
          : note?.content;

        return (
          note?.user?.name?.match(regex) ||
          note?.user?.email?.match(regex) ||
          content?.match(regex)
        );
      });
    }

    const groups = groupBy(notes, (note) =>
      dayjs(note?.date).format('YYYY-MM-DD'),
    );

    return groups;
  }, [contactNotes, searchKeyword]);

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleOpenDeleteNoteConfirmation = (note: QueryContactNote) => {
    Modal.confirm({
      title: 'Delete Note',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this note?
        </div>
      ),
      onOk: async () => {
        await handleDeleteNote(note);
      },
    });
  };

  const handleCreateNote = async (input: { commentJsonString: string }) => {
    if (!contactId) {
      return;
    }

    try {
      // TODO: camel case
      const res = await mutateCreateNote({
        variables: {
          contactId,
          input: {
            noteContent: input.commentJsonString,
            date: getUTC(dayjs()),
            user_id: currentUser?.id,
            // userId: currentUser?.id
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create note',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateNote = async (note: QueryContactNote, content: string) => {
    if (!note?.id) {
      return;
    }

    try {
      const res = await mutateUpdateContactNote({
        variables: {
          contactNoteId: note.id,
          input: {
            noteContent: content,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update note',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteNote = async (note: QueryContactNote) => {
    if (!note?.id) {
      return;
    }

    try {
      const res = await mutateDeleteContactNotes({
        variables: {
          contactNoteIds: [note.id],
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete note',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMentions = (): Mention[] => {
    if (!activeCompany?.members) {
      return [];
    }

    return activeCompany.members.map((member) => ({
      id: member?.id as string,
      name: (member?.user?.name || member?.user?.email) as string,
    }));
  };

  return (
    <div className={styles.container}>
      <Space direction="vertical" size={30}>
        <Input
          className={styles['search-input']}
          placeholder="Search Notes"
          suffix={<MdSearch />}
          value={searchKeyword}
          onChange={handleUpdateSearchKeyword}
        />

        <CommentBox
          submitText="Save Note"
          placeholder="Write a note..."
          canLinkAttachment={false}
          canUploadAttachment={false}
          mentions={getMentions()}
          onSubmit={handleCreateNote}
        />
      </Space>

      <Space
        className={styles['note-group-wrapper']}
        direction="vertical"
        size={10}
      >
        {Object.entries(noteGroups).map(([key, value]) => (
          <NoteGroup
            key={key}
            month={key}
            notes={value}
            mentions={getMentions()}
            onUpdate={handleUpdateNote}
            onDelete={handleOpenDeleteNoteConfirmation}
          />
        ))}

        {Object.keys(noteGroups).length === 0 && <EmptyNote />}
      </Space>
    </div>
  );
};

const EmptyNote = () => {
  return (
    <div className={styles['empty-note-container']}>
      <img src={Icons.emptySheet} alt="empty" />

      <div>
        <Typography.Paragraph className={styles.title}>
          Add first note
        </Typography.Paragraph>

        <Typography.Paragraph>There's nothing here yet!</Typography.Paragraph>
      </div>
    </div>
  );
};

const createContactNoteMutation = gql`
  mutation CreateContactNote($contactId: ID!, $input: ContactNoteInput!) {
    createContactNote(contactId: $contactId, input: $input) {
      id
    }
  }
`;

const updateContactNoteMutation = gql`
  mutation UpdateContactNote($contactNoteId: ID!, $input: ContactNoteInput!) {
    updateContactNote(contactNoteId: $contactNoteId, input: $input) {
      id
    }
  }
`;

const deleteContactNotesMutation = gql`
  mutation DeleteContactNotes($contactNoteIds: [ID]!) {
    deleteContactNotes(contactNoteIds: $contactNoteIds) {
      id
    }
  }
`;

export default ContactNotePanel;
