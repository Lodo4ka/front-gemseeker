import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';

interface TransactionsProps extends Pagination {
  user_id: number;
}

export const transactions = createJsonQuery({
  params: declareParams<TransactionsProps>(),
  request: {
    method: 'GET',
    query: ({ offset, limit, user_id }) => ({ offset: offset || 0, limit: limit || 10, user_id }),
    url: baseUrl('/user/transactions'),
  },
  response: {
    contract: zodContract(contracts.user.transactions),
  },
});

concurrency(transactions, {
  strategy: 'TAKE_LATEST',
});
