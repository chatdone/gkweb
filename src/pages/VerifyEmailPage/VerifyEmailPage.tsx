import { Button, Link, Space } from '@arco-design/web-react';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './VerifyEmailPage.module.less';

import { navigateLoginPage } from '@/navigation';

import Icons from '@/assets/icons';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state as string;

  const handleRedirectToLoginPage = () => {
    navigateLoginPage(navigate, {
      retryLogin: true,
    });
  };

  return (
    <div className={styles.wrapper}>
      <Space direction="vertical" align="center" size={20}>
        <img src={Icons.logoHorizontal} alt="logo-horizontal" />

        <div className={styles.content}>
          <div>
            A verification email has been sent to your address ({email}). Please
            confirm your account by clicking the link in the email.
          </div>

          <div>
            If you require assistance, please contact us at{' '}
            <Link href="mailto:support@gokudos.io">support@gokudos.io</Link>
          </div>
        </div>

        <Button
          className={styles['theme-button']}
          onClick={handleRedirectToLoginPage}
        >
          Proceed to Login
        </Button>
      </Space>
    </div>
  );
};

export default VerifyEmailPage;
