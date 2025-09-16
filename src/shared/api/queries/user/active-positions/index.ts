import { concurrency, createJsonQuery, declareParams, applyBarrier } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';
import { barriers } from 'shared/api/barriers';

export type ActivePositionsParams = Pagination & { address: string | null };

export const activePositions = createJsonQuery({
  params: declareParams<ActivePositionsParams>(),
  request: {
    credentials: 'include',
    method: 'GET',
    query: ({ offset, limit, address }) => ({ offset: offset || 0, limit: limit || 10, address: address ?? null }),
    url: baseUrl('/portfolio/active_positions'),
  },
  response: {
    contract: zodContract(contracts.transaction.activePosition),
    mapData: ({ result }) => result,
  },
});

applyBarrier(activePositions, { barrier: barriers.auth });

concurrency(activePositions, {
  strategy: 'TAKE_LATEST',
});
