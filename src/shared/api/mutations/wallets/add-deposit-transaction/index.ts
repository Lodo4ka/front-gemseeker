import { applyBarrier, createJsonMutation, declareParams, unknownContract } from '@farfetched/core';

import { baseUrl } from 'shared/lib/base-url';
import { barriers } from 'shared/api/barriers';

export const addDepositTransaction = createJsonMutation({
  params: declareParams<string>(),
  request: {
    method: 'POST',
    url: baseUrl('/wallets/add_deposit_transaction'),
    credentials: 'include',
    query: (signature) => ({ signature }),
  },
  response: {
    contract: unknownContract,
  },
});

applyBarrier(addDepositTransaction, { barrier: barriers.auth });
