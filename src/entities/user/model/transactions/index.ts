import { createStore, sample } from 'effector';
import { api } from 'shared/api';
import { Transactions } from '../../types';

export const $transactions = createStore<Transactions | null>(null);

sample({
  clock: api.queries.user.transactions.finished.success,
  source: $transactions,
  fn: (transactions, { result, params }) => {
    if (params.refresh) return result;
    if (transactions === null) return result;

    return [...transactions, ...result];
  },
  target: $transactions,
});
