import { Button, Card, Grid, Space, Typography } from '@arco-design/web-react';
import bytes from 'bytes';
import { MdCheckCircle } from 'react-icons/md';

import styles from './BasicTypeCard.module.less';

import { formatToCurrency, getCurrencyCode } from '@/utils/currency.utils';
import {
  extractPackageTitle,
  getBasicSubscriptionStorageSize,
} from '@/utils/subscription.utils';

import { ArrayElement } from '@/types';

import {
  PackageTypes,
  CompanySubscriptionInfoPageQuery,
} from 'generated/graphql-types';

type QuerySubscriptionPackage = ArrayElement<
  CompanySubscriptionInfoPageQuery['subscriptionPackages']
>;

type Props = {
  companySubscription: CompanySubscriptionInfoPageQuery['companySubscription'];
  subscriptionPackages: CompanySubscriptionInfoPageQuery['subscriptionPackages'];
  onSwitchPackage: (priceId: string) => void;
};

const BasicTypeCard = (props: Props) => {
  const { companySubscription, subscriptionPackages, onSwitchPackage } = props;

  const getBasicTypeSubscriptionPackages = () => {
    if (!companySubscription || !subscriptionPackages) {
      return [];
    }

    const isBundle = companySubscription.packageTitle?.match(/bundle/i);
    const keyword = isBundle ? 'bundle' : 'omni';

    return subscriptionPackages.filter(
      (sub) =>
        sub?.type === PackageTypes.Basic &&
        sub.title?.match(new RegExp(keyword, 'i')),
    );
  };

  return (
    <Card className={styles.wrapper}>
      <Typography.Paragraph className={styles['card-title']}>
        GoKudos Plan
      </Typography.Paragraph>

      <Grid.Row className={styles['item-row']} gutter={20}>
        {getBasicTypeSubscriptionPackages().map((sub) => (
          <Grid.Col key={sub?.id} xs={24} xl={8}>
            <SubscriptionItem
              subscriptionPackage={sub}
              currency={companySubscription?.subscriptionPackagePrice?.currency}
              interval={companySubscription?.interval}
              currentPriceId={companySubscription?.subscriptionPackagePrice?.id}
              onSelect={onSwitchPackage}
            />
          </Grid.Col>
        ))}
      </Grid.Row>
    </Card>
  );
};

const SubscriptionItem = ({
  subscriptionPackage,
  currency,
  interval,
  currentPriceId,
  onSelect,
}: {
  subscriptionPackage: QuerySubscriptionPackage;
  currency: string | null | undefined;
  interval: string | null | undefined;
  currentPriceId: string | null | undefined;
  onSelect: (priceId: string) => void;
}) => {
  const packageTitle = extractPackageTitle(subscriptionPackage);

  const packagePrice = subscriptionPackage?.packagePrices?.find(
    (sub) => sub?.currency === currency && sub?.interval === interval,
  );

  const isActive = packagePrice?.id === currentPriceId;

  const handleSelect = () => {
    if (isActive || !packagePrice?.id) {
      return;
    }

    onSelect(packagePrice.id);
  };

  const getPrice = () => {
    return subscriptionPackage?.packagePrices?.find(
      (sub) => sub?.currency === currency && sub?.interval === interval,
    )?.price;
  };

  return (
    <Card className={styles['subscription-item']}>
      <Typography.Text className={styles['card-title']}>
        {packageTitle} Plan
      </Typography.Text>

      <Typography.Paragraph className={styles['price-container']}>
        {getCurrencyCode(currency)}{' '}
        <Typography.Text className={styles.amount}>
          {formatToCurrency(getPrice() || 0)}
        </Typography.Text>{' '}
        /{interval}
      </Typography.Paragraph>

      <Space className={styles['list-container']} direction="vertical" size={0}>
        <PackageItem title="Task Management" />

        <PackageItem title="Contacts" />

        <PackageItem title="Guest Collaboration" />

        <PackageItem title="Team Collaboration" />

        <PackageItem
          title={`${bytes.format(
            getBasicSubscriptionStorageSize(packageTitle),
          )} Storage`}
        />
      </Space>

      <Grid.Row justify="center">
        <Button
          className={isActive ? undefined : styles['theme-button']}
          onClick={handleSelect}
        >
          {isActive ? 'Current Plan' : 'Select Plan'}
        </Button>
      </Grid.Row>
    </Card>
  );
};

const PackageItem = ({ title }: { title: string }) => {
  return (
    <Space>
      <MdCheckCircle />

      <Typography.Text>{title}</Typography.Text>
    </Space>
  );
};

export default BasicTypeCard;
