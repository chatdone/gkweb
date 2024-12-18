import { Avatar, Button, Form, Modal, Upload } from '@arco-design/web-react';
import type { UploadItem } from '@arco-design/web-react/es/Upload';
import { useEffect } from 'react';

import { BaseModalConfig } from '@/types';

type Props = BaseModalConfig & {
  loading: boolean;
  onImport: (files: File[]) => void;
  onDownloadTemplate: () => void;
};

const ImportTaskModal = (props: Props) => {
  const { visible, onCancel, loading, onImport, onDownloadTemplate } = props;

  const [form] = Form.useForm<{ files: UploadItem[] }>();

  useEffect(() => {
    visible && form.resetFields();
  }, [visible]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      if (values.files.length === 0) {
        return;
      }

      const files = values.files.map((item) => item.originFile as File);

      onImport(files);
    });
  };

  return (
    <Modal
      className="w-full max-w-lg"
      visible={visible}
      onCancel={onCancel}
      title="Import Tasks"
      okText="Import Tasks"
      confirmLoading={loading}
      onConfirm={handleSubmit}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
    >
      <Form form={form}>
        <Form.Item noStyle field="files">
          <Upload
            className="border border-gray-600"
            drag
            multiple
            accept=".csv"
            tip="Only .csv is supported"
            showUploadList={{
              progressRender: () => <></>,
            }}
          />
        </Form.Item>
      </Form>

      <div className="pt-6 text-center">
        <h3>Import your tasks from excel to GoKudos</h3>
        <h4>Note: Limited to 500 tasks at a time.</h4>

        <div className="mb-4">
          Add your tasks to the template and upload. That's all 😊
        </div>

        <Button className="h-12" type="outline" onClick={onDownloadTemplate}>
          <Avatar className="gk-extension xlsx mr-2" shape="square" size={24}>
            XLSX
          </Avatar>

          <span>Download the template</span>
        </Button>
      </div>
    </Modal>
  );
};

export default ImportTaskModal;
