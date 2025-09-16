import { applyBarrier, concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { barriers } from 'shared/api/barriers';
import { contracts } from 'shared/api/contracts';
import { paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';

type RefRewardHistoryQuery = paths['/api/user/ref_reward_history']['get'];
export type RefRewardHistoryParams = Partial<RefRewardHistoryQuery['parameters']['query']>;
export type RefRewardHistoryResponse = RefRewardHistoryQuery['responses'][200]['content']['application/json'];

export const refRewardHistory = createJsonQuery({
  params: declareParams<RefRewardHistoryParams>(),
  request: {
    method: 'GET',
    query: (params) => ({
      limit: params?.limit ?? 10,
      offset: params?.offset ?? 0,
    }),
    url: baseUrl('/user/ref_reward_history'),
    credentials: 'include',
  },
  response: {
    contract: zodContract(contracts.user.refRewardHistory),
  },
});

applyBarrier(refRewardHistory, { barrier: barriers.auth });

concurrency(refRewardHistory, {
  strategy: 'TAKE_LATEST',
});
