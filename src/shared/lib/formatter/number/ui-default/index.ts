import { toPlainString } from '../toPlainString';

export const uiDefault = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '0';

  const absValue = Math.abs(value);

  if (absValue >= 1_000) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }

  if (absValue >= 0.01) {
    return value.toFixed(2).replace(/\.00$/, '');
  }

  if (absValue >= 0.00001) {
    return toPlainString(Number(value.toPrecision(3)));
  }

  return '0';
};

export const uiDefaultWithDollar = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '$0';

  const absValue = Math.abs(value);

  if (absValue >= 1_000) {
    const formatted = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);

    return value < 0 ? `-$${formatted.slice(1)}` : `$${formatted}`;
  }

  if (absValue >= 0.01) {
    const formatted = value.toFixed(2).replace(/\.00$/, '');
    return value < 0 ? `-$${formatted.slice(1)}` : `$${formatted}`;
  }

  if (absValue >= 0.00001) {
    const formatted = toPlainString(Number(value.toPrecision(3)));
    return value < 0 ? `-$${formatted.slice(1)}` : `$${formatted}`;
  }

  return '$0';
};
