import {
  Button,
  ButtonProps,
  Space,
  Tag,
  TreeSelect,
} from '@arco-design/web-react';
import type { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import {
  RefTreeSelectType,
  TreeSelectProps,
} from '@arco-design/web-react/es/TreeSelect';
import type { TreeSelectDataType } from '@arco-design/web-react/es/TreeSelect/interface';
import { cloneDeep } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { MdAdd } from 'react-icons/md';

type Props = {
  value: string[];
  treeData: TreeSelectDataType[];
  onAdd?: (id: string) => void;
  onRemove?: (id: string) => void;
  isReadOnly?: boolean;
  buttonProps?: ButtonProps;
  selectProps?: Omit<TreeSelectProps, 'treeData'>;
};

const DynamicTreeSelect = (props: Props) => {
  const {
    value,
    treeData,
    onAdd,
    onRemove,
    isReadOnly = false,
    buttonProps,
    selectProps,
  } = props;

  const [showSelect, setShowSelect] = useState(false);

  const selectRef = useRef<RefTreeSelectType>(null);

  useEffect(() => {
    if (showSelect) {
      selectRef.current?.focus();
    }
  }, [showSelect]);

  const handleShowSelect = () => {
    setShowSelect(true);
  };

  const handleChange = (newValue: string) => {
    const childValue = newValue.split('-child')[1];

    setShowSelect(false);

    const isNewValue = !value.includes(childValue);
    if (!isNewValue) {
      return;
    }

    onAdd?.(childValue);
  };

  const getVisibleData = (): TreeDataType[] => {
    let clone = cloneDeep(treeData);

    clone.forEach((tree) => {
      if (tree.children) {
        tree.children = tree.children
          .filter((child) => !value.includes(child.id))
          .map((child) => ({ ...child, id: `${tree.id}-child${child.id}` }));
      }
    });

    clone = clone.filter((tree) => tree.children && tree.children.length > 0);

    return clone;
  };

  return (
    <Space wrap>
      {value.map((id) => {
        const option = treeData
          ?.find((option) => option.children?.some((child) => child.id === id))
          ?.children?.find((child) => child.id === id);

        return (
          option && (
            <Tag
              key={id}
              closable
              bordered
              onClose={() => onRemove?.(option.id)}
            >
              {option.title}
            </Tag>
          )
        );
      })}

      {!isReadOnly &&
        (showSelect ? (
          <TreeSelect
            ref={selectRef}
            showSearch
            treeData={getVisibleData()}
            onChange={handleChange}
            triggerProps={{
              onClickOutside: () => setShowSelect(false),
            }}
            {...selectProps}
          />
        ) : (
          <Button
            shape="circle"
            icon={<MdAdd />}
            onClick={handleShowSelect}
            {...buttonProps}
          />
        ))}
    </Space>
  );
};

export default DynamicTreeSelect;
