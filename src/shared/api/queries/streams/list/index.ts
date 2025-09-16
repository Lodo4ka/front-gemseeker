import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';

type ListQuery = paths['/api/room/list']['get'];
type ListParams = Partial<ListQuery['parameters']['query']>;

export const list = createJsonQuery({
  params: declareParams<ListParams & { refresh?: boolean }>(),
  request: {
    url: baseUrl('/room/list'),
    method: 'GET',
    query: (props) => ({
      sorting_filter: props?.sorting_filter || 'all_streams',
      limit: props?.limit || 15,
      offset: props?.offset || 0,
      show_nsfw: props?.show_nsfw || false,
    }),
  },
  response: {
    contract: zodContract(contracts.stream.list),
  },
});

concurrency(list, {
  strategy: 'TAKE_EVERY',
});
