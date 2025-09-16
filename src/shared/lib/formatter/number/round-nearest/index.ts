export function roundToNearest(value: number): number {
  if (value === 0) return 0;

  const sign = Math.sign(value);
  const absValue = Math.abs(value);

  const order = Math.floor(Math.log10(absValue));
  const base = Math.pow(10, order);

  const niceNumbers = [1, 2, 5, 10] as const;

  let bestNumber = niceNumbers[0] as number;
  let bestDiff = Math.abs(absValue - bestNumber * base);

  for (const nice of niceNumbers) {
    const candidate = nice * base;
    const diff = Math.abs(absValue - candidate);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestNumber = nice;
    }
  }

  return sign * (bestNumber * base);
}
