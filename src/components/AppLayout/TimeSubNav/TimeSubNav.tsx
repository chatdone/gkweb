import { Menu, Tabs } from '@arco-design/web-react';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './TimeSubNav.module.less';

import { useAppStore } from '@/stores/useAppStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

import {
  navigateAttendancePage,
  navigateMemberTimesheetApprovalPage,
  navigateTimesheetApprovalPage,
  navigateTimesheetPage,
} from '@/navigation';

const TimeSubNav = () => {
  const { activeCompany, getCurrentMember } = useAppStore();
  const member = getCurrentMember();
  const isManagerOrAdmin =
    member?.type === 'ADMIN' || member?.type === 'MANAGER';
  const { activeWorkspace } = useWorkspaceStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('project');
  const [projectId, setCurrentProjectId] = useState('');
  const [memberId, setCurrentMemberId] = useState('');
  const [activeMenu, setActiveMenu] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClickTimeListMenuItem = (key: string, event: KeyboardEvent) => {
    if (!activeCompany?.slug) {
      return;
    }

    if (key === 'timesheet') {
      setActiveMenu(key);
      navigateTimesheetPage({
        navigate,
        companySlug: activeCompany?.slug,
      });
    } else if (key === 'attendance') {
      setActiveMenu(key);
      navigateAttendancePage({
        navigate,
        companySlug: activeCompany?.slug,
      });
    } else if (key && activeTab.includes('project')) {
      setCurrentProjectId(key);
      navigateTimesheetApprovalPage({
        navigate,
        companySlug: activeCompany?.slug,
        projectId: key,
      });
    } else if (key && activeTab.includes('member')) {
      setCurrentMemberId(key);
      navigateMemberTimesheetApprovalPage({
        navigate,
        companySlug: activeCompany?.slug,
        memberId: key,
      });
    }
  };

  const isFreePlan =
    !activeCompany?.currentSubscription?.stripeSubscriptionId &&
    !activeCompany?.currentSubscription?.package?.isCustom;

  const members = useMemo(() => {
    if (!activeCompany?.members) {
      return [];
    }

    const isManager = member?.type === 'MANAGER';

    if (isManager && member?.teams) {
      const teams = member?.teams?.map((team) => team);
      const members = [];

      for (const team of teams) {
        const teamMembers = team?.members?.map((m) => m);

        if (teamMembers) {
          for (const teamMember of teamMembers) {
            members.push(teamMember);
          }
        }
      }

      const uniqMembers = _.uniqBy(members, 'user.id');

      return uniqMembers;
    }

    return activeCompany?.members;
  }, [activeCompany, member]);

  const projects = useMemo(() => {
    if (!activeWorkspace?.projects) {
      return [];
    }

    const projects = activeWorkspace?.projects.filter(
      (project) => !project?.archived,
    );

    const isManager = member?.type === 'MANAGER';

    if (isManager && member?.teams) {
      const teams = member?.teams?.map((team) => team);
      const members = [];

      for (const team of teams) {
        const teamMembers = team?.members?.map((m) => m);

        if (teamMembers) {
          for (const teamMember of teamMembers) {
            members.push(teamMember);
          }
        }
      }

      const userIdsOfManagersTeam = members?.map((m) => m?.user?.id);

      const filteredProjects = projects.filter(
        (p) =>
          !_.isEmpty(p?.members) &&
          p?.members?.some((m) => userIdsOfManagersTeam?.includes(m?.user?.id)),
      );

      return filteredProjects;
    }

    return projects;
  }, [activeWorkspace]);

  return (
    <>
      <div>
        <Menu
          className={styles.sidebar}
          selectedKeys={[]}
          onClickMenuItem={handleClickTimeListMenuItem}
        >
          <Menu.Item
            key="timesheet"
            className="!bg-gray-100 !pr-1 text-base hover:!bg-gray-200"
            disabled={isFreePlan}
          >
            <div className="flex items-center">
              <div
                className="flex-1"
                style={{
                  color: activeMenu === 'timesheet' ? '#D6001C' : '',
                }}
              >
                Timesheet {isFreePlan && <>(Paid Plan)</>}
              </div>
            </div>
          </Menu.Item>

          <Menu.Item
            key="attendance"
            className="!bg-gray-100 !pr-1 text-base hover:!bg-gray-200"
            style={{
              color: activeMenu === 'attendance' ? '#D6001C' : '',
            }}
          >
            <div className="flex items-center">
              <div className="flex-1">Attendance</div>
            </div>
          </Menu.Item>

          {!isFreePlan && isManagerOrAdmin && (
            <>
              <hr className="my-2" />

              <Tabs className="mt-5" onClickTab={(e) => setActiveTab(e)}>
                <Tabs.TabPane key="projects" title="Projects">
                  {projects.map((project) => (
                    <Menu.Item
                      key={`${project?.id}`}
                      className="!bg-gray-100 !pr-1 text-base hover:!bg-gray-200"
                      style={{
                        color: projectId === project?.id ? '#D6001C' : '',
                      }}
                    >
                      <div className="flex items-center">
                        <div className="flex-1 truncate">{project?.name}</div>
                      </div>
                    </Menu.Item>
                  ))}
                </Tabs.TabPane>
                <Tabs.TabPane key="members" title="Members">
                  {members.map((member) => {
                    return (
                      <Menu.Item
                        key={`${member?.id}`}
                        className="!bg-gray-100 !pr-1 hover:!bg-gray-200"
                        style={{
                          color: memberId === member?.id ? '#D6001C' : '',
                        }}
                      >
                        <div className="flex items-center">
                          <div className="flex-1 truncate">
                            {member?.user?.name || member?.user?.email}
                          </div>
                        </div>
                      </Menu.Item>
                    );
                  })}
                </Tabs.TabPane>
              </Tabs>
            </>
          )}
        </Menu>
      </div>
    </>
  );
};

export default TimeSubNav;
