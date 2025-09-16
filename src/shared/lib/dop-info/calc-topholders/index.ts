import { contracts } from 'shared/api/contracts';

export function calculateTopHolders(parsed: ReturnType<typeof contracts.token.dopInfo.topHolders.safeParse>) {
  if (!parsed.success) return null;

  const holders = parsed.data.result.value;
  if (holders.length <= 1) return 0;

  const sum = holders.slice(1, 11).reduce((acc, curr) => acc + curr.uiAmount, 0);
  return (sum / +__ALL_SUPPLY_TOKEN__) * 100;
}
