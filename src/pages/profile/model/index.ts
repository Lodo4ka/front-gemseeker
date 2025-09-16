import { invoke } from '@withease/factories';
import { combine, createEvent, createStore, sample } from 'effector';
import { $id } from 'entities/user';
import { openedGenerateWalletModal } from 'features/generate-wallet';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { refreshFactory } from 'shared/lib/refresh';
import { chainAuthenticated } from 'shared/viewer';
import { $viewer } from 'shared/viewer';

export const $activeTab = createStore<number>(0);
export const tabChanged = createEvent<number>();

sample({
  clock: tabChanged,
  target: $activeTab,
});

export const currentRoute = routes.profile;

export const authenticatedRoute = chainAuthenticated(currentRoute, {
  otherwise: openedGenerateWalletModal,
});

export const $isOwnProfile = combine($viewer, $id, (viewer, id) => viewer?.user_id === id);

sample({
  clock: $id,
  source: $viewer.map((viewer) => viewer?.user_id || null),
  fn: (from_id, user_id) => ({ user_id, from_id }),
  target: api.queries.user.profile.refresh,
});

sample({
  clock: $viewer.map((viewer) => viewer?.user_id || null),
  source: {
    user_id: $id,
    isOpened: authenticatedRoute.$isOpened,
  },
  filter: ({ isOpened }, from_id) => from_id != null && isOpened,
  fn: ({ user_id }, from_id) => ({ user_id, from_id }),
  target: api.queries.user.profile.refresh,
});

const {
  tick: refreshedProfile,
  startedInterval: startedRefreshProfile,
  stoppedInterval: stoppedRefreshProfile,
} = invoke(refreshFactory);

sample({
  clock: authenticatedRoute.opened,
  target: startedRefreshProfile,
});
sample({
  clock: authenticatedRoute.closed,
  target: stoppedRefreshProfile,
});

sample({
  clock: refreshedProfile,
  source: {
    from_id: $viewer.map((viewer) => viewer?.user_id || null),
    user_id: $id,
  },
  fn: ({ from_id, user_id }) => ({ user_id, from_id }),
  target: api.queries.user.profile.refresh,
});
