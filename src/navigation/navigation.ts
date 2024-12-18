import { NavigateFunction, Location } from 'react-router-dom';

import { useResponsiveStore } from '@/stores/useResponsiveStores';

const navigateLoginPage = (navigate: NavigateFunction, state?: unknown) => {
  navigate('/login', { state });
};

const navigateVerifyEmailPage = (navigate: NavigateFunction, email: string) => {
  navigate('/verify-email', {
    state: email,
  });
};

const navigateOnboardingPage = (navigate: NavigateFunction) => {
  navigate('/onboarding');
};

const navigateHomePage = (navigate: NavigateFunction, companySlug: string) => {
  navigate(`/${companySlug}/home`);
};

const navigateBoardPage = (
  navigate: NavigateFunction,
  boardId: string,
  companySlug: string,
) => {
  navigate(`/${companySlug}/board/${boardId}`);
};

const navigateContactListPage = (
  navigate: NavigateFunction,
  companySlug: string,
) => {
  navigate(`/${companySlug}/crm`);
};

const navigateContactInfoPage = ({
  navigate,
  companySlug,
  contactId,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  contactId: string;
}) => {
  navigate(`/${companySlug}/contact/${contactId}`);
};

const navigateTaskPage = ({
  navigate,
  taskId,
  companySlug,
  location,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  taskId: string;
  location?: Location;
}) => {
  const { isMobile } = useResponsiveStore.getState();

  navigate(`/${companySlug}/task/${taskId}`, {
    state: !isMobile && location ? { backgroundLocation: location } : undefined,
  });
};

const navigateAttendanceDetails = (
  navigate: NavigateFunction,
  companySlug: string,
  memberId: string,
) => {
  navigate(`/${companySlug}/member/${memberId}/attendance-details`);
};

const navigateReportFormPage = (
  navigate: NavigateFunction,
  companySlug: string,
) => {
  navigate(`/${companySlug}/report`);
};

const navigateGenerateReportPage = ({
  navigate,
  companySlug,
  state,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  state: unknown;
}) => {
  navigate(`/${companySlug}/report/generate`, { state });
};

const navigateProfilePage = (
  navigate: NavigateFunction,
  companySlug: string,
) => {
  navigate(`/${companySlug}/settings/profile`);
};

const navigateCompanyTeamInfoPage = ({
  navigate,
  companySlug,
  teamId,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  teamId: string;
}) => {
  navigate(`/${companySlug}/settings/company/teams/${teamId}`);
};

const navigateCompanyTagGroupPage = ({
  navigate,
  companySlug,
  tagGroupId,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  tagGroupId: string;
}) => {
  navigate(`/${companySlug}/settings/company/tags/${tagGroupId}`);
};

const navigateCompanyWorkSchedulesPage = (
  navigate: NavigateFunction,
  companySlug: string,
) => {
  navigate(`/${companySlug}/settings/company/work-schedules`);
};

const navigateCompanyWorkScheduleInfoPage = ({
  navigate,
  companySlug,
  employeeTypeId,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  employeeTypeId: string;
}) => {
  navigate(`/${companySlug}/settings/company/work-schedules/${employeeTypeId}`);
};

const navigateCompanySubscriptionsPage = ({
  navigate,
  companySlug,
}: {
  navigate: NavigateFunction;
  companySlug: string;
}) => {
  navigate(`/${companySlug}/settings/company/subscriptions`);
};

const navigateCompanySubscriptionInfoPage = ({
  navigate,
  companySlug,
  subscriptionId,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  subscriptionId: string;
}) => {
  navigate(`/${companySlug}/settings/company/subscriptions/${subscriptionId}`);
};

const navigateNotificationPage = (
  navigate: NavigateFunction,
  companySlug: string,
) => {
  navigate(`/${companySlug}/notifications`);
};

const navigateDedocoInfoPage = (
  navigate: NavigateFunction,
  companySlug: string,
) => {
  navigate(`/${companySlug}/settings/integrations/dedoco`);
};

