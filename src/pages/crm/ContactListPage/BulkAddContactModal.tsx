import {
  Button,
  Grid,
  Modal,
  Space,
  Typography,
  Upload,
  Select,
  SelectProps,
} from '@arco-design/web-react';
import type { UploadItem } from '@arco-design/web-react/es/Upload';
import { useEffect, useState } from 'react';
import { MdClose, MdFilePresent } from 'react-icons/md';

import styles from './BulkAddContactModal.module.less';

import type { BaseModalConfig } from '@/types';

export type BulkFile = {
  file: File;
  groupId?: string;
};

type Props = BaseModalConfig & {
  title: string;
  loading: boolean;
  onSubmit: (files: BulkFile[]) => void;
  onDownloadTemplate: () => void;
  contactGroupOptions: SelectProps['options'];
};

const BulkAddContactModal = (props: Props) => {
  const {
    visible,
    onCancel,
    title,
    loading,
    onSubmit,
    onDownloadTemplate,
    contactGroupOptions,
  } = props;

  const [uploadList, setUploadList] = useState<UploadItem[]>([]);
  const [filesGroupId, setFilesGroupId] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      setUploadList([]);
      setFilesGroupId({});
    }
  }, [visible]);

  const trimmedFileName = (name: string) => {
    if (name.length > 30) {
      return `${name.substring(0, 25)}...${name.substring(
        name.length - 10,
        name.length,
      )}`;
    }

    return name;
  };

  const handleSubmit = () => {
    if (uploadList.length === 0) {
      return;
    }

    const submitFiles: BulkFile[] = uploadList.map((item) => ({
      file: item.originFile as File,
      groupId: filesGroupId[item.uid],
    }));

    onSubmit(submitFiles);
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
    >
      <Space
        className={styles['batch-modal-content-wrapper']}
        direction="vertical"
        size={20}
      >
        <Grid.Row justify="space-between" align="center">
          <Typography.Text>Download template</Typography.Text>

          <Button
            className={styles['theme-button']}
            onClick={onDownloadTemplate}
          >
            Download
          </Button>
        </Grid.Row>

        <Upload
          drag
          accept=".csv"
          autoUpload={false}
          tip="or download template below"
          fileList={uploadList}
          onChange={(fileList) => setUploadList(fileList)}
          renderUploadList={(fileList, props) => (
            <Space className={styles['file-list']} direction="vertical">
              {fileList.map((file) => {
                const groupId = filesGroupId[file.uid];

                return (
                  <div key={file.uid} className={styles['file-list-item']}>
                    <div className={styles['file']}>
                      <Space>
                        <MdFilePresent />

                        <Typography.Text>
                          {trimmedFileName(file.name as string)}
                        </Typography.Text>
                      </Space>

                      <Select
                        style={{ width: 152 }}
                        allowClear
                        placeholder="Select a group"
                        value={groupId}
                        options={contactGroupOptions}
                        onChange={(value) => {
                          setFilesGroupId((prev) => ({
                            ...prev,
                            [file.uid]: value,
                          }));
                        }}
                      />
                    </div>

                    <Button
                      icon={<MdClose />}
                      size="small"
                      type="text"
                      onClick={() => {
                        const newGroupIds = { ...filesGroupId };
                        delete newGroupIds[file.uid];
                        setFilesGroupId(newGroupIds);

                        props.onRemove?.(file);
                      }}
                    />
                  </div>
                );
              })}
            </Space>
          )}
        />
      </Space>
    </Modal>
  );
};

export default BulkAddContactModal;
