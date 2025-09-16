import { object, literal, number, string, array, tuple, boolean, bigint } from 'zod';

const accountInfo = object({
  data: tuple([string(), string()]),
  executable: boolean(),
  lamports: number(),
  owner: string(),
  rentEpoch: bigint().or(number()),
  space: number(),
});

export const balances = array(object({
  jsonrpc: literal('2.0'),
  id: number(),
  result: object({
    context: object({
      apiVersion: string(),
      slot: number(),
    }),
    value: array(accountInfo.nullable()),
  }),
}));
