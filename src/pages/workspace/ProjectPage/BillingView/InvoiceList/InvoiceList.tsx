import { Button, Table } from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { FormValues as InvoiceItemFormValues } from './EditInvoiceItemModal';
import { FormValues as InvoicePaymentFormValues } from './EditInvoicePaymentModal';
import InvoiceDetails from './InvoiceDetails';

import { formatToCurrency } from '@/utils/currency.utils';

import { ArrayElement, SelectOption } from '@/types';

import { ProjectPageQuery } from 'generated/graphql-types';

type QueryInvoice = ArrayElement<ProjectPageQuery['billingInvoices']>;

type QueryInvoiceItem = ArrayElement<NonNullable<QueryInvoice>['items']>;

type Props = {
  invoices: ProjectPageQuery['billingInvoices'];
  itemLoading: boolean;
  paymentLoading: boolean;
  taskOptions: SelectOption[];
  onShowDetails: (visible: boolean) => void;
  onEditInvoice: (invoice: QueryInvoice) => void;
  onDeleteInvoice: (invoice: QueryInvoice, callback: () => void) => void;
  onSendInvoice: (invoice: QueryInvoice) => void;
  onVoidInvoice: (invoice: QueryInvoice, callback: () => void) => void;
  onAddInvoiceItem: (
    invoice: QueryInvoice,
    values: InvoiceItemFormValues,
  ) => void;
  onUpdateInvoiceItem: (
    item: QueryInvoiceItem,
    values: InvoiceItemFormValues,
  ) => void;
  onDeleteInvoiceItem: (item: QueryInvoiceItem, callback: () => void) => void;
  onCreateInvoicePayment: (
    invoice: QueryInvoice,
    values: InvoicePaymentFormValues,
  ) => void;
};

const InvoiceList = (props: Props) => {
  const {
    invoices,
    itemLoading,
    paymentLoading,
    taskOptions,
    onShowDetails,
    onEditInvoice,
    onDeleteInvoice,
    onSendInvoice,
    onVoidInvoice,
    onAddInvoiceItem,
    onUpdateInvoiceItem,
    onDeleteInvoiceItem,
    onCreateInvoicePayment,
  } = props;

  const [viewInvoice, setViewInvoice] = useState<QueryInvoice>();

  useEffect(() => {
    if (viewInvoice && invoices) {
      const updatedInvoice = invoices.find(
        (invoice) => invoice?.id === viewInvoice.id,
      );

      updatedInvoice && setViewInvoice(updatedInvoice);
    }
  }, [invoices]);

  const handleViewInvoice = (invoice: QueryInvoice) => {
    setViewInvoice(invoice);

    onShowDetails(true);
  };

  const handleCancelViewInvoice = () => {
    setViewInvoice(undefined);
    onShowDetails(false);
  };

  const getTotalBilledAmount = () => {
    if (!invoices) {
      return 0;
    }

    return invoices.reduce(
      (prev, invoice) => prev + calculateInvoiceBilledAmount(invoice),
      0,
    );
  };

  const getTotalBalanceAmount = () => {
    if (!invoices) {
      return 0;
    }

    return invoices.reduce(
      (prev, invoice) =>
        prev +
        (invoice?.void
          ? 0
          : calculateInvoiceBilledAmount(invoice) -
            (invoice?.totalReceived || 0)),
      0,
    );
  };

  const calculateInvoiceBilledAmount = (invoice: QueryInvoice) => {
    if (!invoice?.items) {
      return 0;
    }

    return invoice.items.reduce((prev, item) => prev + (item?.billed || 0), 0);
  };

  const columns: ColumnProps<QueryInvoice>[] = [
    {
      title: '#',
      dataIndex: 'index',
      width: 25,
      align: 'center',
      render: (col, item, index) => {
        return <div className="text-gray-300">{index + 1}</div>;
      },
    },
    {
      title: 'Date',
      width: 100,
      render: (col, item) => {
        return dayjs(item?.docDate).format('MMM DD, YYYY');
      },
    },
    {
      title: 'Reference',
      width: 100,
      render: (col, item) => {
        return (
          <Button
            className="p-0"
            type="text"
            size="small"
            onClick={() => handleViewInvoice(item)}
          >
            {item?.docNo}
          </Button>
        );
      },
    },
    {
      title: 'Customer',
      width: 200,
      dataIndex: 'contactPic.name',
    },
    {
      title: 'Billed (RM)',
      width: 100,
      align: 'right',
      render: (col, item) => {
        const amount = calculateInvoiceBilledAmount(item);

        return formatToCurrency(amount);
      },
    },
    {
      title: 'Balance Due (RM)',
      width: 100,
      align: 'right',
      render: (col, item) => {
        const amount =
          calculateInvoiceBilledAmount(item) - (item?.totalReceived || 0);

        return item?.void ? formatToCurrency(0) : formatToCurrency(amount);
      },
    },
    {
      title: 'Void',
      width: 50,
      align: 'right',
      render: (col, item) => {
        return item?.void ? 'Yes' : 'No';
      },
    },
  ];

  return (
    <>
      {viewInvoice ? (
        <InvoiceDetails
          invoice={viewInvoice}
          loading={itemLoading}
          paymentLoading={paymentLoading}
          taskOptions={taskOptions}
          onBack={handleCancelViewInvoice}
          onEdit={() => onEditInvoice(viewInvoice)}
          onSend={() => onSendInvoice(viewInvoice)}
          onVoid={(callback) => onVoidInvoice(viewInvoice, callback)}
          onCreateItem={(values) => onAddInvoiceItem(viewInvoice, values)}
          onUpdateItem={onUpdateInvoiceItem}
          onDeleteItem={onDeleteInvoiceItem}
          onCreatePayment={(values) =>
            onCreateInvoicePayment(viewInvoice, values)
          }
          onDelete={() => onDeleteInvoice(viewInvoice, handleCancelViewInvoice)}
        />
      ) : (
        <Table
          className="rounded border border-gray-300"
          size="small"
          scroll={{ x: true }}
          pagination={false}
          columns={columns}
          data={invoices || []}
          noDataElement={<div>NOTHING</div>}
          summary={(currentData) =>
            currentData &&
            currentData.length > 0 && (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={4} />

                  <Table.Summary.Cell className="text-right font-bold">
                    {formatToCurrency(getTotalBilledAmount())}
                  </Table.Summary.Cell>

                  <Table.Summary.Cell className="text-right font-bold">
                    {formatToCurrency(getTotalBalanceAmount())}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }
        />
      )}
    </>
  );
};

export default InvoiceList;
