import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { openedGenerateWalletModal } from 'features/generate-wallet';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { refreshFactory } from 'shared/lib/refresh';
import { chainAuthenticated, $viewer } from 'shared/viewer';
import { $friendsCurrentPage, $globalCurrentPage } from 'widgets/posts';

export const currentRoute = routes.posts;

export const anonymousRoute = chainAuthenticated(currentRoute, {
  otherwise: openedGenerateWalletModal,
});

export const $activeTab = createStore<number>(0);
export const changedActiveTab = createEvent<number>();

sample({
  clock: changedActiveTab,
  target: $activeTab,
});

const {
  startedInterval: startedRefreshGlobal,
  stoppedInterval: stoppedRefreshGlobal,
  tick: refreshedGlobal,
} = invoke(refreshFactory);

const {
  startedInterval: startedRefreshFriends,
  stoppedInterval: stoppedRefreshFriends,
  tick: refreshedFriends,
} = invoke(refreshFactory);

sample({
  clock: anonymousRoute.opened,
  target: startedRefreshGlobal,
});

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab === 0,
  target: [startedRefreshGlobal, stoppedRefreshFriends],
});

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab === 1,
  target: [stoppedRefreshGlobal, startedRefreshFriends],
});

sample({
  clock: anonymousRoute.closed,
  target: [stoppedRefreshGlobal, stoppedRefreshFriends],
});

sample({
  clock: refreshedGlobal,
  source: {
    offset: $globalCurrentPage,
    from_id: $viewer.map((viewer) => viewer?.user_id || null),
  },
  fn: ({ offset, from_id }) => ({ offset: 0, from_id, limit: offset + 10, refresh: true }),
  target: api.queries.post.global.start,
});

sample({
  clock: refreshedFriends,
  source: $friendsCurrentPage,
  fn: (offset) => ({ offset: 0, limit: offset + 10, refresh: true }),
  target: api.queries.post.byFriends.start,
});
