import { Alert } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import styles from './TrialBanner.module.less';

import { useAppStore } from '@/stores/useAppStore';

// import { SubscriptionStatuses } from 'generated/graphql-types';

const TrialBanner = () => {
  const { activeCompany } = useAppStore();

  const [showTrialAlert, setShowTrialAlert] = useState<boolean>(false);

  useEffect(() => {
    // const hasTrialSubscriptions = !!(
    //   activeCompany?.activeSubscription &&
    //   activeCompany.activeSubscription.length > 0 &&
    //   activeCompany.activeSubscription.every(
    //     (sub) => sub?.status === SubscriptionStatuses.Trial,
    //   )
    // );

    const hasTrialSubscriptions = false;

    setShowTrialAlert(hasTrialSubscriptions);
  }, [activeCompany]);

  useEffect(() => {
    const contentNode = document.querySelector('.arco-layout-content');

    if (showTrialAlert) {
      contentNode?.classList.add(styles.trial);
    } else {
      contentNode?.classList.remove(styles.trial);
    }
  }, [showTrialAlert]);

  const handleCloseAlertBanner = () => {
    setShowTrialAlert(false);
  };

  const getTrialRemainingDays = () => {
    // const hasTrialSubscriptions =
    //   activeCompany?.activeSubscription &&
    //   activeCompany.activeSubscription.length > 0 &&
    //   activeCompany.activeSubscription?.every(
    //     (sub) => sub?.status === SubscriptionStatuses.Trial,
    //   );
    const hasTrialSubscriptions = false;
    if (!hasTrialSubscriptions) {
      return 0;
    }

    // const endDate = activeCompany?.activeSubscription?.[0]?.endDate;

    // return dayjs(endDate).diff(dayjs(), 'day');
    return dayjs().diff(dayjs(), 'day');
  };

  if (!showTrialAlert) {
    return <></>;
  }

  return (
    <Alert
      className={styles.banner}
      banner
      closable
      showIcon={false}
      content={`Your trial will be expired in ${getTrialRemainingDays()} days`}
      onClose={handleCloseAlertBanner}
    />
  );
};

export default TrialBanner;
