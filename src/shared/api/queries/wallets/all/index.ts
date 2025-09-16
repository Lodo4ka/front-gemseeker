import { concurrency, applyBarrier, createJsonQuery } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { barriers } from 'shared/api/barriers';

export const all = createJsonQuery({
  request: {
    method: 'GET',
    url: baseUrl('/wallets'),
    credentials: 'include',
  },
  response: {
    contract: zodContract(contracts.wallets.all),
  },
});

applyBarrier(all, { barrier: barriers.auth });

concurrency(all, {
  strategy: 'TAKE_LATEST',
});
