import { createStore, sample } from 'effector';
import { api } from 'shared/api';
import { MostProfitable } from '../../types';
import { $selectedWallet } from 'entities/wallet';
import { $selectAllWallets } from 'pages/portfolio/model/all-wallets';

export const $mostProfitableTrades = createStore<MostProfitable[] | null>(null);

sample({
  clock: [$selectedWallet, $selectAllWallets],
  target: $mostProfitableTrades.reinit,
});
api.queries.user.mostProfitable.finished.finally.watch(console.log);
sample({
  clock: api.queries.user.mostProfitable.finished.success,
  source: $mostProfitableTrades,
  fn: (mostProfitableTrades, { result, params }) => {
    if (mostProfitableTrades === null || params.refresh) return result.stat;

    return [...mostProfitableTrades, ...result.stat];
  },
  target: $mostProfitableTrades,
});
