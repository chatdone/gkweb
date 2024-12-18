import { Button } from '@arco-design/web-react';
import { MdCheck } from 'react-icons/md';

import { formatToCurrency } from '@/utils/currency.utils';

type Props = {
  isActive: boolean;
  title: string;
  price?: string | number;
  unit?: string | JSX.Element;
  features: string[] | undefined;
  subscribeBtnText: string;
  onUpgrade: () => void;
  total?: string;
  term?: string;
};

const SubscriptionCard = (props: Props) => {
  const {
    isActive,
    title,
    price,
    unit,
    features,
    subscribeBtnText,
    onUpgrade,
    total,
    term,
  } = props;

  return (
    <div
      className={`p-4 border ${
        isActive ? 'border-blue-600' : 'border-gray-200'
      }`}
    >
      <div className="text-center">
        <h3 className="uppercase tracking-wider mb-5 text-brand-500">
          {title}
        </h3>

        <div className="text-4xl font-bold">
          {typeof price === 'string' ? price : formatToCurrency(price || 0)}
        </div>

        <div className="text-xl">{unit}</div>

        <div className="py-5 text-gray-500 text-lg">
          <div className="h-5">{total}</div>
          <div className="h-5">{term}</div>
        </div>
      </div>

      {isActive ? (
        <div className="mb-5 h-8" />
      ) : (
        <Button className="mb-5" type="primary" long onClick={onUpgrade}>
          {subscribeBtnText}
        </Button>
      )}

      <div className="divide-y divide-gray-200">
        {features?.map((feature, index) => (
          <div key={index} className="p-2">
            <MdCheck className="text-brand-500 mr-1" /> {feature}
          </div>
        ))}

        {title === 'Startup' && (
          <div className="px-2 pt-5 text-gray-500">
            * Quota refreshes every month
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;
