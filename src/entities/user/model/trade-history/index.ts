import { createStore, sample } from 'effector';
import { TradesHistory } from '../../types';
import { api } from 'shared/api';
import { $selectedWallet } from 'entities/wallet';
import { $selectAllWallets } from 'pages/portfolio/model/all-wallets';

export const $tradesHistory = createStore<TradesHistory[] | null>(null);

sample({
  clock: [$selectedWallet, $selectAllWallets],
  target: $tradesHistory.reinit
});

sample({
  clock: api.queries.user.tradeHistory.finished.success,
  source: $tradesHistory,
  fn: (tradesHistory, { result, params }) => {
    if (tradesHistory === null || params.refresh) return result.transactions;

    return [...tradesHistory, ...result.transactions];
  },
  target: $tradesHistory,
});
