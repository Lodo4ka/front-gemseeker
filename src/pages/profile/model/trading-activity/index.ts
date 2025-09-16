import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { $id } from 'entities/user';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { refreshFactory } from 'shared/lib/refresh';
import { $activeTab } from '..';
import { routes } from 'shared/config/router';

const limit = 200;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {
  limit,
});
export const {
  tick: refreshedTradingActivity,
  startedInterval: startedRefreshTradingActivity,
  stoppedInterval: stoppedRefreshTradingActivity,
} = invoke(refreshFactory);
sample({
  clock: onLoadedFirst,
  source: $id,
  filter: Boolean,
  fn: (user_id) => ({ user_id, offset: 0, limit }),
  target: api.queries.user.tradingActivity.start,
});

sample({
  clock: api.queries.user.tradingActivity.finished.success,
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
  target: api.queries.user.tradingActivity.refresh,
});

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab === 5,
  target: startedRefreshTradingActivity,
});

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab !== 5,
  target: stoppedRefreshTradingActivity,
});

sample({
  clock: routes.profile.closed,
  target: stoppedRefreshTradingActivity,
});

sample({
  clock: refreshedTradingActivity,
  source: {
    user_id: $id,
    offset: $currentPage,
  },
  filter: ({ user_id }) => user_id != null,
  fn: ({ user_id, offset }) => ({ user_id, offset: 0, limit: offset + limit, refresh: true }),
  target: api.queries.user.tradingActivity.start,
});
