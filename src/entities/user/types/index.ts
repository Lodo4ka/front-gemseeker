import { infer as types } from 'zod';
import { contracts } from 'shared/api/contracts';
import { Column } from 'shared/ui/table';
import { components } from 'shared/client';

export type UserMini = types<typeof contracts.user.user_mini>;
export type UserMiniCol = Column<UserMini>;
export type User = types<typeof contracts.user.profile>;

export type Transactions = types<typeof contracts.user.transactions>;
export type TransactionsCol = Column<Transactions>;
export type TransactionByUser = types<typeof contracts.transaction.byUser>;
export type TransactionByUserCol = Column<TransactionByUser>;

export type TokenCreated = types<typeof contracts.token.created>;
export type TokenCreatedCol = Column<TokenCreated>;

export type MostProfitable = components['schemas']['MostProfitableResponse']['stat'][0];
export type MostProfitableCol = Column<MostProfitable>;

export type ActivePosition = components['schemas']['ActivePositionsResponse']['positions'][0];
export type ActivePositionCol = Column<ActivePosition>;

export type TradesHistory = components['schemas']['TradeHistoryResponse']['transactions'][0];
export type TradesHistoryCol = Column<TradesHistory>;

export type PnlPeriodValues = '1d' | '1w' | '1m' | '3m' | '1y' | 'All';
export type PnlPeriodKeys = 1 | 7 | 30 | 90 | 365 | 'All';

export type PnlPeriod = types<typeof contracts.user.pnl> | null;

export type TradingActivity = components['schemas']['VolumeDailyResponse'];
