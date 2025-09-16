import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';

type HoldersStatusQuery = paths['/api/token/holders/status']['get'];
export type HoldersStatusResponse = HoldersStatusQuery['responses'][200]['content']['application/json'];


export const holdersStatus = createJsonQuery({
  params: declareParams<string>(),
  request: {
    method: 'GET',
    query: (address) => ({ address }),
    url: baseUrl('/token/holders/status'),
  },
  response: {
    contract: zodContract(contracts.token.holdersStatus),
  },
});

concurrency(holdersStatus, {
  strategy: 'TAKE_LATEST',
});
