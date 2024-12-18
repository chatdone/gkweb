import {
  Button,
  Card,
  Grid,
  Radio,
  Space,
  Typography,
} from '@arco-design/web-react';
import { useState } from 'react';
import { MdCheck, MdCheckCircle, MdOutlineCircle } from 'react-icons/md';

import Checkout from './Checkout';
import styles from './DedocoPackage.module.less';

import { formatToCurrency, getCurrencyCode } from '@/utils/currency.utils';

import { ArrayElement } from '@/types';

import { CompanyIntegrationPageQuery } from 'generated/graphql-types';

const RadioGroup = Radio.Group;

type QuerySubscriptionPackage = ArrayElement<
  CompanyIntegrationPageQuery['dedocoPackages']
>;

type QueryPaymentMethod = ArrayElement<
  NonNullable<CompanyIntegrationPageQuery['currentUser']>['paymentMethods']
>;

type Props = {
  loading: boolean;
  isInMalaysia: boolean;
  hasSubscribedTrialBefore: boolean;
  dedocoPackages: CompanyIntegrationPageQuery['dedocoPackages'];
  paymentMethod: QueryPaymentMethod | undefined;
  onSubscribe: (packagePriceId: string) => void;
  onCancel: () => void;
  onSetupPaymentMethod: () => void;
};

const DedocoPackage = (props: Props) => {
  const {
    dedocoPackages,
    loading,
    paymentMethod,
    isInMalaysia,
    hasSubscribedTrialBefore,
    onSubscribe,
    onCancel,
    onSetupPaymentMethod,
  } = props;

  const [selectedPriceId, setSelectedPriceId] = useState<string>();
  const [showCheckout, setShowCheckout] = useState<boolean>(false);

  const currencyCode = getCurrencyCode(isInMalaysia ? undefined : 'USD');
  const packageCurrency = isInMalaysia ? 'MYR' : 'USD';

  const handleSelectPackage = (priceId: string) => {
    setSelectedPriceId(priceId);
  };

  const handleBack = () => {
    setShowCheckout(false);
  };

  const handleNext = () => {
    if (!selectedPriceId) {
      return;
    }

    setShowCheckout(true);
  };

  const getPlanTitle = (subscriptionPackage: QuerySubscriptionPackage) => {
    switch (subscriptionPackage?.title) {
      case 'Dedoco Trial':
        return 'Free';

      case 'Dedoco 500':
        return 'Starter Plan';

      case 'Dedoco 1000':
        return 'Business Plan';

      default:
        return '';
    }
  };

  return (
    <>
      {!showCheckout ? (
        <div>
          <Typography.Paragraph className={styles.title}>
            Activation
          </Typography.Paragraph>

          <RadioGroup
            className={styles.group}
            direction="vertical"
            value={selectedPriceId}
            onChange={handleSelectPackage}
          >
            {(hasSubscribedTrialBefore
              ? dedocoPackages?.filter((pack) => !pack?.title?.match(/trial/i))
              : dedocoPackages
            )?.map((dedocoPackage) => {
              const price = dedocoPackage?.packagePrices?.find(
                (price) => price?.currency === packageCurrency,
              );

              return (
                <Radio key={dedocoPackage?.id} value={price?.id}>
                  {({ checked }) => (
                    <Card className={styles['price-card']}>
                      <Grid.Row justify="space-between" align="center">
                        <Space>
                          <CheckedIcon checked={checked} />

                          <Typography.Text>
                            {getPlanTitle(dedocoPackage)}
                          </Typography.Text>
                        </Space>

                        <Typography.Text className={styles.price}>
                          {price?.price === 0
                            ? 'FREE'
                            : `${currencyCode} ${formatToCurrency(
                                price?.price as number,
                              )}/ Annual`}
                        </Typography.Text>
                      </Grid.Row>

                      <Space direction="vertical">
                        <PlanDescription
                          label={`${dedocoPackage?.signatureQuota} Transactions`}
                        />
                        <PlanDescription label="Signer Authentication" />
                        <PlanDescription label="Sign with SignPass" />
                        <PlanDescription label="Multi-Documents Workflow" />
                      </Space>
                    </Card>
                  )}
                </Radio>
              );
            })}
          </RadioGroup>

          <Grid.Row justify="end">
            <Space>
              <Button onClick={onCancel}>Cancel</Button>

              <Button
                className={styles['theme-button']}
                disabled={!selectedPriceId}
                onClick={handleNext}
              >
                Next
              </Button>
            </Space>
          </Grid.Row>
        </div>
      ) : (
        <Checkout
          loading={loading}
          dedocoPackages={dedocoPackages}
          selectedPriceId={selectedPriceId as string}
          paymentMethod={paymentMethod}
          currencyCode={currencyCode}
          onBack={handleBack}
          onPay={() => onSubscribe(selectedPriceId as string)}
          onCancel={onCancel}
          onSetupPaymentMethod={onSetupPaymentMethod}
        />
      )}
    </>
  );
};

const CheckedIcon = ({ checked }: { checked: boolean }) => {
  return (
    <div className={styles['checked-icon-wrapper']}>
      {checked ? (
        <MdCheckCircle className={styles['checked-icon']} />
      ) : (
        <MdOutlineCircle />
      )}
    </div>
  );
};

const PlanDescription = ({ label }: { label: string }) => {
  return (
    <Space size={15}>
      <MdCheck className={styles.check} />

      <Typography.Text>{label}</Typography.Text>
    </Space>
  );
};

export default DedocoPackage;
