import { createStore, sample } from 'effector';
import { api } from 'shared/api';
import { ActivePosition } from '../../types';
import { $selectedWallet } from 'entities/wallet';
import { $selectAllWallets } from 'pages/portfolio/model/all-wallets';

export const $activePositions = createStore<ActivePosition[] | null>(null);

sample({
  clock: [$selectedWallet, $selectAllWallets],
  target: $activePositions.reinit
});

sample({
  clock: api.queries.user.activePositions.finished.success,
  source: $activePositions,
  fn: (activePositions, { result, params }) => {
    if (activePositions === null || params.refresh) return result.positions;

    return [...activePositions, ...result.positions];
  },
  target: $activePositions,
});
