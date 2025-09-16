import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';

interface FolloweesProps extends Pagination {
  user_id: number;
}

export const followees = createJsonQuery({
  params: declareParams<FolloweesProps>(),
  request: {
    method: 'GET',
    query: ({ user_id, offset, limit }) => ({ user_id, offset: offset || 0, limit: limit || 10 }),
    url: baseUrl('/subscriptions/followees_list'),
  },
  response: {
    contract: zodContract(contracts.user.followees),
    mapData: (data) => data.result.followees,
  },
});

concurrency(followees, {
  strategy: 'TAKE_LATEST',
});
