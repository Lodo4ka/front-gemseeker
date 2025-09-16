import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';

export const limit = 10;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {limit});

sample({
  clock: api.queries.post.byFriends.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: $currentPage,
  fn: (offset) => ({ offset, limit }),
  target: api.queries.post.byFriends.refresh,
});

sample({
  clock: onLoadedFirst,
  fn: () => ({ offset: 0, limit }),
  target: api.queries.post.byFriends.refresh,
});
