import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';

type FavouritesQuery = paths['/api/token/favourite']['get'];
export type FavouritesResponse = FavouritesQuery['responses'][200]['content']['application/json'];

export const favourites = createJsonQuery({
  params: declareParams(),
  request: {
    method: 'GET',
    url: baseUrl('/token/favourite'),
    credentials: 'include',
  },
  response: {
    contract: zodContract(contracts.token.favourites),
  },
});

concurrency(favourites, {
  strategy: 'TAKE_LATEST',
});
