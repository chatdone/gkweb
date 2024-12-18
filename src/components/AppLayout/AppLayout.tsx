import { Layout } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import CompanySelector from '../CompanySelector';
import styles from './AppLayout.module.less';
import Header from './Header';
import Logo from './Logo';
import QuickCreateAction from './QuickCreateAction';
import SharedTasksSubNav from './SharedTasksSubNav';
import SideMenu from './SideMenu';
import TaskSubNav from './TaskSubNav';
import TimeSubNav from './TimeSubNav';

import useBreakPoints from '@/hooks/useBreakPoints';
import { useAppStore } from '@/stores/useAppStore';
import { useResponsiveStore } from '@/stores/useResponsiveStores';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

const Sider = Layout.Sider;
const Content = Layout.Content;

const AppLayout = () => {
  const location = useLocation();

  const { reload } = useWorkspaceStore();
  const { activeCompany, reloadUser } = useAppStore();
  const { setIsMobile } = useResponsiveStore();
  const { isMd } = useBreakPoints();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [hasSubNav, setHasSubNav] = useState<boolean>(false);

  useEffect(() => {
    reloadUser();
  }, []);

  useEffect(() => {
    reload();

    const unsubscribe = useAppStore.subscribe(() => {
      reload(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const showSubNav =
      showTaskSubNav() || showSharedTasksSubNav() || showTimeSubNav();

    setHasSubNav(showSubNav);
  }, [location]);

  useEffect(() => {
    setIsMobile(!isMd);
  }, [isMd]);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const getSubNav = () => {
    if (showTaskSubNav()) {
      return <TaskSubNav />;
    } else if (showSharedTasksSubNav()) {
      return <SharedTasksSubNav />;
    } else if (showTimeSubNav()) {
      return <TimeSubNav />;
    }
  };

  const showTaskSubNav = () => {
    const paths = ['project', 'workspace', 'task'];

    return (
      !location.pathname.includes('shared') &&
      paths.some((path) => location.pathname.includes(path))
    );
  };

  const showSharedTasksSubNav = () => {
    return location.pathname.includes('shared');
  };

  const showTimeSubNav = () => {
    return location.pathname.includes('time');
  };

  return (
    <Layout className="h-screen overflow-hidden bg-gray-200">
      <Sider
        className={`h-screen bg-white ${styles['layout-sider-new']}`}
        width="18rem"
        // @ts-ignore
        collapsedWidth="4rem"
        collapsed={collapsed}
      >
        <Logo collapsed={collapsed} />

        <div className="flex h-full overflow-y-scroll">
          <div className={`${hasSubNav ? 'w-16' : 'flex-1'}`}>
            <CompanySelector collapsed={collapsed || hasSubNav} />
            <SideMenu />

            <hr className="my-2 border-gray-300" />

            {activeCompany && (
              <QuickCreateAction collapsed={collapsed || hasSubNav} />
            )}
          </div>

          {!collapsed && hasSubNav && (
            <div className="w-56 overflow-auto bg-gray-100">{getSubNav()}</div>
          )}
        </div>
      </Sider>

      <Layout>
        <Header collapse={collapsed} onToggleCollapse={handleToggleCollapse} />

        <Content className="overflow-auto p-2 pb-20">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
