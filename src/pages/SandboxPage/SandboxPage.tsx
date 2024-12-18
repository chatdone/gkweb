// @ts-nocheck
import { useAuth0 } from '@auth0/auth0-react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { Drive, DriveItem } from 'microsoft-graph';
import { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

import useDropbox from '@/hooks/useDropbox';
import useMsalAuthProvider from '@/hooks/useMsalAuth';
import useMsalAuth from '@/hooks/useMsalAuth';

import { MicrosoftGraphService } from '@/services';

import Configs from '@/configs';

const SandboxPage = () => {
  const [urlSearchParams] = useSearchParams();
  const wp = urlSearchParams.get('wp');

  const isAuthenticated = useIsAuthenticated();
  const msal = useMsal();

  const { openPicker } = useDropbox();

  // const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // useEffect(() => {
  //   async function getToken() {
  //     const accessToken = await getAccessTokenSilently();
  //     console.log('token', accessToken);
  //   }
  //   if (isAuthenticated) {
  //     console.log('isAuth', isAuthenticated);
  //     console.log('user', user);

  //     getToken();
  //   }
  // }, [isAuthenticated]);

  const handleOpenDropbox = () => {
    openPicker({
      success: (files) => {
        console.log(files);
      },
      multiselect: true,
    });
  };

  return (
    <div>
      <div>
        <h1>Microsoft Graph Authentication</h1>

        {isAuthenticated ? <AuthenticatedTemplate /> : <LoginTemplate />}
        {/* <LogoutButton /> */}
      </div>

      <div>
        <h1>Dropbox</h1>
        <button onClick={handleOpenDropbox}>select file</button>
      </div>
    </div>
  );
};

const AuthenticatedTemplate = () => {
  const { logout, authProvider } = useMsalAuth();

  const [driveItems, setDriveItems] = useState<DriveItem[]>([]);
  const [userDrive, setUserDrive] = useState<Drive>();
  const [currentItemId, setCurrentItemId] = useState<string>('root');
  const [parentItemId, setParentItemId] = useState<string>('root');

  useEffect(() => {
    loadUserDrive();
  }, []);

  useEffect(() => {
    getDriveItems();
  }, [currentItemId]);

  const loadUserDrive = async () => {
    const drive = await MicrosoftGraphService.getUserDrive(authProvider);

    if (drive) {
      setUserDrive(drive);

      setParentItemId(drive?.id || 'root');
    }
  };

  const getDriveItems = async () => {
    console.log('getDriveItems', userDrive);
    if (!userDrive?.id) {
      await loadUserDrive();
    }

    console.log('load drive items', currentItemId, userDrive?.id);
    const items = await MicrosoftGraphService.listDriveItemChildren(
      authProvider,
      {
        itemId: currentItemId,
        driveId: userDrive?.id || '',
      },
    );

    setDriveItems(items);
    console.log(items);
  };

  const handleLoadDriveItems = async () => {
    setCurrentItemId('root');
  };

  const handleShare = (item: DriveItem) => {
    //
  };

  const handleUpLevel = async () => {
    setCurrentItemId(parentItemId);
  };

  const handleFolderSelected = async (item: DriveItem) => {
    setParentItemId(currentItemId);
    if (item.id) {
      setCurrentItemId(item.id);
    }
  };

  const isFolder = (item: DriveItem) => {
    return !!item.folder;
  };

  return (
    <>
      <p>
        <Button onClick={handleLoadDriveItems} title="Get Drive Items" />
        <Button onClick={logout} title="Logout" />
      </p>

      <hr />
      <table width="100%">
        <tbody>
          <tr>
            <td>Name</td>
            <td>Type</td>
            <td>Actions</td>
          </tr>
          {currentItemId !== 'root' && (
            <tr>
              <td>
                <div onClick={handleUpLevel}>[Go up one level]</div>
              </td>
            </tr>
          )}
          {driveItems.map((driveItem) => (
            <tr key={`tr:${driveItem.id}`}>
              {isFolder(driveItem) ? (
                <td>
                  <span onClick={() => handleFolderSelected(driveItem)}>
                    {driveItem.name} [{driveItem.folder?.childCount}]
                  </span>
                </td>
              ) : (
                <td>{driveItem.name}</td>
              )}

              <td>
                {isFolder(driveItem) ? 'Folder' : driveItem.file?.mimeType}
              </td>
              <td>
                <p>
                  <a href={driveItem.webUrl || ''}>[Web URL]</a>
                  <span onClick={() => handleShare(driveItem)}>[Share]</span>
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const LoginTemplate = () => {
  const { login } = useMsalAuth();
  return (
    <>
      <LoginButton onClick={login} />
    </>
  );
};

const LoginButton = ({ onClick }: { onClick: () => Promise<void> }) => {
  return <button onClick={onClick}>Log In</button>;
};

const Button = ({
  title,
  onClick,
}: {
  title: string;
  onClick: () => Promise<void> | (() => void);
}) => {
  return <button onClick={onClick}>{title}</button>;
};

export default SandboxPage;
