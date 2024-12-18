import { Button, Modal, Space, Typography } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

import styles from './DedocoModal.module.less';
import DedocoPackage from './DedocoPackage';

import Icons from '@/assets/icons';

import { ArrayElement, BaseModalConfig } from '@/types';

import { CompanyIntegrationPageQuery } from 'generated/graphql-types';

type QueryPaymentMethod = ArrayElement<
  NonNullable<CompanyIntegrationPageQuery['currentUser']>['paymentMethods']
>;

type Props = BaseModalConfig & {
  loading: boolean;
  hasSubscription: boolean;
  hasSubscribedTrialBefore: boolean;
  isInMalaysia: boolean;
  paymentMethod: QueryPaymentMethod | undefined;
  dedocoPackages: CompanyIntegrationPageQuery['dedocoPackages'];
  onSubscribe: (packagePriceId: string) => void;
  onSetupPaymentMethod: () => void;
};

const DedocoModal = (props: Props) => {
  const {
    visible,
    onCancel,
    dedocoPackages,
    hasSubscription,
    loading,
    isInMalaysia,
    paymentMethod,
    hasSubscribedTrialBefore,
    onSubscribe,
    onSetupPaymentMethod,
  } = props;

  const [showPackages, setShowPackages] = useState<boolean>(false);

  useEffect(() => {
    visible && handleShowPackage(false);
  }, [visible]);

  const handleShowPackage = (flag: boolean) => {
    setShowPackages(flag);
  };

  const handleCancel = () => {
    handleShowPackage(false);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      style={{ width: 520 }}
      title="Integrate with Dedoco"
      footer={null}
    >
      {hasSubscription && (
        <Typography.Paragraph>
          You are currently subscribed to dedoco.
        </Typography.Paragraph>
      )}

      {!hasSubscription &&
        (showPackages ? (
          <DedocoPackage
            dedocoPackages={dedocoPackages}
            loading={loading}
            isInMalaysia={isInMalaysia}
            paymentMethod={paymentMethod}
            hasSubscribedTrialBefore={hasSubscribedTrialBefore}
            onSubscribe={onSubscribe}
            onCancel={handleCancel}
            onSetupPaymentMethod={onSetupPaymentMethod}
          />
        ) : (
          <Space className={styles.intro} direction="vertical" size={20}>
            <img src={Icons.dedoco} alt="Dedoco" />

            <div>
              <Typography.Paragraph>
                Dedoco is a digital document and signing solution
              </Typography.Paragraph>
              <Typography.Paragraph>
                that transforms the way enterprise manage
              </Typography.Paragraph>
              <Typography.Paragraph>
                digital workflows, while issuing trusted,
              </Typography.Paragraph>
              <Typography.Paragraph>
                verifiable documents and credentials.
              </Typography.Paragraph>
            </div>

            <Button
              className={styles['theme-button']}
              onClick={() => handleShowPackage(true)}
            >
              Subscribe Now
            </Button>
          </Space>
        ))}
    </Modal>
  );
};

export default DedocoModal;
