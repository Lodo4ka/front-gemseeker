import { applyBarrier, concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { barriers } from 'shared/api/barriers';
import { contracts } from 'shared/api/contracts';
import { paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';

type TokenSingleQuery = paths['/api/token']['get'];
export type TokenSingleResponse = TokenSingleQuery['responses'][200]['content']['application/json'];

export const single = createJsonQuery({
  params: declareParams<string>(),
  request: {
    method: 'GET',
    query: (address) => ({ address }),
    credentials: 'include',
    url: baseUrl('/token'),
  },
  response: {
    contract: zodContract(contracts.token.single),
  },
});

applyBarrier(single, { barrier: barriers.auth });

concurrency(single, {
  strategy: 'TAKE_LATEST',
});
