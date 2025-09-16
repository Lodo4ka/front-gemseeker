import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';
import { array } from 'zod';

interface ByTokenProps extends Pagination {
  token_id: number;
}

export const byToken = createJsonQuery({
  params: declareParams<ByTokenProps>(),
  request: {
    method: 'GET',
    query: ({ token_id, offset, limit }) => ({ token_id, offset: offset || 0, limit: limit || 10 }),
    url: baseUrl('/threads/token_thread'),
  },
  response: {
    contract: zodContract(array(contracts.thread.single)),
  },
});

concurrency(byToken, {
  strategy: 'TAKE_LATEST',
});
