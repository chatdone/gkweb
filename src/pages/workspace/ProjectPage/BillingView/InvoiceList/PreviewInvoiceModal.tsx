import { Button, Modal, Spin } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

import { BillingService } from '@/services';

import { BaseModalConfig } from '@/types';

type Props = BaseModalConfig & {
  invoiceId: string;
  onSend: () => void;
  onDownload: () => void;
  onVoid: (callback: () => void) => void;
};

const PreviewInvoiceModal = (props: Props) => {
  const { visible, onCancel, invoiceId, onDownload, onSend, onVoid } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [invoiceUrl, setInvoiceUrl] = useState<string>();

  useEffect(() => {
    visible && handleGetInvoice();
  }, [visible, invoiceId]);

  const handleGetInvoice = async () => {
    setLoading(true);

    try {
      const res = await BillingService.getInvoice(invoiceId);

      const url = URL.createObjectURL(res.data);

      setInvoiceUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className="w-full max-w-4xl"
      wrapClassName="full"
      visible={visible}
      onCancel={onCancel}
      title="Invoice Preview"
      footer={null}
    >
      <div className="border-b border-gray-200" style={{ height: '80vh' }}>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spin size={50} />
          </div>
        ) : (
          <iframe width="100%" height="100%" src={invoiceUrl} />
        )}
      </div>

      <div className="p-2">
        <div className="flex">
          <div className="flex-1">
            <Button type="primary" onClick={onSend}>
              Send
            </Button>

            <Button className="ml-2" onClick={onDownload}>
              Download
            </Button>
          </div>

          <Button type="text" onClick={() => onVoid(handleGetInvoice)}>
            Void
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PreviewInvoiceModal;
