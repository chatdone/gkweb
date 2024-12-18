import dayjs from 'dayjs';
import { capitalize } from 'lodash-es';

import apiService from './api.service';

import { downloadFile } from '@/utils/dom.utils';

export const BASE_PATH = `/reports`;

export type ReportTypeService = 'project' | 'assignee' | 'team';

export type TaskReportInput = {
  userId: string;
  companyId: string;
  dateRange: Date[];
  teamIds?: string[];
  memberIds?: string[];
  contactIds?: string[];
  picIds?: string[];
  tagIds?: string[];
};

export type AttendanceReportInput = {
  userId: string;
  companyId: string;
  dateRange: Date[];
  memberIds?: string[];
  activityLabelIds?: string[];
  employeeTypeId?: string;
  contactIds?: string[];
  tagIds?: string[];
};

export type ProjectReportInput = {
  userId: string;
  companyId: string;
  dateType: 'actual' | 'targeted';
  dateRange: Date[];
  amountRange?: { min: number; max: number };
  projectIds?: string[];
  projectOwnerIds?: string[];
  teamIds?: string[];
  memberIds?: string[];
  contactIds?: string[];
  statusId?: string;
  tagIds?: string[];
  isGroupByProject?: boolean;
};

export type InvoiceReportInput = {
  companyId: string;
  dateRange: Date[];
  workspaceIds?: string[];
};

export type ReportInputV2 = {
  userId: string;
  companyId: string;
  reportType: 'project' | 'assignee' | 'team';
  dateRange: Date[];
  projectIds?: string[];
  projectOwnerIds?: string[];
  assigneeId?: string;
  teamId?: string;
};

const getAttendanceReport = (input: AttendanceReportInput) => {
  const { dateRange, ...rest } = input;

  const [startDate, endDate] = dateRange;

  return apiService.get(`${BASE_PATH}/time-attendances`, {
    params: {
      responseType: 'json',
      intervalType: 'daily', // NOTE: not using at all in BE
      overtimeFlag: false,
      startDate,
      endDate,
      ...rest,
    },
  });
};

const getProjectReport = (input: ProjectReportInput) => {
  const { dateType, dateRange, amountRange, statusId, ...rest } = input;

  const [startDate, endDate] = dateRange;

  return apiService.get(`${BASE_PATH}/project-tasks`, {
    params: {
      responseType: 'json',
      subStatusId: statusId,
      start: dateType === 'targeted' ? startDate : undefined,
      end: dateType === 'targeted' ? endDate : undefined,
      actualStart: dateType === 'actual' ? startDate : undefined,
      actualEnd: dateType === 'actual' ? endDate : undefined,
      projectedCostMin: dateType === 'targeted' ? amountRange?.min : undefined,
      projectedCostMax: dateType === 'targeted' ? amountRange?.max : undefined,
      actualCostMin: dateType === 'actual' ? amountRange?.min : undefined,
      actualCostMax: dateType === 'actual' ? amountRange?.max : undefined,
      ...rest,
    },
  });
};

const getInvoiceReport = (input: InvoiceReportInput) => {
  const { dateRange, ...rest } = input;

  const [startDate, endDate] = dateRange;

  return apiService.get(`${BASE_PATH}/invoice`, {
    params: {
      responseType: 'json',
      start: startDate,
      end: endDate,
      ...rest,
    },
  });
};

const downloadAttendanceReport = async (input: AttendanceReportInput) => {
  const { dateRange, ...rest } = input;

  const [startDate, endDate] = dateRange;

  try {
    const res = await apiService.get(`${BASE_PATH}/time-attendances`, {
      responseType: 'blob',
      params: {
        responseType: 'file',
        startDate,
        endDate,
        intervalType: 'daily',
        overtimeFlag: false,
        ...rest,
      },
    });

    const url = URL.createObjectURL(res.data);

    downloadFile({
      url,
      fileName: 'TimeAttendance-Report',
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const downloadProjectReport = async (input: ProjectReportInput) => {
  const { dateType, dateRange, amountRange, statusId, ...rest } = input;

  const [startDate, endDate] = dateRange;

  try {
    const res = await apiService.get(`${BASE_PATH}/project-tasks`, {
      responseType: 'blob',
      params: {
        responseType: 'file',
        subStatusId: statusId,
        start: dateType === 'targeted' ? startDate : undefined,
        end: dateType === 'targeted' ? endDate : undefined,
        actualStart: dateType === 'actual' ? startDate : undefined,
        actualEnd: dateType === 'actual' ? startDate : undefined,
        projectedCostMin:
          dateType === 'targeted' ? amountRange?.min : undefined,
        projectedCostMax:
          dateType === 'targeted' ? amountRange?.max : undefined,
        actualCostMin: dateType === 'actual' ? amountRange?.min : undefined,
        actualCostMax: dateType === 'actual' ? amountRange?.max : undefined,
        ...rest,
      },
    });

    const url = URL.createObjectURL(res.data);

    downloadFile({
      url,
      fileName: 'ProjectTasks-Report',
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const downloadPaymentTransactionsReport = async (userId: string) => {
  try {
    const res = await apiService.get(
      `${BASE_PATH}/payment-transactions?userId=${userId}`,
      {
        responseType: 'blob',
      },
    );

    const url = URL.createObjectURL(res.data);

    downloadFile({
      url,
      fileName: 'PaymentTransactions-Report',
    });
  } catch (error) {
    console.error(error);
  }
};

const downloadInvoiceSqlReport = async (input: InvoiceReportInput) => {
  const { dateRange, ...rest } = input;

  const [startDate, endDate] = dateRange;

  try {
    const res = await apiService.get(`${BASE_PATH}/invoice`, {
      responseType: 'blob',
      params: {
        responseType: 'file',
        start: startDate,
        end: endDate,
        ...rest,
      },
    });

    const url = URL.createObjectURL(res.data);

    const dateTime = dayjs().format('YYYYMMDDHHmmss');
    downloadFile({
      url,
      fileName: `SL_IV.${dateTime}.xlsx`,
    });
  } catch (error) {
    console.error(error);
  }
};

const downloadReportV2 = async (input: ReportInputV2) => {
  try {
    const res = await apiService.get(`${BASE_PATH}/projects-v2`, {
      responseType: 'blob',
      params: {
        responseType: 'file',
        ...input,
      },
    });

    const url = URL.createObjectURL(res.data);

    downloadFile({
      url,
      fileName: `${capitalize(input.reportType)}-Report`,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const getReportV2 = (input: ReportInputV2) => {
  return apiService.get(`${BASE_PATH}/projects-v2`, {
    params: {
      responseType: 'json',
      ...input,
    },
  });
};

export {
  getAttendanceReport,
  downloadAttendanceReport,
  getProjectReport,
  downloadProjectReport,
  downloadPaymentTransactionsReport,
  getInvoiceReport,
  downloadInvoiceSqlReport,
  downloadReportV2,
  getReportV2,
};
