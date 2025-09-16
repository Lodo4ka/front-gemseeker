import { createJsonMutation, declareParams } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { contracts } from 'shared/api/contracts';
import { zodContract } from '@farfetched/zod';

export const like = createJsonMutation({
  params: declareParams<number>(),
  request: {
    method: 'POST',
    url: baseUrl('/posts/like'),
    credentials: 'include',
    query: (post_id) => ({ post_id }),
  },
  response: {
    contract: zodContract(contracts.post.like),
  },
});
