import { number, object, string } from 'zod';

export const create = object({
  id: number(),
  public_key: string(),
  private_key: string(),
});
