import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';

export interface TradingActivityProps extends Pagination {
  user_id: number;
}

export const tradingActivity = createJsonQuery({
  params: declareParams<TradingActivityProps>(),
  request: {
    method: 'GET',
    query: ({ user_id, offset, limit }) => ({ user_id, offset: offset || 0, limit: limit || 100 }),
    url: baseUrl('/user/user_activity'),
    credentials: 'include',
  },
  response: {
    contract: zodContract(contracts.user.tradingActivity),
  },
});

concurrency(tradingActivity, {
  strategy: 'TAKE_LATEST',
});
