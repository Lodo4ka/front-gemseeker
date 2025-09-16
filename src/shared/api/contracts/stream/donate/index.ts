import { object, number, string } from 'zod';

export const donate = object({
  amount: number(),
  text: string(),
  user: object({
    user_id: number(),
    user_nickname: string(),
    user_photo_hash: string().nullable(),
  }),
  timestamp: number(),
  wallet_address: string(),
  signature: string(),
});
