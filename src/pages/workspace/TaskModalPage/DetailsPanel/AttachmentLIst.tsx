import {
  Button,
  Table,
  Upload,
  Avatar as ArcoAvatar,
  Dropdown,
  Menu,
  Typography,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import type { UploadItem } from '@arco-design/web-react/es/Upload';
import { IconCaretDown, IconCaretRight } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { SyntheticEvent, useState } from 'react';
import { MdKeyboardArrowDown, MdMoreVert } from 'react-icons/md';

import { Avatar, OneDriveModal } from '@/components';

import { useDisclosure, useGoogleDrivePicker } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { TASK_ATTACHMENT_ACCEPT_TYPE } from '@/constants/task.constants';

import Icons from '@/assets/icons';

import { ArrayElement } from '@/types';

import {
  ExternalAttachmentInput,
  ExternalFileSource,
  TaskModalPageQuery,
} from 'generated/graphql-types';

type QueryAttachment = ArrayElement<
  NonNullable<TaskModalPageQuery['task']>['attachments']
>;

type Props = {
  attachments: NonNullable<TaskModalPageQuery['task']>['attachments'];
  loading: boolean;
  onUpload: (file: File) => void;
  onLinkExternalAttachments: (attachments: ExternalAttachmentInput[]) => void;
  onPreview: (attachment: QueryAttachment) => void;
  onDownload: (attachment: QueryAttachment) => void;
  onRequestSignature: (attachment: QueryAttachment) => void;
  onDelete: (attachment: QueryAttachment) => void;
  onGoogleDriveOpen: (open: boolean) => void;
};

const AttachmentList = (props: Props) => {
  const {
    attachments,
    loading,
    onUpload,
    onLinkExternalAttachments,
    onDelete,
    onDownload,
    onGoogleDriveOpen,
    onPreview,
    onRequestSignature,
  } = props;

  const { currentUser } = useAppStore();

  const [expand, setExpand] = useState(true);

  const { openPicker, handleMakeDocumentShareable } = useGoogleDrivePicker({
    onFilePicked: (result) => handlePickGoogleDriveFile(result),
    onCancel: () => handleGoogleDriveCancel(),
  });

  const { visible, onClose, onOpen } = useDisclosure();

  const handleToggleExpand = () => {
    setExpand((prev) => !prev);
  };

  const handleGoogleDriveCancel = () => {
    onGoogleDriveOpen(false);
  };

  const handleClickIntegrationMenuItem = (key: string) => {
    if (key === 'google-drive') {
      openPicker({
        setIncludeFolders: true,
      });
      onGoogleDriveOpen?.(true);
    } else if (key === 'one-drive') {
      onOpen();
    }
  };

  const handlePickFile = (fileList: UploadItem[], file: UploadItem) => {
    file.originFile && onUpload(file.originFile);
  };

  const handlePickGoogleDriveFile = async (
    result: google.picker.ResponseObject,
  ) => {
    onGoogleDriveOpen(false);

    try {
      const document = result.docs[0];

      await handleMakeDocumentShareable(document);

      await onLinkExternalAttachments([
        {
          name: document.name,
          source: ExternalFileSource.GoogleDrive,
          type: document.mimeType,
          url: document.url,
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePickOneDriveFile = ({
    name,
    mimeType,
    url,
  }: {
    name: string;
    mimeType: string;
    url: string;
  }) => {
    onLinkExternalAttachments([
      {
        name: name,
        source: ExternalFileSource.OneDrive,
        type: mimeType,
        url,
      },
    ]);
  };

  const columns: ColumnProps<QueryAttachment>[] = [
    {
      title: 'Icon',
      width: 20,
      render: (col, item) => {
        const extension = item?.type?.split('/')[1] || '';

        return (
          <ArcoAvatar
            className={`gk-extension ${extension}`}
            shape="square"
            size={24}
          >
            {extension.toUpperCase()}
          </ArcoAvatar>
        );
      },
    },
    {
      title: 'name',
      render: (col, item) => {
        return <div className="truncate">{item?.name}</div>;
      },
    },
    {
      title: '',
      width: 35,
      render: (col, item) => {
        return (
          <>
            {item?.externalSource === ExternalFileSource.GoogleDrive && (
              <img
                className="h-[20px]"
                src={Icons.googleDrive}
                alt="google-drive"
              />
            )}

            {item?.externalSource === ExternalFileSource.OneDrive && (
              <img className="h-[15px]" src={Icons.oneDrive} alt="one-drive" />
            )}
          </>
        );
      },
    },
    {
      title: 'date',
      width: 100,
      render: (col, item) => {
        return dayjs(item?.createdAt).format('MMM DD, YYYY');
      },
    },
    {
      title: 'user',
      width: 30,
      render: (col, item) => {
        return (
          <Avatar
            size={24}
            name={item?.createdBy?.name || item?.createdBy?.email}
            imageSrc={item?.createdBy?.profileImage}
          />
        );
      },
    },
    {
      title: 'action',
      width: 20,
      render: (col, item) => {
        const isPdf = item?.type?.includes('pdf');
        const canDelete = item?.createdBy?.id === currentUser?.id;

        const handleClickMenuItem = (key: string, event: SyntheticEvent) => {
          event.stopPropagation();

          if (key === 'view') {
            item?.isExternal && item.url
              ? window.open(item.url, '_blank')
              : onPreview(item);
          } else if (key === 'download') {
            onDownload(item);
          } else if (key === 'sign') {
            onRequestSignature(item);
          } else if (key === 'delete') {
            onDelete(item);
          }
        };

        return (
          <Dropdown
            trigger="click"
            droplist={
              <Menu onClickMenuItem={handleClickMenuItem}>
                <Menu.Item key="view">View</Menu.Item>
                <Menu.Item key="download">Download</Menu.Item>
                {/* TODO: Re-enable when release */}
                {/* {isPdf && <Menu.Item key="sign">Add Signature</Menu.Item>} */}
                {canDelete && <Menu.Item key="delete">Delete</Menu.Item>}
              </Menu>
            }
          >
            <Button
              size="mini"
              type="text"
              icon={<MdMoreVert className="text-gray-600" />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <div className="mx-2 my-4 p-2">
        <div className="cursor-pointer font-bold" onClick={handleToggleExpand}>
          {expand ? <IconCaretDown /> : <IconCaretRight />}
          <span className="ml-1">Attachments</span>
        </div>

        {expand && (
          <div className="mt-2 rounded bg-gray-100 p-0.5">
            <Table
              size="small"
              loading={loading}
              border={false}
              columns={columns}
              data={attachments || []}
              showHeader={false}
              pagination={false}
              scroll={{}}
              onRow={(record) => ({
                onClick: () => {
                  record?.isExternal && record.url
                    ? window.open(record.url, '_blank')
                    : onPreview(record);
                },
              })}
              noDataElement={<div>No attachments</div>}
            />

            <div className="flex p-2">
              <Upload
                multiple
                autoUpload={false}
                showUploadList={false}
                accept={TASK_ATTACHMENT_ACCEPT_TYPE}
                onChange={handlePickFile}
              />

              <Dropdown
                trigger="click"
                getPopupContainer={() => window.document.body}
                droplist={
                  <Menu onClickMenuItem={handleClickIntegrationMenuItem}>
                    <Menu.Item key="google-drive" className="flex items-center">
                      <img
                        className="mr-2 h-[15px]"
                        src={Icons.googleDrive}
                        alt="google-drive"
                      />

                      <Typography.Text>Link from Google Drive™</Typography.Text>
                    </Menu.Item>

                    <Menu.Item key="one-drive" className="flex items-center">
                      <img
                        className="mr-2 h-[10px]"
                        src={Icons.oneDrive}
                        alt="one-drive"
                      />

                      <Typography.Text>Link from One Drive</Typography.Text>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button className="ml-2" type="primary">
                  Integrations <MdKeyboardArrowDown />
                </Button>
              </Dropdown>
            </div>
          </div>
        )}
      </div>

      <OneDriveModal
        visible={visible}
        onCancel={onClose}
        onFileSelected={handlePickOneDriveFile}
      />
    </>
  );
};

export default AttachmentList;
