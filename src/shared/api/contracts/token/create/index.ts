import { number, object, string } from 'zod';

export const create = object({
  address: string(),
  json_link: string(),
  id: number(),
});
