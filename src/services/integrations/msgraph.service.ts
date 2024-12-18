import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { Drive, DriveItem, User } from 'microsoft-graph';

let graphClient: Client | undefined = undefined;

function ensureClient(authProvider: AuthCodeMSALBrowserAuthenticationProvider) {
  if (!graphClient) {
    graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
  }

  return graphClient;
}

const getUser = async (
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
): Promise<User> => {
  const client = ensureClient(authProvider);

  // Return the /me API endpoint result as a User object
  const user: User = await client
    .api('/me')
    // Only retrieve the specific fields needed
    .select('displayName,mail,mailboxSettings,userPrincipalName')
    .get();

  return user;
};

const getUserDrive = async (
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
): Promise<Drive> => {
  const client = ensureClient(authProvider);

  // Return the /me API endpoint result as a User object
  const drive = await client
    .api('/me/drive')
    // Only retrieve the specific fields needed
    .get();

  return drive;
};

const listDriveItemChildren = async (
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  { itemId, driveId }: { itemId: string; driveId: string },
): Promise<DriveItem[]> => {
  try {
    const client = ensureClient(authProvider);

    const result = await client
      .api(`/drives/${driveId}/items/${itemId}/children`)
      .get();

    return result?.value;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const createSharingLink = async (
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  { itemId, driveId }: { itemId: string; driveId: string },
): Promise<string> => {
  try {
    const client = ensureClient(authProvider);

    const result = await client
      .api(`/drives/${driveId}/items/${itemId}/createLink`)
      .post({ type: 'view' });

    return result?.link?.webUrl;
  } catch (error) {
    console.log(error);
    return '';
  }
};

export default {
  getUser,
  getUserDrive,
  listDriveItemChildren,
  createSharingLink,
};
