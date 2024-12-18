import {
  Card,
  Typography,
  Table,
  Space,
  Grid,
  Button,
  Dropdown,
  Checkbox,
  Menu,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { AxiosError } from 'axios';
import { isEmpty, range, upperFirst } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { MdAdd, MdIosShare, MdKeyboardArrowDown } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';

import { FormValues } from '../ReportFormPage/ReportForm';
import styles from './GenerateReportPage.module.less';
import columns, { Footer } from './columns';

import { useAppStore } from '@/stores/useAppStore';

import {
  getAttendanceReport,
  downloadAttendanceReport,
  getInvoiceReport,
  downloadInvoiceSqlReport,
  downloadReportV2,
  getReportV2,
} from '@/services/report.service';

import { formatToCurrency } from '@/utils/currency.utils';
import { minutesToHoursAndMinutes } from '@/utils/date.utils';

import { navigateReportFormPage } from '@/navigation';

import {
  QueryProjectGroupReport,
  QueryProjectReport,
  QueryTaskReport,
} from '@/types';

const GenerateReportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as FormValues;

  const { activeCompany, currentUser } = useAppStore();

  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>([]);
  const [reportData, setReportData] = useState<object[]>();
  const [reportColumns, setReportColumns] = useState<{
    columns: ColumnProps[];
    keyOptions: { label: string; value: string }[];
    summary?: (payload: {
      data: unknown[];
      visibleKeys: string[];
      visibleColumns: ColumnProps[];
    }) => Footer[];
  }>();
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [customColumns, setCustomColumns] =
    useState<
      { name: string; type: number; projectGroups: QueryProjectGroupReport[] }[]
    >();

  useEffect(() => {
    if (state) {
      const reportColumn = columns[state?.type];

      if (reportColumn) {
        if (
          state?.type === 'project' &&
          state?.project?.reportType === 'project'
        ) {
          const columns = reportColumn.columns.filter(
            (col) => col?.key !== 'task',
          );
          const keyOptions = reportColumn.keyOptions.filter(
            (opt) => opt?.value !== 'task',
          );

          const initialKeys = [...reportColumn.initialKeys];
          initialKeys.shift();
          initialKeys.unshift('project');

          setVisibleColumnKeys(initialKeys);
          setReportColumns({
            columns: columns,
            keyOptions: keyOptions,
            summary: reportColumn.summary,
          });
        } else {
          setVisibleColumnKeys(reportColumn.initialKeys);
          setReportColumns({
            columns: reportColumn.columns,
            keyOptions: reportColumn.keyOptions,
            summary: reportColumn.summary,
          });
        }
      }
    }
  }, [state]);

  useEffect(() => {
    if (state) {
      handleGetReport();
    } else {
      redirectToReportFormPage();
    }
  }, [state]);

  const redirectToReportFormPage = () => {
    if (!activeCompany?.slug) {
      return;
    }

    navigateReportFormPage(navigate, activeCompany?.slug);
  };

  const handleUpdateVisibleColumnKeys = (value: string[]) => {
    setVisibleColumnKeys(value);
  };

  const handleClickInvoiceMenuItem = (key: string) => {
    if (key === 'excel') {
      //
    } else if (key === 'sql') {
      handleExportReport();
    }
  };

  const handleGetReport = async () => {
    if (!state) {
      return;
    }

    setLoading(true);

    if (state?.type === 'attendance') {
      await handleGetAttendanceReport();
    } else if (state?.type === 'project') {
      await handleGetProjectReport();
    } else if (state?.type === 'invoice') {
      await handleGetInvoiceReport();
    }

    setLoading(false);
  };

  const handleGetAttendanceReport = async () => {
    if (!currentUser?.id || !activeCompany?.id || !state.attendance) {
      return;
    }

    try {
      const res = await getAttendanceReport({
        userId: currentUser.id,
        companyId: activeCompany.id,
        dateRange: state.attendance.dateRange,
        activityLabelIds: state.attendance.activityLabelIds,
        employeeTypeId: state.attendance.employeeTypeId,
        memberIds: state.attendance.memberIds,
        contactIds: state.attendance.contactIds,
        tagIds: state.attendance.tagIds,
      });

      setReportData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetProjectReport = async () => {
    if (!currentUser?.id || !activeCompany?.id || !state.project) {
      return;
    }

    try {
      const res = await getReportV2({
        userId: currentUser.id,
        companyId: activeCompany.id,
        dateRange: state.project.dateRange ? state.project.dateRange : [],
        projectIds: state.project.projectIds,
        reportType: state?.project?.reportType,
        projectOwnerIds: state.project.projectOwnerIds,
        assigneeId: state.project.assigneeId,
        teamId: state.project.teamId,
      });

      const dateWithUniqueIndex = res.data.map((entry: object) => {
        // @ts-ignore
        const projectGroups = entry?.projectGroups?.map((pg) => {
          // @ts-ignore
          const tasks = pg?.tasks?.map((task) => {
            return {
              ...task,
              index: task?.taskId,
              key: task?.taskId,
              name: task?.name,
            };
          });

          const budget = pg?.tasks?.reduce(
            (acc: number, cur: { budget: number }) => {
              return acc + +cur?.budget;
            },
            0,
          );

          const actualCost = pg?.tasks?.reduce(
            (acc: number, cur: { actualCost: number }) => {
              return acc + +cur?.actualCost;
            },
            0,
          );

          const varianceBudget = +budget - +actualCost;

          return {
            ...pg,
            budget: formatToCurrency(budget),
            budgetUnformatted: +budget,
            actualCost: formatToCurrency(actualCost),
            actualCostUnformatted: +actualCost,
            varianceBudget: formatToCurrency(varianceBudget),
            index: pg?.projectGroupId,
            key: pg?.projectGroupId,
            name: pg?.projectGroupName,
            children: tasks,
          };
        });

        const projectTotalActualMinutes = projectGroups?.reduce(
          (acc: number, cur: { totalActualMinutes: number }) => {
            return acc + cur?.totalActualMinutes;
          },
          0,
        );

        const projectTotalTargetedMinutes = projectGroups?.reduce(
          (acc: number, cur: { totalTargetedMinutes: number }) => {
            return acc + cur?.totalTargetedMinutes;
          },
          0,
        );

        const projectTotalVarianceMinutes = projectGroups?.reduce(
          (acc: number, cur: { totalVarianceMinutes: number }) => {
            return acc + cur?.totalVarianceMinutes;
          },
          0,
        );

        const totalBudget = projectGroups?.reduce(
          (acc: number, cur: { budgetUnformatted: number }) => {
            return acc + +(cur?.budgetUnformatted || '0');
          },
          0,
        );

        const totalActualCost = projectGroups?.reduce(
          (acc: number, cur: { actualCostUnformatted: number }) => {
            return acc + +(cur?.actualCostUnformatted || '0');
          },
          0,
        );

        const totalVarianceBudget = totalBudget - totalActualCost;

        return {
          ...entry,
          // @ts-ignore
          index: entry?.projectId,
          actualHour: minutesToHoursAndMinutes(projectTotalActualMinutes),
          actualMinutes: projectTotalActualMinutes,
          targetedHour: minutesToHoursAndMinutes(projectTotalTargetedMinutes),
          budget: formatToCurrency(totalBudget),
          varianceHours: minutesToHoursAndMinutes(projectTotalVarianceMinutes),
          actualCost: formatToCurrency(totalActualCost),
          varianceBudget: formatToCurrency(totalVarianceBudget),
          children: projectGroups,
          // @ts-ignore
          name: entry?.projectName,
        };
      });

      setReportData(dateWithUniqueIndex);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetInvoiceReport = async () => {
    if (!activeCompany?.id || !state.invoice) {
      return;
    }

    try {
      const res = await getInvoiceReport({
        companyId: activeCompany.id,
        dateRange: state.invoice.dateRange,
        workspaceIds:
          state.invoice.workspaceId !== 'all'
            ? [state.invoice.workspaceId]
            : undefined,
      });

      setReportData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportReport = async () => {
    try {
      if (!state || !currentUser?.id || !activeCompany?.id) {
        return;
      }

      setIsExporting(true);

      if (state.type === 'attendance') {
        await downloadAttendanceReport({
          userId: currentUser.id,
          companyId: activeCompany.id,
          dateRange: state.attendance.dateRange,
          activityLabelIds: state.attendance.activityLabelIds,
          employeeTypeId: state.attendance.employeeTypeId,
          memberIds: state.attendance.memberIds,
          tagIds: state.attendance.tagIds,
        });
      } else if (state.type === 'project') {
        await downloadReportV2({
          userId: currentUser.id,
          companyId: activeCompany.id,
          dateRange: state.project.dateRange ? state.project.dateRange : [],
          reportType: state?.project?.reportType,
          projectIds: state.project.projectIds,
          projectOwnerIds: state.project.projectOwnerIds,
          assigneeId: state.project.assigneeId,
          teamId: state.project.teamId,
        });
      } else if (state.type === 'invoice') {
        await downloadInvoiceSqlReport({
          companyId: activeCompany.id,
          dateRange: state.invoice.dateRange,
          workspaceIds:
            state.invoice.workspaceId !== 'all'
              ? [state.invoice.workspaceId]
              : undefined,
        });
      } else if (state?.type === 'attendance') {
        await downloadAttendanceReport({
          userId: currentUser.id,
          companyId: activeCompany.id,
          dateRange: state.attendance.dateRange,
          activityLabelIds: state.attendance.activityLabelIds,
          employeeTypeId: state.attendance.employeeTypeId,
          memberIds: state.attendance.memberIds,
          tagIds: state.attendance.tagIds,
        });
      } else if (state?.type === 'project') {
        await downloadReportV2({
          userId: currentUser.id,
          companyId: activeCompany.id,
          dateRange: state.project.dateRange ? state.project.dateRange : [],
          reportType: state?.project?.reportType,
          projectIds: state.project.projectIds,
          projectOwnerIds: state.project.projectOwnerIds,
          assigneeId: state.project.assigneeId,
          teamId: state.project.teamId,
        });
      } else if (state?.type === 'invoice') {
        await downloadInvoiceSqlReport({
          companyId: activeCompany.id,
          dateRange: state.invoice.dateRange,
          workspaceIds:
            state.invoice.workspaceId !== 'all'
              ? [state.invoice.workspaceId]
              : undefined,
        });
      }

      setIsExporting(false);
    } catch (error) {
      setIsExporting(false);
      console.error(error);
      Message.error(
        `Err ${
          (error as AxiosError).response?.status
        }: Something went wrong, please try again later`,
      );
    }
  };

  const visibleColumns = useMemo<ColumnProps[]>(() => {
    return (
      reportColumns?.columns.filter((column) =>
        visibleColumnKeys.includes(column?.key as string),
      ) || []
    );
  }, [reportColumns, visibleColumnKeys]);

  type CustomColumProps = {
    type: number;
    projectGroups: QueryProjectGroupReport[];
    render?: (
      _: unknown,
      item: QueryTaskReport | QueryProjectReport | QueryProjectGroupReport,
    ) => JSX.Element;
  } & ColumnProps;

  const projectReportColumns = useMemo<CustomColumProps[]>(() => {
    const columns = [
      {
        title: 'Project',
        key: 'projectId',
        dataIndex: 'name',
        width: 250,
      },
      {
        title: 'Assignee',
        dataIndex: 'assigneeNames',
        width: 100,
      },
      {
        title: 'Statuses',
        dataIndex: 'statusName',
        width: 100,
      },
      {
        title: 'Targeted Start',
        dataIndex: 'targetedStart',
        width: 100,
      },
      {
        title: 'Targeted End',
        dataIndex: 'targetedEnd',
        width: 100,
      },
      {
        title: 'Actual Start',
        dataIndex: 'actualStart',
        width: 100,
      },
      {
        title: 'Actual End',
        dataIndex: 'actualEnd',
        width: 100,
      },
      {
        title: 'Targeted Hour',
        dataIndex: 'targetedHour',
        width: 100,
      },
      {
        title: 'Actual Hour',
        dataIndex: 'actualHour',
        width: 100,
      },
      {
        title: 'Actual Minutes',
        dataIndex: 'actualMinutes',
        width: 80,
      },
      {
        title: 'Variance (Hours)',
        dataIndex: 'varianceHours',
        width: 80,
      },
      {
        title: 'Budget',
        dataIndex: 'budget',
        width: 80,
      },
      {
        title: 'Actual (MYR)',
        dataIndex: 'actualCost',
        width: 80,
      },
      {
        title: 'Variance (MYR)',
        dataIndex: 'varianceBudget',
        width: 80,
      },
      {
        title: 'Billable',
        dataIndex: 'billable',
        width: 80,
      },
    ] as CustomColumProps[];

    const customCol: CustomColumProps[] = [];

    const projectReportData = reportData as QueryProjectReport[];

    projectReportData?.map((col) => {
      col?.customColumnNames?.map((c) => {
        customCol.push({
          title: c?.name,
          width: 100,
          type: c?.type,
          projectGroups: col?.projectGroups || [],
        });
      });
    });

    if (!isEmpty(customCol)) {
      setCustomColumns(
        customCol.map((c) => {
          return {
            name: c?.title as string,
            type: c?.type,
            projectGroups: c?.projectGroups,
          };
        }),
      );

      const customColumns = customCol?.map((c, index: number) => {
        return {
          title: c?.title,
          key: index,
          dataIndex: index.toString(),
          width: 100,
          render: (
            _: unknown,
            item:
              | QueryTaskReport
              | QueryProjectReport
              | QueryProjectGroupReport,
          ) => {
            if ('taskId' in item) {
              const taskId = item?.taskId;
              const value =
                item?.customValuesObj?.find(
                  (custom) =>
                    custom?.name === c?.title && +custom?.type === +c?.type,
                )?.value || '';

              return <div key={taskId}>{value}</div>;
            } else if ('projectGroupId' in item && !('projectGroups' in item)) {
              const groupId = item?.projectGroupId;
              if (groupId && +c?.type === 2) {
                const tasks = item?.tasks;
                const value = tasks?.reduce((acc, task) => {
                  const customValue =
                    task?.customValuesObj?.find(
                      (custom) =>
                        custom?.name === c?.title && +custom?.type === +c?.type,
                    )?.value || 0;

                  return acc + +customValue;
                }, 0);

                return <div key={groupId}>{value}</div>;
              }
            } else if ('projectId' in item && 'projectGroups' in item) {
              const projectReportRow = item;
              const projectId = projectReportRow?.projectId;
              if (projectId && +c?.type === 2) {
                const groups = projectReportRow?.projectGroups;
                const value = groups?.reduce((acc, group) => {
                  const tasks = group?.tasks as QueryTaskReport[];
                  const groupValue = tasks?.reduce((acc, task) => {
                    const customValue =
                      task?.customValuesObj?.find(
                        (custom) =>
                          custom?.name === c?.title &&
                          +custom?.type === +c?.type,
                      )?.value || 0;

                    return acc + +customValue;
                  }, 0);

                  return acc + +groupValue;
                }, 0);

                return <div key={projectId}>{value}</div>;
              }
              return <div key={item?.index}>{+c?.type === 2 ? 0 : ''}</div>;
            }

            return <></>;
          },
        };
      }) as CustomColumProps[];

      return [...columns, ...customColumns];
    }

    return columns;
  }, [reportData]);

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Report',
            path: '/report',
          },
          {
            name: 'Generated Report',
          },
        ]}
      />

      <Card className={styles.wrapper}>
        <Space direction="vertical" size={20}>
          <Typography.Text className={styles.title}>
            {state ? upperFirst(state?.type) : ''} Report (
            {reportData?.length || 0})
          </Typography.Text>

          <Grid.Row justify="space-between">
            <Button
              className={styles['theme-button']}
              icon={<MdAdd />}
              onClick={redirectToReportFormPage}
            >
              Generate New
            </Button>

            <Space>
              {!['assignee', 'project', 'team'].includes(
                state?.project?.reportType,
              ) && (
                <Dropdown.Button
                  className={styles['checkbox-group-dropdown']}
                  icon={<MdKeyboardArrowDown />}
                  droplist={
                    <Card>
                      <Checkbox.Group
                        direction="vertical"
                        value={visibleColumnKeys}
                        onChange={handleUpdateVisibleColumnKeys}
                        options={reportColumns?.keyOptions}
                      />
                    </Card>
                  }
                >
                  Report Data
                </Dropdown.Button>
              )}

              {state?.type === 'invoice' ? (
                <Dropdown
                  trigger="click"
                  droplist={
                    <Menu onClickMenuItem={handleClickInvoiceMenuItem}>
                      <Menu.Item key="excel" disabled>
                        Microsoft Excel
                      </Menu.Item>
                      <Menu.Item key="sql">SQL Accounting</Menu.Item>
                    </Menu>
                  }
                >
                  <Button icon={<MdIosShare />} loading={isExporting}>
                    Export
                  </Button>
                </Dropdown>
              ) : (
                <Button
                  icon={<MdIosShare />}
                  loading={isExporting}
                  onClick={handleExportReport}
                >
                  Export
                </Button>
              )}
            </Space>
          </Grid.Row>

          <Table
            className={styles.table}
            data={reportData}
            columns={
              ['assignee', 'project', 'team'].includes(
                state.project?.reportType,
              )
                ? projectReportColumns
                : visibleColumns
            }
            loading={loading}
            size="small"
            scroll={{ x: true }}
            pagination={false}
            rowKey={
              state?.type === 'invoice'
                ? 'reference'
                : state?.type === 'project'
                ? 'index'
                : 'id'
            }
            summary={(currentData) => {
              const summary = reportColumns?.summary?.({
                data: currentData || [],
                visibleKeys: visibleColumnKeys,
                visibleColumns,
              });

              if (
                ['assignee', 'project', 'team'].includes(
                  state?.project?.reportType,
                ) &&
                currentData
              ) {
                //@ts-ignore
                const projectGroups = [];
                //@ts-ignore
                const tasks = [];

                for (const data of currentData) {
                  //@ts-ignore
                  data?.projectGroups?.forEach((d) => {
                    projectGroups.push(d);
                    //@ts-ignore
                    d?.tasks?.forEach((t) => tasks.push(t));
                  });
                }
                //@ts-ignore
                const totalTargetedMinutes = projectGroups.reduce(
                  (acc, cur) => {
                    return acc + cur.totalTargetedMinutes;
                  },
                  0,
                );

                //@ts-ignore
                const totalVarianceMinutes = projectGroups.reduce(
                  (acc, cur) => {
                    return acc + cur.totalVarianceMinutes;
                  },
                  0,
                );
                //@ts-ignore
                const totalBudget = tasks.reduce((acc, cur) => {
                  return acc + +cur?.budget;
                }, 0);
                //@ts-ignore
                const totalActualCost = tasks.reduce((acc, cur) => {
                  return acc + +cur?.actualCost;
                }, 0);
                //@ts-ignore
                const totalVarianceBudget = tasks.reduce((acc, cur) => {
                  return acc + +cur?.varianceBudget;
                }, 0);

                //@ts-ignore
                const totalActualMinutes = tasks?.reduce((acc, cur) => {
                  return acc + cur?.actualMinutes;
                }, 0);

                const numberOfCustomColumns = customColumns?.length;
                const renderCustomColumns = range(0, numberOfCustomColumns).map(
                  (i) => {
                    if (customColumns?.[i]?.type === 2) {
                      const groups = customColumns?.[i]?.projectGroups;
                      const value = groups?.reduce((acc, group) => {
                        const tasks = group?.tasks as QueryTaskReport[];
                        const groupValue = tasks?.reduce((acc, task) => {
                          const customValues = task?.customValuesObj?.reduce(
                            (ac, current) => {
                              return ac + +current?.value;
                            },
                            0,
                          );

                          return acc + +customValues;
                        }, 0);

                        return acc + +groupValue;
                      }, 0);

                      return (
                        <Table.Summary.Cell key={i}>
                          {+value}
                        </Table.Summary.Cell>
                      );
                    } else {
                      return <Table.Summary.Cell key={i} />;
                    }
                  },
                );

                return (
                  <Table.Summary>
                    <Table.Summary.Row>
                      <Table.Summary.Cell>Total</Table.Summary.Cell>
                      <Table.Summary.Cell />
                      <Table.Summary.Cell />
                      <Table.Summary.Cell />
                      <Table.Summary.Cell />
                      <Table.Summary.Cell />
                      <Table.Summary.Cell />
                      <Table.Summary.Cell>
                        {minutesToHoursAndMinutes(totalTargetedMinutes)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        {minutesToHoursAndMinutes(totalActualMinutes)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        {totalActualMinutes}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        {minutesToHoursAndMinutes(totalVarianceMinutes)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        {formatToCurrency(totalBudget)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        {formatToCurrency(totalActualCost)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        {formatToCurrency(totalVarianceBudget)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell />
                      {renderCustomColumns}
                    </Table.Summary.Row>
                  </Table.Summary>
                );
              }

              return (
                currentData &&
                currentData.length > 0 &&
                summary &&
                summary.length > 0 && (
                  <Table.Summary>
                    <Table.Summary.Row>
                      {summary.map((col) => (
                        <Table.Summary.Cell
                          className={col.className}
                          colSpan={col.colSpan}
                        >
                          {col.content}
                        </Table.Summary.Cell>
                      ))}
                    </Table.Summary.Row>
                  </Table.Summary>
                )
              );
            }}
          />
        </Space>
      </Card>
    </>
  );
};

export default GenerateReportPage;
