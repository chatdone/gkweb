import { Button, Table } from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { useState } from 'react';
import {
  MdAdd,
  MdKeyboardBackspace,
  MdOutlineRemoveRedEye,
  MdEdit,
} from 'react-icons/md';

import EditInvoiceItemModal, {
  FormValues as InvoiceItemFormValues,
} from './EditInvoiceItemModal';
import EditInvoicePaymentModal, {
  FormValues as InvoicePaymentFormValues,
} from './EditInvoicePaymentModal';
import PreviewInvoiceModal from './PreviewInvoiceModal';

import { useDisclosure } from '@/hooks';

import { BillingService } from '@/services';

import { formatToCurrency } from '@/utils/currency.utils';

import { TERM_OPTIONS } from '@/constants/billing.constants';

import { ArrayElement, SelectOption } from '@/types';

import { ProjectPageQuery } from 'generated/graphql-types';

type QueryInvoice = ArrayElement<ProjectPageQuery['billingInvoices']>;

type QueryInvoiceItem = ArrayElement<NonNullable<QueryInvoice>['items']>;

type Props = {
  invoice: QueryInvoice;
  loading: boolean;
  paymentLoading: boolean;
  taskOptions: SelectOption[];
  onBack: () => void;
  onEdit: () => void;
  onCreateItem: (values: InvoiceItemFormValues) => void;
  onUpdateItem: (item: QueryInvoiceItem, values: InvoiceItemFormValues) => void;
  onDeleteItem: (item: QueryInvoiceItem, callback: () => void) => void;
  onCreatePayment: (values: InvoicePaymentFormValues) => void;
  onDelete: () => void;
  onSend: () => void;
  onVoid: (callback: () => void) => void;
};

