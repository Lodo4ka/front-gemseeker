import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';

interface ByUserParams extends Pagination {
  user_id: number;
  from_id?: number | null;
}

export const byUser = createJsonQuery({
  params: declareParams<ByUserParams>(),
  request: {
    method: 'GET',
    query: ({ user_id, offset, from_id, limit }) => ({
      user_id,
      offset: offset || 0,
      from_id: from_id || null,
      limit: limit || 10,
    }),
    url: baseUrl('/posts/get_posts_by_user'),
  },
  response: {
    contract: zodContract(contracts.post.allObject),
    mapData: ({ result }) => result.posts,
  },
});

concurrency(byUser, {
  strategy: 'TAKE_EVERY',
});
