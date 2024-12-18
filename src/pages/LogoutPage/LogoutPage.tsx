import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

const LogoutPage = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    logout({
      returnTo: `${window.location.origin}/login`,
    });
  }, []);

  return <></>;
};

export default LogoutPage;
