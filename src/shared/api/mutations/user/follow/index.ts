import { applyBarrier, createJsonMutation, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { barriers } from 'shared/api/barriers';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';

export const follow = createJsonMutation({
  params: declareParams<number>(),
  request: {
    method: 'POST',
    url: baseUrl('/subscriptions/subscribe'),
    query: (followee_id) => ({ followee_id }),
    credentials: 'include',
  },
  response: {
    contract: zodContract(contracts.user.followee_mini),
  },
});
applyBarrier(follow, { barrier: barriers.auth });