const InvoiceDetails = (props: Props) => {
  const {
    invoice,
    loading,
    paymentLoading,
    taskOptions,
    onBack,
    onEdit,
    onCreateItem,
    onUpdateItem,
    onDeleteItem,
    onCreatePayment,
    onDelete,
    onSend,
    onVoid,
  } = props;

  const [editInvoiceItem, setEditInvoiceItem] = useState<QueryInvoiceItem>();

  const modalState = {
    item: useDisclosure(),
    payment: useDisclosure(),
    preview: useDisclosure(),
  };

  const handleEditItem = (item: QueryInvoiceItem) => {
    setEditInvoiceItem(item);

    modalState.item.onOpen();
  };

  const handleCloseModal = () => {
    setEditInvoiceItem(undefined);

    modalState.item.onClose();
  };

  const handleDownloadInvoice = () => {
    invoice?.id && BillingService.downloadInvoice(invoice.id);
  };

  const handleAddItem = async (values: InvoiceItemFormValues) => {
    try {
      await onCreateItem(values);

      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateItem = async (values: InvoiceItemFormValues) => {
    if (!editInvoiceItem) {
      return;
    }

    try {
      await onUpdateItem(editInvoiceItem, values);

      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePayment = async (values: InvoicePaymentFormValues) => {
    try {
      await onCreatePayment(values);

      modalState.payment.onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePayment = async (values: InvoicePaymentFormValues) => {
    //
  };

  const getTotalAmount = () => {
    if (!invoice?.items || invoice.void) {
      return 0;
    }

    return invoice.items.reduce((prev, item) => prev + (item?.billed || 0), 0);
  };

  const getBalanceDueAmount = () => {
    if (!invoice?.items || invoice.void) {
      return 0;
    }

    return (
      invoice.items.reduce((prev, item) => prev + (item?.billed || 0), 0) -
      (invoice.totalReceived || 0)
    );
  };

  const getTermsLabel = () => {
    // TODO: remove ts-ignore once schema is updated
    return (
      // @ts-ignore
      TERM_OPTIONS.find((option) => option.value === invoice?.terms)?.label ||
      '-'
    );
  };

  const columns: ColumnProps<QueryInvoiceItem>[] = [
    {
      title: '#',
      width: 25,
      align: 'center',
      render: (col, item, index) => {
        return <div className="text-gray-300">{index + 1}</div>;
      },
    },
    {
      title: 'Item',
      width: 300,
      render: (col, item) => {
        return (
          <Button
            className="p-0"
            type="text"
            onClick={() => handleEditItem(item)}
          >
            {item?.task?.name || item?.itemName}
          </Button>
        );
      },
    },
    {
      title: 'Gross (RM)',
      width: 100,
      align: 'right',
      render: (col, item) => {
        return formatToCurrency(item?.unitPrice || 0);
      },
    },
    {
      title: 'Disc (%)',
      width: 60,
      align: 'right',
      render: (col, item) => {
        return formatToCurrency(item?.discountPercentage || 0);
      },
    },
    {
      title: 'Tax (%)',
      width: 60,
      align: 'right',
      render: (col, item) => {
        return formatToCurrency(item?.taxPercentage || 0);
      },
    },
    {
      title: 'Billed (RM)',
      width: 100,
      align: 'right',
      render: (col, item) => {
        return formatToCurrency(item?.billed || 0);
      },
    },
  ];

  return (
    <>
      <div className="mb-2 flex items-center">
        <div className="flex flex-1 items-center">
          <Button icon={<MdKeyboardBackspace />} onClick={onBack} />

          <div className="px-2 text-base font-bold">{invoice?.docNo}</div>

          <Button icon={<MdEdit />} onClick={onEdit} />
        </div>

        <Button
          icon={<MdAdd />}
          size="small"
          type="primary"
          onClick={modalState.item.onOpen}
        >
          <span className="hidden md:inline">Item</span>
        </Button>
      </div>

      <div className="border border-gray-200 bg-white p-2">
        <div className="mb-2 grid grid-cols-2  divide-x divide-gray-200 md:grid-cols-4">
          <div className="col-span-2 p-2">
            <div className="text-xs text-gray-500">Customer</div>
            <div>{invoice?.contactPic?.name}</div>
          </div>

          <div className="p-2">
            <div className="text-xs text-gray-500">Terms</div>
            <div>{getTermsLabel()}</div>
          </div>

          <div className="p-2">
            <div className="text-xs text-gray-500">Date</div>
            <div>{dayjs(invoice?.docDate).format('MMM DD, YYYY')}</div>
          </div>
        </div>

        <Table
          className="rounded border border-gray-300"
          size="small"
          scroll={{ x: true }}
          columns={columns}
          data={invoice?.items || []}
          pagination={false}
          noDataElement={<div>NOTHING</div>}
          summary={(currentData) =>
            currentData &&
            currentData.length > 0 && (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell className="text-right" colSpan={5}>
                    Discount (RM)
                  </Table.Summary.Cell>

                  <Table.Summary.Cell className="text-right font-bold">
                    {formatToCurrency(invoice?.totalDiscounted || 0)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>

                <Table.Summary.Row>
                  <Table.Summary.Cell className="text-right" colSpan={5}>
                    Tax (RM)
                  </Table.Summary.Cell>

                  <Table.Summary.Cell className="text-right font-bold">
                    {formatToCurrency(invoice?.totalTaxed || 0)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>

                <Table.Summary.Row>
                  <Table.Summary.Cell className="text-right" colSpan={5}>
                    Total (RM)
                  </Table.Summary.Cell>

                  <Table.Summary.Cell className="text-right font-bold">
                    {formatToCurrency(getTotalAmount())}
                  </Table.Summary.Cell>
                </Table.Summary.Row>

                <Table.Summary.Row>
                  <Table.Summary.Cell className="text-right" colSpan={5}>
                    Balance Due (RM)
                  </Table.Summary.Cell>

                  <Table.Summary.Cell className="text-right font-bold">
                    {formatToCurrency(getBalanceDueAmount())}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }
        />

        <div className="flex justify-between p-2">
          <Button onClick={modalState.payment.onOpen}>Receive Payment</Button>

          <Button
            type="primary"
            icon={<MdOutlineRemoveRedEye />}
            onClick={modalState.preview.onOpen}
          >
            Preview
          </Button>
        </div>
      </div>

      <div className="py-2">
        <Button type="text" onClick={onDelete}>
          Delete Invoice
        </Button>
      </div>

      <EditInvoiceItemModal
        visible={modalState.item.visible}
        onCancel={handleCloseModal}
        invoiceItem={editInvoiceItem}
        loading={loading}
        taskOptions={taskOptions}
        onCreate={handleAddItem}
        onUpdate={handleUpdateItem}
        onDelete={() =>
          editInvoiceItem && onDeleteItem(editInvoiceItem, handleCloseModal)
        }
      />

      <EditInvoicePaymentModal
        visible={modalState.payment.visible}
        onCancel={modalState.payment.onClose}
        payment={undefined}
        loading={paymentLoading}
        onCreate={handleCreatePayment}
        onUpdate={handleUpdatePayment}
      />

      <PreviewInvoiceModal
        visible={modalState.preview.visible}
        onCancel={modalState.preview.onClose}
        invoiceId={invoice?.id as string}
        onDownload={handleDownloadInvoice}
        onSend={onSend}
        onVoid={onVoid}
      />
    </>
  );
};

export default InvoiceDetails;
