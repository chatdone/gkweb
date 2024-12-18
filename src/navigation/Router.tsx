import { withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';
import loadable, { LoadableComponent } from '@loadable/component';
import NProgress from 'nprogress';
import React, { lazy, ReactNode, Suspense, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import {
  Navigate,
  RouteObject,
  useRoutes,
  useParams,
  useLocation,
  Location,
  Routes,
  Route,
} from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

import withCypress from './withCypress';

import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketContext,
  SocketContextInterface,
} from 'contexts/socket';

import Configs from '@/configs';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const ContactListPage = lazy(() => import('@/pages/crm/ContactListPage'));
const ContactInfoPage = lazy(() => import('@/pages/crm/ContactInfoPage'));
const AttendanceListPage = lazy(
  () => import('@/pages/attendance/AttendanceListPage'),
);

const TimesheetApprovalPage = lazy(
  () => import('@/pages/attendance/TimesheetApprovalPage'),
);

const TimesheetMemberApprovalPage = lazy(
  () => import('@/pages/attendance/TimesheetMemberApprovalPage'),
);

const AttendanceDetailsPage = lazy(
  () => import('@/pages/attendance/AttendanceDetailsPage'),
);

const TimesheetTrackingPage = lazy(
  () => import('@/pages/attendance/TimesheetTrackingPage'),
);
const ReportFormPage = lazy(() => import('@/pages/report/ReportFormPage'));
const GenerateReportPage = lazy(
  () => import('@/pages/report/GenerateReportPage'),
);
const NotificationPage = lazy(() => import('@/pages/NotificationPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const CompanyAccountPage = lazy(
  () => import('@/pages/company/CompanyAccountPage'),
);
const CompanyMemberPage = lazy(
  () => import('@/pages/company/CompanyMembersPage'),
);
const CompanyTeamsPage = lazy(() => import('@/pages/company/CompanyTeamsPage'));
const CompanyTeamInfoPage = lazy(
  () => import('@/pages/company/CompanyTeamInfoPage'),
);
const CompanyPoliciesPage = lazy(
  () => import('@/pages/company/CompanyPoliciesPage'),
);
const CompanyWorkSchedulesPage = lazy(
  () => import('@/pages/company/CompanyWorkSchedulesPage'),
);
const CompanyWorkScheduleInfoPage = lazy(
  () => import('@/pages/company/CompanyWorkScheduleInfoPage'),
);
const CompanyTagsPage = lazy(() => import('@/pages/company/CompanyTagsPage'));
const CompanyTagGroupPage = lazy(
  () => import('@/pages/company/CompanyTagGroupPage'),
);
const CompanySubscriptionsPage = lazy(
  () => import('@/pages/company/CompanySubscriptionsPage'),
);
const CompanySubscriptionInfoPage = lazy(
  () => import('@/pages/company/CompanySubscriptionInfoPage'),
);
const CompanyLocationsPage = lazy(
  () => import('@/pages/company/CompanyLocationsPage'),
);
const CompanyHolidaysPage = lazy(
  () => import('@/pages/company/CompanyHolidaysPage'),
);
const CompanyActivityLabelsPage = lazy(
  () => import('@/pages/company/CompanyActivityLabelsPage'),
);
const CompanyIntegrationPage = lazy(
  () => import('@/pages/company/CompanyIntegrationPage'),
);
const CompanyInvoiceSettingsPage = lazy(
  () => import('@/pages/company/CompanyInvoiceSettingsPage'),
);
const CompanyPaymentPage = lazy(
  () => import('@/pages/company/CompanyPaymentPage'),
);
// const CompanyNotificationsPage = lazy(
//   () => import('@/pages/company/CompanyNotificationsPage'),
// );
// const CompanyPermissionsPage = lazy(
//   () => import('@/pages/company/CompanyPermissionsPage'),
// );
const DedocoInfoPage = lazy(() => import('@/pages/DedocoInfoPage'));
const RedirectLinkPage = lazy(() => import('@/pages/RedirectLinkPage'));
const VerifyEmailPage = lazy(() => import('@/pages/VerifyEmailPage'));
const LogoutPage = lazy(() => import('@/pages/LogoutPage'));
const WorkspacePage = lazy(() => import('@/pages/workspace/WorkspacePage'));
const WorkspaceArchivedProjectsPage = lazy(
  () => import('@/pages/workspace/WorkspaceArchivedProjectsPage'),
);
const ProjectPage = lazy(() => import('@/pages/workspace/ProjectPage'));
const ProjectArchivedTasksPage = lazy(
  () => import('@/pages/workspace/ProjectArchivedTasksPage'),
);
const PreTaskModalPage = lazy(
  () => import('@/pages/workspace/PreTaskModalPage'),
);
const TaskModalPage = lazy(() => import('@/pages/workspace/TaskModalPage'));
const SharedTaskPage = lazy(() => import('@/pages/workspace/SharedTaskPage'));
const SqlAccountingInfoPage = lazy(
  () => import('@/pages/SqlAccountingInfoPage'),
);

const SandboxPage = lazy(() => import('@/pages/SandboxPage'));

const AppLayout = loadable(() => import('@/components/AppLayout'));
const Loader = loadable(() => import('./Loader'));
const CompanySlugGuard = loadable(() => import('./CompanySlugGuard'));

const LazyLoadNProgress = () => {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return <></>;
};

const lazyRoute = (
  WrappedComponent: React.LazyExoticComponent<() => JSX.Element>,
): ReactNode => {
  return (
    <Suspense fallback={<LazyLoadNProgress />}>
      <WrappedComponent />
    </Suspense>
  );
};

const lazyRouteWithCompanySlugGuard = (
  WrappedComponent: React.LazyExoticComponent<() => JSX.Element>,
): ReactNode => {
  return (
    <Suspense fallback={<LazyLoadNProgress />}>
      <CompanySlugGuard>
        <WrappedComponent />
      </CompanySlugGuard>
    </Suspense>
  );
};

const protectedRoute = (
  WrappedComponent: React.FC | LoadableComponent<unknown>,
): ReactNode => {
  // const Component = window.Cypress
  //   ? withCypress(WrappedComponent)
  //   : withAuthenticationRequired(WrappedComponent, {
  //       onRedirecting: () => <Loader />,
  //     });

  return (
    <Suspense fallback={<LazyLoadNProgress />}>
        <WrappedComponent />

      {/* <Component /> */}
    </Suspense>
  );
};

const NavigateWithCompanyId = ({ to }: { to: string }) => {
  const { companyId } = useParams();
  return <Navigate replace to={`/${companyId}/${to}`} />;
};

const NavigateWithCheck = ({
  to,
  replace,
}: {
  to: string;
  replace?: boolean;
}) => {
  const location = useLocation();

  if (location.search || location.hash) {
    return <></>;
  }

  return <Navigate to={to} replace={replace} />;
};

const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        index: true,
        element: <NavigateWithCheck replace to={`/login`} />,
      },
      { path: 'signup', element: <Navigate replace to={`/login`} /> },
      { path: 'login', element: lazyRoute(LoginPage) },
      { path: 'logout', element: lazyRoute(LogoutPage) },
      { path: 'verify-email', element: lazyRoute(VerifyEmailPage) },
      // { path: 'onboarding', element: protectedRoute(OnboardingPage) },
      { path: 'onboarding', element: lazyRoute(OnboardingPage) },
      {
        path: 'link',
        children: [
          {
            path: ':shortId',
            element: lazyRoute(RedirectLinkPage),
          },
        ],
      },
      {
        path: ':companyId',
        element: protectedRoute(AppLayout),
        children: [
          {
            index: true,
            element: <NavigateWithCompanyId to="home" />,
          },
          {
            path: '*',
            element: <NavigateWithCompanyId to="home" />,
          },
          {
            path: 'home',
            element: lazyRouteWithCompanySlugGuard(HomePage),
          },
          {
            path: 'contacts',
            element: lazyRouteWithCompanySlugGuard(ContactListPage),
          },
          {
            path: 'contact',
            children: [
              {
                path: ':contactId',
                element: lazyRouteWithCompanySlugGuard(ContactInfoPage),
              },
            ],
          },

          {
            path: 'workspace/:workspaceId',
            children: [
              {
                index: true,
                element: lazyRoute(WorkspacePage),
              },
              {
                path: 'archived',
                element: lazyRoute(WorkspaceArchivedProjectsPage),
              },
            ],
          },
          {
            path: 'project/:projectId',
            children: [
              {
                index: true,
                element: lazyRoute(ProjectPage),
              },
              {
                path: 'archived',
                element: lazyRoute(ProjectArchivedTasksPage),
              },
            ],
          },
          {
            path: 'task/:taskId',
            element: lazyRoute(PreTaskModalPage),
          },
          {
            path: 'shared',
            children: [
              {
                index: true,
              },
              {
                path: ':taskId',
                element: lazyRoute(SharedTaskPage),
              },
            ],
          },
          {
            path: 'report',
            children: [
              {
                index: true,
                element: lazyRouteWithCompanySlugGuard(ReportFormPage),
              },
              {
                path: 'generate',
                element: lazyRouteWithCompanySlugGuard(GenerateReportPage),
              },
            ],
          },
          {
            path: 'notifications',
            element: lazyRouteWithCompanySlugGuard(NotificationPage),
          },
          {
            path: 'settings',
            children: [
              {
                path: 'profile',
                element: lazyRouteWithCompanySlugGuard(ProfilePage),
              },
              {
                path: 'company',
                children: [
                  {
                    path: 'account',
                    element: lazyRouteWithCompanySlugGuard(CompanyAccountPage),
                  },
                  {
                    path: 'members',
                    element: lazyRouteWithCompanySlugGuard(CompanyMemberPage),
                  },
                  {
                    path: 'teams',
                    children: [
                      {
                        index: true,
                        element:
                          lazyRouteWithCompanySlugGuard(CompanyTeamsPage),
                      },
                      {
                        path: ':teamId',
                        element:
                          lazyRouteWithCompanySlugGuard(CompanyTeamInfoPage),
                      },
                    ],
                  },
                  {
                    path: 'work-schedules',
                    children: [
                      {
                        index: true,
                        element: lazyRouteWithCompanySlugGuard(
                          CompanyWorkSchedulesPage,
                        ),
                      },
                      {
                        path: ':employeeTypeId',
                        element: lazyRouteWithCompanySlugGuard(
                          CompanyWorkScheduleInfoPage,
                        ),
                      },
                    ],
                  },
                  {
                    path: 'tags',
                    children: [
                      {
                        index: true,
                        element: lazyRouteWithCompanySlugGuard(CompanyTagsPage),
                      },
                      {
                        path: ':groupId',
                        element:
                          lazyRouteWithCompanySlugGuard(CompanyTagGroupPage),
                      },
                    ],
                  },
                  {
                    path: 'subscriptions',
                    children: [
                      {
                        index: true,
                        element: lazyRouteWithCompanySlugGuard(
                          CompanySubscriptionsPage,
                        ),
                      },
                      {
                        path: ':subscriptionId',
                        element: lazyRouteWithCompanySlugGuard(
                          CompanySubscriptionInfoPage,
                        ),
                      },
                    ],
                  },
                  {
                    path: 'invoice',
                    element: lazyRouteWithCompanySlugGuard(
                      CompanyInvoiceSettingsPage,
                    ),
                  },
                  {
                    path: 'payment',
                    element: lazyRouteWithCompanySlugGuard(CompanyPaymentPage),
                  },
                ],
              },
              {
                path: 'time-attendance',
                children: [
                  {
                    path: 'locations',
                    element:
                      lazyRouteWithCompanySlugGuard(CompanyLocationsPage),
                  },
                  {
                    path: 'holidays',
                    element: lazyRouteWithCompanySlugGuard(CompanyHolidaysPage),
                  },
                  {
                    path: 'activity-labels',
                    element: lazyRouteWithCompanySlugGuard(
                      CompanyActivityLabelsPage,
                    ),
                  },
                  {
                    path: 'policies',
                    element: lazyRouteWithCompanySlugGuard(CompanyPoliciesPage),
                  },
                ],
              },
              {
                path: 'integrations',
                children: [
                  {
                    index: true,
                    element: lazyRouteWithCompanySlugGuard(
                      CompanyIntegrationPage,
                    ),
                  },
                  {
                    path: 'dedoco',
                    element: lazyRouteWithCompanySlugGuard(DedocoInfoPage),
                  },
                  {
                    path: 'sql-accounting',
                    element: lazyRoute(SqlAccountingInfoPage),
                  },
                ],
              },
              // {
              //   path: 'notifications',
              //   element: lazyRouteWithCompanySlugGuard(
              //     CompanyNotificationsPage,
              //   ),
              // },
              // {
              //   path: 'permissions',
              //   element: lazyRouteWithCompanySlugGuard(CompanyPermissionsPage),
              // },
            ],
          },
          {
            path: 'time',
            children: [
              {
                path: 'timesheet',
                element: lazyRouteWithCompanySlugGuard(TimesheetTrackingPage),
              },
              {
                path: 'attendance',
                element: lazyRouteWithCompanySlugGuard(AttendanceListPage),
              },
              {
                path: ':projectId',
                element: lazyRouteWithCompanySlugGuard(TimesheetApprovalPage),
              },
              {
                path: 'approval/:memberId',
                element: lazyRouteWithCompanySlugGuard(
                  TimesheetMemberApprovalPage,
                ),
              },
            ],
          },
          {
            path: 'member',
            children: [
              {
                path: ':memberId',
                children: [
                  {
                    path: 'attendance-details',
                    element: lazyRouteWithCompanySlugGuard(
                      AttendanceDetailsPage,
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: 'sandbox', element: lazyRoute(SandboxPage) },
    ],
  },
];

const Router = () => {
  const location = useLocation();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const state = location.state as { backgroundLocation?: Location };

  const element = useRoutes(routes, state?.backgroundLocation || location);

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  useEffect(() => {
    const handleSocketSetup = async () => {
      const token = await getAccessTokenSilently();
      const sock = io(Configs.SOCKET_URL, {
        auth: {
          token,
        },
      });

      sock.on('connect', () => {
        if (Configs.GK_ENVIRONMENT !== 'production') {
          console.log(`[dev] Socket connected: ${sock?.id}`);
        }
        setSocket(sock);
      });

      sock.on('disconnect', () => {
        if (Configs.GK_ENVIRONMENT !== 'production') {
          console.log(`[dev] Socket disconnected`);
        }
        setSocket(null);
      });
    };
    if (isAuthenticated && Configs.ENABLE_WEBSOCKETS) {
      handleSocketSetup();
    }
  }, [isAuthenticated]);

  const context: SocketContextInterface = {
    socket,
    addSocketEventHandler(event, handler) {
      if (socket) {
        if (Configs.GK_ENVIRONMENT !== 'production') {
          console.log('[dev] addSocketEventHandler', event);
        }

        // @ts-ignore -- ignoring the payload typing for now
        socket.on(event, (payload) => {
          if (Configs.GK_ENVIRONMENT !== 'production') {
            console.log('[dev] socket event received: ', event, payload);
          }
          try {
            const parsedPayload = JSON.parse(payload);
            handler(parsedPayload);
          } catch (error) {
            // @ts-ignore - just in case it's not an object so we pass it along anyway
            handler(payload);
          }
        });
      }
    },
  };

  return (
    <SocketContext.Provider value={context}>
      <div className="App">
        {element}

        {state?.backgroundLocation && isAuthenticated && (
          <Routes>
            <Route
              path=":companyId/task/:taskId"
              element={lazyRoute(TaskModalPage)}
            />
          </Routes>
        )}
      </div>
    </SocketContext.Provider>
  );
};

export default Router;
