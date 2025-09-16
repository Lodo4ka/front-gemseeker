import { invoke } from '@withease/factories';
import { debug } from 'patronum';
import { combine, createEvent, sample } from 'effector';
import { $balanceToken, $token } from 'entities/token';
import { $balanceCastodial } from 'entities/wallet';
import { inputFactory } from 'shared/lib/factories';
import { exactBtoA, exactAtoB } from 'shared/lib/rate-token';

export const resetAmount = createEvent();

export const amount = invoke(inputFactory, {
  defaultValue: '0',
  filter: (amount) => Math.sign(+amount) !== -1 && !Number.isNaN(+amount),
});

amount.$value.reset(resetAmount);

export const maxClicked = createEvent<{ type: 'SELL' | 'BUY' }>();

export const $rateBuyTokens = combine(amount.$value, $token, (value, token) =>
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

export const $rateSellTokens = combine(amount.$value, $token, (value, token) =>
  exactAtoB({
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

export const $isEnoughBalanceBuy = combine(amount.$value, $balanceCastodial, (amount, balance) => balance >= +amount);

sample({
  clock: maxClicked,
  source: $balanceCastodial,
  filter: (_, { type }) => type === 'BUY',
  fn: (balance) => String(balance - 0.005),
  target: amount.$value,
});

sample({
  clock: maxClicked,
  source: $balanceToken,
  filter: (_, { type }) => type === 'SELL',
  fn: (balance) => String(balance),
  target: amount.$value,
});
