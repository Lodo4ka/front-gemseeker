import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';

interface GlobalParams extends Pagination {
  from_id?: number | null;
}

export const global = createJsonQuery({
  params: declareParams<GlobalParams>(),
  request: {
    method: 'GET',
    query: ({ offset, from_id, limit }) => ({
      offset: offset || 0,
      from_id: from_id || null,
      limit: limit || 10,
    }),
    url: baseUrl('/posts/global'),
  },
  response: {
    contract: zodContract(contracts.post.allObject),
    mapData: ({ result }) => result.posts,
  },
});

concurrency(global, {
  strategy: 'TAKE_EVERY',
});
