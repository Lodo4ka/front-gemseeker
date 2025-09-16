import { createStore, sample } from 'effector';
import { api } from 'shared/api';
import { TradingActivity } from '../../types';

export const $tradingActivity = createStore<TradingActivity[] | null>(null);

sample({
  clock: api.queries.user.tradingActivity.finished.success,
  source: $tradingActivity,
  fn: (tokensCreated, { result, params }) => {
    if (params.refresh) return result;
    if (tokensCreated === null) return result;

    return [...tokensCreated, ...result];
  },
  target: $tradingActivity,
});
