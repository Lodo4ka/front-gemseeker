import { number, object, string, literal } from 'zod';

export const tx = object({
  signature: string(),
  wallet_address: string(),
  amount: number(),
  timestamp: number(),
  type: literal('WITHDRAW').or(literal('DEPOSIT')),
  mint: string(),
});
