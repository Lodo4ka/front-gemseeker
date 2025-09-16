import { invoke } from '@withease/factories';
import { createStore, sample } from 'effector';
import { $id } from '../../model';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { TokenCreated } from '../../types';
const limit = 10;

export const $tokensCreated = createStore<TokenCreated[] | null>(null);
export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {limit});

sample({
  clock: $id,
  target: $tokensCreated.reinit,
});

sample({
  clock: onLoadedFirst,
  source: $id,
  filter: Boolean,
  fn: (user_id) => ({ user_id, offset: 0, limit }),
  target: api.queries.user.tokens.start,
});

sample({
  clock: api.queries.user.tokens.finished.success,
  source: $tokensCreated,
  fn: (tokensCreated, { result }) => {
    if (tokensCreated === null) return result;

    return [...tokensCreated, ...result];
  },
  target: $tokensCreated,
});

sample({
  clock: api.queries.user.tokens.finished.success,
  source: $tokensCreated,
  filter: (tokensCreated) => tokensCreated === null,
  fn: (_, { result }) => result,
  target: $tokensCreated,
});

sample({
  clock: api.queries.user.tokens.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: {
    user_id: $id,
    offset: $currentPage,
  },
  filter: ({ user_id }) => user_id !== null,
  fn: ({ user_id, offset }) => ({ user_id, offset, limit }),
  target: api.queries.user.tokens.refresh,
});
