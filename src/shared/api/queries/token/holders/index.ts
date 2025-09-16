import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';

export interface HoldersParams extends Pagination {
  address: string;
}

export const holders = createJsonQuery({
  params: declareParams<HoldersParams>(),
  request: {
    method: 'GET',
    query: ({ address, offset, limit }) => ({ spl_token_id_address: address, offset: offset || 0, limit: limit || 10 }),
    url: baseUrl('/token/holders'),
  },
  response: {
    contract: zodContract(contracts.token.holders),
  },
});

concurrency(holders, {
  strategy: 'TAKE_LATEST',
});
