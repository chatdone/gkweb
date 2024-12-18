import { Button, Radio, Select } from '@arco-design/web-react';
import { useState } from 'react';
import { MdSearch } from 'react-icons/md';
import fixtures from 'test-utils/fixtures';

import TaskTimeline from '@/components/TaskTimeline';

import SearchFilter from '../../ProjectPage/SearchFilter';
import { FormValues as SearchTaskFormValues } from '../../ProjectPage/SearchTaskModal';

import useBreakPoints from '@/hooks/useBreakPoints';

import { SelectOption } from '@/types';

type TimeScale = 'day' | 'month' | 'year';

type Props = {
  searchValues: SearchTaskFormValues | undefined;
  companyMemberOptions: SelectOption[];
  onSearch: () => void;
  onUpdateSearch: (values: SearchTaskFormValues | undefined) => void;
  onView: (task: { id: string }) => void;
};

const TimelineView = (props: Props) => {
  const {
    searchValues,
    companyMemberOptions,
    onSearch,
    onUpdateSearch,
    onView,
  } = props;

  const { isMd } = useBreakPoints();

  const [scale, setScale] = useState<TimeScale>('month');

  const handleChangeTimeScale = (value: TimeScale) => {
    setScale(value);
  };

  const handleClearSearch = () => {
    onUpdateSearch(undefined);
  };

  const isSearchEmpty = () => {
    return (
      !searchValues || Object.values(searchValues).every((value) => !value)
    );
  };

  const data = [
    {
      id: 'b36c0c22-695b-4528-9675-b5f588383846',
      name: 'Group Home',
      tasks: fixtures.generate('task', 3),
    },
    {
      id: 'ea2b8e5f-3f26-4331-a212-d7c3d8edaf6d',
      name: 'Group calculating architectures Jamaica',
      tasks: fixtures.generate('task', 2),
    },
  ];

  return (
    <>
      <div className="flex h-12 items-center justify-end border-b border-gray-300 px-2">
        <Button icon={<MdSearch />} onClick={onSearch} />
      </div>

      {!isSearchEmpty() && (
        <div className="bg-gray-50 p-3">
          <SearchFilter
            values={searchValues}
            companyMemberOptions={companyMemberOptions}
            onClear={handleClearSearch}
            onUpdate={onUpdateSearch}
          />
        </div>
      )}

      <div className="flex items-center bg-gray-50 px-2 pt-3">
        {isMd && (
          <Radio.Group
            type="button"
            size="small"
            options={timeScaleOptions}
            value={scale}
            onChange={handleChangeTimeScale}
          />
        )}

        {!isMd && (
          <Select
            className="w-24"
            bordered={false}
            options={timeScaleOptions}
            value={scale}
            onChange={handleChangeTimeScale}
          />
        )}
      </div>

      <TaskTimeline
        title="Project"
        scale={scale}
        data={data}
        onClickTask={onView}
      />
    </>
  );
};

const timeScaleOptions = [
  {
    label: 'Day',
    value: 'day',
  },
  {
    label: 'Month',
    value: 'month',
  },
  {
    label: 'Year',
    value: 'year',
  },
];

export default TimelineView;
