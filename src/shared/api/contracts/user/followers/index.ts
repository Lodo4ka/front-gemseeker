import { object, array } from 'zod';
import { user_mini } from '../profile';

export const followers = object({
  subscribers: array(user_mini),
});
