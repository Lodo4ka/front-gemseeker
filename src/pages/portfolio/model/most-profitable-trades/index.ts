import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { $activeTab } from '..';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { refreshFactory } from 'shared/lib/refresh';
import { routes } from 'shared/config/router';
import { $selectedWallet } from 'entities/wallet';
import { $selectAllWallets } from 'pages/portfolio/model/all-wallets';

const limit = 10;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {
  limit,
});
export const {
  tick: refreshedMostProfitableTrades,
  startedInterval: startedRefreshMostProfitableTrades,
  stoppedInterval: stoppedRefreshMostProfitableTrades,
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
  target: api.queries.user.mostProfitable.start,
});

sample({
  clock: api.queries.user.mostProfitable.finished.success,
  fn: ({ result }) => result.stat.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: {
    wallet: $selectedWallet,
    offset: $currentPage,
    isSelectAllWallets: $selectAllWallets,
  },
  fn: ({ offset, wallet, isSelectAllWallets }) => ({
    offset,
    limit,
    address: isSelectAllWallets ? null : (wallet?.public_key ?? null),
  }),
  target: api.queries.user.mostProfitable.start,
});

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab === 0,
  target: startedRefreshMostProfitableTrades,
});

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab !== 0,
  target: stoppedRefreshMostProfitableTrades,
});

sample({
  clock: routes.portfolio.closed,
  target: stoppedRefreshMostProfitableTrades,
});

sample({
  clock: refreshedMostProfitableTrades,
  source: {
    offset: $currentPage,
    wallet: $selectedWallet,
    isSelectAllWallets: $selectAllWallets,
  },
  fn: ({ offset, isSelectAllWallets, wallet }) => ({
    offset: 0,
    limit: offset + limit,
    address: isSelectAllWallets ? null : (wallet?.public_key ?? null),
    refresh: true,
  }),
  target: api.queries.user.mostProfitable.start,
});
