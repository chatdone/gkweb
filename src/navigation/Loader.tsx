import { Typography } from '@arco-design/web-react';

import styles from './Loader.module.less';

import Icons from '@/assets/icons';

const Loader = ({ message }: { message?: string }) => {
  const defaultMessage =
    'Please wait a moment while we bring you to your workspace...';
  return (
    <div className={styles.wrapper}>
      <video autoPlay loop muted playsInline width={100} height={100}>
        <source src={Icons.loadingWebm} type="video/webm" />
        <source src={Icons.loadingMp4} type="video/mp4" />
      </video>

      <Typography.Paragraph>{message || defaultMessage}</Typography.Paragraph>
    </div>
  );
};

export default Loader;
