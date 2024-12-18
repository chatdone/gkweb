import { Space, Tag, Button, TreeSelect } from '@arco-design/web-react';
import type {
  RefTreeSelectType,
  TreeSelectProps,
} from '@arco-design/web-react/es/TreeSelect';
import chroma from 'chroma-js';
import { cloneDeep, last } from 'lodash-es';
import { useState, useEffect, useRef } from 'react';
import { MdAdd, MdTag } from 'react-icons/md';

import styles from './CompanyTagInput.module.less';

import type { TagGroup } from 'generated/graphql-types';

type Props = {
  tagGroups: (TagGroup | null | undefined)[] | null | undefined;
  mode?: 'button' | 'select';
  placeholder?: string;
  value?: string[];
  isReadOnly?: boolean;
  onChange?: (value: string | string[]) => void;
  onAdd?: (value: string) => void;
  onRemove?: (value: string) => void;
};

const CompanyTagInput = (props: Props) => {
  const { mode = 'button', placeholder, isReadOnly = false } = props;

  const [showSelect, setShowSelect] = useState(false);
  const [stateValue, setValue] = useState(props.value);
  const value = props.value || stateValue || [];

  const selectRef = useRef<RefTreeSelectType>(null);

  useEffect(() => {
    if (props.value !== stateValue && props.value === undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    if (showSelect) {
      selectRef.current?.focus();
    }
  }, [showSelect]);

  const handleShowSelect = () => {
    setShowSelect(true);
  };

  const handleHideSelect = () => {
    setShowSelect(false);
  };

  const handleChange = (newValue: string) => {
    setShowSelect(false);

    const isNewValue = !value.includes(newValue);

    if (!isNewValue) {
      return;
    }

    const newArray = [...value, newValue];

    if (!('value' in props)) {
      setValue(newArray);
    }

    props.onChange?.(newArray);
    props.onAdd?.(newValue);
  };

  const handleChangeMulti = (newValue: string[]) => {
    setShowSelect(false);

    const addedValue = last(newValue);

    props.onChange?.(newValue);
    addedValue && props.onAdd?.(addedValue);
  };

  const handleRemove = (id: string) => {
    const newValue = value.filter((val) => val !== id);

    if (!('value' in props)) {
      setValue(newValue);
    }

    props.onChange?.(newValue);
    props.onRemove?.(id);
  };

  const getVisibleData = (): TreeSelectProps['treeData'] => {
    if (!props.tagGroups) {
      return [];
    }

    let clone = cloneDeep(props.tagGroups);

    clone.forEach((group) => {
      if (group?.tags) {
        group.tags = group.tags.filter(
          (tag) => !value.includes(tag?.id as string),
        );
      }
    });

    clone = clone.filter((group) => group?.tags && group.tags.length > 0);

    return clone.map((group) => ({
      id: group?.id,
      title: group?.name,
      selectable: false,
      children: group?.tags?.map((tag) => ({
        id: tag?.id,
        title: tag?.name,
      })),
    }));
  };

  const getMultiSelectValue = () => {
    const tags = props.tagGroups?.map((group) => group?.tags).flat() || [];

    return tags
      .filter((tag) => tag?.id && value.includes(tag.id))
      .map((tag) => ({
        label: tag?.name,
        value: tag?.id as string,
      }));
  };

  return mode === 'button' ? (
    <Space wrap>
      {value.map((id) => {
        const tag = props.tagGroups
          ?.find((group) => group?.tags?.some((tag) => tag?.id === id))
          ?.tags?.find((tag) => tag?.id === id);

        const color = tag?.color ? chroma(tag.color) : undefined;

        return (
          <Tag
            key={id}
            className={styles.tag}
            icon={<MdTag className={styles.icon} color={color?.css()} />}
            closable
            bordered
            style={{ color: color?.css() }}
            color={color?.alpha(0.1).css()}
            onClose={() => handleRemove(tag?.id as string)}
          >
            {tag?.name}
          </Tag>
        );
      })}

      {!isReadOnly &&
        (showSelect ? (
          <TreeSelect
            ref={selectRef}
            showSearch
            onChange={handleChange}
            treeData={getVisibleData()}
            triggerProps={{
              onClickOutside: handleHideSelect,
            }}
            filterTreeNode={(inputText, node) => {
              return (
                node.props.title
                  .toLowerCase()
                  .indexOf(inputText.toLowerCase()) > -1
              );
            }}
          />
        ) : (
          <Button size="mini" icon={<MdAdd />} onClick={handleShowSelect} />
        ))}
    </Space>
  ) : (
    <TreeSelect
      multiple
      showSearch
      value={getMultiSelectValue()}
      placeholder={placeholder}
      onChange={handleChangeMulti}
      treeData={getVisibleData()}
      disabled={isReadOnly}
      filterTreeNode={(inputText, node) => {
        return (
          node.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1
        );
      }}
    />
  );
};

export default CompanyTagInput;
