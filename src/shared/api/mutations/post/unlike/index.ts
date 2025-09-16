import { createJsonMutation, declareParams } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { contracts } from 'shared/api/contracts';
import { zodContract } from '@farfetched/zod';

export const unlike = createJsonMutation({
  params: declareParams<number>(),
  request: {
    method: 'DELETE',
    url: baseUrl('/posts/unlike'),
    credentials: 'include',
    query: (post_id) => ({ post_id }),
  },
  response: {
    contract: zodContract(contracts.post.unlike),
  },
});
