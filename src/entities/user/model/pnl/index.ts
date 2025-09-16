import { sample } from 'effector';
import { PnlPeriodKeys, PnlPeriod } from '../../types';
import { createEvent, createStore } from 'effector';
import { $viewer } from 'shared/viewer';
import { api } from 'shared/api';
import { $selectedWallet } from 'entities/wallet';
import { $selectAllWallets } from 'pages/portfolio/model/all-wallets';

const $id = $viewer.map((viewer) => viewer?.user_id ?? null);

export const pnlLoaded = createEvent();
export const $pnl = createStore<PnlPeriod>(null);
export const $currentPeriod = createStore<PnlPeriodKeys>(1);
export const changeCurrentPeriod = createEvent<PnlPeriodKeys>();

sample({
  clock: changeCurrentPeriod,
  target: $currentPeriod,
});

sample({
  clock: [pnlLoaded, $selectedWallet, $selectAllWallets],
  source: {
    id: $id,
    wallet: $selectedWallet,
    period: $currentPeriod,
    isSelectAllWallets: $selectAllWallets,
  },
  filter: ({ id, period }) => Boolean(id) && period !== 'All',
  fn: ({ id, wallet, isSelectAllWallets, period }) => ({
    user_id: id ?? 0,
    delta: Number(period),
    address: isSelectAllWallets ? null : (wallet?.public_key ?? null),
  }),
  target: api.queries.user.pnlByPeriod.start,
});

sample({
  clock: [pnlLoaded, $selectedWallet, $selectAllWallets],
  source: {
    id: $id,
    wallet: $selectedWallet,
    period: $currentPeriod,
    isSelectAllWallets: $selectAllWallets,
  },
  filter: ({ id, period }) => Boolean(id) && period === 'All',
  fn: ({ id, wallet, isSelectAllWallets }) => ({
    user_id: id ?? 0,
    address: isSelectAllWallets ? null : (wallet?.public_key ?? null),
  }),
  target: api.queries.user.totalPln.start,
});

sample({
  clock: $currentPeriod,
  source: {
    id: $id,
    wallet: $selectedWallet,
    isSelectAllWallets: $selectAllWallets,
  },
  filter: ({ id }, period) => period !== 'All' && !!id,
  fn: ({ id, wallet, isSelectAllWallets }, period) => ({
    user_id: id as number,
    delta: Number(period),
    address: isSelectAllWallets ? null : (wallet?.public_key ?? null),
  }),
  target: api.queries.user.pnlByPeriod.start,
});

sample({
  clock: $currentPeriod,
  source: {
    id: $id,
    wallet: $selectedWallet,
    isSelectAllWallets: $selectAllWallets,
  },
  filter: ({ id }, period) => period === 'All' && !!id,
  fn: ({ id, wallet, isSelectAllWallets }) => ({
    user_id: id as number,
    address: isSelectAllWallets ? null : (wallet?.public_key ?? null),
  }),
  target: api.queries.user.totalPln.start,
});

sample({
  clock: api.queries.user.pnlByPeriod.finished.success,
  fn: ({ result }) => result,
  target: $pnl,
});

sample({
  clock: api.queries.user.totalPln.finished.success,
  fn: ({ result }) => result,
  target: $pnl,
});
