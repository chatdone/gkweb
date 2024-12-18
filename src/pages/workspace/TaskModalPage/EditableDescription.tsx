import { Input } from '@arco-design/web-react';
import type { RefInputType } from '@arco-design/web-react/es/Input/interface';
import { useEffect, useRef, useState } from 'react';

import { MarkdownText } from '@/components';

type Props = {
  value: string | undefined;
  onUpdate: (value: string) => void;
};

const EditableDescription = (props: Props) => {
  const { value, onUpdate } = props;

  const [editing, setEditing] = useState<boolean>(false);

  const inputRef = useRef<RefInputType>(null);

  useEffect(() => {
    editing && inputRef.current?.focus();
  }, [editing]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleUpdate = (newValue: string) => {
    setEditing(false);

    const trimmed = newValue.trim();
    if (trimmed === value) {
      return;
    }

    onUpdate(trimmed);
  };

  return editing ? (
    <Input.TextArea
      ref={inputRef}
      className="bg-white text-gray-600"
      allowClear
      autoSize
      placeholder="Add a description"
      defaultValue={value}
      onBlur={(event) => handleUpdate(event.target.value)}
      onPressEnter={(event) => handleUpdate(event.target.value)}
    />
  ) : (
    <div className="arco-textarea bg-white text-gray-600" onClick={handleEdit}>
      <MarkdownText
        componentClassName={{
          link: 'text-blue-600',
        }}
        markdown={value || 'Add a description'}
      />
    </div>
  );
};

export default EditableDescription;
