import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';

export type PnlByPeriodParams = { user_id: number; delta: number; address: string | null };

export const pnlByPeriod = createJsonQuery({
  params: declareParams<PnlByPeriodParams>(),
  request: {
    method: 'GET',
    url: baseUrl('/portfolio/pnl_statistics_by_period'),
    query: ({ user_id, delta, address }) => ({ user_id, delta, address: address ?? null }),
  },
  response: {
    contract: zodContract(contracts.user.pnl),
  },
});

concurrency(pnlByPeriod, {
  strategy: 'TAKE_LATEST',
});
