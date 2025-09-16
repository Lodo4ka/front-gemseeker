import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
export type TotalPlnParams = { user_id: number; address: string | null };

export const totalPln = createJsonQuery({
  params: declareParams<TotalPlnParams>(),
  request: {
    method: 'GET',
    url: baseUrl('/portfolio/pnl_statistics_all'),
    query: ({ user_id, address }) => ({ user_id, address: address ?? null }),
  },
  response: {
    contract: zodContract(contracts.user.pnl),
  },
});

concurrency(totalPln, {
  strategy: 'TAKE_LATEST',
});
