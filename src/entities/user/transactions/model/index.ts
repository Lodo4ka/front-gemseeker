import { invoke } from '@withease/factories';
import { createStore, sample } from 'effector';
import { $id } from '../../model';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { Transactions } from '../../types';

const limit = 10;

export const $transactions = createStore<Transactions | null>(null);
export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {limit});

sample({
  clock: $id,
  target: $transactions.reinit,
});

sample({
  clock: onLoadedFirst,
  source: $id,
  filter: Boolean,
  fn: (user_id) => ({ user_id, offset: 0, limit }),
  target: api.queries.user.transactions.refresh,
});

sample({
  clock: api.queries.user.transactions.finished.success,
  source: $transactions,
  fn: (transactions, { result }) => {
    if (transactions === null) return result;

    return [...transactions, ...result];
  },
  target: $transactions,
});

sample({
  clock: api.queries.user.transactions.finished.success,
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
  target: api.queries.user.transactions.refresh,
});
