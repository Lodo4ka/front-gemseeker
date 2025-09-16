import { applyBarrier, concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { barriers } from 'shared/api/barriers';
import { paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';

type RefferalsQuery = paths['/api/user/referrals']['get'];
export type RefferalsParams = Partial<RefferalsQuery['parameters']['query']>;
export type RefferalsResponse = RefferalsQuery['responses'][200]['content']['application/json'];

export const referrals = createJsonQuery({
  params: declareParams<RefferalsParams>(),
  request: {
    method: 'GET',
    url: baseUrl('/user/referrals'),
    credentials: 'include',
  },
  response: {
    contract: zodContract(contracts.user.referrals),
  },
});

applyBarrier(referrals, { barrier: barriers.auth });

concurrency(referrals, {
  strategy: 'TAKE_LATEST',
});
