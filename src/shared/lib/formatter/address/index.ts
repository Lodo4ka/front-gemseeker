export const address = (
  address: string | null | undefined,
  visibleChars?: { start?: number; end?: number },
): string => {
  if (!address) return '';

  const start = address.slice(0, visibleChars?.start ?? 4);
  const end = address.slice(-(visibleChars?.end ?? 4));

  return `${start}...${end}`;
};
