import { invoke } from '@withease/factories';
import { createStore, sample } from 'effector';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { MostProfitable } from '../../types';
import { $selectedWallet } from 'entities/wallet';

const limit = 10;

export const $mostProfitableTrades = createStore<MostProfitable[] | null>(null);
export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {limit});

sample({
  clock: $selectedWallet,
  target: [$currentPage.reinit, $isEndReached.reinit, $mostProfitableTrades.reinit]
})

sample({
  clock: onLoadedFirst,
  source: {
    wallet: $selectedWallet
  },
  fn: ({wallet}) => ({ offset: 0, limit, wallet_id: wallet?.id }),
  target: api.queries.user.mostProfitable.refresh,
});

sample({
  clock: api.queries.user.mostProfitable.finished.success,
  source: $mostProfitableTrades,
  fn: (mostProfitableTrades, { result }) => {
    if (mostProfitableTrades === null) return result.stat;

    return [...mostProfitableTrades, ...result.stat];
  },
  target: $mostProfitableTrades,
});

sample({
  clock: api.queries.user.mostProfitable.finished.success,
  fn: ({ result }) => result.stat.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: {
    offset: $currentPage,
    wallet: $selectedWallet
  },
  fn: ({offset, wallet}) => ({ offset, limit, wallet_id: wallet?.id }),
  target: api.queries.user.mostProfitable.refresh,
});
