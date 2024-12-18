import {
  Typography,
  Space,
  Divider,
  Tooltip,
  Spin,
} from '@arco-design/web-react';
import loadable from '@loadable/component';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { MdClose, MdOutlineCloudDownload } from 'react-icons/md';

import styles from './AttachmentViewer.module.less';
import view from './view';

import type { BaseModalConfig } from '@/types';

import type { User } from 'generated/graphql-types';

const Avatar = loadable(() => import('../Avatar'));
const ImageViewer = loadable(() => import('./ImageViewer'));
const Portal = loadable(() => import('./Portal'));

type ViewMode = 'none' | 'image' | 'video' | 'pdf';

type PreviewAttachment = {
  view: ViewMode;
  url: string;
};

export type AttachmentViewerProps = {
  fileName: string;
  createdBy?: User | null;
  createdAt?: string;
  getAttachment?: () => Promise<Blob | undefined>;
  onDownload?: () => void;
};

type Props = BaseModalConfig & AttachmentViewerProps;

const AttachmentViewer = (props: Props) => {
  const {
    visible,
    onCancel,
    fileName,
    createdBy,
    createdAt,
    getAttachment,
    onDownload,
  } = props;

  const [previewAttachment, setPreviewAttachment] =
    useState<PreviewAttachment>();
  const [canViewAttachment, setCanViewAttachment] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && onCancel();

    document.body.addEventListener('keydown', closeOnEscapeKey);

    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [onCancel]);

  useEffect(() => {
    if (visible) {
      handleLoadAttachment();
    }
  }, [getAttachment, visible]);

  const handleLoadAttachment = async () => {
    setLoading(true);

    const res = await getAttachment?.();

    if (res) {
      const mode = getViewMode(res.type);
      const isSupported = isSupportedType(res.type);

      if (isSupported) {
        setPreviewAttachment({
          view: mode,
          url: URL.createObjectURL(res),
        });
      }

      setCanViewAttachment(isSupported);
    } else {
      setCanViewAttachment(false);
    }

    setLoading(false);
  };

  const isSupportedType = (type: string) => {
    const supportedTypes = ['image', 'pdf', 'video'];

    return supportedTypes.some((supportType) => type.includes(supportType));
  };

  const getViewMode = (type: string): ViewMode => {
    if (type.includes('pdf')) {
      return 'pdf';
    } else if (type.includes('image')) {
      return 'image';
    } else if (type.includes('video')) {
      return 'video';
    }

    return 'none';
  };

  const renderViewer = () => {
    if (!canViewAttachment) {
      return <NoPreviewAvailable onDownload={onDownload} />;
    }

    switch (previewAttachment?.view) {
      case 'pdf':
        return <PdfViewer url={previewAttachment.url} />;

      case 'image':
        return <ImageViewer url={previewAttachment.url} />;

      case 'video':
        return <VideoViewer url={previewAttachment.url} />;

      default:
        return <NoPreviewAvailable onDownload={onDownload} />;
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Portal wrapperId="attachment-viewer">
      <div className={styles.modal}>
        <div className={styles.header}>
          <Space size={15}>
            {createdBy && (
              <Avatar
                size={50}
                name={createdBy.name || createdBy.email}
                imageSrc={createdBy.profileImage}
              />
            )}

            <div>
              <Typography.Paragraph className={styles.title}>
                {fileName}
              </Typography.Paragraph>
              {(createdBy || createdAt) && (
                <Typography.Paragraph>
                  {createdBy && (createdBy.name || createdBy.email)} |{' '}
                  {createdAt && dayjs(createdAt).format('DD MMM YYYY')}
                </Typography.Paragraph>
              )}
            </div>
          </Space>

          <Space split={<Divider type="vertical" />}>
            <Tooltip
              className={styles.tooltip}
              color="white"
              content="Download"
              mini
            >
              <MdOutlineCloudDownload
                data-testid="download-button"
                onClick={onDownload}
              />
            </Tooltip>

            <Tooltip
              className={styles.tooltip}
              color="white"
              content="Close"
              mini
            >
              <MdClose data-testid="close-button" onClick={onCancel} />
            </Tooltip>
          </Space>
        </div>

        <div className={styles.content}>
          {loading && <Loading />}
          {!loading && renderViewer()}
        </div>
      </div>
    </Portal>
  );
};

const Loading = () => {
  return (
    <div className={styles['loading-wrapper']}>
      <Spin size={40} />
    </div>
  );
};

const VideoViewer = ({ url }: { url: string }) => {
  return (
    <div
      className={styles['video-viewer-wrapper']}
      data-testid="video-container"
    >
      <video src={url} controls>
        Sorry, your browser doesn't support embedded videos.
      </video>
    </div>
  );
};

const PdfViewer = ({ url }: { url: string }) => {
  return (
    <iframe
      data-testid="pdf-viewer"
      src={url}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

const NoPreviewAvailable = ({ onDownload }: { onDownload?: () => void }) => {
  return (
    <div className={styles['no-preview-wrapper']}>
      <Typography.Text>
        No preview available.{' '}
        <Typography.Text
          className={styles.download}
          underline
          onClick={onDownload}
        >
          Download file
        </Typography.Text>
      </Typography.Text>
    </div>
  );
};

AttachmentViewer.view = (props: AttachmentViewerProps) => {
  return view(props);
};

export default AttachmentViewer;
