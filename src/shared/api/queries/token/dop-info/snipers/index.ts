import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { unknownContract } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';

export const snipers = createJsonQuery({
  params: declareParams<string>(),
  request: {
    method: 'GET',
    url: (address) => baseUrl(`/token/snipers/${address}`),
  },
  response: {
    contract: unknownContract,
    mapData: ({ result }: any) => {
      return result.result.length;
    },
  },
});

concurrency(snipers, {
  strategy: 'TAKE_EVERY',
});
