import { Select, Tag } from '@arco-design/web-react';
import { useState } from 'react';

type Props = {
  onChange: (value: string) => void;
};

const ApprovalStatusSelect = (props: Props) => {
  const { onChange } = props;

  const [editing, setEditing] = useState<boolean>(false);

  return editing ? (
    <Select
      options={[
        {
          label: 'New',
          value: 'new',
        },
        {
          label: 'Approve',
          value: 'approve',
        },
        {
          label: 'Rejected',
          value: 'rejected',
        },
      ]}
      onChange={(value) => {
        onChange(value);

        setEditing(false);
      }}
    />
  ) : (
    <Tag
      className="w-full cursor-pointer text-center capitalize"
      bordered
      color={colors['new']}
      onClick={() => setEditing(true)}
    >
      New
    </Tag>
  );
};

const colors = {
  new: 'blue',
  approve: 'green',
  rejected: 'red',
};

export default ApprovalStatusSelect;
