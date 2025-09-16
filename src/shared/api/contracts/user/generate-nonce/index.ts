import { object, string } from 'zod';

export const generateNonce = object({
  nonce: string(),
});
