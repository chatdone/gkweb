import {
  Button,
  Grid,
  Modal,
  Space,
  Typography,
  Upload,
} from '@arco-design/web-react';
import type { UploadItem } from '@arco-design/web-react/es/Upload';
import { useEffect, useState } from 'react';

import styles from './CompanyMembersPage.module.less';

import { TemplateService } from '@/services';

import type { BaseModalConfig } from '@/types';

type Props = BaseModalConfig & {
  loading: boolean;
  onSubmit: (file: File) => void;
};

const BulkAddCompanyMembersModal = (props: Props) => {
  const { visible, onCancel, loading, onSubmit } = props;

  const [uploadList, setUploadList] = useState<UploadItem[]>([]);

  useEffect(() => {
    if (visible) {
      setUploadList([]);
    }
  }, [visible]);

  const handleDownloadTemplate = () => {
    TemplateService.downloadCompanyMemberTemplate();
  };

  const handleSubmit = () => {
    if (uploadList.length === 0) {
      return;
    }

    uploadList[0].originFile && onSubmit(uploadList[0].originFile);
  };

  return (
    <Modal
      title="Add member by batch"
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
        <Upload
          drag
          accept=".csv"
          limit={1}
          autoUpload={false}
          tip="or download template below"
          fileList={uploadList}
          onChange={(fileList) => setUploadList(fileList)}
        />

        <Grid.Row justify="space-between" align="center">
          <Typography.Text>Download template</Typography.Text>

          <Button
            className={styles['theme-button']}
            onClick={handleDownloadTemplate}
          >
            Download
          </Button>
        </Grid.Row>

        <div>
          <Typography.Text className={styles.title}>
            Steps to upload member by batch
          </Typography.Text>

          <ol>
            <li>Download template</li>
            <li>Fill in the template</li>
            <li>Upload the file</li>
          </ol>
        </div>
      </Space>
    </Modal>
  );
};

export default BulkAddCompanyMembersModal;
