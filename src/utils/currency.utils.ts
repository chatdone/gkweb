import numeral from 'numeral';

const formatToCurrency = (amount: number, optionalDecimal = false) => {
  return `${numeral(amount).format(
    optionalDecimal ? '0,0[.]00' : '0,0.00',
    Math.floor,
  )}`;
};

const CURRENCY_CODE = {
  MYR: 'RM',
  USD: 'USD',
};

const getCurrencyCode = (input?: string | null) => {
  switch (input) {
    case CURRENCY_CODE.USD:
      return 'USD' as const;

    default:
      return 'RM' as const;
  }
};

export { formatToCurrency, getCurrencyCode, CURRENCY_CODE };
