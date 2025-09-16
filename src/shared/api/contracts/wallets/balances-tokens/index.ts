import { object, literal, number, string, array, boolean, any } from 'zod';

export const balancesTokens = object({
  jsonrpc: literal('2.0'),
  id: number(),
  result: object({
    total: number(),
    limit: number(),
    token_accounts: array(object({
      address: string(),
      mint: string(),
      owner: string(),
      amount: number(),
      delegated_amount: number(),
      frozen: boolean(),
      burnt: any()
    }))
  }),
});
