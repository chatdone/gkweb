import { Button, Drawer } from '@arco-design/web-react';
import {
  MdContentCopy,
  MdDeleteOutline,
  MdOutlineArchive,
  MdOutlineKeyboardTab,
} from 'react-icons/md';

import { BaseModalConfig } from '@/types';

type Props = BaseModalConfig & {
  itemTitle: string;
  selectedCount: number;
  onDuplicate: () => void;
  onMove: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

const MultiSelectDrawer = (props: Props) => {
  const {
    itemTitle,
    visible,
    onCancel,
    selectedCount,
    onDuplicate,
    onMove,
    onArchive,
    onDelete,
  } = props;

  return (
    <Drawer
      className="border-t border-gray-300 shadow-2xl"
      visible={visible}
      onCancel={onCancel}
      placement="bottom"
      mask={false}
      title={null}
      footer={null}
      height={100}
    >
      <div className="pt-2 text-center">
        <h3 className="mb-2">
          {selectedCount} {selectedCount > 1 ? `${itemTitle}s` : itemTitle}{' '}
          selected
        </h3>

        <Button
          className="mx-1.5"
          icon={<MdContentCopy />}
          onClick={onDuplicate}
        >
          Duplicate
        </Button>

        <Button
          className="mx-1.5"
          icon={<MdOutlineKeyboardTab />}
          onClick={onMove}
        >
          Move
        </Button>

        <Button
          className="mx-1.5"
          icon={<MdOutlineArchive />}
          onClick={onArchive}
        >
          Archive
        </Button>

        <Button
          status="danger"
          className="mx-1.5"
          icon={<MdDeleteOutline />}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </Drawer>
  );
};

export default MultiSelectDrawer;
