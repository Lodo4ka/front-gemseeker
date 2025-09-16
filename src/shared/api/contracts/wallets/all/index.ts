import { array, boolean, number, object, string } from 'zod';

export const wallet = object({
  id: number(),
  name: string(),
  public_key: string(),
  holdings: number(),
  is_active: boolean(),
  is_archived: boolean(),
});

export const all = array(wallet);
