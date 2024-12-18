import {
  Input,
  InputNumber,
  Select,
  TreeSelect,
  TreeSelectProps,
  Cascader,
  CascaderProps,
} from '@arco-design/web-react';
import type { RefInputType } from '@arco-design/web-react/es/Input/interface';
import type { SelectHandle } from '@arco-design/web-react/es/Select/interface';
import { debounce } from 'lodash-es';
import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  RefObject,
  SyntheticEvent,
} from 'react';
import { MdAdd } from 'react-icons/md';

import { SelectUserInput, SelectUserCascaderInput } from '@/components';
import { CascaderOption } from '@/components/SelectUserCascaderInput';

import { SelectOption } from '@/types';

type TextInputType = {
  type: 'input';
  value?: string;
  placeholder?: string;
  maxLength?: number;
  onSubmit?: (value: string) => void;
};

type NumberInputType = {
  type: 'number';
  value?: number;
  placeholder?: string;
  precision?: number;
  step?: number;
  min?: number;
  onSubmit?: (value: number) => void;
};

type SingleSelectInputType = {
  type: 'single-select';
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
};

type UserSelectInputType = {
  type: 'user-select';
  options: SelectOption[];
  value?: string[];
  placeholder?: string;
  onSubmit?: (value: string[]) => void;
  filterValue?: string[];
};

type TreeSelectType = {
  type: 'tree-select';
  treeData: TreeSelectProps['treeData'];
  value?: string[];
  placeholder?: string;
  onChange?: (value: { label: string; value: string }[]) => void;
};

type CascaderType = {
  type: 'cascader';
  options: CascaderProps['options'];
  mode?: CascaderProps['mode'];
  value?: CascaderProps['value'];
  children?: CascaderProps['children'];
  renderFormat?: CascaderProps['renderFormat'];
  onSubmit?: (value: (string | string[])[]) => void;
};

type UserSelectCascaderType = {
  type: 'user-cascader';
  options: CascaderOption[];
  value?: CascaderProps['value'];
  onSubmit?: (value: (string | string[])[]) => void;
};

type Props = (
  | TextInputType
  | NumberInputType
  | SingleSelectInputType
  | UserSelectInputType
  | TreeSelectType
  | CascaderType
  | UserSelectCascaderType
) & {
  contentWrapperClassName?: string;
  renderContent?: (
    value?: string | string[] | (string | string[])[] | number,
  ) => ReactNode;
  showInputOnly?: boolean;
};

const EditableCell = (props: Props) => {
  const {
    type,
    contentWrapperClassName,
    renderContent,
    value,
    showInputOnly = false,
  } = props;

  const [editing, setEditing] = useState<boolean>(false);

  const inputRef = useRef<RefInputType | SelectHandle>(null);

  useEffect(() => {
    editing && inputRef.current?.focus();
  }, [editing]);

  const handleStartEdit = (event: SyntheticEvent) => {
    event.stopPropagation();

    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const renderInput = () => {
    switch (type) {
      case 'input':
        return (
          <Input
            ref={inputRef as RefObject<RefInputType>}
            allowClear
            placeholder={props.placeholder}
            defaultValue={props.value}
            maxLength={props.maxLength}
            showWordLimit={!!props.maxLength}
            onBlur={(event) => {
              props.onSubmit?.(event.target.value);
              handleCancelEdit();
            }}
            onPressEnter={(event) => {
              props.onSubmit?.(event.target.value);
              handleCancelEdit();
            }}
          />
        );

      case 'number':
        return (
          <InputNumber
            ref={inputRef as RefObject<RefInputType>}
            placeholder={props.placeholder}
            min={props.min}
            precision={props.precision}
            step={props.step}
            defaultValue={props.value}
            onBlur={debounce((event) => {
              props.onSubmit?.(event.target.value);
              handleCancelEdit();
            }, 100)}
          />
        );

      case 'single-select':
        return (
          <Select
            ref={inputRef as RefObject<SelectHandle>}
            options={props.options}
            placeholder={props.placeholder}
            defaultValue={props.value}
            onChange={(value) => {
              props.onSubmit?.(value);
              handleCancelEdit();
            }}
            onBlur={handleCancelEdit}
          />
        );

      case 'user-select':
        return (
          <SelectUserInput
            options={props.options}
            value={props.value}
            onChange={props.onSubmit}
            filterValue={props.filterValue}
          />
        );

      case 'tree-select':
        return (
          <TreeSelect
            ref={inputRef}
            defaultValue={props.value}
            treeData={props.treeData}
            treeCheckable
            labelInValue
            triggerElement={(params) =>
              params.value.length ? (
                <div className="break-normal">
                  {params.value
                    .map((item: { label: string }) => item.label)
                    .join(', ')}
                </div>
              ) : (
                <div className="cursor-pointer px-1 hover:bg-gray-200">
                  <MdAdd className="text-gray-600 hover:text-gray-900" />
                </div>
              )
            }
            onChange={props.onChange}
          />
        );

      case 'cascader':
        return (
          <Cascader
            placeholder="Please select ..."
            options={props.options}
            mode={props.mode}
            triggerProps={{
              onClickOutside: handleCancelEdit,
            }}
            renderFormat={props.renderFormat}
            value={props.value}
            onChange={(value) => {
              props.onSubmit?.(value);
              handleCancelEdit();
            }}
          >
            {props.children}
          </Cascader>
        );

      case 'user-cascader':
        return (
          <SelectUserCascaderInput
            options={props.options}
            value={props.value}
            onChange={props.onSubmit}
          />
        );
    }
  };

  return (
    <div>
      {editing || showInputOnly || type === 'user-select' ? (
        renderInput()
      ) : (
        <div
          className={`truncate ${contentWrapperClassName}`}
          onClick={handleStartEdit}
        >
          {renderContent?.(value) || value}
        </div>
      )}
    </div>
  );
};

export default EditableCell;
