import { Button, Space, Typography } from '@arco-design/web-react';
import { useAuth0 } from '@auth0/auth0-react';

import styles from './ErrorContent.module.less';

import Icons from '@/assets/icons';

type Props = {
  iconSrc: string;
  title: string;
  subtitle?: string;
};

const ErrorContent = (props: Props) => {
  const { iconSrc, title } = props;

  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      returnTo: `${window.location.origin}/login`,
    });
  };

  return (
    <div className={styles.wrapper}>
      <img src={iconSrc} alt="no-permission" />

      <img src={Icons.logoHorizontal} alt="logo-horizontal" />

      <Space align="center" size={20}>
        <Typography.Paragraph className={styles.title}>
          {title}
        </Typography.Paragraph>
      </Space>
      <br />
      <Button className={styles['icon-button']} onClick={handleLogout}>
        Log in to another account
      </Button>
    </div>
  );
};

export default ErrorContent;
