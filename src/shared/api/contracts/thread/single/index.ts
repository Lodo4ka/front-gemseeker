import { object, number, string, boolean } from 'zod';

export const single = object({
  id: number(),
  user_id: number(),
  user: object({
    user_id: number(),
    user_nickname: string(),
    user_photo_hash: string().nullable(),
  }),
  text: string(),
  timestamp: number(),
  likes: number(),
  liked: boolean(),
  token_id: number(),
  replies: number(),
});
