import bytes from 'bytes';

import type {
  CompanySubscription,
  SubscriptionPackage,
} from 'generated/graphql-types';

const getFinalPrice = (sub: CompanySubscription) => {
  if (!sub) {
    return 0;
  }

  const price = sub.price || 0;
  const quantity = sub.quantity || 1;

  let finalPrice = price * quantity;

  if (sub.discount) {
    const { coupon } = sub.discount;
    if (coupon?.percentOff) {
      finalPrice = finalPrice * ((100 - coupon.percentOff) / 100);
    } else if (coupon?.amountOff) {
      finalPrice -= coupon.amountOff;
    }
  }

  return finalPrice;
};

const getBasicSubscriptionStorageSize = (type: string | null | undefined) => {
  const lowerCaseType = type?.toLowerCase();

  let size = '5GB';

  if (lowerCaseType?.includes('starter')) {
    size = '50GB';
  } else if (lowerCaseType?.includes('pro')) {
    size = '70GB';
  } else if (lowerCaseType?.includes('premium')) {
    size = '100GB';
  }

  return bytes(size);
};

const extractPackageTitle = (
  subscriptionPackage: SubscriptionPackage | null | undefined,
) => {
  return subscriptionPackage?.title
    ?.replace('Bundle', '')
    .replace('Omni', '')
    .trim();
};

export { getFinalPrice, getBasicSubscriptionStorageSize, extractPackageTitle };
