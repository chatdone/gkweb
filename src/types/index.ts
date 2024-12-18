import type { SelectProps } from '@arco-design/web-react/es/Select/interface';
import type { ReactNode } from 'react';

export type BaseModalConfig = {
  visible: boolean;
  onCancel: () => void;
};

export type ArrayElement<T> = T extends (infer U)[] ? U : null;

export type SelectOption = Extract<
  ArrayElement<SelectProps['options']>,
  { label: ReactNode | string }
>;

export type CompanySettings = {
  dedoco?: {
    enabled?: boolean;
  };
  allowedPaymentType?: {
    full?: boolean;
    instalment?: boolean;
    subscription?: boolean;
  };
  senangpay?: {
    applicationStatus?: number;
    default_payment?: boolean;
    enabled?: boolean;
  };
};

export type NotificationModel = {
  recipientId: string;
  path: string;
  message: string;
  read: boolean;
  groupType: string;
  companyId: string;
  id: string;
  createdAt: string;
  createdBy: {
    name?: string;
    profileImage?: string;
    picName?: string;
  };
};

export type NotificationResponseModel = {
  data: {
    notifications: NotificationModel[];
    unreadCount: number;
  };
};

export type UpdateNotificationResponseModel = {
  data: {
    notifications: NotificationModel[];
  };
};

export type NotificationUnreadCountModel = {
  data: {
    unreadCount: number;
  };
};

export enum NotificationFilterType {
  ALL = 1,
  UNREAD = 2,
  MENTIONED = 3,
  ASSIGNED = 4,
}

export type TaskRecurringType =
  | 'DAILY'
  | 'WEEKLY'
  | 'FIRST_WEEK'
  | 'SECOND_WEEK'
  | 'THIRD_WEEK'
  | 'FOURTH_WEEK'
  | 'MONTHLY'
  | 'YEARLY';

export enum OnboardingType {
  NONE,
  INITIAL,
  EDIT_COMPANY,
  ADD_COMPANY_MEMBERS,
  ADD_COMPANY_TEAM,
  EDIT_COMPANY_TEAM,
  SETUP_PAYMENT_DETAILS,
  SUBSCRIBE_PACKAGE,
  ADD_CONTACT_GROUP,
  ADD_CONTACT,
  ASSIGN_CONTACT_GROUP_FOR_CONTACT,
  VIEW_CONTACT_DETAIL,
  ADD_INTERNAL_TASK_BOARD,
  ADD_TASK_BOARD_TEAM,
  ADD_TASK,
  EDIT_TASK,
  TASK_VIEW_MODE,
  TASK_SHARED_WITH_ME,
  ADD_CLIENT_COLLECTOR,
  CREATE_COLLECTION,
  VIEW_COLLECTION,
  COLLECTION_LIST_VIEW_TYPE_AND_STATUS_SORTING,
  PAYMENTS_PAGE,
  GANTT_CHART,
  CREATE_PROJECT,
  ADD_PROJECT_TEAM,
  CREATE_PROJECT_TASK,
  EDIT_PROJECT_TASK,
  ATTENDANCE_CLOCK_IN,
  ATTENDANCE_DETAILS,
  COMPANY_POLICY,
  COMPANY_HOLIDAY,
  COMPANY_LOCATION,
  COMPANY_SELECT_LOCATION,
  COMPANY_ADD_LOCATION,
  COMPANY_ACTIVITY_LABEL,
  CREATE_EMPLOYEE_TYPE,
  EDIT_EMPLOYEE_TYPE,
  SET_COMPANY_MEMBER_EMPLOYEE_TYPE,
}

export enum OnboardingRangeType {
  SETTINGS_COMPANY,
  SETTINGS_TIME_ATTENDANCE,
  CRM,
  TASK,
  COLLECTION,
  PAYMENT,
  TIME_ATTENDANCE,
  PROJECT_MANAGEMENT,
}

export type QueryProjectReport = {
  actualCost: string;
  actualHour: string;
  actualMinutes: number;
  assigneeName: string;
  budget: string;
  children: Array<QueryProjectGroupReport>;
  customColumnNames: Array<{ name: string; type: number }>;
  index: number;
  name: string;
  projectGroups: Array<QueryProjectGroupReport>;
  projectId: number;
  projectName: string;
  projectOwnerNames: string;
  targetedHour: string;
  teamName: string;
  varianceBudget: string;
  varianceHours: string;
};

export type QueryTaskReport = {
  actualCost: string;
  actualEnd: string;
  actualHour: string;
  actualMinutes: number;
  actualStart: string;
  assigneeNames: string;
  billable: number;
  budget: string;
  customValuesObj: Array<{ name: string; type: string; value: string }>;
  name: string;
  statusName: string;
  tagNames: string;
  targetedEnd: string;
  targetedHour: string;
  targetedMinutes: number;
  targetedStart: string;
  taskId: number;
  varianceBudget: number;
  varianceHours: string;
  varianceMinutes: number;
  totalActualMinutes: number;
  totalTargetedMinutes: number;
  totalVarianceMinutes: number;
};

export type QueryProjectGroupReport = {
  actualCost: string;
  actualCostUnformatted: number;
  budget: string;
  budgetUnformatted: number;
  children: Array<QueryProjectGroupReport>;
  index: number;
  key: number;
  name: string;
  projectGroupId: number;
  projectGroupName: string;
  tasks: Array<QueryTaskReport>;
  varianceBudget: string;
};
