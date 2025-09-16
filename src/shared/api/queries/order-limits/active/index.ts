import { applyBarrier, concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { array } from 'zod';
import { contracts, paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';
import { barriers } from 'shared/api/barriers';

type LimitOrdersActiveQuery = paths['/api/limit-orders/active']['get'];
export type LimitOrdersActiveParams = Partial<LimitOrdersActiveQuery['parameters']['query']>;
export type LimitOrdersActiveResponse = LimitOrdersActiveQuery['responses'][200]['content']['application/json'];

export const active = createJsonQuery({
  params: declareParams<LimitOrdersActiveParams>(),
  request: {
    url: baseUrl('/limit-orders/active'),
    method: 'GET',
    credentials: 'include',
    query: (props) => ({
      ...props,
    }),
  },
  response: {
    contract: zodContract(array(contracts.LimitOrderOut)),
    mapData: ({ result }) => result,
  },
});

concurrency(active, {
  strategy: 'TAKE_LATEST',
});

applyBarrier(active, { barrier: barriers.auth });
