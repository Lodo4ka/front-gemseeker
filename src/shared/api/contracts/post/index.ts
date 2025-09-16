import { all, allObject } from './all';
import { single } from './default';
import { like } from './like';
import { unlike } from './unlike';

export const post = {
  default: single,
  all,
  allObject,
  like,
  unlike,
};
