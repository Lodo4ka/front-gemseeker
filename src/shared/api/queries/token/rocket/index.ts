import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';

import { contracts } from 'shared/api/contracts';
import { paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';

type RocketQuery = paths['/api/token/on_the_rocket']['get'];
type RocketParams = Partial<RocketQuery['parameters']['query']>;
export type RocketResponse = RocketQuery['responses'][200]['content']['application/json'];

export const rocket = createJsonQuery({
  params: declareParams<RocketParams>(),
  request: {
    url: baseUrl('/token/on_the_rocket'),
    method: 'GET',
    query: (props) => ({
      show_nsfw: props?.show_nsfw ?? false,
    }),
  },
  response: {
    contract: zodContract(contracts.token.rocket),
    mapData: ({ result }) => result,
  },
});

concurrency(rocket, {
  strategy: 'TAKE_LATEST',
});
