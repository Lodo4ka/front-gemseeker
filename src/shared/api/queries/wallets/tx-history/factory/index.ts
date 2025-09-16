import { concurrency, applyBarrier, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { barriers } from 'shared/api/barriers';
import { createFactory } from '@withease/factories';

type AllParams = {
  offset: number;
  limit?: number;
  refresh?: boolean;
};

export const txHistoryFactory = createFactory(({ sorting_filter }: { sorting_filter: 'deposit' | 'withdraw' }) => {
  const txHistory = createJsonQuery({
    params: declareParams<AllParams>(),
    request: {
      method: 'GET',
      query: ({ offset, limit }) => ({
        offset,
        limit: limit || 10,
        sorting_filter,
      }),
      url: baseUrl('/wallets/tx_history'),
      credentials: 'include',
    },
    response: {
      contract: zodContract(contracts.wallets.txHistory),
    },
  });

  applyBarrier(txHistory, { barrier: barriers.auth });

  concurrency(txHistory, {
    strategy: 'TAKE_LATEST',
  });

  return txHistory;
});