const navigateUserPaymentPage = (
  navigate: NavigateFunction,
  companySlug: string,
) => {
  navigate(`/${companySlug}/settings/payment`);
};

const navigateWorkspacePage = ({
  navigate,
  companySlug,
  workspaceId,
  isNewCompany,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  workspaceId: string;
  isNewCompany?: boolean;
}) => {
  navigate(
    `/${companySlug}/workspace/${workspaceId}${
      isNewCompany ? '/?query=new-company' : ''
    }`,
  );
};

const navigateWorkspaceArchivedProjectsPage = ({
  navigate,
  companySlug,
  workspaceId,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  workspaceId: string;
}) => {
  navigate(`/${companySlug}/workspace/${workspaceId}/archived`);
};

const navigateProjectPage = ({
  navigate,
  companySlug,
  projectId,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  projectId: string;
}) => {
  navigate(`/${companySlug}/project/${projectId}`);
};

const navigateProjectArchivedTasksPage = ({
  navigate,
  companySlug,
  projectId,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  projectId: string;
}) => {
  navigate(`/${companySlug}/project/${projectId}/archived`);
};

const navigateTask = ({
  navigate,
  companySlug,
  taskId,
  location,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  taskId: string;
  location: Location;
}) => {
  navigate(`/${companySlug}/task/${taskId}`, {
    state: { backgroundLocation: location },
  });
};

const navigateSqlAccountingInfoPage = ({
  navigate,
  companySlug,
}: {
  navigate: NavigateFunction;
  companySlug: string;
}) => {
  navigate(`/${companySlug}/settings/integrations/sql-accounting`);
};

const navigateTimesheetPage = ({
  navigate,
  companySlug,
}: {
  navigate: NavigateFunction;
  companySlug: string;
}) => {
  navigate(`/${companySlug}/time/timesheet`);
};

const navigateAttendancePage = ({
  navigate,
  companySlug,
}: {
  navigate: NavigateFunction;
  companySlug: string;
}) => {
  navigate(`/${companySlug}/time/attendance`);
};

const navigateProjectTabsPage = ({
  navigate,
  companySlug,
  projectId,
  view,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  projectId: string;
  view: string;
}) => {
  navigate(`/${companySlug}/project/${projectId}#${view}`);
};

const navigateTimesheetApprovalPage = ({
  navigate,
  companySlug,
  projectId,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  projectId: string;
}) => {
  navigate(`/${companySlug}/time/${projectId}`, {
    state: 'project',
  });
};

const navigateMemberTimesheetApprovalPage = ({
  navigate,
  companySlug,
  memberId,
}: {
  navigate: NavigateFunction;
  companySlug: string;
  memberId: string;
}) => {
  navigate(`/${companySlug}/time/approval/${memberId}`, {
    state: 'member',
  });
};

export {
  navigateLoginPage,
  navigateVerifyEmailPage,
  navigateOnboardingPage,
  navigateHomePage,
  navigateBoardPage,
  navigateContactListPage,
  navigateContactInfoPage,
  navigateTaskPage,
  navigateAttendanceDetails,
  navigateReportFormPage,
  navigateGenerateReportPage,
  navigateProfilePage,
  navigateCompanyTeamInfoPage,
  navigateCompanyTagGroupPage,
  navigateCompanyWorkSchedulesPage,
  navigateCompanyWorkScheduleInfoPage,
  navigateCompanySubscriptionsPage,
  navigateCompanySubscriptionInfoPage,
  navigateNotificationPage,
  navigateDedocoInfoPage,
  navigateUserPaymentPage,
  navigateWorkspacePage,
  navigateWorkspaceArchivedProjectsPage,
  navigateProjectPage,
  navigateProjectArchivedTasksPage,
  navigateTask,
  navigateSqlAccountingInfoPage,
  navigateTimesheetPage,
  navigateAttendancePage,
  navigateProjectTabsPage,
  navigateTimesheetApprovalPage,
  navigateMemberTimesheetApprovalPage,
};
