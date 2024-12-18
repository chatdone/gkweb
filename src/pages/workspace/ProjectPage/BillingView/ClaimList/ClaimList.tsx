import { Button, Table } from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { useState } from 'react';
import { MdAdd, MdDelete, MdEdit, MdLogout } from 'react-icons/md';

import { Avatar } from '@/components';

import ApprovalStatusSelect from '../ApprovalStatusSelect';
import EditClaimModal, { FormValues } from './EditClaimModal';

import { useDisclosure } from '@/hooks';

import { formatToCurrency } from '@/utils/currency.utils';

import { SelectOption } from '@/types';

type Props = {
  taskOptions: SelectOption[];
  onCreate: (values: FormValues) => void;
  onUpdate: (claim: unknown, values: FormValues) => void;
  onDelete: (claim: unknown) => void;
};

const ClaimList = (props: Props) => {
  const { taskOptions, onCreate, onUpdate, onDelete } = props;

  const [editClaim, setEditClaim] = useState<unknown>();

  const modalState = useDisclosure();

  const handleCloseModal = () => {
    modalState.onClose();

    setEditClaim(undefined);
  };

  const handleEditClaim = (claim: unknown) => {
    setEditClaim(claim);

    modalState.onOpen();
  };

  const handleUpdateClaim = (values: FormValues) => {
    if (!editClaim) {
      return;
    }

    onUpdate(editClaim, values);
  };

  const columns: ColumnProps[] = [
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
        return dayjs().format('MMM DD, YYYY');
      },
    },
    {
      title: 'Task',
      width: 200,
    },
    {
      title: 'Description',
      width: 200,
      render: (col, record, index) => {
        return <div className="truncate">description</div>;
      },
    },
    {
      title: 'Member',
      width: 80,
      align: 'center',
      render: (col, item) => {
        return <Avatar size={24} />;
      },
    },
    {
      title: 'Amount',
      width: 100,
      align: 'right',
      render: (col, item) => {
        return formatToCurrency(100);
      },
    },
    {
      title: 'Attachment',
      width: 80,
      align: 'center',
    },
    {
      title: 'Status',
      width: 100,
      align: 'center',
      render: (col, item) => {
        return (
          <ApprovalStatusSelect
            onChange={(value) => {
              //
            }}
          />
        );
      },
    },
    {
      key: 'action',
      title: null,
      width: 60,
      bodyCellStyle: {
        backgroundColor: 'rgb(var(--gray-0))',
      },
      render: (col, record) => {
        return (
          <div>
            <MdEdit
              className="mx-1 cursor-pointer text-gray-300 hover:text-gray-900"
              onClick={() => handleEditClaim(record)}
            />

            <MdDelete
              className="mx-1 cursor-pointer text-red-200 hover:text-red-500"
              onClick={() => onDelete(record)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table
        className="rounded border border-gray-300"
        size="small"
        scroll={{ x: true }}
        pagination={false}
        columns={columns}
        data={[{}]}
        noDataElement={<div>There's nothing here yet.</div>}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={5} />

              <Table.Summary.Cell className="text-right font-bold">
                {formatToCurrency(300)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      <div className="mt-2 flex items-center justify-between py-2">
        <Button
          className="mt-2"
          size="mini"
          type="text"
          icon={<MdAdd />}
          onClick={modalState.onOpen}
        >
          Add Claim
        </Button>

        <Button className="mt-2" type="primary" icon={<MdLogout />}>
          Export
        </Button>
      </div>

      <EditClaimModal
        visible={modalState.visible}
        onCancel={handleCloseModal}
        loading={false}
        claim={editClaim}
        taskOptions={taskOptions}
        onCreate={onCreate}
        onUpdate={handleUpdateClaim}
      />
    </>
  );
};

export default ClaimList;
