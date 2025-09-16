export const round = (num: number | string | undefined | null, decimals = 4): number => {
  if (num === undefined || num === null) return 0;

  const number = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(number)) return 0;

  const str = number.toString();
  const [_, decimal] = str.split('.');

  if (!decimal) return number;

  return decimal.length <= decimals ? number : Number(Math.round(Number(number + 'e' + decimals)) + 'e-' + decimals);
};