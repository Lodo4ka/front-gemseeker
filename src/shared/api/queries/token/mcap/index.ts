import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';

export const mcap = createJsonQuery({
  params: declareParams<string>(),
  request: {
    method: 'GET',
    query: (spl_token_id_address) => ({ spl_token_id_address }),
    url: baseUrl('/token/stats'),
  },
  response: {
    contract: zodContract(contracts.token.mcapList),
  },
});

concurrency(mcap, {
  strategy: 'TAKE_LATEST',
});
