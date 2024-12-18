import {
  Button,
  Grid,
  Modal,
  Space,
  Tooltip,
  Typography,
  Upload,
} from '@arco-design/web-react';
import { UploadItem } from '@arco-design/web-react/es/Upload';
import { useEffect, useState } from 'react';
import { MdOutlineInfo } from 'react-icons/md';

import styles from './BulkAddMemberModal.module.less';

import { TemplateService } from '@/services';

import type { BaseModalConfig } from '@/types';

type Props = BaseModalConfig & {
  loading: boolean;
  onSubmit: (file: File) => void;
};

const BulkAddMemberModal = (props: Props) => {
  const { visible, onCancel, loading, onSubmit } = props;

  const [uploadFileList, setUploadFileList] = useState<UploadItem[]>([]);

  useEffect(() => {
    if (visible) {
      setUploadFileList([]);
    }
  }, [visible]);

  const handleDownloadTemplate = () => {
    TemplateService.downloadCompanyMemberTemplate();
  };

  const handleSubmit = () => {
    if (uploadFileList.length === 0 || !uploadFileList[0].originFile) {
      return;
    }

    onSubmit(uploadFileList[0].originFile);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Add Member"
      onOk={handleSubmit}
      okText="Import"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Space className={styles.wrapper} direction="vertical" size={20}>
        <Grid.Row justify="space-between" align="center">
          <Space>
            <Typography.Text>Download template</Typography.Text>

            <Tooltip content="Download the template to batch invite users to the company and team.">
              <MdOutlineInfo className={styles['tooltip-icon']} />
            </Tooltip>
          </Space>

          <Button
            className={styles['theme-button']}
            onClick={handleDownloadTemplate}
          >
            Download
          </Button>
        </Grid.Row>

        <Upload
          disabled={loading}
          accept=".csv"
          drag
          limit={1}
          autoUpload={false}
          fileList={uploadFileList}
          onChange={(fileList) => setUploadFileList(fileList)}
          tip="Upload once you filled out the info on template. Supported format: .csv"
        />
      </Space>
    </Modal>
  );
};

export default BulkAddMemberModal;
