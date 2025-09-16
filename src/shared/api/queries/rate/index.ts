import { concurrency, createJsonQuery } from '@farfetched/core';
import { contracts } from 'shared/api/contracts';
import { zodContract } from '@farfetched/zod';

export const rate = createJsonQuery({
  request: {
    method: 'GET',
    url: 'https://lite-api.jup.ag/price/v3?ids=So11111111111111111111111111111111111111112',
  },
  response: {
    contract: zodContract(contracts.rate),
    mapData: ({ result }) => result.So11111111111111111111111111111111111111112.usdPrice,
  },
});

concurrency(rate, {
  strategy: 'TAKE_LATEST',
});
