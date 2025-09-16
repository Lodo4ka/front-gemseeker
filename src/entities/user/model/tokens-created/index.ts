import { createStore, sample } from 'effector';
import { api } from 'shared/api';
import { TokenCreated } from '../../types';

export const $tokensCreated = createStore<TokenCreated[] | null>(null);

sample({
  clock: api.queries.user.tokens.finished.success,
  source: $tokensCreated,
  fn: (tokensCreated, { result, params }) => {
    if (params.refresh) return result;
    if (tokensCreated === null) return result;

    return [...tokensCreated, ...result];
  },
  target: $tokensCreated,
});
