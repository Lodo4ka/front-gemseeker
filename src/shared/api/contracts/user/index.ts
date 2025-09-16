import { me } from './me';
import { generateNonce } from './generate-nonce';
import { profile, user_mini, followee_mini } from './profile';
import { followers } from './followers';
import { followees } from './followees';
import { tokens } from './tokens';
import { transactions } from './transactions';
import { refRewardHistory } from './ref-reward-history';
import { referrals } from './referrals';
import { pnl, pnlInfo } from './pnl';
import { mostProfitable } from './most-profitable';
import { tradingActivity } from './trading-activity';

export const user = {
  generateNonce,
  me,
  tokens,
  transactions,
  user_mini,
  profile,
  followers,
  followee_mini,
  followees,
  tradingActivity,
  mostProfitable,
  refRewardHistory,
  referrals,
  pnl,
  pnlInfo,
};
