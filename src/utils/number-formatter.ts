import accounting from 'accounting';

export const formatCurrency = (
  amount: number,
  minimumFractionDigits = 2,
  symbol = '€',
) => {
  try {
    return accounting.formatMoney(amount, symbol, minimumFractionDigits);
  } catch (error) {}
};
