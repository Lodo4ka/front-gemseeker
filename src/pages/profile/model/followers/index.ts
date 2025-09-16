import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { $id, $followers } from 'entities/user';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { refreshFactory } from 'shared/lib/refresh';
import { $activeTab } from '..';
import { routes } from 'shared/config/router';

const limit = 10;

// export const $followers = createStore<UserMini[] | null>(null);
export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {limit});

sample({
  clock: $id,
  target: $followers.reinit,
});

export const {
  tick: refreshedFollowers,
  startedInterval: startedRefreshFollowers,
  stoppedInterval: stoppedRefreshFollowers,
} = invoke(refreshFactory);

sample({
  clock: onLoadedFirst,
  source: $id,
  filter: Boolean,
  fn: (user_id) => ({ user_id, offset: 0, limit }),
  target: api.queries.user.followers.refresh,
});

sample({
  clock: api.queries.user.followers.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: {
    user_id: $id,
    offset: $currentPage,
  },
  filter: ({ user_id }) => user_id != null,
  fn: ({ user_id, offset }) => ({ user_id, offset, limit }),
  target: api.queries.user.followers.refresh,
});

sample({
  clock: api.mutations.user.unfollow.finished.success,
  source: $followers,
  filter: Boolean,
  fn: (followers, { result }) => followers.filter((follower) => follower.user_id !== result.user_id),
  target: $followers,
});

sample({
  clock: api.mutations.user.follow.finished.success,
  source: {
    followers: $followers,
    isEndReached: $isEndReached,
  },
  filter: ({ isEndReached }) => isEndReached,
  fn: ({ followers }, { result }) => {
    const followee = {
      user_id: result.user_id,
      user_nickname: result.user_nickname,
      user_photo_hash: result.user_photo_hash,
      user_followers: result.user_subscribers,
    };
    if (followers === null) return [followee];

    return [...followers, followee];
  },
  target: $followers,
});

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab === 1,
  target: startedRefreshFollowers,
});

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab !== 1,
  target: stoppedRefreshFollowers,
});

sample({
  clock: routes.profile.closed,
  target: stoppedRefreshFollowers,
});

sample({
  clock: refreshedFollowers,
  source: {
    user_id: $id,
    offset: $currentPage,
  },
  filter: ({ user_id }) => user_id != null,
  fn: ({ user_id, offset }) => ({ user_id, offset: 0, limit: offset + limit, refresh: true }),
  target: api.queries.user.followers.start,
});
