import { gql, useQuery } from '@apollo/client';
import { Layout, Button, Dropdown, Menu } from '@arco-design/web-react';
import { useAuth0 } from '@auth0/auth0-react';
import loadable from '@loadable/component';
import { useContext, useEffect } from 'react';
import {
  MdOutlineSettings,
  MdOutlineNotifications,
  MdOutlineAccessTime,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import { Link } from 'react-router-dom';

import Message from '@/components/Message';

import Avatar from '../../Avatar';
import AttendanceClockIn, {
  attendanceClockInFragments,
} from './AttendanceClockIn';
import SubscriptionDropdown from './SubscriptionDropdown';

import { useAppStore } from '@/stores/useAppStore';

import { SocketContext } from 'contexts/socket';

import { HeaderQuery, HeaderQueryVariables } from 'generated/graphql-types';

const NotificationDropdown = loadable(
  () => import('../../NotificationDropdown'),
);

type Props = {
  collapse: boolean;
  onToggleCollapse: () => void;
};

const Header = (props: Props) => {
  const { collapse, onToggleCollapse } = props;

  const { logout } = useAuth0();

  const { currentUser, activeCompany, getCurrentMember } = useAppStore();
  const { socket, addSocketEventHandler } = useContext(SocketContext);

  const currentMember = getCurrentMember();

  const { data: queryData, refetch: refetchQuery } = useQuery<
    HeaderQuery,
    HeaderQueryVariables
  >(headerQuery, {
    variables: {
      companyId: activeCompany?.id as string,
      memberId: currentMember?.id as string,
    },
    skip: !activeCompany?.id || !currentMember?.id,
  });

  useEffect(() => {
    if (socket) {
      addSocketEventHandler('attendance:start', ({ userId }) => {
        if (userId === currentUser?.id) {
          refetchQuery();
        }
      });
      addSocketEventHandler('attendance:stop', ({ userId, message }) => {
        if (userId === currentUser?.id) {
          refetchQuery();

          if (message) {
            Message.info(message);
          }
        }
      });
      addSocketEventHandler('user:logout', () => {
        logout({
          returnTo: `${window.location.origin}/login`,
        });
      });
      addSocketEventHandler('message:show', ({ message }) => {
        Message.info(message);
      });
    }

    return () => {
      if (socket) {
        socket.off('attendance:start');
        socket.off('attendance:stop');
        socket.off('user:logout');
        socket.off('message:show');
      }
    };
  }, [socket]);

  const handleClickMenuItem = (key: string) => {
    if (key === 'logout') {
      handleLogout();
    }
  };

  const handleLogout = () => {
    logout({
      returnTo: `${window.location.origin}/login`,
    });
  };

  const getPathWithCompanySlug = (path: string) => {
    return `/${activeCompany?.slug || 'external'}/${path}`;
  };

  return (
    <Layout.Header className="flex h-16 w-full items-center justify-between bg-white shadow-md">
      <Button className="px-2" type="text" onClick={onToggleCollapse}>
        {collapse ? (
          <MdKeyboardArrowRight className="h-4 w-4 text-gray-600" />
        ) : (
          <MdKeyboardArrowLeft className="h-4 w-4 text-gray-600" />
        )}
      </Button>

      <div className="flex items-center">
        <SubscriptionDropdown />

        <AttendanceClockIn
          currentAttendance={queryData?.currentAttendance}
          attendanceSettings={queryData?.attendanceSettings}
          refetchQuery={refetchQuery}
          buttonProps={{
            className: 'px-2',
            type: 'text',
            shape: 'circle',
            icon: <MdOutlineAccessTime className="h-4 w-4 text-gray-600" />,
          }}
        />

        <NotificationDropdown>
          <Button className="px-2" type="text" shape="round">
            <MdOutlineNotifications className="h-4 w-4 text-gray-600" />
          </Button>
        </NotificationDropdown>

        <Link to={getPathWithCompanySlug('settings/profile')}>
          <Button className="px-2" type="text" shape="round">
            <MdOutlineSettings className="h-4 w-4 text-gray-600" />
          </Button>
        </Link>

        <Dropdown
          trigger="click"
          position="br"
          droplist={
            <Menu onClickMenuItem={handleClickMenuItem}>
              <Menu.Item key="logout">Logout</Menu.Item>
            </Menu>
          }
        >
          <Avatar
            className="mx-4 cursor-pointer bg-brand-600"
            size={30}
            name={currentUser?.name || currentUser?.email}
            imageSrc={currentUser?.profileImage}
          />
        </Dropdown>
      </div>
    </Layout.Header>
  );
};

const headerQuery = gql`
  query Header($companyId: ID!, $memberId: ID!) {
    company(id: $companyId) {
      id
      activeSubscription {
        id
        type
        whiteListedMembers {
          companyMembers {
            id
          }
        }
      }
    }
    currentAttendance(memberId: $memberId) {
      ...AttendanceClockInAttendanceFragment
    }
    attendanceSettings(companyId: $companyId) {
      ...AttendanceClockInAttendanceSettingsFragment
    }
  }
  ${attendanceClockInFragments.attendance}
  ${attendanceClockInFragments.attendanceSettings}
`;

export default Header;
