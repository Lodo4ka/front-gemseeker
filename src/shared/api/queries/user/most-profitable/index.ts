import { concurrency, createJsonQuery, declareParams, applyBarrier } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';
import { barriers } from 'shared/api/barriers';

export type MostProfitableParams = Pagination & { address: string | null };

export const mostProfitable = createJsonQuery({
  params: declareParams<MostProfitableParams>(),
  request: {
    credentials: 'include',
    method: 'GET',
    query: ({ offset, limit, address }) => ({ offset: offset || 0, limit: limit || 10, address: address ?? null }),
    url: baseUrl('/portfolio/most_profitable'),
  },
  response: {
    contract: zodContract(contracts.user.mostProfitable),
    mapData: ({ result }) => result,
  },
});

applyBarrier(mostProfitable, { barrier: barriers.auth });

concurrency(mostProfitable, {
  strategy: 'TAKE_LATEST',
});
