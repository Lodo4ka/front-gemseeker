import { createEvent, sample } from 'effector';

import { $address, $briberyAmount, $priorityFee, $speed, $token } from 'entities/token';
import { amount, $isEnoughBalanceBuy, $rateBuyTokens } from '../input';
import { showToastFx, ShowToastParams } from 'shared/lib/toast';
import { buyTokenMutation } from '../';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { api } from 'shared/api';
import { exactBtoA } from 'shared/lib/rate-token';

export const buyed = createEvent();

sample({
  clock: buyed,
  source: {
    value: amount.$value,
    isEnoughBalanceBuy: $isEnoughBalanceBuy,
    speed: $speed,
    priority_fee: $priorityFee,
    bribery_amount: $briberyAmount,
    symbol: $token.map((token) => token?.symbol),
    rate: $rateBuyTokens,
    address: $address,
    token: $token,
  },
  filter: ({ isEnoughBalanceBuy, token, value }) => {
    console.log(
      (token?.real_tokens ?? 0) / LAMPORTS_PER_SOL,
      exactBtoA({
        value: +value,
        virtualReserv: {
          token: BigInt(token?.virtual_tokens ?? 0),
          sol: BigInt(token?.virtual_sol ?? 0),
        },
        realReserv: {
          token: BigInt(token?.real_tokens ?? 0),
          sol: BigInt(token?.real_sol ?? 0),
        },
      }),
    );
    return (
      isEnoughBalanceBuy &&
      (token?.real_tokens ?? 0) / LAMPORTS_PER_SOL <=
        exactBtoA({
          value: +value,
          virtualReserv: {
            token: BigInt(token?.virtual_tokens ?? 0),
            sol: BigInt(token?.virtual_sol ?? 0),
          },
          realReserv: {
            token: BigInt(token?.real_tokens ?? 0),
            sol: BigInt(token?.real_sol ?? 0),
          },
        })
    );
  },
  fn: ({ value, priority_fee, bribery_amount, speed, address, symbol, rate, token }) => {
    const exact_amount_out = token?.trade_finished ? +value : (token?.real_tokens ?? 0) / 1e6;
    return {
      max_amount_in: +value + +value * 2,
      exact_amount_out,
      mint: address,
      priority_fee: +priority_fee,
      bribery_amount: +bribery_amount,
      speed,
      symbol,
      rate,
    };
  },
  target: api.mutations.token.buyFull.start,
});

sample({
  clock: buyed,
  source: {
    exact_amount_in: amount.$value,
    isEnoughBalanceBuy: $isEnoughBalanceBuy,
    speed: $speed,
    priority_fee: $priorityFee,
    bribery_amount: $briberyAmount,
    symbol: $token.map((token) => token?.symbol),
    rate: $rateBuyTokens,
    address: $address,
    token: $token,
  },
  filter: ({ isEnoughBalanceBuy, token, exact_amount_in }) =>
    isEnoughBalanceBuy &&
    (token?.real_tokens ?? 0) / LAMPORTS_PER_SOL >
      exactBtoA({
        value: +exact_amount_in,
        virtualReserv: {
          token: BigInt(token?.virtual_tokens ?? 0),
          sol: BigInt(token?.virtual_sol ?? 0),
        },
        realReserv: {
          token: BigInt(token?.real_tokens ?? 0),
          sol: BigInt(token?.real_sol ?? 0),
        },
      }),
  fn: ({ exact_amount_in, priority_fee, bribery_amount, speed, address, symbol, rate }) => ({
    mint: address,
    exact_amount_in: +exact_amount_in,
    min_amount_out: 0,
    priority_fee: +priority_fee,
    bribery_amount: +bribery_amount,
    speed,
    symbol,
    rate,
  }),
  target: buyTokenMutation.start,
});

sample({
  clock: buyed,
  source: $isEnoughBalanceBuy,
  filter: (isEnoughBalanceBuy) => !isEnoughBalanceBuy,
  fn: () =>
    ({
      message: "There's not enough balance!",
      options: { type: 'error' },
    }) as ShowToastParams,
  target: showToastFx,
});
