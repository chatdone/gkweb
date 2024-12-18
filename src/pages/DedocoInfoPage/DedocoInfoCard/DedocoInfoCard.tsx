import { Card, Grid, Space, Typography } from '@arco-design/web-react';
import dayjs from 'dayjs';

import styles from './DedocoInfoCard.module.less';

import { formatToCurrency, getCurrencyCode } from '@/utils/currency.utils';

import { ArrayElement } from '@/types';

import { DedocoInfoPageQueryQuery } from 'generated/graphql-types';

type QueryActiveSubscription = ArrayElement<
  NonNullable<DedocoInfoPageQueryQuery['company']>['activeSubscription']
>;

type Props = {
  dedocoPackage: QueryActiveSubscription | undefined;
};

const DedocoInfoCard = (props: Props) => {
  const { dedocoPackage } = props;

  const getRemainingQuota = (): number | undefined | null => {
    if (
      !dedocoPackage?.package?.signatureQuota ||
      !dedocoPackage.signatureQuota
    ) {
      return 0;
    }

    return dedocoPackage.package.signatureQuota - dedocoPackage.signatureQuota;
  };

  return (
    <Card className={styles['payment-settings-card']}>
      <Space direction="vertical" size={15}>
        <Typography.Text className={styles.title}>Dedoco</Typography.Text>

        <Grid.Row>
          <Grid.Col span={12}>
            <Space align="baseline">
              <Typography.Text className={styles.label}>
                Plan: {dedocoPackage?.package?.title}
              </Typography.Text>

              <Space direction="vertical"></Space>
            </Space>
          </Grid.Col>

          <Grid.Col span={12}>
            <Space>
              <Typography.Text className={styles.label}>
                Usage/Quota: {getRemainingQuota()}/
                {dedocoPackage?.package?.signatureQuota}
              </Typography.Text>
            </Space>
          </Grid.Col>
        </Grid.Row>

        <Grid.Row>
          <Grid.Col span={12}>
            <Space align="baseline">
              <Typography.Text className={styles.label}>
                Price:{' '}
                {getCurrencyCode(
                  dedocoPackage?.subscriptionPackagePrice?.currency,
                )}{' '}
                {dedocoPackage?.price && formatToCurrency(dedocoPackage?.price)}
              </Typography.Text>

              <Space direction="vertical"></Space>
            </Space>
          </Grid.Col>

          <Grid.Col span={12}>
            <Space>
              <Typography.Text className={styles.label}>
                Renewal Date:{' '}
                {dayjs(dedocoPackage?.endDate).format('DD/MM/YYYY')}
              </Typography.Text>
            </Space>
          </Grid.Col>
        </Grid.Row>
      </Space>
    </Card>
  );
};

export default DedocoInfoCard;
