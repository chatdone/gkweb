import { Button, DatePicker, Modal, Table, Tag } from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import dayjs from 'dayjs';
import { MdAdd } from 'react-icons/md';

import AddTimeCostModal, {
  FormValues as AddTimeCostFormValues,
} from './AddTimeCostModal';

import { useDisclosure } from '@/hooks';

import { BaseModalConfig } from '@/types';

type Props = BaseModalConfig & {
  onAddTimeCost: (values: AddTimeCostFormValues) => void;
};

const TimeCostDetailsModal = (props: Props) => {
  const { visible, onCancel, onAddTimeCost } = props;

  const modalState = useDisclosure();

  const columns: ColumnProps[] = [
    {
      title: '#',
      width: 25,
      align: 'center',
      render: (col, record, index) => {
        return <div className="text-gray-300">{index + 1}</div>;
      },
    },
    {
      title: 'Time',
      width: 160,
      render: (col, record) => {
        const start = dayjs();
        const end = dayjs().add(1, 'day');

        let startFormat = "MMM D 'YY";
        let endFormat = "MMM D 'YY";

        const startTimeFormat = start.format('m') === '0' ? 'hA' : 'h:mmA';
        const endTimeFormat = end.format('m') === '0' ? 'hA' : 'h:mmA';
        if (start.isSame(end, 'year')) {
          startFormat = 'MMM D';
          endFormat = 'MMM D';
        }

        return (
          <DatePicker.RangePicker
            showTime
            value={[start, end]}
            triggerElement={
              <div className="cursor-pointer">
                <div className="relative -m-2 h-12 w-full">
                  <div className="absolute top-0 left-0 flex h-full w-full items-center">
                    <div className="w-1/2 py-2 pl-2">
                      <div>
                        <span className="mr-2 font-bold text-gray-300">IN</span>

                        {start.format(startFormat)}

                        <Tag bordered className="ml-2 font-bold">
                          {start.format(startTimeFormat)}
                        </Tag>
                      </div>
                    </div>

                    <div className="w-1/2 border-l border-gray-200 py-2 pl-2">
                      <div>
                        <span className="mr-2 font-bold text-gray-300">
                          OUT
                        </span>

                        {end.format(endFormat)}

                        <Tag bordered className="ml-2 font-bold">
                          {start.format(endTimeFormat)}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        );
      },
    },
    {
      title: 'Duration',
      width: 80,
      align: 'center',
      render: (col, record) => {
        const start = dayjs();
        const end = dayjs().add(1, 'day');
        const duration = end.diff(start, 'hour', true);

        return <div>{duration} hrs</div>;
      },
    },
  ];

  return (
    <>
      <Modal
        className="w-full max-w-3xl"
        visible={visible}
        onCancel={onCancel}
        title="Time Cost Details"
        footer={null}
      >
        <div>
          <div className="mb-2 flex">
            <div className="w-20">Task</div>
            <div className="font-bold">Task Name</div>
          </div>

          <div className="mb-8 flex">
            <div className="w-20">Member</div>
            <div className="font-bold">Member Name</div>
          </div>
        </div>

        <Table
          className="rounded border border-gray-300"
          size="small"
          scroll={{ x: true }}
          columns={columns}
          data={[{}]}
          pagination={false}
          noDataElement={<div>NOTHING</div>}
        />

        <div className="py-2">
          <Button
            className="mt-2"
            size="mini"
            type="text"
            icon={<MdAdd />}
            onClick={modalState.onOpen}
          >
            Add Time
          </Button>
        </div>
      </Modal>

      <AddTimeCostModal
        visible={modalState.visible}
        onCancel={modalState.onClose}
        loading={false}
        onSubmit={onAddTimeCost}
      />
    </>
  );
};

export default TimeCostDetailsModal;
