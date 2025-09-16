import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { $id } from 'entities/user';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { refreshFactory } from 'shared/lib/refresh';
import { $activeTab } from '..';
import { routes } from 'shared/config/router';
const limit = 10;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {
  limit,
});
export const {
  tick: refreshedTransactions,
  startedInterval: startedRefreshTransactions,
  stoppedInterval: stoppedRefreshTransactions,
} = invoke(refreshFactory);
sample({
  clock: onLoadedFirst,
  source: $id,
  filter: Boolean,
  fn: (user_id) => ({ user_id, offset: 0, limit }),
  target: api.queries.user.transactions.refresh,
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

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab === 3,
  target: startedRefreshTransactions,
});

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab !== 3,
  target: stoppedRefreshTransactions,
});

sample({
  clock: routes.profile.closed,
  target: stoppedRefreshTransactions,
});

sample({
  clock: refreshedTransactions,
  source: {
    user_id: $id,
    offset: $currentPage,
  },
  filter: ({ user_id }) => user_id != null,
  fn: ({ user_id, offset }) => ({ user_id, offset: 0, limit: offset + limit, refresh: true }),
  target: api.queries.user.transactions.start,
});
