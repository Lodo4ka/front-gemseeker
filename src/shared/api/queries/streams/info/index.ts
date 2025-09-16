import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { createFactory } from '@withease/factories';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';

export const info = createFactory(() => {
  const query = createJsonQuery({
    params: declareParams<string>(),
    request: {
      method: 'GET',
      credentials: 'include',
      url: (slug) => baseUrl(`/room/info/${slug}`),
    },
    response: {
      contract: zodContract(contracts.stream.info),
    },
  });

  concurrency(query, {
    strategy: 'TAKE_LATEST',
  });

  return query;
});
