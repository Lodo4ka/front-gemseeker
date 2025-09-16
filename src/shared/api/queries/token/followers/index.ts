import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';

interface FollowersProps extends Pagination {
  user_id: number;
}

export const followers = createJsonQuery({
  params: declareParams<FollowersProps>(),
  request: {
    method: 'GET',
    query: ({ user_id, offset, limit }) => ({ user_id, offset: offset || 0, limit: limit || 10 }),
    url: baseUrl('/subscriptions/subscribers_list'),
  },
  response: {
    contract: zodContract(contracts.user.followers),
    mapData: (data) => data.result.subscribers,
  },
});

concurrency(followers, {
  strategy: 'TAKE_LATEST',
});
