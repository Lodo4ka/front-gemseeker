import { generateNonce } from './generate-nonce';
import { me } from './me';
import { profile } from './profile';
import { followers } from './followers';
import { followees } from './followees';
import { tokens } from './tokens';
import { transactions } from './transactions';
import { referrals } from './referrals';
import { refRewardHistory } from './ref-reward-history';
import { tradeHistory } from './trade-history';
import { activePositions } from './active-positions';
import { pnlByPeriod } from './pnl-by-period';
import { totalPln } from './total-pnl';
import { mostProfitable } from './most-profitable';
import { tradingActivity } from './trading-activity';

export const user = {
  generateNonce,
  me,
  profile,
  referrals,
  refRewardHistory,
  followers,
  tokens,
  transactions,
  tradeHistory,
  tradingActivity,
  followees,
  activePositions,
  pnlByPeriod,
  mostProfitable,
  totalPln,
};
