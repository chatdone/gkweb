import {
  Button,
  Form,
  Grid,
  FormInstance, // Space,
  // Typography,
} from '@arco-design/web-react';
import type { PaymentMethod } from '@stripe/stripe-js';
import { useState } from 'react';

// import { MdOutlinePriceCheck } from 'react-icons/md';
// import Message from '@/components/Message';
// import Modal from '@/components/Modal';
import PaymentMethodForm from './PaymentMethodForm';
import styles from './StepTwoForm.module.less';
import SubscriptionFormItems from './SubscriptionFormItems';

import { OnboardingPageQuery } from 'generated/graphql-types';

const FormItem = Form.Item;

type Props = {
  subscriptionPackages: OnboardingPageQuery['subscriptionPackagesV2'];
  form: FormInstance;
  loading: boolean;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
};

const StepTwoForm = (props: Props) => {
  const { form, loading, subscriptionPackages, onBack, onNext, onSkip } = props;

  const [showPaymentMethodForm, setShowPaymentMethodForm] =
    useState<boolean>(false);

  const handleResumeEditSubscription = () => {
    setShowPaymentMethodForm(false);
  };

  const handleNext = () => {
    form.validate().then((value) => {
      const isFreeOnly = value.packageId === 'free';
      if (isFreeOnly) {
        onSkip();
        return;
      }

      // TODO: Enable this once trial is available
      //   Modal.confirm({
      //     icon: null,
      //     content: (
      //       <Space
      //         direction="vertical"
      //         align="center"
      //         style={{ width: '100%' }}
      //         size={20}
      //       >
      //         <div className={styles['modal-icon']}>
      //           <MdOutlinePriceCheck />
      //         </div>

      //         <Typography.Text style={{ fontWeight: '600' }}>
      //           Do you wish to pay now?
      //         </Typography.Text>
      //       </Space>
      //     ),
      //     cancelText: 'Start 14 days trial',
      //     okText: 'Pay Now',
      //     onOk: () => {
      //       form.setFieldValue('subscriptionTrial', false);

      //       setShowPaymentMethodForm(true);
      //     },
      //     onCancel: () => {
      //       form.setFieldValue('subscriptionTrial', true);

      //       onNext();
      //     },
      //     maskClosable: false,
      //     escToExit: false,
      //   });

      form.setFieldValue('subscriptionTrial', false);

      setShowPaymentMethodForm(true);
    });
  };

  const handleCreatePaymentMethodSuccess = (paymentMethod: PaymentMethod) => {
    form.setFieldValue('paymentMethod', paymentMethod);

    onNext();
  };

  return (
    <>
      {showPaymentMethodForm && (
        <PaymentMethodForm
          form={form}
          loading={loading}
          subscriptionPackages={subscriptionPackages}
          onBack={handleResumeEditSubscription}
          onCreatePaymentMethodSuccess={handleCreatePaymentMethodSuccess}
        />
      )}

      {!showPaymentMethodForm && (
        <>
          <SubscriptionFormItems
            form={form}
            subscriptionPackages={subscriptionPackages}
          />

          <FormItem wrapperCol={{ span: 24 }}>
            <Grid.Row justify="space-between">
              <Button
                className={styles['theme-btn-text']}
                type="text"
                onClick={onBack}
                disabled={loading}
              >
                Back
              </Button>

              <Button
                className={styles['theme-button']}
                loading={loading}
                onClick={handleNext}
              >
                Next
              </Button>
            </Grid.Row>
          </FormItem>
        </>
      )}
    </>
  );
};

export default StepTwoForm;
