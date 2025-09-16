import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';

export const limit = 15;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {
  limit,
});

sample({
  clock: api.queries.streams.list.finished.success,
  filter: ({ params }) => params.sorting_filter === 'token_stream',
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: $currentPage,
  fn: (offset) => ({ offset, limit, sorting_filter: 'token_stream' as const }),
  target: api.queries.streams.list.refresh,
});

sample({
  clock: onLoadedFirst,
  fn: () => ({ offset: 0, limit, sorting_filter: 'token_stream' as const }),
  target: api.queries.streams.list.refresh,
});
