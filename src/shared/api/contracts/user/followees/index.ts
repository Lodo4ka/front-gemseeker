import { object, array } from 'zod';
import { user_mini } from '../profile';

export const followees = object({
  followees: array(user_mini),
});
