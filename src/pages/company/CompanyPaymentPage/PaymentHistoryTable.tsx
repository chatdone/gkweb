import {
  Button,
  Dropdown,
  Menu,
  Table,
  Typography,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { MdMoreVert } from 'react-icons/md';

import { formatToCurrency } from '@/utils/currency.utils';

import Icons from '@/assets/icons';

type Props = {
  invoices: unknown[];
};

const PaymentHistoryTable = (props: Props) => {
  const { invoices } = props;

  const columns: ColumnProps<any>[] = [
    {
      title: 'Invoice Number',
      dataIndex: 'number',
    },
    {
      title: 'Date',
      render: (col, item) => {
        return item?.created
          ? dayjs.unix(item.created).format('DD MMMM YYYY')
          : '-';
      },
    },
    {
      title: 'Status',
      align: 'center',
      render: () => {
        return (
          <Typography.Text className="text-green-500">Paid</Typography.Text>
        );
      },
    },
    {
      title: 'Price',
      render: (col, item) => {
        return item?.amount_due && formatToCurrency(item.amount_due / 100);
      },
    },
    {
      title: 'Action',
      width: 80,
      render: (col, item) => {
        const handleClickMenuItem = (key: string) => {
          //   if (key === 'view') {
          //     handleViewInvoice(item);
          //   } else if (key === 'download') {
          //     handleDownloadInvoice(item);
          //   }
        };

        return (
          <Dropdown
            position="br"
            droplist={
              <Menu onClickMenuItem={handleClickMenuItem}>
                <Menu.Item key="view">View</Menu.Item>
                <Menu.Item key="download">Download</Menu.Item>
              </Menu>
            }
          >
            <Button icon={<MdMoreVert />} type="text" />
          </Dropdown>
        );
      },
    },
  ];

  return invoices && invoices.length > 0 ? (
    <Table
      data={invoices}
      columns={columns}
      border={false}
      rowSelection={{}}
      pagination={false}
      scroll={{ x: 1000 }}
    />
  ) : (
    <EmptyTransaction />
  );
};

const EmptyTransaction = () => {
  return (
    <div className="flex flex-col justify-center items-center text-center py-20">
      <img
        className="mb-4"
        src={Icons.emptyList}
        alt="empty"
        width={159}
        height={177}
      />

      <div>
        <Typography.Paragraph className="font-semibold text-base mb-0">
          There's nothing here yet!
        </Typography.Paragraph>
        <Typography.Paragraph className="mb-0">
          Subscribe to a plan to gain access to payment and invoice history
        </Typography.Paragraph>
      </div>
    </div>
  );
};

export default PaymentHistoryTable;
