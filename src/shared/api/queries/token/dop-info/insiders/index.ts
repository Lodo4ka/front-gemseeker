import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { unknownContract } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';

export const insiders = createJsonQuery({
  params: declareParams<string>(),
  request: {
    method: 'GET',
    url: (address) => baseUrl(`/token/insiders/${address}`),
  },
  response: {
    contract: unknownContract,
    mapData: ({ result }: any) => {
      return result.length;
    },
  },
});

concurrency(insiders, {
  strategy: 'TAKE_EVERY',
});
