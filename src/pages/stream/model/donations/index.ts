import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { $slug } from 'entities/stream';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';

export const limit = 10;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {
  limit,
});

sample({
  clock: api.queries.streams.donations.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: {
    offset: $currentPage,
    slug: $slug,
  },
  filter: ({ slug }) => slug !== null,
  fn: ({ offset, slug }) => ({ offset, limit, slug: slug as string }),
  target: api.queries.streams.donations.refresh,
});

sample({
  clock: api.mutations.stream.donate.finished.success,
  source: $currentPage,
  fn: (currentPage) => currentPage + 1,
  target: $currentPage,
});
