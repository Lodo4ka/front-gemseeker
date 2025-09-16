import { combine, createEffect, createStore, sample } from 'effector';
import { $connection } from '../connection';
import { $publicKey } from '../auth';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { $selectedWallet, $isAllWallets } from '../select-wallet';
import { api } from 'shared/api';

export const $balance = createStore(0);
export const $balanceCastodial = createStore(0);

export const $walletsBalances = createStore<Map<string, number>>(new Map());
export const $totalBalance = combine($walletsBalances, (balances) =>
  Array.from(balances.values()).reduce((acc, curr) => acc + curr, 0),
);

sample({
  clock: api.queries.wallets.balances.finished.success,
  fn: ({ result }) => result,
  target: $walletsBalances,
});

type GetBalanceFxProps = { publicKey: PublicKey; connection: Connection };

export const getBalanceFx = createEffect<GetBalanceFxProps, number>(async ({ publicKey, connection }) => {
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
});

sample({
  clock: combine($publicKey, $connection, (publicKey, connection) =>
    publicKey !== null ? { publicKey, connection } : null,
  ),
  filter: Boolean,
  target: getBalanceFx,
});

sample({
  clock: getBalanceFx.doneData,
  target: $balance,
});

sample({
  clock: $selectedWallet,
  source: {
    allWallets: $walletsBalances,
    isAllWallets: $isAllWallets,
  },
  filter: ({ isAllWallets }) => !isAllWallets,
  fn: ({ allWallets }, selectedWallet) => {
    if (selectedWallet === null) return 0;
    const balance = allWallets.get(selectedWallet.public_key) || 0;
    return balance;
  },
  target: $balanceCastodial,
});

sample({
  clock: $walletsBalances,
  source: {
    selectedWallet: $selectedWallet,
    isAllWallets: $isAllWallets,
  },
  filter: ({ isAllWallets }) => !isAllWallets,
  fn: ({ selectedWallet }, walletsBalances) => {
    if (selectedWallet === null) return 0;
    return walletsBalances.get(selectedWallet.public_key) || 0;
  },
  target: $balanceCastodial,
});

sample({
  clock: $walletsBalances,
  source: {
    totalBalance: $totalBalance,
    isAllWallets: $isAllWallets,
  },
  filter: ({ isAllWallets }) => isAllWallets,
  fn: ({ totalBalance }) => totalBalance,
  target: $balanceCastodial,
});

sample({
  clock: $walletsBalances,
  source: {
    selectedWallet: $selectedWallet,
    isAllWallets: $isAllWallets,
  },
  filter: ({ isAllWallets }) => !isAllWallets,
  fn: ({ selectedWallet }, walletsBalances) => {
    if (selectedWallet === null) return 0;
    return walletsBalances.get(selectedWallet.public_key) || 0;
  },
  target: $balanceCastodial,
});

sample({
  clock: $isAllWallets,
  source: $totalBalance,
  filter: (_, isAllWallets) => isAllWallets,
  fn: (totalBalance) => totalBalance,
  target: $balanceCastodial,
});

sample({
  clock: $isAllWallets,
  source: {
    allWallets: $walletsBalances,
    currentWallet: $selectedWallet,
  },
  filter: (_, isAllWallets) => !isAllWallets,
  fn: ({ allWallets, currentWallet }) => {
    if (currentWallet === null) return 0;
    const balance = allWallets.get(currentWallet.public_key) || 0;
    return balance;
  },
  target: $balanceCastodial,
});
