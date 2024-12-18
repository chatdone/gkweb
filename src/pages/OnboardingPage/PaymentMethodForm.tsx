import { gql, useLazyQuery } from '@apollo/client';
import {
  Space,
  Typography,
  Grid,
  Button,
  Table,
  FormInstance,
  Tooltip,
  Input,
  Divider,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { IconQuestionCircle } from '@arco-design/web-react/icon';
import type { PaymentMethod } from '@stripe/stripe-js';
import { useEffect, useRef, useState } from 'react';

import { StripeCardInput, StripeCardInputRef } from '@/components';
import Message from '@/components/Message';

import styles from './PaymentMethodForm.module.less';

import { formatToCurrency } from '@/utils/currency.utils';

import i18n from '@/i18n';

import { promoCodeInfoFragment } from '@/fragments';

import { ArrayElement } from '@/types';

import {
  OnboardingPageQuery,
  PromoCodeInfoQuery,
  PromoCodeInfoQueryVariables,
} from 'generated/graphql-types';

type QuerySubscriptionPackage = ArrayElement<
  NonNullable<OnboardingPageQuery['subscriptionPackagesV2']>
>;

type Props = {
  form: FormInstance;
  loading: boolean;
  subscriptionPackages: OnboardingPageQuery['subscriptionPackagesV2'];
  onBack: () => void;
  onCreatePaymentMethodSuccess: (paymentMethod: PaymentMethod) => void;
};

const PaymentMethodForm = (props: Props) => {
  const {
    form,
    loading,
    onCreatePaymentMethodSuccess,
    subscriptionPackages,
    onBack,
  } = props;

  const [
    getPromoCodeInfo,
    { loading: getPromoCodeInfoLoading, data: queryPromoData },
  ] = useLazyQuery<PromoCodeInfoQuery, PromoCodeInfoQueryVariables>(
    promoCodeInfoQuery,
  );

  const [promoCode, setPromoCode] = useState<string>('');
  const [createPaymentMethodLoading, setCreatePaymentMethodLoading] =
    useState<boolean>(false);

  const stripeRef = useRef<StripeCardInputRef>(null);

  useEffect(() => {
    if (queryPromoData?.promoCodeInfo) {
      handleApplyPromoCode();
    } else {
      form.setFieldValue('promoCode', undefined);
    }
  }, [promoCode, queryPromoData]);

  const handleUpdatePromoCode = (value: string) => {
    setPromoCode(value);
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode) {
      return;
    }

    // try {
    //   const input = handleGenerateSubscriptionInput();

    //   const res = await getPromoCodeInfo({
    //     variables: {
    //       code: promoCode,
    //       createSubscriptionInput: input,
    //     },
    //   });

    //   if (res.data?.promoCodeInfo) {
    //     form.setFieldValue('promoCode', promoCode);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const handlePayNow = async () => {
    if (!stripeRef.current) {
      return;
    }

    setCreatePaymentMethodLoading(true);

    const res = await stripeRef.current.createPaymentMethod();

    const { error, paymentMethod } = res || {};

    if (error) {
      Message.error(i18n.t('errors.requestError'));
    } else {
      paymentMethod && onCreatePaymentMethodSuccess(paymentMethod);
    }

    setCreatePaymentMethodLoading(false);
  };

  const getDiscountedPrice = () => {
    let total = 0;

    if (queryPromoData?.promoCodeInfo) {
      total = queryPromoData.promoCodeInfo.reduce((prev, current) => {
        if (current?.discounted_price && current.price) {
          prev += current.price - current.discounted_price;
        }

        return prev;
      }, 0);
    }

    return total;
  };

  const getPackageTotalPrice = (
    subPackage: QuerySubscriptionPackage,
    interval: string,
  ) => {
    if (!subPackage?.products) {
      return 0;
    }

    const total = subPackage.products.reduce((prev, product) => {
      const price = product?.prices?.find(
        (price) => price?.interval === interval,
      );

      return prev + (price?.amount || 0);
    }, 0);

    return total / 100;
  };

  const getTotalAmount = () => {
    const formValue = form.getFields();
    const interval = formValue.subscriptionInterval;

    const discountedPrice = getDiscountedPrice();
    const subscriptionPackages = getData();

    const total = subscriptionPackages.reduce((prev, sub) => {
      const price = getPackageTotalPrice(sub.subscriptionPackage, interval);

      prev += price * sub.quantity;

      return prev;
    }, 0);

    return total - discountedPrice;
  };

  const columns: ColumnProps<{
    subscriptionPackage: QuerySubscriptionPackage;
    quantity: number;
  }>[] = [
    {
      title: 'Plan Name',
      render: (col, item) => {
        const { subscriptionPackage, quantity } = item;

        const formValue = form.getFields();
        const interval = formValue.subscriptionInterval;

        const price = getPackageTotalPrice(subscriptionPackage, interval);

        return (
          <Grid.Row justify="space-between">
            <div>
              <Typography.Paragraph className={styles['table-paragraph']}>
                {subscriptionPackage?.name}
              </Typography.Paragraph>

              {quantity > 1 && (
                <Typography.Paragraph className={styles['table-paragraph']}>
                  {quantity} users
                </Typography.Paragraph>
              )}
            </div>

            <Typography.Text>{`RM ${formatToCurrency(
              price,
            )}/ ${interval}ly`}</Typography.Text>
          </Grid.Row>
        );
      },
    },
  ];

  const getData = () => {
    const value = form.getFields();

    const packages: {
      subscriptionPackage: QuerySubscriptionPackage;
      quantity: number;
    }[] = [];

    const foundPackage = subscriptionPackages?.find(
      (subPackage) => subPackage?.id === value.packageId,
    );
    if (foundPackage) {
      packages.push({
        subscriptionPackage: foundPackage,
        quantity: 1,
      });
    }

    return packages;
  };

  return (
    <div className={styles.wrapper}>
      <Grid.Row className={styles['center-row']} gutter={20}>
        <Grid.Col span={12}>
          <Typography.Paragraph className={styles.title}>
            Plan Summary
          </Typography.Paragraph>

          <Table
            data={getData()}
            columns={columns}
            scroll={{}}
            pagination={false}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Space direction="vertical" size={20}>
            {/* TODO: Re-enable once promo code is available */}
            {/* <div>
              <Typography.Paragraph className={styles.title}>
                Payment
              </Typography.Paragraph>

              <Space direction="vertical">
                <Space>
                  <Typography.Text>Promotion Code</Typography.Text>

                  <Tooltip content="Discount">
                    <IconQuestionCircle className={styles['tooltip-icon']} />
                  </Tooltip>
                </Space>

                <Space className={styles['promo-input-wrapper']}>
                  <Input
                    value={promoCode}
                    onChange={handleUpdatePromoCode}
                    placeholder="SuperInvestorYay30"
                  />

                  <Button
                    className={
                      queryPromoData?.promoCodeInfo
                        ? undefined
                        : styles['theme-button']
                    }
                    loading={getPromoCodeInfoLoading}
                    onClick={handleApplyPromoCode}
                  >
                    Apply Code
                  </Button>
                </Space>

                {queryPromoData?.promoCodeInfo && (
                  <Typography.Text className={styles['promo-code-valid-txt']}>
                    Promotion code has been applied.
                  </Typography.Text>
                )}
              </Space>
            </div> */}

            <div>
              <Typography.Paragraph className={styles.title}>
                Card Information
              </Typography.Paragraph>

              <div className={styles['stripe-wrapper']}>
                <StripeCardInput ref={stripeRef} />
              </div>
            </div>
          </Space>

          <div className={styles['summary-value-container']}>
            {queryPromoData?.promoCodeInfo && (
              <Grid.Row justify="space-between">
                <Typography.Text className={styles.label}>
                  Discount
                </Typography.Text>

                <Typography.Text className={styles['discount-value-txt']}>
                  -{`RM ${formatToCurrency(getDiscountedPrice())}`}
                </Typography.Text>
              </Grid.Row>
            )}

            <Divider className={styles.divider} />

            <Grid.Row justify="space-between">
              <Typography.Text className={styles.label}>Total</Typography.Text>

              <Typography.Text className={styles['total-value']}>
                {`RM ${formatToCurrency(getTotalAmount())}`}
              </Typography.Text>
            </Grid.Row>
          </div>
        </Grid.Col>
      </Grid.Row>

      <Grid.Row className={styles['bottom-row']} justify="space-between">
        <Button
          className={styles['theme-btn-text']}
          type="text"
          onClick={onBack}
          disabled={
            createPaymentMethodLoading || getPromoCodeInfoLoading || loading
          }
        >
          Back
        </Button>

        <Button
          className={styles['theme-button']}
          loading={createPaymentMethodLoading || loading}
          disabled={getPromoCodeInfoLoading}
          onClick={handlePayNow}
        >
          Proceed Payment
        </Button>
      </Grid.Row>
    </div>
  );
};

const promoCodeInfoQuery = gql`
  query PromoCodeInfo(
    $code: String!
    $createSubscriptionInput: [CreateSubscriptionInput]!
  ) {
    promoCodeInfo(
      code: $code
      createSubscriptionInput: $createSubscriptionInput
    ) {
      ...PromoCodeInfoFragment
    }
  }
  ${promoCodeInfoFragment}
`;

export default PaymentMethodForm;
