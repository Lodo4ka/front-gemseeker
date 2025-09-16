import { object, string, number } from 'zod';

export const byUser = object({
  transaction_id: number(),
  hash: string(),
  token_name: string(),
  token_symbol: string(),
  token_photo_hash: string(),
  type: string(),
  sol_amount: number(),
  token_amount: number(),
  timestamp: number(),
});
