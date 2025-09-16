import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { $viewer } from 'shared/viewer';

export const limit = 10;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {limit});

sample({
  clock: api.queries.post.global.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: {
    offset: $currentPage,
    from_id: $viewer.map((viewer) => viewer?.user_id || null),
  },
  fn: ({ from_id, offset }) => ({ from_id, offset, limit }),
  target: api.queries.post.global.refresh,
});

sample({
  clock: onLoadedFirst,
  source: $viewer.map((viewer) => viewer?.user_id || null),
  fn: (from_id) => ({ from_id, offset: 0, limit }),
  target: api.queries.post.global.refresh,
});

sample({
  clock: api.mutations.post.create.finished.success,
  source: $currentPage,
  fn: (currentPage) => {
    if (currentPage === 0) return 0;
    return currentPage + 1;
  },
  target: $currentPage,
});
