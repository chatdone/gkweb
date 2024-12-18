import faker from '@faker-js/faker';
import { random } from 'lodash-es';
import { describe, test, vi, beforeEach } from 'vitest';

import apiService from './api.service';
import {
  getAttendanceReport,
  getProjectReport,
  downloadAttendanceReport,
  downloadProjectReport,
  downloadPaymentTransactionsReport,
  AttendanceReportInput,
  ProjectReportInput,
  BASE_PATH,
} from './report.service';

vi.mock('./api.service', () => ({
  default: {
    get: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

let mockData: {
  companyId: string;
  userId: string;
  memberIds: string[];
  picIds: string[];
  tagIds: string[];
  contactIds: string[];
  teamIds: string[];
  startDate: Date;
  endDate: Date;
};

beforeEach(() => {
  mockData = {
    companyId: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
    memberIds: Array.from({ length: random(0, 5) }, faker.datatype.uuid),
    picIds: Array.from({ length: random(0, 5) }, faker.datatype.uuid),
    tagIds: Array.from({ length: random(0, 5) }, faker.datatype.uuid),
    contactIds: Array.from({ length: random(0, 5) }, faker.datatype.uuid),
    teamIds: Array.from({ length: random(0, 5) }, faker.datatype.uuid),
    startDate: new Date(faker.date.past()),
    endDate: new Date(faker.date.recent()),
  };
});

describe('Attendance Report', () => {
  test('should be able to get attendance report', async () => {
    const input: AttendanceReportInput = {
      companyId: mockData.companyId,
      userId: mockData.userId,
      dateRange: [mockData.startDate, mockData.endDate],
      memberIds: mockData.memberIds,
      tagIds: mockData.tagIds,
    };

    vi.mocked(apiService.get).mockResolvedValue(true);

    const res = await getAttendanceReport(input);

    expect(apiService.get).toHaveBeenCalledWith(
      `${BASE_PATH}/time-attendances`,
      {
        params: {
          responseType: 'json',
          startDate: mockData.startDate,
          endDate: mockData.endDate,
          companyId: mockData.companyId,
          userId: mockData.userId,
          memberIds: mockData.memberIds,
          tagIds: mockData.tagIds,
          intervalType: 'daily',
          overtimeFlag: false,
        },
      },
    );
    expect(res).toBe(true);
  });

  test('should be able to download attendance report', async () => {
    const input: AttendanceReportInput = {
      companyId: mockData.companyId,
      userId: mockData.userId,
      dateRange: [mockData.startDate, mockData.endDate],
      memberIds: mockData.memberIds,
      tagIds: mockData.tagIds,
    };

    await downloadAttendanceReport(input);

    expect(apiService.get).toHaveBeenCalledWith(
      `${BASE_PATH}/time-attendances`,
      {
        responseType: 'blob',
        params: {
          responseType: 'file',
          startDate: mockData.startDate,
          endDate: mockData.endDate,
          companyId: mockData.companyId,
          userId: mockData.userId,
          memberIds: mockData.memberIds,
          tagIds: mockData.tagIds,
          intervalType: 'daily',
          overtimeFlag: false,
        },
      },
    );
  });
});

describe('Project Report', () => {
  test('should be able to get project report with targeted date type', async () => {
    const projectIds = Array.from(
      { length: random(0, 5) },
      faker.datatype.uuid,
    );
    const projectOwnerIds = Array.from(
      { length: random(0, 5) },
      faker.datatype.uuid,
    );
    const statusId = faker.datatype.uuid();

    const input: ProjectReportInput = {
      companyId: mockData.companyId,
      userId: mockData.userId,
      dateRange: [mockData.startDate, mockData.endDate],
      memberIds: mockData.memberIds,
      tagIds: mockData.tagIds,
      dateType: 'targeted',
      contactIds: mockData.contactIds,
      teamIds: mockData.teamIds,
      amountRange: { min: 100, max: 5000 },
      projectIds,
      projectOwnerIds,
      statusId,
    };

    vi.mocked(apiService.get).mockResolvedValue(true);

    const res = await getProjectReport(input);

    expect(apiService.get).toHaveBeenCalledWith(`${BASE_PATH}/project-tasks`, {
      params: {
        responseType: 'json',
        start: mockData.startDate,
        end: mockData.endDate,
        companyId: mockData.companyId,
        userId: mockData.userId,
        memberIds: mockData.memberIds,
        tagIds: mockData.tagIds,
        teamIds: mockData.teamIds,
        contactIds: mockData.contactIds,
        subStatusId: statusId,
        projectedCostMin: 100,
        projectedCostMax: 5000,
        projectIds,
        projectOwnerIds,
        actualCostMin: undefined,
        actualCostMax: undefined,
        actualStart: undefined,
        actualEnd: undefined,
      },
    });
    expect(res).toBe(true);
  });

  test('should be able to get project report with actual date type', async () => {
    const projectIds = Array.from(
      { length: random(0, 5) },
      faker.datatype.uuid,
    );
    const projectOwnerIds = Array.from(
      { length: random(0, 5) },
      faker.datatype.uuid,
    );
    const statusId = faker.datatype.uuid();

    const input: ProjectReportInput = {
      companyId: mockData.companyId,
      userId: mockData.userId,
      dateRange: [mockData.startDate, mockData.endDate],
      memberIds: mockData.memberIds,
      tagIds: mockData.tagIds,
      dateType: 'actual',
      contactIds: mockData.contactIds,
      teamIds: mockData.teamIds,
      amountRange: { min: 100, max: 5000 },
      projectIds,
      projectOwnerIds,
      statusId,
    };

    vi.mocked(apiService.get).mockResolvedValue(true);

    const res = await getProjectReport(input);

    expect(apiService.get).toHaveBeenCalledWith(`${BASE_PATH}/project-tasks`, {
      params: {
        responseType: 'json',
        companyId: mockData.companyId,
        userId: mockData.userId,
        memberIds: mockData.memberIds,
        tagIds: mockData.tagIds,
        teamIds: mockData.teamIds,
        contactIds: mockData.contactIds,
        subStatusId: statusId,
        projectIds,
        projectOwnerIds,
        start: undefined,
        end: undefined,
        projectedCostMin: undefined,
        projectedCostMax: undefined,
        actualCostMin: 100,
        actualCostMax: 5000,
        actualStart: mockData.startDate,
        actualEnd: mockData.endDate,
      },
    });
    expect(res).toBe(true);
  });

  test('should be able to download project report', async () => {
    const projectIds = Array.from(
      { length: random(0, 5) },
      faker.datatype.uuid,
    );
    const projectOwnerIds = Array.from(
      { length: random(0, 5) },
      faker.datatype.uuid,
    );
    const statusId = faker.datatype.uuid();

    const input: ProjectReportInput = {
      companyId: mockData.companyId,
      userId: mockData.userId,
      dateRange: [mockData.startDate, mockData.endDate],
      memberIds: mockData.memberIds,
      tagIds: mockData.tagIds,
      dateType: 'targeted',
      contactIds: mockData.contactIds,
      teamIds: mockData.teamIds,
      amountRange: { min: 100, max: 5000 },
      projectIds,
      projectOwnerIds,
      statusId,
    };

    await downloadProjectReport(input);

    expect(apiService.get).toHaveBeenCalledWith(`${BASE_PATH}/project-tasks`, {
      responseType: 'blob',
      params: {
        responseType: 'file',
        start: mockData.startDate,
        end: mockData.endDate,
        companyId: mockData.companyId,
        userId: mockData.userId,
        memberIds: mockData.memberIds,
        tagIds: mockData.tagIds,
        teamIds: mockData.teamIds,
        contactIds: mockData.contactIds,
        subStatusId: statusId,
        projectedCostMin: 100,
        projectedCostMax: 5000,
        projectIds,
        projectOwnerIds,
        actualCostMin: undefined,
        actualCostMax: undefined,
        actualStart: undefined,
        actualEnd: undefined,
      },
    });
  });
});

describe('downloadPaymentTransactionsReport', () => {
  test('should be able to get payment transactions report', async () => {
    await downloadPaymentTransactionsReport(mockData.userId);

    expect(apiService.get).toHaveBeenCalledWith(
      `${BASE_PATH}/payment-transactions?userId=${mockData.userId}`,
      {
        responseType: 'blob',
      },
    );
  });
});
