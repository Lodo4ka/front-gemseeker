import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';

interface ByIdParams {
  post_id: number;
  from_id?: number | null;
}

export const byId = createJsonQuery({
  params: declareParams<ByIdParams>(),
  request: {
    method: 'GET',
    query: ({ post_id, from_id }) => ({
      post_id,
      from_id: from_id || null,
    }),
    url: baseUrl('/posts/get_post_by_id'),
  },
  response: {
    contract: zodContract(contracts.post.default),
  },
});

concurrency(byId, {
  strategy: 'TAKE_EVERY',
});
