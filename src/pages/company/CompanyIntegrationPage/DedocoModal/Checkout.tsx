import {
  Button,
  Grid,
  Space,
  Typography,
  Table,
  Card,
} from '@arco-design/web-react';
import { MdOutlineCreditCard } from 'react-icons/md';

import styles from './Checkout.module.less';

import { formatToCurrency } from '@/utils/currency.utils';

import { ArrayElement } from '@/types';

import { CompanyIntegrationPageQuery } from 'generated/graphql-types';

type QueryPaymentMethod = ArrayElement<
  NonNullable<CompanyIntegrationPageQuery['currentUser']>['paymentMethods']
>;

type Props = {
  loading: boolean;
  dedocoPackages: CompanyIntegrationPageQuery['dedocoPackages'];
  selectedPriceId: string;
  currencyCode: string;
  paymentMethod: QueryPaymentMethod | undefined;
  onBack: () => void;
  onCancel: () => void;
  onPay: () => void;
  onSetupPaymentMethod: () => void;
};

const Checkout = (props: Props) => {
  const {
    loading,
    paymentMethod,
    dedocoPackages,
    selectedPriceId,
    currencyCode,
    onBack,
    onCancel,
    onPay,
    onSetupPaymentMethod,
  } = props;

  const getSubscriptionPackage = () => {
    if (!dedocoPackages) {
      return [];
    }

    const subscriptionPackage = dedocoPackages.find((sub) =>
      sub?.packagePrices?.some((price) => price?.id === selectedPriceId),
    );

    return [subscriptionPackage];
  };

  return (
    <Space className={styles.checkout} direction="vertical">
      <Space direction="vertical" size={20}>
        <div>
          <Typography.Paragraph className={styles.title}>
            Confirm payment
          </Typography.Paragraph>

          <Table
            rowKey="package.id"
            scroll={{}}
            pagination={false}
            data={getSubscriptionPackage()}
            columns={[
              {
                title: 'Plan',
                render: (col, item) => {
                  return item?.title;
                },
              },
              {
                title: 'Unit',
                align: 'right',
                render: () => 1,
              },
              {
                title: 'Price per unit',
                width: 150,
                render: (col, item) => {
                  const price = item?.packagePrices?.find(
                    (price) => price?.id === selectedPriceId,
                  );

                  return `${currencyCode} ${formatToCurrency(
                    price?.price || 0,
                  )}/ annual`;
                },
              },
              {
                title: 'Total Price',
                width: 110,
                render: (col, item) => {
                  const price = item?.packagePrices?.find(
                    (price) => price?.id === selectedPriceId,
                  );

                  return `${currencyCode} ${formatToCurrency(
                    price?.price || 0,
                  )}`;
                },
              },
            ]}
            summary={(currentData) => {
              const data = currentData?.[0];
              const price = data?.packagePrices?.find(
                (price) => price?.id === selectedPriceId,
              );

              return (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={3}>Total</Table.Summary.Cell>
                    <Table.Summary.Cell>
                      {currencyCode} {formatToCurrency(price?.price || 0)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
        </div>

        <div>
          <Typography.Paragraph className={styles.title}>
            Card Information
          </Typography.Paragraph>

          {paymentMethod ? (
            <Card className={styles.card}>
              <Grid.Row justify="space-between">
                <Space size={40}>
                  <MdOutlineCreditCard />

                  <Typography.Text>
                    xxxx xxxx xxxx {paymentMethod.card?.last4}
                  </Typography.Text>
                </Space>

                <Typography.Text>{`${
                  paymentMethod.card?.exp_month
                }/ ${paymentMethod.card?.exp_year
                  ?.toString()
                  .slice(2)}`}</Typography.Text>
              </Grid.Row>
            </Card>
          ) : (
            <Typography.Paragraph>
              Please setup a card to proceed.{' '}
              <Typography.Text
                className={styles['link-txt']}
                onClick={onSetupPaymentMethod}
              >
                Go to setup
              </Typography.Text>
            </Typography.Paragraph>
          )}
        </div>
      </Space>

      <Grid.Row className={styles['button-group-row']} justify="space-between">
        <Button
          className={styles['theme-btn-text']}
          type="text"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>

        <Space>
          <Button disabled={loading} onClick={onCancel}>
            Cancel
          </Button>

          <Button
            className={styles['theme-button']}
            loading={loading}
            onClick={onPay}
            disabled={!paymentMethod}
          >
            Pay
          </Button>
        </Space>
      </Grid.Row>
    </Space>
  );
};

export default Checkout;
