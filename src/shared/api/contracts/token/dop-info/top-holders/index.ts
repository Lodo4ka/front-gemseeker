import { object, string, number, array } from 'zod';

const account = object({
  address: string(),
  amount: string(),
  decimals: number(),
  uiAmount: number(),
  uiAmountString: string(),
});

export const topHolders = object({
  jsonrpc: string(),
  id: string(),
  result: object({
    context: object({ slot: number() }),
    value: array(account),
  }),
});
