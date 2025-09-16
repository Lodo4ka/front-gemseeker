import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';

interface TokensProps extends Pagination {
  user_id: number;
}

export const tokens = createJsonQuery({
  params: declareParams<TokensProps>(),
  request: {
    method: 'GET',
    query: ({ offset, limit, user_id }) => ({ offset: offset || 0, limit: limit || 10, user_id }),
    url: baseUrl('/user/spl_tokens'),
  },
  response: {
    contract: zodContract(contracts.user.tokens),
  },
});

concurrency(tokens, {
  strategy: 'TAKE_LATEST',
});
