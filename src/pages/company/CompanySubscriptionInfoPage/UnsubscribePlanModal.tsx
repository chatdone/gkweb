import { Button, Grid, Modal, Space, Typography } from '@arco-design/web-react';

import styles from './UnsubscribePlanModal.module.less';

import Icons from '@/assets/icons';

import { BaseModalConfig } from '@/types';

import { CompanySubscriptionInfoPageQuery } from 'generated/graphql-types';

type Props = BaseModalConfig & {
  companySubscription: CompanySubscriptionInfoPageQuery['companySubscription'];
  loading: boolean;
  onSubscribe: () => void;
};

const UnsubscribePlanModal = (props: Props) => {
  const { visible, onCancel, companySubscription, loading, onSubscribe } =
    props;

  const getFormattedPackageTitle = () => {
    if (!companySubscription?.packageTitle) {
      return '-';
    }

    return companySubscription.packageTitle.replace('Omni', '').trim();
  };

  return (
    <Modal
      className={styles.modal}
      visible={visible}
      onCancel={onCancel}
      title="Unsubscribe Plan"
      footer={null}
      escToExit={!loading}
      maskClosable={!loading}
      closable={!loading}
    >
      <Typography.Paragraph>We are sorry to see you go</Typography.Paragraph>

      <img src={Icons.ohNo} alt="unsubscribe" />

      <Typography.Paragraph className={styles.descriptions}>
        Are you sure you wish to unsubscribe from {getFormattedPackageTitle()}?
        This action will remove all the member in the subscription and all the
        project cannot be undone.
      </Typography.Paragraph>

      <Grid.Row justify="center">
        <Space>
          <Button
            className={styles['theme-button']}
            disabled={loading}
            onClick={onCancel}
          >
            No
          </Button>

          <Button loading={loading} onClick={onSubscribe}>
            Yes
          </Button>
        </Space>
      </Grid.Row>
    </Modal>
  );
};

export default UnsubscribePlanModal;
