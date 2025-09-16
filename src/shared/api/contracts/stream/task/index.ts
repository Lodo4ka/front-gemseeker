import { number, object, string } from 'zod';

export const task = object({
  description: string(),
  donation_target: number().nullable(),
  mcap_target: number().nullable(),
  token_address: string().nullable(),
});
