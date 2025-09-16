import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';
import { array } from 'zod';

interface HistoryParams extends Pagination {
  slug: string;
}

export const history = createJsonQuery({
  params: declareParams<HistoryParams>(),
  request: {
    method: 'GET',
    query: ({ offset, limit }) => ({
      offset: offset || 0,
      limit: limit || 20,
    }),
    url: ({ slug }) => baseUrl(`/chat/${slug}`),
  },
  response: {
    contract: zodContract(array(contracts.chat.message)),
  },
});

concurrency(history, {
  strategy: 'TAKE_LATEST',
});
