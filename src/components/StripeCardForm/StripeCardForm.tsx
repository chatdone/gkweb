import { Form } from '@arco-design/web-react';
import {
  Elements,
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  loadStripe,
  PaymentMethod,
  StripeElementStyle,
} from '@stripe/stripe-js';
import { forwardRef, useImperativeHandle, useState } from 'react';

import { FormLabel } from '@/components';

import Message from '../Message';
import styles from './StripeCardForm.module.less';

import configs from '@/configs';

const stripePromise = loadStripe(configs.env.STRIPE_PUBLISH_KEY);

export type StripeCardFormRef = {
  createPaymentMethod: () => Promise<PaymentMethod | undefined>;
  clearValues: () => void;
};

export const StripeCardForm = forwardRef<StripeCardFormRef>((props, ref) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm ref={ref} />
    </Elements>
  );
});

const CheckoutForm = forwardRef<StripeCardFormRef>((props, ref) => {
  const stripe = useStripe();
  const elements = useElements();

  const [cardErrors, setCardErrors] =
    useState<Record<string, string | null | undefined>>();

  useImperativeHandle(ref, () => ({
    createPaymentMethod: handleSubmit,
    clearValues: handleClearValues,
  }));

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      console.error('no stripe card element');
      return;
    }

    const res = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (!res.error) {
      return res.paymentMethod;
    } else {
      res.error.message && Message.error(res.error.message);
    }
  };

  const handleClearValues = () => {
    if (!elements) {
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    const expiryElement = elements.getElement(CardExpiryElement);
    const cvcElement = elements.getElement(CardCvcElement);

    cardElement?.clear();
    expiryElement?.clear();
    cvcElement?.clear();
  };

  return (
    <Form layout="vertical">
      <Form.Item
        label={
          <FormLabel
            label="Card number"
            tooltip="Credit or debit card is acceptable."
          />
        }
        required
        validateStatus={cardErrors?.number ? 'error' : undefined}
        help={cardErrors?.number}
      >
        <CardNumberElement
          options={{
            placeholder: 'xxxx xxxx xxxx xxxx',
            style: elementStyle,
            classes: {
              base: elementClass,
            },
          }}
          onChange={(event) => {
            const newErrors = {
              ...cardErrors,
              ['number']: event.error?.message,
            };

            setCardErrors(newErrors);
          }}
        />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            label="MM/YY"
            tooltip="Fill in the expiry date of your payment card."
          />
        }
        required
        validateStatus={cardErrors?.expiry ? 'error' : undefined}
        help={cardErrors?.expiry}
      >
        <CardExpiryElement
          options={{
            style: elementStyle,
            classes: {
              base: elementClass,
            },
          }}
          onChange={(event) => {
            const newErrors = {
              ...cardErrors,
              ['expiry']: event.error?.message,
            };

            setCardErrors(newErrors);
          }}
        />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            label="CVC"
            tooltip="Fill in the three-digit security number on the front or rear of your payment card."
          />
        }
        required
        validateStatus={cardErrors?.cvc ? 'error' : undefined}
        help={cardErrors?.cvc}
      >
        <CardCvcElement
          options={{
            placeholder: 'xxx',
            style: elementStyle,
            classes: {
              base: elementClass,
            },
          }}
          onChange={(event) => {
            const newErrors = {
              ...cardErrors,
              ['cvc']: event.error?.message,
            };

            setCardErrors(newErrors);
          }}
        />
      </Form.Item>
    </Form>
  );
});

const elementClass = `arco-input arco-input-size-default ${styles.input}`;

const elementStyle: StripeElementStyle = {
  base: {
    '::placeholder': {
      color: '#86909c',
    },
  },
};
