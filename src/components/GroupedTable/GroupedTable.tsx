import {
  Button,
  Collapse,
  Skeleton,
  Table,
  TableProps,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { SorterResult } from '@arco-design/web-react/es/Table/interface';
import { cloneDeep } from 'lodash-es';
import { ReactNode, useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';

import styles from './GroupedTable.module.less';

const CollapseItem = Collapse.Item;

export type Group<T> = {
  key: string;
  label: ReactNode;
  data: T[];
  extra?: () => ReactNode;
};

type Props<T> = {
  groups: Group<T>[];
  columns: ColumnProps<T>[];
  noDataElement?: { [key: string]: string };
  expandedRowRender?: TableProps<T>['expandedRowRender'];
  onRow?: TableProps<T>['onRow'];
  handleCheckedRows?: (record: T[]) => void;
  onSelect?: NonNullable<TableProps<T>['rowSelection']>['onSelect'];
  renderCheckboxCell?: NonNullable<TableProps<T>['rowSelection']>['renderCell'];
  HeaderRowsSelected?: ReactNode;
  loading?: boolean;
  wrapperClassName?: string;
  expandProps?: TableProps<T>['expandProps'];
  selectedRowKeys?: string[];
  canSelect?: boolean;
  activeKeys?: string[];
  onCollapseChange?: (key: string, keys: string[]) => void;
};

const GroupedTable = <T,>(props: Props<T>) => {
  const {
    expandedRowRender,
    columns,
    groups,
    loading,
    noDataElement,
    HeaderRowsSelected,
    wrapperClassName,
    onRow,
    onSelect,
    expandProps,
    selectedRowKeys,
    canSelect = true,
    activeKeys,
    onCollapseChange,
    renderCheckboxCell,
  } = props;

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [sorterResult, setSorterResult] = useState<SorterResult>();

  const addExpandedRowKey = (id: string) => {
    setExpandedRowKeys(expandedRowKeys.concat(id));
  };

  const removeExpandedRowKey = (id: string) => {
    setExpandedRowKeys(expandedRowKeys.filter((k) => k !== id));
  };

  const getColumnSorter = () => {
    const sorter = columns.find((column, index) => {
      return typeof sorterResult?.field === 'string'
        ? column.dataIndex === sorterResult.field
        : (expandedRowRender ? index + 2 : index + 1) === sorterResult?.field;
    })?.sorter;

    return sorter;
  };

  return (
    <div className={`${styles.wrapper} ${wrapperClassName}`}>
      <div>
        {HeaderRowsSelected ? (
          HeaderRowsSelected
        ) : (
          <Table
            className={styles['table-header-only']}
            columns={columns}
            border={false}
            noDataElement={null}
            expandedRowRender={expandedRowRender}
            rowSelection={canSelect ? { type: 'checkbox' } : undefined}
            scroll={{ x: false }}
            tableLayoutFixed
            onChange={(_, sorter) => {
              setSorterResult(sorter);
            }}
          />
        )}

        <Collapse
          className={styles['collapse-wrapper']}
          bordered={false}
          expandIcon={<MdKeyboardArrowRight className={styles['icon-arrow']} />}
          onChange={onCollapseChange}
          {...(activeKeys ? { activeKey: activeKeys } : {})}
        >
          {groups.map((group, index) => {
            const data = cloneDeep(group.data);

            const sorter = getColumnSorter();
            if (sorter && sorterResult?.direction) {
              // @ts-ignore
              data.sort(sorter);

              if (sorterResult?.direction === 'descend') {
                data.reverse();
              }
            }

            return (
              <CollapseItem
                key={group.key || index}
                name={group.key || index.toString()}
                header={group.label}
                extra={group?.extra ? group.extra() : null}
              >
                {loading ? (
                  <Skeleton style={{ padding: 50 }} />
                ) : (
                  <Table
                    expandedRowKeys={expandedRowKeys}
                    showHeader={false}
                    columns={columns}
                    data={data}
                    noDataElement={noDataElement?.[group.key]}
                    pagination={false}
                    rowSelection={
                      canSelect
                        ? {
                            selectedRowKeys,
                            onSelect,
                            checkboxProps: () => {
                              return {
                                onClick: (e: Event) => {
                                  e.stopPropagation();
                                },
                              };
                            },
                            renderCell: renderCheckboxCell,
                          }
                        : undefined
                    }
                    border={false}
                    scroll={{ x: false }}
                    tableLayoutFixed
                    components={{
                      body: {
                        operations: ({ selectionNode, expandNode }) => [
                          {
                            name: 'selectionNode',
                            node: selectionNode,
                          },
                          {
                            name: 'expandNode',
                            node: expandNode,
                          },
                        ],
                      },
                    }}
                    onRow={onRow}
                    expandedRowRender={expandedRowRender}
                    expandProps={{
                      icon: ({ expanded, record }) => {
                        return expanded ? (
                          <Button
                            style={{ background: 'none' }}
                            icon={
                              <MdKeyboardArrowDown
                                className={styles['icon-arrow']}
                              />
                            }
                            onClick={(e) => {
                              removeExpandedRowKey(record.id);
                              e.stopPropagation();
                            }}
                          />
                        ) : (
                          <Button
                            style={{ background: 'none' }}
                            icon={
                              <MdKeyboardArrowRight
                                className={styles['icon-arrow']}
                              />
                            }
                            onClick={(e) => {
                              addExpandedRowKey(record.id);
                              e.stopPropagation();
                            }}
                          />
                        );
                      },
                      ...expandProps,
                    }}
                  />
                )}
              </CollapseItem>
            );
          })}
        </Collapse>
      </div>
    </div>
  );
};

export default GroupedTable;
