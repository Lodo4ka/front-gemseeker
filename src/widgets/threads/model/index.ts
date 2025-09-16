import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { $tokenId } from 'entities/token';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';

export const limit = 10;
export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {limit});

sample({
  clock: api.queries.thread.byToken.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: {
    offset: $currentPage,
    // from_id: $viewer.map((viewer) => viewer?.user_id || null),
    token_id: $tokenId,
  },
  filter: ({ token_id }) => token_id !== null,
  fn: ({ offset, token_id }) => ({ offset, limit, token_id: token_id! }),
  target: api.queries.thread.byToken.refresh,
});

sample({
  clock: onLoadedFirst,
  source: $tokenId,
  filter: Boolean,
  fn: (token_id) => ({ token_id }),
  target: api.queries.thread.byToken.refresh,
});

sample({
  clock: api.mutations.thread.create.finished.success,
  source: $currentPage,
  fn: (currentPage) => {
    if (currentPage === 0) return 0;
    return currentPage + 1;
  },
  target: $currentPage,
});
