import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { array } from 'zod';
import { contracts, paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';

type LeaderboardTop100Query = paths['/api/leaderboard/top100']['get'];
export type LeaderboardTop100Params = Partial<LeaderboardTop100Query['parameters']['query']>;
export type LeaderboardTop100Response = LeaderboardTop100Query['responses'][200]['content']['application/json'];

export const top100 = createJsonQuery({
  params: declareParams<LeaderboardTop100Params>(),
  request: {
    url: baseUrl('/leaderboard/top100'),
    method: 'GET',
    // offset, limit
    query: (props) => ({
      sort_field: props?.sort_field,
      //   limit: limit || 10,
      //   offset: offset || 0,
    }),
  },
  response: {
    contract: zodContract(array(contracts.LeaderboardResponse)),
    mapData: ({ result }) => result,
  },
});

concurrency(top100, {
  strategy: 'TAKE_LATEST',
});
