import { createJsonMutation, unknownContract } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';

export const refreshToken = createJsonMutation({
  request: {
    method: 'POST',
    url: baseUrl('/user/refresh'),
    credentials: 'include',
  },
  response: {
    contract: unknownContract,
  },
});
