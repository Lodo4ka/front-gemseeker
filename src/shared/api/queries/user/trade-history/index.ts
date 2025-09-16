import { concurrency, createJsonQuery, declareParams, applyBarrier } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';
import { barriers } from 'shared/api/barriers';

export type TradeHistoryParams = Pagination & { address: string | null };

export const tradeHistory = createJsonQuery({
  params: declareParams<TradeHistoryParams>(),
  request: {
    credentials: 'include',
    method: 'GET',
    query: ({ offset, limit, address }) => ({ offset: offset || 0, limit: limit || 10, address: address ?? null }),
    url: baseUrl('/portfolio/trade_history'),
  },
  response: {
    contract: zodContract(contracts.transaction.single),
    mapData: ({ result }) => result,
  },
});

applyBarrier(tradeHistory, { barrier: barriers.auth });

concurrency(tradeHistory, {
  strategy: 'TAKE_LATEST',
});
