import { contracts } from 'shared/client';
import { object, string, number, literal } from 'zod';
import { socketInfo } from '../socket-info';

export const donation = object({
  type: literal('DONATION'),
  donation: object({
    user: contracts.UserResponseShort,
    amount: number(),
    text: string(),
    timestamp: number(),
    wallet_address: string(),
    signature: string(),
  }),
  info: socketInfo,
});
