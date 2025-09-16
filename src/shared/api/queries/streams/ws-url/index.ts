import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { createFactory } from '@withease/factories';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';

export const wsUrl = createFactory(() => {
  const query = createJsonQuery({
    params: declareParams<string>(),
    request: {
      method: 'GET',
      query: (slug) => ({ slug }),
      credentials: 'include',
      url: baseUrl('/room/ws_url'),
    },
    response: {
      contract: zodContract(contracts.stream.wsUrl),
      mapData: ({ result }) => result.ws_url,
    },
  });

  concurrency(query, {
    strategy: 'TAKE_LATEST',
  });

  return query;
});
