import { describe, test } from 'vitest';

import { formatToCurrency, getCurrencyCode } from './currency.utils';

describe('formatToCurrency', () => {
  describe('Whole Number', () => {
    const value = 1000;

    test('should return in currency format', () => {
      const formattedValue = formatToCurrency(value);

      expect(formattedValue).toBe('1,000.00');
    });

    test('should not show decimal value when optional decimal param is true', () => {
      const formattedValue = formatToCurrency(value, true);

      expect(formattedValue).toBe('1,000');
    });
  });

  describe('Decimal Value', () => {
    const value = 1000.5;

    test('should return in currency format', () => {
      const formattedValue = formatToCurrency(value);

      expect(formattedValue).toBe('1,000.50');
    });

    test('should show decimal value even when optional decimal param is true', () => {
      const formattedValue = formatToCurrency(value, true);

      expect(formattedValue).toBe('1,000.50');
    });
  });
});

describe('getCurrencyCode', () => {
  test('should return default RM if no param is provided', () => {
    const currencyCode = getCurrencyCode();

    expect(currencyCode).toBe('RM');
  });

  test('should return USD if param is input', () => {
    const currencyCode = getCurrencyCode('USD');

    expect(currencyCode).toBe('USD');
  });

  test('should return RM if param is invalid', () => {
    const currencyCode = getCurrencyCode('testing');

    expect(currencyCode).toBe('RM');
  });
});
