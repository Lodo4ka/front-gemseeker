import { rate } from './rate';
import { post } from './post';
import { user } from './user';
import { wallets } from './wallets';
import { token } from './token';
import { streams } from './streams';
import { transaction } from './transaction';
import { thread } from './thread';
import { leaderboard } from './leaderboard';
import { chat } from './chat';
import { orderLimits } from './order-limits';

export const queries = {
  user,
  token,
  rate,
  post,
  wallets,
  streams,
  transaction,
  thread,
  chat,
  leaderboard,
  orderLimits,
};
