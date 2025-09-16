import { applyBarrier, createJsonMutation, unknownContract } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { barriers } from 'shared/api/barriers';

export const deleteStream = createJsonMutation({
  request: {
    method: 'POST',
    url: baseUrl('/room/delete'),
    credentials: 'include',
  },
  response: {
    contract: unknownContract,
  },
});

applyBarrier(deleteStream, { barrier: barriers.auth });
