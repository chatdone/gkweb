import { Button, Table } from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { useState } from 'react';
import { MdAdd, MdLogout } from 'react-icons/md';

import { Avatar } from '@/components';

import ApprovalStatusSelect from '../ApprovalStatusSelect';
import AddTimeCostEntryModal, {
  FormValues as AddTimeCostEntryFormValues,
} from './AddTimeCostEntryModal';
import { FormValues as AddTimeCostFormValues } from './AddTimeCostModal';
import TimeCostDetailsModal from './TimeCostDetailsModal';

import { useDisclosure } from '@/hooks';

import { formatToCurrency } from '@/utils/currency.utils';

import { SelectOption } from '@/types';

type Props = {
  taskOptions: SelectOption[];
  companyMemberOptions: SelectOption[];
  onAddEntry: (values: AddTimeCostEntryFormValues) => void;
  onAddTimeCost: (
    timeCostEntry: unknown,
    values: AddTimeCostFormValues,
  ) => void;
};

const TimeCostList = (props: Props) => {
  const { taskOptions, companyMemberOptions, onAddEntry, onAddTimeCost } =
    props;

  const [selectedTimeCost, setSelectedTimeCost] = useState<unknown>();

  const modalState = {
    addEntry: useDisclosure(),
    details: useDisclosure(),
  };

  const handleViewTimeCost = (timeCost: unknown) => {
    setSelectedTimeCost(timeCost);

    modalState.details.onOpen();
  };

  const handleCloseDetailsModal = () => {
    setSelectedTimeCost(undefined);

    modalState.details.onClose();
  };

  const handleAddTimeCost = (values: AddTimeCostFormValues) => {
    if (!selectedTimeCost) {
      return;
    }

    onAddTimeCost(selectedTimeCost, values);
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
      title: 'Task',
      width: 200,
      render: (col, item) => {
        return (
          <div
            className="cursor-pointer truncate"
            onClick={() => handleViewTimeCost(item)}
          >
            title
          </div>
        );
      },
    },
    {
      title: 'Member',
      width: 80,
      render: (col, item) => {
        return <Avatar size={24} />;
      },
    },
    {
      title: 'Rate/Hour',
      width: 100,
      align: 'right',
      render: (col, item) => {
        return formatToCurrency(50);
      },
    },
    {
      title: 'Duration',
      width: 80,
      align: 'center',
      render: (col, item) => {
        return `1 hrs`;
      },
    },
    {
      title: 'Amount',
      width: 100,
      align: 'right',
      render: (col, item) => {
        return formatToCurrency(200);
      },
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
        noDataElement={<div>NOTHING</div>}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={4} />

              <Table.Summary.Cell className="text-center font-bold">
                19 hrs
              </Table.Summary.Cell>

              <Table.Summary.Cell className="text-right font-bold">
                {formatToCurrency(300)}
              </Table.Summary.Cell>

              <Table.Summary.Cell colSpan={2} />
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
          onClick={modalState.addEntry.onOpen}
        >
          Add Time Cost
        </Button>

        <Button className="mt-2" type="primary" icon={<MdLogout />}>
          Export
        </Button>
      </div>

      <AddTimeCostEntryModal
        visible={modalState.addEntry.visible}
        onCancel={modalState.addEntry.onClose}
        loading={false}
        taskOptions={taskOptions}
        companyMemberOptions={companyMemberOptions}
        onSubmit={onAddEntry}
      />

      <TimeCostDetailsModal
        visible={modalState.details.visible}
        onCancel={handleCloseDetailsModal}
        onAddTimeCost={handleAddTimeCost}
      />
    </>
  );
};

export default TimeCostList;
