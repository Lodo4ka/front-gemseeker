import { post } from './post';
import { token } from './token';
import { user } from './user';
import { wallets } from './wallets';
import { stream } from './stream';
import { thread } from './thread';
import { orderLimits } from './order-limits';

export const mutations = {
  user,
  wallets,
  token,
  post,
  thread,
  stream,
  orderLimits
};
