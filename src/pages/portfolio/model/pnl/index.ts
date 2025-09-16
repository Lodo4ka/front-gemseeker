import { createStore, sample, createEvent } from 'effector';
import { $viewer } from 'shared/viewer';
import { api } from 'shared/api';
import { delay, spread } from 'patronum';
import { $currentPeriod } from 'entities/user';
import { $selectedWallet } from 'entities/wallet';
import { $selectAllWallets } from '../all-wallets';

const $id = $viewer.map((viewer) => viewer?.user_id ?? null);

export const $isRefreshing = createStore<boolean>(false);
export const refreshed = createEvent();

const delayedByPeriod = delay(api.queries.user.pnlByPeriod.finished.finally, 1000);
const delayedByTotal = delay(api.queries.user.totalPln.finished.finally, 1000);

sample({
  clock: refreshed,
  source: {
    id: $id,
    period: $currentPeriod,
    wallet: $selectedWallet,
    isSelectAllWallets: $selectAllWallets,
  },
  filter: ({ id, period }) => id !== null && period !== 'All',
  fn: ({ id, period, wallet, isSelectAllWallets }) => ({
    refresh: {
      user_id: id!,
      delta: period as number,
      address: isSelectAllWallets ? null : (wallet?.public_key ?? null),
    },
    status: true,
  }),
  target: spread({
    refresh: api.queries.user.pnlByPeriod.start,
    status: $isRefreshing,
  }),
});
sample({
  clock: refreshed,
  source: {
    id: $id,
    period: $currentPeriod,
    wallet: $selectedWallet,
    isSelectAllWallets: $selectAllWallets,
  },
  filter: ({ id, period }) => id !== null && period === 'All',
  fn: ({ id, wallet, isSelectAllWallets }) => ({
    refresh: { user_id: id!, address: isSelectAllWallets ? null : (wallet?.public_key ?? null) },
    status: true,
  }),
  target: spread({
    refresh: api.queries.user.totalPln.start,
    status: $isRefreshing,
  }),
});

sample({
  clock: [delayedByPeriod, delayedByTotal],
  fn: () => false,
  target: $isRefreshing,
});
