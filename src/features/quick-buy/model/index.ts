import { combine, createEvent, createStore, sample } from 'effector';
import { $amount, $balancesSplTokens, $briberyAmount, $isBuyQuick, $priorityFee, $speed } from 'entities/token';
import { $balanceCastodial, $publicKey, $selectedWallet } from 'entities/wallet';
import { ConnectWalletModalProps } from 'features/connect-wallet';
import { api } from 'shared/api';
import { TokensListTokenResponse } from 'shared/api/queries/token/tokens-factory';
import { LAMPORTS_PER_TOKEN } from 'shared/constants';
import { modalsStore } from 'shared/lib/modal';
import { exactAtoB, exactBtoA } from 'shared/lib/rate-token';
import { showToastFx, ShowToastParams } from 'shared/lib/toast';

export type quickVariant = 'buy' | 'sell';

const buyTokenMutation = api.mutations.token.buy;
const sellTokenMutation = api.mutations.token.sell;

export const startedTx = createEvent<TokensListTokenResponse[0]>();
export const settedVariant = createEvent<quickVariant>();

const $sourceBuy = combine($publicKey, $amount, (publicKey, amount) =>
  publicKey !== null ? { publicKey, amount } : null,
);
const $isEnoughBalanceBuy = combine($amount, $balanceCastodial, (amount, balance) => {
  if (amount.type === 'percent') {
    return balance >= (balance * Number(amount.amount.replace('%', ''))) / 100;
  }
  return balance >= +amount.amount;
});
export const $isProcessingTx = createStore<boolean | string>(false)
  .on([buyTokenMutation.started, sellTokenMutation.started], (_, { params }) => params.mint)
  .on([buyTokenMutation.finished.finally, sellTokenMutation.finished.finally], () => false);

export const $variantQuick = createStore<quickVariant>('buy').on(settedVariant, (_, payload) => payload);

sample({
  clock: startedTx,
  source: {
    amount: $amount,
    isEnoughBalanceBuy: $isEnoughBalanceBuy,
    isBuy: $isBuyQuick,
    speed: $speed,
    priority_fee: $priorityFee,
    bribery_amount: $briberyAmount,
    balanceCastodial: $balanceCastodial,
  },
  filter: ({ isEnoughBalanceBuy, isBuy }) => isBuy && isEnoughBalanceBuy,
  fn: ({ priority_fee, bribery_amount, speed, amount, balanceCastodial }, token) => {
    const getAmount = () => {
      if (amount.type === 'percent') return (balanceCastodial * Number(amount.amount.replace('%', ''))) / 100;
      return Number(amount.amount);
    };
    const exact_amount_in = getAmount();
    const rate = exactBtoA({
      value: exact_amount_in ?? 0,
      virtualReserv: {
        token: token?.virtual_tokens ?? 0,
        sol: token?.virtual_sol ?? 0,
      },
      realReserv: {
        token: token?.real_tokens ?? 0,
        sol: token?.real_sol ?? 0,
      },
    });

    return {
      mint: token.address,
      exact_amount_in,
      min_amount_out: 0,
      priority_fee: +priority_fee,
      bribery_amount: +bribery_amount,
      symbol: token.symbol,
      speed,
      rate,
    };
  },
  target: buyTokenMutation.start,
});

sample({
  clock: startedTx,
  source: {
    isEnoughBalanceBuy: $isEnoughBalanceBuy,
    isBuy: $isBuyQuick,
  },
  filter: ({ isEnoughBalanceBuy, isBuy }) => isBuy && !isEnoughBalanceBuy,
  fn: () =>
    ({
      message: 'Insufficient balance',
      options: {
        type: 'error',
      },
    }) as ShowToastParams,
  target: showToastFx,
});

sample({
  clock: startedTx,
  source: {
    balanceTokens: $balancesSplTokens,
    currentWallet: $selectedWallet,
    isBuy: $isBuyQuick,
  },
  filter: ({ currentWallet, balanceTokens, isBuy }, token) =>
    !isBuy &&
    (currentWallet === null ||
      balanceTokens === null ||
      balanceTokens[currentWallet?.public_key ?? '']?.find(({ mint }) => mint === token.address) === undefined),
  fn: () =>
    ({
      message: 'You don’t have this token',
      options: {
        type: 'error',
      },
    }) as ShowToastParams,
  target: showToastFx,
});

sample({
  clock: startedTx,
  source: {
    isBuy: $isBuyQuick,
    priority_fee: $priorityFee,
    bribery_amount: $briberyAmount,
    speed: $speed,
    balanceTokens: $balancesSplTokens,
    amount: $amount,
    currentWallet: $selectedWallet,
  },
  filter: ({ isBuy, currentWallet, balanceTokens }, token) =>
    !isBuy &&
    currentWallet !== null &&
    balanceTokens !== null &&
    Boolean(balanceTokens[currentWallet?.public_key ?? '']?.find(({ mint }) => mint === token.address)),
  fn: ({ amount, priority_fee, bribery_amount, speed, balanceTokens, currentWallet }, token) => {
    const getAmount = () => {
      if (amount.type === 'percent') {
        const tokenBalance = balanceTokens[currentWallet?.public_key ?? '']?.find(
          ({ mint }) => mint === token.address,
        )?.amount;
        if (!tokenBalance) return;
        return ((tokenBalance / LAMPORTS_PER_TOKEN) * Number(amount.amount.replace('%', ''))) / 100;
      }

      return Number(amount.amount);
    };
    const exact_amount_in: number = getAmount() as number;

    const rate = exactAtoB({
      value: +exact_amount_in,
      virtualReserv: {
        token: token?.virtual_tokens ?? 0,
        sol: token?.virtual_sol ?? 0,
      },
      realReserv: {
        token: token?.real_tokens ?? 0,
        sol: token?.real_sol ?? 0,
      },
    });
    return {
      mint: token.address,
      exact_amount_in,
      min_amount_out: 0,
      priority_fee: +priority_fee,
      bribery_amount: +bribery_amount,
      symbol: token.symbol,
      speed,
      rate,
    };
  },
  target: sellTokenMutation.start,
});

sample({
  clock: startedTx,
  source: $sourceBuy,
  filter: (v) => v === null,
  fn: () => ConnectWalletModalProps,
  target: modalsStore.openModal,
});
