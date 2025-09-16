import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { createFactory } from '@withease/factories';
import { contracts } from 'shared/api/contracts';
import { components, paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';

type RecentQuery = paths['/api/tx/recent']['get'];
export type RecentParams = Partial<RecentQuery['parameters']['query']>;
export type RecentResponse = RecentQuery['responses'][200]['content']['application/json'];
export type EventsRecentTx = components['schemas']['RecentTxResponse']['type'];

interface ListFactoryProps {
  show_events: EventsRecentTx[];
}

export const listFactory = createFactory(({ show_events }: ListFactoryProps) => {
  const recent = createJsonQuery({
    params: declareParams<RecentParams>(),
    request: {
      url: baseUrl('/tx/recent'),
      method: 'GET',
      query: (params) => ({
        limit: params?.limit ?? 3,
        show_events: params?.show_events ?? show_events,
        show_nsfw: params?.show_nsfw ?? false,
      }),
    },
    response: {
      contract: zodContract(contracts.transaction.recent),
      mapData: ({ result }) => result,
    },
  });

  concurrency(recent, {
    strategy: 'TAKE_LATEST',
  });

  return recent;
});
