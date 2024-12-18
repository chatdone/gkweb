import { Menu } from '@arco-design/web-react';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MdAlarm,
  MdTaskAlt,
  MdOutlineHome,
  MdOutlinePeopleOutline,
  MdAddChart,
  MdFaceUnlock,
  MdBusiness,
  MdOutlineIntegrationInstructions,
  MdOutlineFolderShared,
} from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

import styles from './SideMenu.module.less';

import { useAppStore } from '@/stores/useAppStore';

type MenuItem = {
  key: string;
  to: string;
  icon?: ReactNode;
  label: string;
  relatedKeys?: string[];
  children?: MenuItem[];
};

const iconClassName = 'w-4 h-4 mx-1 mr-4';

const SideMenu = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const { activeCompany, currentUser } = useAppStore();

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const { openKeys, key } = getSelectedKeyByLocation();

    setSelectedKeys(key ? [key] : []);
    setOpenKeys(openKeys);
  }, [location]);

  const handleClickSubMenu = (key: string, openKeys: string[]) => {
    setOpenKeys(openKeys);
  };

  const getSelectedKeyByLocation = () => {
    const menus = getMenus();

    const found = menus.find(
      (item) =>
        location.pathname.includes(item.key) ||
        item.relatedKeys?.some((path) => location.pathname.includes(path)),
    );
    const foundChild = found?.children?.find((child) =>
      location.pathname.includes(child.key),
    );

    return {
      openKeys: foundChild ? [found?.key as string] : [],
      key: foundChild ? foundChild.key : found?.key,
    };
  };

  const getPathWithCompanySlug = (path: string) => {
    return `/${activeCompany?.slug}/${path}`;
  };

  const getSettingsPathWithCompanyId = (path: string) => {
    return `/${activeCompany?.slug || 'external'}/settings/${path}`;
  };

  const getMenus = () => {
    return location.pathname.includes('settings')
      ? getSettingsMenu()
      : getMainMenus();
  };

  const getMainMenus = (): MenuItem[] => {
    let menus: MenuItem[] = [
      {
        key: 'home',
        to: getPathWithCompanySlug('home'),
        icon: <MdOutlineHome className={iconClassName} />,
        label: t('menu.home'),
      },
      {
        key: 'project',
        to: getPathWithCompanySlug(`workspace/DEFAULT_WORKSPACE`),
        icon: <MdTaskAlt className={iconClassName} />,
        label: t('menu.tasks'),
        relatedKeys: ['workspace', 'task'],
      },
      {
        key: 'shared',
        to: getPathWithCompanySlug(`shared`),
        icon: <MdOutlineFolderShared className={iconClassName} />,
        label: t('menu.sharedWithMe'),
      },
      {
        key: 'contact',
        to: getPathWithCompanySlug('contacts'),
        icon: <MdOutlinePeopleOutline className={iconClassName} />,
        label: t('menu.contacts'),
      },
      {
        key: 'time',
        to: getPathWithCompanySlug('time'),
        icon: <MdAlarm className={iconClassName} />,
        label: t('menu.time'),
      },
      {
        key: 'report',
        to: getPathWithCompanySlug('report'),
        icon: <MdAddChart className={iconClassName} />,
        label: t('menu.reports'),
      },
    ];

    if (currentUser?.companies?.length === 0) {
      menus = menus.filter((item) => item.key === 'shared');
    }

    return menus;
  };

  const getSettingsMenu = () => {
    let menus: MenuItem[] = [
      {
        key: 'home',
        to: currentUser?.companies?.length
          ? getPathWithCompanySlug('home')
          : '/external/shared',
        icon: <MdOutlineHome className={iconClassName} />,
        label: t('menu.home'),
      },
      {
        key: 'profile',
        to: getSettingsPathWithCompanyId('profile'),
        icon: <MdFaceUnlock className={iconClassName} />,
        label: t('menu.myProfile'),
      },
      {
        key: 'company',
        to: getSettingsPathWithCompanyId('company'),
        icon: <MdBusiness className={iconClassName} />,
        label: t('menu.company'),
        children: [
          {
            key: 'account',
            to: getSettingsPathWithCompanyId('company/account'),
            label: t('menu.account'),
          },
          {
            key: 'member',
            to: getSettingsPathWithCompanyId('company/members'),
            label: t('menu.member'),
          },
          {
            key: 'team',
            to: getSettingsPathWithCompanyId('company/teams'),
            label: t('menu.team'),
          },
          {
            key: 'work-schedule',
            to: getSettingsPathWithCompanyId('company/work-schedules'),
            label: t('menu.workSchedule'),
          },
          {
            key: 'tags',
            to: getSettingsPathWithCompanyId('company/tags'),
            label: t('menu.tags'),
          },
          {
            key: 'subscription',
            to: getSettingsPathWithCompanyId('company/subscriptions'),
            label: t('menu.subscription'),
          },
          {
            key: 'invoice',
            to: getSettingsPathWithCompanyId('company/invoice'),
            label: t('menu.invoice'),
          },
          {
            key: 'payment',
            to: getSettingsPathWithCompanyId('company/payment'),
            label: t('menu.payment'),
          },
        ],
      },
      {
        key: 'time-attendance',
        to: getSettingsPathWithCompanyId('time-attendance'),
        icon: <MdAlarm className={iconClassName} />,
        label: t('menu.timeAttendance'),
        children: [
          {
            key: 'policies',
            to: getSettingsPathWithCompanyId('time-attendance/policies'),
            label: t('menu.policies'),
          },
          {
            key: 'holidays',
            to: getSettingsPathWithCompanyId('time-attendance/holidays'),
            label: t('menu.holidays'),
          },
          {
            key: 'location',
            to: getSettingsPathWithCompanyId('time-attendance/locations'),
            label: t('menu.location'),
          },
          {
            key: 'activity-label',
            to: getSettingsPathWithCompanyId('time-attendance/activity-labels'),
            label: t('menu.activityLabel'),
          },
        ],
      },
      {
        key: 'integration',
        to: getSettingsPathWithCompanyId('integrations'),
        label: t('menu.integration'),
        icon: <MdOutlineIntegrationInstructions className={iconClassName} />,
      },
      // {
      //   label: t('menu.notification'),
      //   path: getSettingsPathWithCompanyId('notifications'),
      //   icon: <MdNotificationsActive className={styles['icon']} />,
      //   key: 'notification',
      // },
      // {
      //   label: t('menu.permission'),
      //   path: getSettingsPathWithCompanyId('permissions'),
      //   icon: <MdVpnKey className={styles['icon']} />,
      //   key: 'permission',
      // },
    ];

    if (currentUser?.companies?.length === 0) {
      menus = menus.slice(0, 3);
    }

    return menus;
  };

  return (
    <Menu
      className={styles.menu}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onClickSubMenu={handleClickSubMenu}
    >
      {getMenus().map((item) =>
        item.children ? (
          <Menu.SubMenu
            key={item.key}
            title={
              <>
                {item.icon} {item.label}
              </>
            }
          >
            {item.children.map((child) => (
              <Link key={child.key} to={child.to}>
                <Menu.Item key={child.key} className="text-base">
                  {child.icon || <EmptyIcon />} {child.label}
                </Menu.Item>
              </Link>
            ))}
          </Menu.SubMenu>
        ) : (
          <Link key={item.key} to={item.to}>
            <Menu.Item key={item.key} className="text-base">
              {item.icon} {item.label !== 'menu.time' ? item.label : 'Time'}
            </Menu.Item>
          </Link>
        ),
      )}
    </Menu>
  );
};

const EmptyIcon = () => {
  return <div style={{ width: 12, height: 18, display: 'inline-block' }} />;
};

export default SideMenu;
