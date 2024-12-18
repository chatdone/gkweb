import { ComponentType, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppStore } from '@/stores/useAppStore';

const withCypress = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    const navigate = useNavigate();

    const { currentUser, setReturnTo } = useAppStore();

    useEffect(() => {
      if (!currentUser) {
        setReturnTo(location.pathname);

        navigate('/login');
      }
    }, [currentUser]);

    return <>{currentUser && <Component {...props} />}</>;
  };
};

export default withCypress;
