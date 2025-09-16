import { createStore, sample } from 'effector';
import { api } from 'shared/api';
import { UserMini } from '../../types';

export const $followees = createStore<UserMini[] | null>(null);

sample({
  clock: api.queries.user.followees.finished.success,
  source: $followees,
  fn: (followees, { result, params }) => {
    if (params.refresh) return result;
    if (followees === null) return result;

    return [...followees, ...result];
  },
  target: $followees,
});
