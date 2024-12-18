import { Space, Typography } from '@arco-design/web-react';
import { MdInfoOutline } from 'react-icons/md';

import styles from './EmptyContent.module.less';

type Props = {
  iconSrc: string;
  title: string;
  subtitle: string;
  showInfoIcon?: boolean;
  showImage?: boolean;
};

const EmptyContent = (props: Props) => {
  const {
    iconSrc,
    title,
    subtitle,
    showInfoIcon = true,
    showImage = true,
  } = props;

  return (
    <div className={styles.wrapper}>
      {showImage && <img src={iconSrc} alt="empty" />}

      <Space align="center" size={20}>
        {showInfoIcon && <MdInfoOutline />}

        <div>
          <Typography.Paragraph className={styles.title}>
            {title}
          </Typography.Paragraph>

          <Typography.Paragraph>{subtitle}</Typography.Paragraph>
        </div>
      </Space>
    </div>
  );
};

export default EmptyContent;
