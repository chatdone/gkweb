import { Input, Tooltip } from '@arco-design/web-react';
import type { RefInputType } from '@arco-design/web-react/es/Input/interface';
import { useEffect, useRef, useState } from 'react';
import { MdEdit } from 'react-icons/md';

import { TASK_NAME_MAX_LENGTH } from '@/constants/task.constants';

type Props = {
  type?: 'text' | 'number';
  onUpdate: (value: string) => void;
  value?: string;
  className?: string;
};

const EditableInputValue = (props: Props) => {
  const { onUpdate, value, className, type = 'text' } = props;

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
    if (trimmed === value) {
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
    <div className={`flex cursor-pointer items-center ${className}`}>
      {!editing ? (
        <>
          <Tooltip content={getIsEllipsisActive() ? value : undefined}>
            <div ref={divRef} className="flex-1 truncate">
              {value}
            </div>
          </Tooltip>

          <MdEdit
            className="text-gray-400 hover:text-gray-900"
            onClick={handleEdit}
          />
        </>
      ) : (
        <div className="flex-1">
          <Input
            ref={inputRef}
            allowClear
            type={type}
            // placeholder=""
            // showWordLimit
            maxLength={TASK_NAME_MAX_LENGTH}
            value={editValue}
            onChange={handleUpdateEditValue}
            onBlur={handleSubmit}
            onPressEnter={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default EditableInputValue;
