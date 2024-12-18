import { Button, Space, Typography } from '@arco-design/web-react';
import { upperFirst } from 'lodash-es';

import styles from './PaymentMethodCard.module.less';

import Icons from '@/assets/icons';

import type { ArrayElement } from '@/types';

import type { CompanyPaymentPageQuery } from 'generated/graphql-types';

type QueryCompanyPaymentMethod = ArrayElement<
  CompanyPaymentPageQuery['companyPaymentMethods']
>;

type Props = {
  paymentMethod: QueryCompanyPaymentMethod;
  onSetDefault: () => void;
  onRemove: () => void;
};

const PaymentMethodCard = (props: Props) => {
  const { paymentMethod, onSetDefault, onRemove } = props;

  const getCardBrandImage = () => {
    switch (paymentMethod?.brand) {
      case 'mastercard':
        return Icons.master;

      default:
        return Icons.visa;
    }
  };

  return (
    <div className="flex flex-col justify-between relative h-[150px] p-4 rounded border-solid border-[0.5px] border-black shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-start">
        <img src={getCardBrandImage()} alt="card" />

        <Space
          style={{ width: 'unset' }}
          direction="vertical"
          align="end"
          size={3}
        >
          <div className="rounded border-[1px] border-solid border-black px-3">
            {upperFirst(paymentMethod?.brand as string)} Card
          </div>

          {paymentMethod?.isDefault && (
            <Typography.Text className="font-bold" style={{ color: '#3491FA' }}>
              Active
            </Typography.Text>
          )}
        </Space>
      </div>

      <div className="flex justify-between font-bold">
        <Typography.Text>************{paymentMethod?.last4}</Typography.Text>

        <Typography.Text>
          {paymentMethod?.expMonth?.toString().padStart(2, '0')}/
          {paymentMethod?.expYear}
        </Typography.Text>
      </div>

      <div
        className={`${styles.overlay} opacity-0 bg-black/80 mix-blend-multiply absolute top-0 left-0 right-0 bottom-0 hover:opacity-100`}
      >
        <div className="flex flex-col h-full justify-center items-center">
          {!paymentMethod?.isDefault && (
            <Button className="mb-2" type="primary" onClick={onSetDefault}>
              Set As Default
            </Button>
          )}

          <Button type="primary" onClick={onRemove}>
            Remove Card
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
