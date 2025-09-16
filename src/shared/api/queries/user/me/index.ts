import { applyBarrier, concurrency, createJsonQuery } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { barriers } from 'shared/api/barriers';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';

export const me = createJsonQuery({
  request: {
    method: 'GET',
    url: baseUrl('/user/me'),
    credentials: 'include',
  },
  response: {
    contract: zodContract(contracts.user.me),
  },
});

applyBarrier(me, { barrier: barriers.auth });

concurrency(me, {
  strategy: 'TAKE_LATEST',
});
