import { concurrency, createJsonQuery } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';

export const generateNonce = createJsonQuery({
  request: {
    method: 'GET',
    url: baseUrl('/user/nonce'),
  },
  response: {
    contract: zodContract(contracts.user.generateNonce),
    mapData: ({ result }) => result.nonce,
  },
});

concurrency(generateNonce, {
  strategy: 'TAKE_LATEST',
});
