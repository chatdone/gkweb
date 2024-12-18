import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe, PaymentMethodResult } from '@stripe/stripe-js';
import { forwardRef, useImperativeHandle } from 'react';

import configs from '@/configs';

const stripePromise = loadStripe(configs.env.STRIPE_PUBLISH_KEY);

export type StripeCardInputRef = {
  createPaymentMethod: () => Promise<PaymentMethodResult | undefined>;
};

export const StripeCardInput = forwardRef<StripeCardInputRef>((props, ref) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm ref={ref} />
    </Elements>
  );
});

const CheckoutForm = forwardRef<StripeCardInputRef>((props, ref) => {
  const stripe = useStripe();
  const elements = useElements();

  useImperativeHandle(ref, () => ({
    createPaymentMethod: handleSubmit,
  }));

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      return stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
    } else {
      console.error('no stripe card element');
    }
  };

  return (
    <CardElement
      options={{
        iconStyle: 'solid',
        style: {
          base: {
            color: '#424770',
            letterSpacing: '0.025em',
            '::placeholder': {
              color: '#aab7c4',
            },
            padding: '1rem 1rem',
          },
          invalid: {
            color: '#9e2146',
          },
        },
      }}
    />
  );
});
