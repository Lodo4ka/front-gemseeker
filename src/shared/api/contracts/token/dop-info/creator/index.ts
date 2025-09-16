import { object, number, string, array, boolean } from 'zod';

const tokenAccount = object({
  pubkey: string(),
  account: object({
    lamports: number(),
    owner: string(),
    executable: boolean(),
    rentEpoch: number(),
    space: number(),
    data: object({
      program: string(),
      parsed: object({
        type: string(),
        info: object({
          isNative: boolean(),
          mint: string(),
          owner: string(),
          state: string(),
          tokenAmount: object({
            amount: string(),
            decimals: number(),
            uiAmount: number(),
            uiAmountString: string(),
          }),
        }),
      }),
      space: number(),
    }),
  }),
});

export const creator = object({
  jsonrpc: string(),
  id: string(),
  result: object({
    context: object({
      slot: number(),
      apiVersion: string(),
    }),
    value: array(tokenAccount),
  }),
});
