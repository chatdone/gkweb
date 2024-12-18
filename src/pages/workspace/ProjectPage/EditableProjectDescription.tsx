import { Input, Tooltip } from '@arco-design/web-react';
import type { RefInputType } from '@arco-design/web-react/es/Input/interface';
import { useEffect, useRef, useState } from 'react';
import { MdEdit } from 'react-icons/md';

type Props = {
  onClick?: () => void;
  onUpdate: (value: string) => void;
  value?: string;
};

const EditableProjectDescription = (props: Props) => {
  const { onClick, onUpdate, value } = props;

  const [editing, setEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  const inputRef = useRef<RefInputType>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();

      value && setEditValue(value);
    }
  }, [editing, value]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleUpdateEditValue = (newValue: string) => {
    setEditValue(newValue);
  };

  const handleSubmit = () => {
    setEditing(false);

    const trimmed = editValue.trim();
    if (trimmed === value || !trimmed) {
      return;
    }

    onUpdate(trimmed);
  };

  const getIsEllipsisActive = () => {
    if (!divRef.current) {
      return false;
    }

    return divRef.current.offsetWidth < divRef.current.scrollWidth;
  };

  return (
    <div className={`flex cursor-pointer items-center pl-4`}>
      {!editing ? (
        <>
          <Tooltip content={getIsEllipsisActive() ? value : undefined}>
            <div ref={divRef} className="flex-1 truncate" onClick={onClick}>
              {value}
            </div>
          </Tooltip>

          <div className="pl-2 pb-1">
            <MdEdit
              className=" text-gray-400 hover:text-gray-900"
              onClick={handleEdit}
            />
          </div>
        </>
      ) : (
        <div className="flex-1">
          <Input.TextArea
            ref={inputRef}
            autoSize={{ minRows: 2, maxRows: 6 }}
            allowClear
            placeholder="Add a task name"
            showWordLimit
            maxLength={500}
            style={{ width: 350 }}
            value={editValue}
            onChange={handleUpdateEditValue}
            onBlur={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default EditableProjectDescription;
