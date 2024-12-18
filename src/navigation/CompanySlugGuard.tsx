import { Card, Grid, Space, Typography } from '@arco-design/web-react';
import { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './CompanySlugGuard.module.less';

import { useAppStore } from '@/stores/useAppStore';

import Icons from '@/assets/icons';

type Props = {
  children: ReactNode;
};

const CompanySlugGuard = (props: Props) => {
  const { children } = props;

  const { companyId } = useParams();

  const { currentUser } = useAppStore();

  const [validSlug, setValidSlug] = useState<boolean>(true);

  useEffect(() => {
    const isValid =
      currentUser?.companies?.some((company) => company?.slug === companyId) ||
      companyId === 'external' ||
      false;

    setValidSlug(isValid);
  }, [companyId, currentUser]);

  if (!validSlug) {
    return (
      <Card className={styles.card}>
        <Grid.Row justify="center" align="center">
          <Space direction="vertical">
            <img src={Icons.unauthorized} alt="Unauthorized" />

            <div>
              <Typography.Paragraph className={styles.title}>
                Hold up!
              </Typography.Paragraph>
              <Typography.Paragraph>
                you don’t have access to this company
              </Typography.Paragraph>
            </div>
          </Space>
        </Grid.Row>
      </Card>
    );
  }

  return <>{children}</>;
};

export default CompanySlugGuard;
