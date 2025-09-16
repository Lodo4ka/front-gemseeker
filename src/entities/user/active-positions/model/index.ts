import { invoke } from '@withease/factories';
import { createStore, sample } from 'effector';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { ActivePosition } from '../../types';
import { $selectedWallet } from 'entities/wallet';

const limit = 10;

export const $activePositions = createStore<ActivePosition[] | null>(null);
export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {limit});

sample({
  clock: $selectedWallet,
  target: [$currentPage.reinit, $isEndReached.reinit]
});

sample({
  clock: onLoadedFirst,
  source: {
    wallet: $selectedWallet
  },
  fn: ({wallet}) => ({ offset: 0, limit, wallet_id: wallet?.id }),
  target: api.queries.user.activePositions.refresh,
});

sample({
  clock: api.queries.user.activePositions.finished.success,
  source: $activePositions,
  fn: (activePositions, { result }) => {
    if (activePositions === null) return result.positions;

    return [...activePositions, ...result.positions];
  },
  target: $activePositions,
});

sample({
  clock: api.queries.user.activePositions.finished.success,
  fn: ({ result }) => result.positions.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: {
    offset: $currentPage,
    wallet: $selectedWallet
  },
  fn: ({offset, wallet}) => ({ offset, limit, wallet_id: wallet?.id }),
  target: api.queries.user.activePositions.refresh,
});
