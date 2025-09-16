import { createStore, sample } from 'effector';
import { api } from 'shared/api';

import { UserMini } from '../../types';

export const $followers = createStore<UserMini[] | null>(null);

sample({
  clock: api.queries.user.followers.finished.success,
  source: $followers,
  fn: (followers, { result, params }) => {
    if (params.refresh) return result;
    if (followers === null) return result;

    return [...followers, ...result];
  },
  target: $followers,
});
