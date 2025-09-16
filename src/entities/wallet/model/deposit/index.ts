import { attach, createEvent, createStore, sample } from 'effector';
import { $wallets } from '../wallets';
import { api } from 'shared/api';
import { SignerWalletAdapterProps } from '@solana/wallet-adapter-base';
import { DepositMutationResponse } from 'shared/api/mutations/wallets/deposit';
import { Id } from 'react-toastify';
import {
  showToastFx as showToastAttachedFx,
  ShowToastParams,
  updateToastFx,
  UpdateToastParams,
} from 'shared/lib/toast';

const depositMutation = api.mutations.wallets.deposit;

export interface Wallet {
  id: number;
  amount: string;
}

export type WalletMap = Map<Wallet['id'], Omit<Wallet, 'id'>>;
export type AmountUpdated = { id: Wallet['id']; amount: string };

const defaultValues: WalletMap = new Map();

export const $walletsAmounts = createStore<{ ref: WalletMap }>({
  ref: defaultValues,
});

const showToastFx = attach({ effect: showToastAttachedFx });

export const deposited = createEvent();
export const depositSucceeded = createEvent<string>();
export const depositFailed = createEvent<string>();
export const initSignAllTransactions = createEvent<SignerWalletAdapterProps['signAllTransactions']>();
export const $pending = createStore(false)
  .on(depositMutation.started, () => true)
  .on(depositFailed, () => false)
  .on(depositSucceeded, () => false);
const $signAllTransactions = createStore<SignerWalletAdapterProps['signAllTransactions'] | null>(null);
export const $instructionsBatches = createStore<DepositMutationResponse['instructions_batches'] | null>(null);
const $toast = createStore<Id | null>(null);
export const $totalAmount = $walletsAmounts.map(({ ref }) => {
  return Array.from(ref.values()).reduce((acc, wallet) => {
    const amount = Number(wallet.amount.replace(/[^0-9.]/g, ''));
    return acc + (isNaN(amount) ? 0 : amount);
  }, 0);
});

sample({
  clock: $wallets,
  source: $walletsAmounts,
  fn: (currentAmounts, wallets) => {
    const ref = new Map<Wallet['id'], Omit<Wallet, 'id'>>();
    wallets.forEach((wallet) => {
      const existingAmount = currentAmounts.ref.get(wallet.id);
      ref.set(wallet.id, { amount: existingAmount?.amount || '' });
    });
    return { ref };
  },
  target: $walletsAmounts,
});

export const amountUpdated = createEvent<AmountUpdated>();

sample({
  clock: amountUpdated,
  source: $walletsAmounts,
  filter: (_, props: AmountUpdated) => !props.amount.includes('-') && +props.amount < 10_000,
  fn: ({ ref }, { id, amount }) => {
    const newRef = new Map(ref);
    const wallet = newRef.get(id);
    if (!wallet) return { ref: newRef };

    newRef.set(id, { ...wallet, amount });
    return { ref: newRef };
  },
  target: $walletsAmounts,
});

sample({
  clock: deposited,
  source: $walletsAmounts,
  filter: ({ ref }) => Array.from(ref.values()).some((amount) => +amount.amount > 0),
  fn: ({ ref }) =>
    Array.from(ref, ([wallet_id, amount]) => ({
      wallet_id,
      amount: +amount.amount,
      spl_token_address: 'native',
    })).filter(({ amount }) => Number(amount) > 0),
  target: depositMutation.start,
});

sample({
  clock: deposited,
  source: $walletsAmounts,
  filter: ({ ref }) => !Array.from(ref.values()).some((amount) => +amount.amount > 0),
  fn: () => ({ message: 'Drive a number greater than 0', options: { type: 'error' } }) as ShowToastParams,
  target: showToastFx,
});

sample({
  clock: initSignAllTransactions,
  target: $signAllTransactions,
});
sample({
  clock: depositMutation.finished.success,
  fn: ({ result }) => result.instructions_batches,
  target: $instructionsBatches,
});

sample({
  clock: depositMutation.started,
  fn: ({ params }) =>
    ({ message: `Depositing ${params.reduce((acc, curr) => acc + curr.amount, 0)} SOL...` }) as ShowToastParams,
  target: showToastFx,
});

sample({
  clock: showToastFx.doneData,
  target: $toast,
});

sample({
  clock: depositFailed,
  source: $toast,
  filter: Boolean,
  fn: (id, message) => ({ id, options: { render: message, type: 'error' } }) as UpdateToastParams,
  target: updateToastFx,
});

sample({
  clock: depositSucceeded,
  source: {
    id: $toast,
    amount: $totalAmount,
  },
  fn: ({ id, amount }) =>
    ({
      id,
      options: { render: `You have successfully deposited ${amount} SOl`, type: 'success' },
    }) as UpdateToastParams,
  target: updateToastFx,
});

sample({
  clock: depositSucceeded,
  source: $walletsAmounts,
  fn: ({ ref }) => ({
    ref: new Map(Array.from(ref.keys(), (id) => [id, { amount: '' }])),
  }),
  target: $walletsAmounts,
});

sample({
  clock: depositSucceeded,
  target: api.mutations.wallets.addDepositTransaction.start,
});

sample({
  clock: depositSucceeded,
  source: $wallets,
  fn: (wallets) => wallets.map(({ public_key }) => public_key),
  target: api.queries.wallets.balances.start,
});
