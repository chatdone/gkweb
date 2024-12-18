import {
  Collapse,
  Skeleton,
  Space,
  Empty,
  Divider,
} from '@arco-design/web-react';
import { get } from 'lodash-es';
import { Fragment, ReactNode } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';

import styles from './GroupedList.module.less';

const CollapseItem = Collapse.Item;

export type Group<T> = {
  key: string;
  label: ReactNode;
  data: T[];
  extra?: () => ReactNode;
};

type Props<T> = {
  groups: Group<T>[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  loading?: boolean;
  itemKey?: string;
  noDataElement?: { [key: string]: string };
};

const GroupedList = <T,>(props: Props<T>) => {
  const { groups, loading, renderItem, itemKey, noDataElement, className } =
    props;

  return (
    <Collapse
      className={`${styles['collapse-wrapper']} ${className}`}
      bordered={false}
      expandIcon={<MdKeyboardArrowRight className={styles['icon-arrow']} />}
    >
      {groups.map((group, index) => (
        <CollapseItem
          key={group.key || index}
          className={`${styles.item} ${
            group.data.length > 0 ? styles['not-empty'] : ''
          }`}
          name={group.key || index.toString()}
          header={group.label}
          extra={group?.extra ? group.extra() : null}
        >
          {loading ? (
            <Skeleton style={{ padding: 50 }} />
          ) : group.data.length > 0 ? (
            <Space
              direction="vertical"
              split={<Divider className={styles.separator} />}
            >
              {group.data.map((item, index) => (
                <Fragment key={itemKey ? get(item, itemKey) : index}>
                  {renderItem(item, index)}
                </Fragment>
              ))}
            </Space>
          ) : (
            <Empty description={noDataElement?.[group.key]} />
          )}
        </CollapseItem>
      ))}
    </Collapse>
  );
};

export default GroupedList;
