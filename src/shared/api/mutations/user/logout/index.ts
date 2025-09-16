import { createJsonMutation, unknownContract } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';

export const logout = createJsonMutation({
  request: {
    method: 'POST',
    url: baseUrl('/user/logout'),
    credentials: 'include',
  },
  response: {
    contract: unknownContract,
  },
});
