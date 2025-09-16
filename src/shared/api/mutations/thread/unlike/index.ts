import { createJsonMutation, declareParams } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { contracts } from 'shared/api/contracts';
import { zodContract } from '@farfetched/zod';

export const unlike = createJsonMutation({
  params: declareParams<{ id: number; token_id: number }>(),
  request: {
    method: 'DELETE',
    url: baseUrl('/threads/unlike'),
    credentials: 'include',
    query: ({ id }) => ({ post_id: id }),
  },
  response: {
    contract: zodContract(contracts.thread.like),
  },
});
