import { object, number, string, array } from 'zod';
export const followee = object({
  id: number(),
  user: object({
    user_id: number(),
    user_nickname: string(),
    user_photo_hash: string().nullable(),
  }),
});

export const followees = array(followee);
