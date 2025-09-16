import { contracts } from 'shared/api/contracts';

export function calculateCreator(parsed: ReturnType<typeof contracts.token.dopInfo.creator.safeParse>) {
  if (!parsed.success) return 0;

  let total = 0;
  for (const account of parsed.data.result.value) {
    const tokenAmount = account.account.data.parsed.info.tokenAmount;
    const amount = BigInt(tokenAmount.amount);
    if (amount <= 0) continue;

    total += Number(amount) / Math.pow(10, tokenAmount.decimals);
  }
  
  return (total / +__ALL_SUPPLY_TOKEN__) * 100;
}
