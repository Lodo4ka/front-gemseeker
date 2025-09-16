import { createJsonMutation, declareParams } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/client';
import { array } from 'zod';

export const view = createJsonMutation({
  params: declareParams<number[]>(),
  request: {
    method: 'POST',
    url: baseUrl('/posts/update_views'),
    credentials: 'include',
    body: (data) => data,
  },
  response: {
    contract: zodContract(array(contracts.PostViewsPair)),
  },
});
