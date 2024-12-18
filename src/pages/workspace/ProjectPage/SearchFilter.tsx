import { Button, Tag } from '@arco-design/web-react';
import { MdSearch } from 'react-icons/md';

import { FormValues } from './SearchTaskModal';

import { formatTimeline } from '@/utils/task.utils';

import { SelectOption } from '@/types';

type Props = {
  values: FormValues | undefined;
  companyMemberOptions: SelectOption[];
  statusOptions?: SelectOption[];
  onClear: () => void;
  onUpdate: (values: FormValues) => void;
  className?: string;
};

const SearchFilter = (props: Props) => {
  const {
    values,
    companyMemberOptions,
    statusOptions,
    onClear,
    onUpdate,
    className,
  } = props;

  const handleRemoveSearch = (key: keyof FormValues) => {
    onUpdate({ ...values, [key]: undefined });
  };

  const handleRemoveAssignee = (id: string) => {
    const newValues = { ...values };

    newValues.assigneeIds = newValues.assigneeIds?.filter(
      (assigneeId) => assigneeId !== id,
    );
    if (!newValues.assigneeIds?.length) {
      newValues.assigneeIds = undefined;
    }

    onUpdate(newValues);
  };

  const isEmpty = () => {
    return !values || Object.values(values).every((value) => !value);
  };

  const getTagText = (key: keyof FormValues, value: string | string[]) => {
    switch (key) {
      case 'name':
        return value;

      case 'timeline': {
        const [start, end] = value;

        return formatTimeline(start, end);
      }

      case 'statusId':
        return statusOptions?.find((option) => option.value === value)?.label;
    }
  };

  const getAssigneeName = (id: string) => {
    return companyMemberOptions.find((option) => option.value === id)?.label;
  };

  return (
    <>
      {values && !isEmpty() && (
        <div
          className={`flex items-center rounded border border-gray-300 bg-gray-100 p-1 ${className}`}
        >
          <MdSearch className="m-1" />

          <div className="flex-1">
            {Object.entries(values).map(
              ([key, value]) =>
                value &&
                (key !== 'assigneeIds' ? (
                  <Tag
                    key={key}
                    className="m-1 bg-white"
                    closable
                    onClose={() => handleRemoveSearch(key as keyof FormValues)}
                  >
                    {getTagText(key as keyof FormValues, value)}
                  </Tag>
                ) : (
                  (value as string[]).map((assigneeId: string) => (
                    <Tag
                      key={assigneeId}
                      className="m-1 bg-white"
                      closable
                      onClose={() => handleRemoveAssignee(assigneeId)}
                    >
                      {getAssigneeName(assigneeId)}
                    </Tag>
                  ))
                )),
            )}
          </div>

          <Button size="mini" onClick={onClear}>
            Clear
          </Button>
        </div>
      )}
    </>
  );
};

export default SearchFilter;
