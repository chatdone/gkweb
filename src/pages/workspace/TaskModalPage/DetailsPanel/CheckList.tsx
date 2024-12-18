import { Button, Checkbox, Input, Table } from '@arco-design/web-react';
import type { RefInputType } from '@arco-design/web-react/es/Input/interface';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { IconCaretDown, IconCaretRight } from '@arco-design/web-react/icon';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineDelete } from 'react-icons/md';

import { ArrayElement } from '@/types';

import { TaskModalPageQuery } from 'generated/graphql-types';

type QueryChecklist = ArrayElement<
  NonNullable<TaskModalPageQuery['task']>['checklists']
>;

type Props = {
  checklists: NonNullable<TaskModalPageQuery['task']>['checklists'];
  onCreate: (title: string) => void;
  onUpdate: (
    item: QueryChecklist,
    input: { title?: string; checked?: boolean },
  ) => void;
  onDelete: (item: QueryChecklist) => void;
  isSharedWithMe?: boolean;
};

const CheckList = (props: Props) => {
  const { checklists, onCreate, onUpdate, onDelete, isSharedWithMe } = props;

  const [expand, setExpand] = useState(true);
  const [title, setTitle] = useState<string>('');

  const handleToggleExpand = () => {
    setExpand((prev) => !prev);
  };

  const handleUpdateTitle = (value: string) => {
    setTitle(value);
  };

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    onCreate(trimmed);

    setTitle('');
  };

  const columns: ColumnProps<QueryChecklist>[] = [
    {
      title: 'check',
      width: 35,
      render: (col, item) => {
        return (
          <Checkbox
            checked={!!item?.checked}
            onChange={(checked) => onUpdate(item, { checked })}
          />
        );
      },
    },
    {
      title: 'name',
      ellipsis: true,
      render: (col, item) => {
        return (
          <EditableText
            value={item?.title || ''}
            onSubmit={(value) => {
              const trimmed = value.trim();
              if (trimmed !== item?.title) {
                onUpdate(item, { title: trimmed });
              }
            }}
          />
        );
      },
    },
    {
      title: 'action',
      width: 40,
      render: (col, item) => {
        return (
          <Button
            size="mini"
            type="text"
            icon={
              <MdOutlineDelete className="text-gray-600 hover:text-red-500" />
            }
            onClick={() => onDelete(item)}
          />
        );
      },
    },
  ];

  return (
    <div className="m-2 p-2">
      <div className="cursor-pointer font-bold" onClick={handleToggleExpand}>
        {expand ? <IconCaretDown /> : <IconCaretRight />}
        <span className="ml-1">Checklist</span>
      </div>

      {expand && (
        <div className="mt-2 rounded bg-gray-100 p-0.5">
          <Table
            size="small"
            border={false}
            columns={
              isSharedWithMe ? columns.slice(0, columns.length - 1) : columns
            }
            data={checklists || []}
            showHeader={false}
            pagination={false}
            scroll={{}}
            noDataElement={<div>No checklist</div>}
          />

          <Input
            className="my-0.5 bg-gray-100 hover:bg-white"
            allowClear
            placeholder="Add a checklist"
            value={title}
            onChange={handleUpdateTitle}
            onBlur={handleSubmit}
            onPressEnter={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

const EditableText = ({
  value,
  onSubmit,
}: {
  value: string;
  onSubmit: (value: string) => void;
}) => {
  const [edit, setEdit] = useState<boolean>(false);

  const inputRef = useRef<RefInputType>(null);

  useEffect(() => {
    edit && inputRef.current?.focus();
  }, [edit]);

  const handleEdit = () => {
    setEdit(true);
  };

  const handleCancelEdit = () => {
    setEdit(false);
  };

  return !edit ? (
    <div className="truncate" onClick={handleEdit}>
      {value}
    </div>
  ) : (
    <Input
      ref={inputRef}
      allowClear
      placeholder="Add a task name"
      defaultValue={value}
      onBlur={(e) => {
        onSubmit(e.target.value);
        handleCancelEdit();
      }}
      onPressEnter={(e) => {
        onSubmit(e.target.value);
        handleCancelEdit();
      }}
    />
  );
};

export default CheckList;
