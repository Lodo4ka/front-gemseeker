import { invoke } from '@withease/factories';
import { createStore, sample } from 'effector';
import { $id } from '../../model';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { UserMini } from '../../types';

const limit = 10;

export const $followees = createStore<UserMini[] | null>(null);
export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {limit});

sample({
  clock: $id,
  target: $followees.reinit,
});

sample({
  clock: onLoadedFirst,
  source: $id,
  filter: Boolean,
  fn: (user_id) => ({ user_id, offset: 0, limit }),
  target: api.queries.user.followees.refresh,
});

sample({
  clock: api.queries.user.followees.finished.success,
  source: $followees,
  fn: (followees, { result }) => {
    if (followees === null) return result;

    return [...followees, ...result];
  },
  target: $followees,
});

sample({
  clock: api.queries.user.followees.finished.success,
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
  target: api.queries.user.followees.refresh,
});
