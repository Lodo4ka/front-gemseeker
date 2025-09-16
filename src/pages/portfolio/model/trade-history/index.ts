import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { $activeTab } from '..';
import { refreshFactory } from 'shared/lib/refresh';
import { $selectedWallet } from 'entities/wallet';
import { $selectAllWallets } from '../all-wallets';

const limit = 10;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {
  limit,
});
export const {
  tick: refreshedTradeHistory,
  startedInterval: startedRefreshTradeHistory,
  stoppedInterval: stoppedRefreshTradeHistory,
} = invoke(refreshFactory);

sample({
  clock: [$selectedWallet, $selectAllWallets],
  target: [$currentPage.reinit, $isEndReached.reinit],
});

sample({
  clock: onLoadedFirst,
  source: {
    wallet: $selectedWallet,
    isSelectAllWallets: $selectAllWallets,
  },
  fn: ({ wallet, isSelectAllWallets }) => ({
    offset: 0,
    limit,
    address: isSelectAllWallets ? null : (wallet?.public_key ?? null),
  }),
  target: api.queries.user.tradeHistory.start,
});

sample({
  clock: api.queries.user.tradeHistory.finished.success,
  fn: ({ result }) => result.transactions.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: {
    offset: $currentPage,
    wallet: $selectedWallet,
    isSelectAllWallets: $selectAllWallets,
  },
  fn: ({ offset, wallet, isSelectAllWallets }) => ({
    offset,
    limit,
    address: isSelectAllWallets ? null : (wallet?.public_key ?? null),
  }),
  target: api.queries.user.tradeHistory.start,
});

sample({
  clock: [$activeTab, $selectAllWallets],
  filter: (activeTab) => activeTab === 2,
  target: startedRefreshTradeHistory,
});

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab !== 2,
  target: stoppedRefreshTradeHistory,
});

sample({
  clock: routes.portfolio.closed,
  target: stoppedRefreshTradeHistory,
});

sample({
  clock: refreshedTradeHistory,
  source: {
    offset: $currentPage,
    wallet: $selectedWallet,
    isSelectAllWallets: $selectAllWallets,
  },
  fn: ({ offset, wallet, isSelectAllWallets }) => ({
    offset: 0,
    limit: offset + limit,
    refresh: true,
    address: isSelectAllWallets ? null : (wallet?.public_key ?? null),
  }),
  target: api.queries.user.tradeHistory.start,
});
