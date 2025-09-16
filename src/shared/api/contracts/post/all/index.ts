import { array, object } from 'zod';
import { single } from '../default';

export const all = array(single);
export const allObject = object({
  posts: all,
});
