import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { refreshFactory } from 'shared/lib/refresh';
import { $activeTab } from '..';
import { $selectedWallet } from 'entities/wallet';
import { $selectAllWallets } from '../all-wallets';

const limit = 10;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {
  limit,
});
export const {
  tick: refreshedActivePositions,
  startedInterval: startedRefreshActivePositions,
  stoppedInterval: stoppedRefreshActivePositions,
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
  target: api.queries.user.activePositions.start,
});

sample({
  clock: api.queries.user.activePositions.finished.success,
  fn: ({ result }) => result.positions.length < limit,
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
  target: api.queries.user.activePositions.start,
});

sample({
  clock: [$activeTab, $selectAllWallets],
  filter: (activeTab) => activeTab === 1,
  target: startedRefreshActivePositions,
});

sample({
  clock: $activeTab,
  filter: (activeTab) => activeTab !== 1,
  target: stoppedRefreshActivePositions,
});

sample({
  clock: routes.portfolio.closed,
  target: stoppedRefreshActivePositions,
});

sample({
  clock: refreshedActivePositions,
  source: {
    wallet: $selectedWallet,
    offset: $currentPage,
    isSelectAllWallets: $selectAllWallets,
  },
  fn: ({ offset, wallet, isSelectAllWallets }) => ({
    offset: 0,
    limit: offset + limit,
    refresh: true,
    address: isSelectAllWallets ? null : (wallet?.public_key ?? null),
  }),
  target: api.queries.user.activePositions.start,
});
