import { literal, number, object, string } from 'zod';

const def = object({
  user_info: object({
    user_id: number(),
    user_nickname: string(),
    user_photo_hash: string().optional(),
  }),
  text: string(),
  timestamp: number(),
});

export const message = object({
  ...def.shape,
  type: literal('message'),
  id: number(),
}).or(
  object({
    type: literal('donation'),
    amount: number(),
    id: string(),
    ...def.shape,
  }),
);
