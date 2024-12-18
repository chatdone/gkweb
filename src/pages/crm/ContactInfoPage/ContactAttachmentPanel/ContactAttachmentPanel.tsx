import { gql, useMutation } from '@apollo/client';
import {
  Space,
  Table,
  Typography,
  Input,
  Dropdown,
  Button,
  Menu,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import bytes from 'bytes';
import dayjs from 'dayjs';
import { escapeRegExp } from 'lodash-es';
import { SyntheticEvent, useState } from 'react';
import { MdMoreVert, MdOutlineFilePresent, MdSearch } from 'react-icons/md';

import { Avatar, AttachmentViewer } from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import styles from './ContactAttachmentPanel.module.less';

import { TaskService } from '@/services';

import { getErrorMessage } from '@/utils/error.utils';
import { alphabeticalSort } from '@/utils/sorter.utils';

import type { ArrayElement } from '@/types';

import type {
  User,
  ContactInfoPageQuery,
  DeleteTaskAttachmentsMutation,
  DeleteTaskAttachmentsMutationVariables,
} from 'generated/graphql-types';

type QueryContact = NonNullable<ContactInfoPageQuery['contact']>;
type QueryTaskBoard = ArrayElement<NonNullable<QueryContact['taskBoards']>>;
type QueryTask = ArrayElement<NonNullable<QueryTaskBoard>['tasks']>;
type QueryTaskAttachment = ArrayElement<NonNullable<QueryTask>['attachments']>;

export const contactAttachmentPanelFragment = gql`
  fragment ContactAttachmentPanelFragment on Task {
    id
    attachments {
      id
      name
      fileSize
      createdAt
      createdBy {
        id
        email
        name
        profileImage
      }
    }
  }
`;

type Props = {
  contactTaskBoards: QueryContact['taskBoards'];
  refetchQuery: () => void;
};

const ContactAttachmentPanel = (props: Props) => {
  const { contactTaskBoards, refetchQuery } = props;

  const [mutateDeleteTaskAttachments] = useMutation<
    DeleteTaskAttachmentsMutation,
    DeleteTaskAttachmentsMutationVariables
  >(deleteTaskAttachmentsMutation);

  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleDownloadAttachment = (attachment: QueryTaskAttachment) => {
    attachment?.id && TaskService.downloadTaskAttachment(attachment.id);
  };

  const handleViewAttachment = (attachment: QueryTaskAttachment) => {
    AttachmentViewer.view({
      fileName: attachment?.name as string,
      createdAt: attachment?.createdAt,
      createdBy: attachment?.createdBy as User,
      getAttachment: async () => handleGetTaskAttachment(attachment),
      onDownload: () => handleDownloadAttachment(attachment),
    });
  };

  const handleGetTaskAttachment = async (attachment: QueryTaskAttachment) => {
    if (!attachment?.id) {
      return undefined;
    }

    try {
      const res = await TaskService.getTaskAttachment(attachment.id);

      return res.data;
    } catch (error) {
      return undefined;
    }
  };

  const handleOpenDeleteTaskAttachmentConfirmation = (
    attachment: QueryTaskAttachment,
  ) => {
    Modal.confirm({
      title: 'Delete Attachment',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this attachment?
        </div>
      ),
      onOk: async () => {
        await handleDeleteTaskAttachment(attachment);
      },
    });
  };

  const handleDeleteTaskAttachment = async (
    attachment: QueryTaskAttachment,
  ) => {
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

  const columns: ColumnProps<QueryTaskAttachment>[] = [
    {
      title: 'File Name',
      sorter: alphabeticalSort('name'),
      render: (col, item) => (
        <Space className={styles['file-name']} size={5}>
          <MdOutlineFilePresent /> {item?.name}
        </Space>
      ),
    },
    {
      title: 'Uploaded by',
      width: 125,
      render: (col, item) => (
        <Avatar
          showTooltip
          size={20}
          name={item?.createdBy?.name}
          imageSrc={item?.createdBy?.profileImage}
        />
      ),
    },
    {
      title: 'Size',
      width: 100,
      render: (col, item) =>
        bytes.format(item?.fileSize as number, {
          unitSeparator: ' ',
        }),
    },
    {
      title: 'Date',
      width: 110,
      render: (col, item) => dayjs(item?.createdAt).format('DD MMM YYYY'),
    },
    {
      title: 'Action',
      width: 110,
      render: (col, item) => {
        const handleClickMenuItem = (key: string, event: SyntheticEvent) => {
          event.stopPropagation();

          if (key === 'download') {
            handleDownloadAttachment(item);
          } else if (key === 'delete') {
            handleOpenDeleteTaskAttachmentConfirmation(item);
          }
        };

        return (
          <Dropdown
            droplist={
              <Menu onClickMenuItem={handleClickMenuItem}>
                <Menu.Item key="download">Download</Menu.Item>
                <Menu.Item key="delete">Delete</Menu.Item>
              </Menu>
            }
          >
            <Button type="text" shape="circle" icon={<MdMoreVert />} />
          </Dropdown>
        );
      },
    },
  ];

  const getData = () => {
    if (!contactTaskBoards) {
      return [];
    }

    let attachments: QueryTaskAttachment[] = [];

    contactTaskBoards.forEach((board) => {
      board?.tasks?.forEach((task) => {
        attachments = [...attachments, ...(task?.attachments || [])];
      });
    });

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      attachments = attachments.filter((att) => att?.name?.match(regex));
    }

    return attachments;
  };

  return (
    <>
      <Space style={{ width: '100%' }} direction="vertical" size={25}>
        <div className={styles.header}>
          <Input
            className={styles['search-input']}
            placeholder="Search Attachment"
            suffix={<MdSearch />}
            value={searchKeyword}
            onChange={handleUpdateSearchKeyword}
          />
        </div>

        <Table
          className={styles.table}
          columns={columns}
          data={getData()}
          border={false}
          pagination={{
            showTotal: (total) => (
              <Typography.Text>Total {total} files</Typography.Text>
            ),
          }}
          onRow={(record) => ({
            onClick: () => handleViewAttachment(record),
          })}
        />
      </Space>
    </>
  );
};

const deleteTaskAttachmentsMutation = gql`
  mutation DeleteTaskAttachments($taskAttachmentIds: [ID]!) {
    deleteTaskAttachments(taskAttachmentIds: $taskAttachmentIds) {
      id
    }
  }
`;

export default ContactAttachmentPanel;
