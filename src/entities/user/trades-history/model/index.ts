import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { $selectedWallet } from 'entities/wallet';
import { api } from 'shared/api';
import { contracts } from 'shared/api/contracts';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { infer as types } from 'zod';

const limit = 10;

export const tradesHistoryLoaded = createEvent();

export const $tradesHistory = createStore<types<typeof contracts.transaction.single>[] | null>(null);
export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage } = invoke(paginationFactory, {limit});

sample({
  clock: $selectedWallet,
  target: [$currentPage.reinit, $isEndReached.reinit, $tradesHistory.reinit]
});

sample({
  clock: tradesHistoryLoaded,
  source: {
    wallet: $selectedWallet
  },
  fn: ({wallet}) => ({ offset: 0, limit, wallet_id: wallet?.id }),
  target: api.queries.user.tradeHistory.refresh,
});

sample({
  clock: api.queries.user.tradeHistory.finished.success,
  source: $tradesHistory,
  fn: (tradesHistory, { result }) => {
    if (tradesHistory === null) return result.transactions;

    return [...tradesHistory, ...result.transactions];
  },
  target: $tradesHistory,
});

sample({
  clock: api.queries.user.tradeHistory.finished.success,
  fn: ({ result }) => result.transactions.length < limit,
  target: $isEndReached,
});

sample({
  clock: $currentPage,
  source: {
    offset: $currentPage,
    wallet: $selectedWallet
  },
  fn: ({offset, wallet}) => ({ offset, limit, wallet_id: wallet?.id }),
  target: api.queries.user.tradeHistory.refresh,
});
