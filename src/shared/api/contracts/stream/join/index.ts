import { boolean, object, string } from 'zod';

export const join = object({
  url: string(),
  access_token: string(),
  slug: string(),
  room_name: string(),
  is_creator: boolean(),
});
