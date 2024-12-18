import { describe, test } from 'vitest';

import { extractPackageTitle, getFinalPrice } from './subscription.utils';

describe('extractPackageTitle', () => {
  test('should extract package title of Omni subscription package', () => {
    const title = extractPackageTitle({
      id: '',
      title: 'Omni Starter',
    });

    expect(title).toBe('Starter');
  });

  test('should extract package title of Bundle subscription package', () => {
    const title = extractPackageTitle({
      id: '',
      title: 'Pro Bundle',
    });

    expect(title).toBe('Pro');
  });
});

describe('getFinalPrice', () => {
  test('should return the correct price number without discount', () => {
    const price = getFinalPrice({
      id: '',
      price: 159,
      quantity: 1,
    });

    expect(price).toBe(159);
  });

  test('should return the correct price number with percent discount', () => {
    const price = getFinalPrice({
      id: '',
      price: 159,
      quantity: 1,
      discount: {
        coupon: {
          percentOff: 10,
        },
      },
    });

    expect(price).toBe(159 * 0.9);
  });

  test('should return the correct price number with amount discount', () => {
    const price = getFinalPrice({
      id: '',
      price: 159,
      quantity: 1,
      discount: {
        coupon: {
          amountOff: 25,
        },
      },
    });

    expect(price).toBe(134);
  });

  test('should return the correct price number with more than one quantity', () => {
    const price = getFinalPrice({
      id: '',
      price: 8,
      quantity: 10,
    });

    expect(price).toBe(80);
  });
});
