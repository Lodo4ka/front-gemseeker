import { array, number, object } from 'zod';

export const like = object({
  post_id: number(),
  token_id: number(),
  count: number(),
  users: array(number()),
});
