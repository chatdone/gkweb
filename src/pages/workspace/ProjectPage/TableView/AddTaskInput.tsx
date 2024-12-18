import { Button, Input } from '@arco-design/web-react';
import { useState } from 'react';
import { MdCheck, MdClose } from 'react-icons/md';

type Props = {
  onSubmit: (value: string) => void;
  placeholder?: string;
};

const AddTaskInput = (props: Props) => {
  const { onSubmit, placeholder = '+ Add new task' } = props;

  const [name, setName] = useState<string>('');

  const handleUpdateName = (value: string) => {
    setName(value);
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    onSubmit(trimmed);

    handleClear();
  };

  const handleClear = () => {
    setName('');
  };

  return (
    <Input.Group className="flex">
      <Input
        className="peer ml-6 flex-1"
        placeholder={placeholder}
        value={name}
        onChange={handleUpdateName}
        onPressEnter={handleSubmit}
      />

      <Button
        className="opacity-0 peer-focus:opacity-100"
        icon={<MdCheck />}
        onClick={handleSubmit}
      />

      <Button
        className="opacity-0 peer-focus:opacity-100"
        icon={<MdClose />}
        onClick={handleClear}
      />
    </Input.Group>
  );
};

export default AddTaskInput;
