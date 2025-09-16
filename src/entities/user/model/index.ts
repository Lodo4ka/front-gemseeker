import { createStore, sample } from 'effector';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { $followers } from './followers';
import { User } from '../types';
import { $followees } from './followees';
import { $transactions } from './transactions';
import { $tokensCreated } from './tokens-created';

export const $user = createStore<User | null>(null);

export const $id = routes.profile.$params.map(({ id }) => +id);

sample({
  clock: api.queries.user.profile.$data,
  target: $user,
});

sample({
  clock: $id,
  target: [$followers.reinit, $followees.reinit, $transactions.reinit, $tokensCreated.reinit],
});
