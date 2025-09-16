import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { $id } from 'entities/user';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { $activeTab } from '..';
import { refreshFactory } from 'shared/lib/refresh';
const limit = 10;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {
  limit,
});
export const {
  tick: refreshedTokensCreated,
  startedInterval: startedRefreshTokensCreated,
  stoppedInterval: stoppedRefreshTokensCreated,
} = invoke(refreshFactory);
sample({
  clock: onLoadedFirst,
  source: $id,
  filter: Boolean,
  fn: (user_id) => ({ user_id, offset: 0, limit }),
  target: api.queries.user.tokens.start,
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

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab === 4,
  target: startedRefreshTokensCreated,
});

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab !== 4,
  target: stoppedRefreshTokensCreated,
});

sample({
  clock: routes.profile.closed,
  target: stoppedRefreshTokensCreated,
});

sample({
  clock: refreshedTokensCreated,
  source: {
    user_id: $id,
    offset: $currentPage,
  },
  filter: ({ user_id }) => user_id != null,
  fn: ({ user_id, offset }) => ({ user_id, offset: 0, limit: offset + limit, refresh: true }),
  target: api.queries.user.tokens.start,
});
