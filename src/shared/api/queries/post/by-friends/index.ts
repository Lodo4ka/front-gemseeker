import { applyBarrier, concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { barriers } from 'shared/api/barriers';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';

import { Pagination } from 'shared/types';

export const byFriends = createJsonQuery({
  params: declareParams<Pagination>(),
  request: {
    method: 'GET',
    credentials: 'include',
    query: ({ offset, limit }) => ({
      offset: offset || 0,
      limit: limit || 10,
    }),
    url: baseUrl('/posts/posts_by_user_subscriptions'),
  },
  response: {
    contract: zodContract(contracts.post.allObject),
    mapData: ({ result }) => result.posts,
  },
});

concurrency(byFriends, {
  strategy: 'TAKE_EVERY',
});

applyBarrier(byFriends, { barrier: barriers.auth });
