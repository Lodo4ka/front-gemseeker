import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';
import { percentRegex } from 'entities/token/config';

import { checkboxFactory } from 'shared/lib/checkbox';
import { inputFactory } from 'shared/lib/factories';

export const {
  $isChecked: $isBuyQuick,
  toggled: toggledVariantQuick,
  toggledChecked: toggledBuyQuick,
  toggledUnchecked: toggledSellQuick,
} = invoke(checkboxFactory, {
  defaultState: true,
});

export const $speed = createStore<'default' | 'auto'>('default');
export const changedSpeed = createEvent<'default' | 'auto'>();

export const $smartMevProtection = createStore<boolean>(false);
export const toggledSmartMevProtection = createEvent();

$speed.on(changedSpeed, (_, speed) => speed);
$smartMevProtection.on(toggledSmartMevProtection, (smartMevProtection) => !smartMevProtection);

export const { $value: $priorityFee, fieldUpdated: changedPriorityFee } = invoke(inputFactory, {
  defaultValue: '0.008',
  filter: (amount) => Math.sign(+amount) !== -1 && +amount < 10_000,
});

export const { $value: $briberyAmount, fieldUpdated: changedBriberyAmount } = invoke(inputFactory, {
  defaultValue: '0.012',
  filter: (amount) => Math.sign(+amount) !== -1 && +amount < 10_000,
});

export const { $value: $slippage, fieldUpdated: changedSlippage } = invoke(inputFactory, {
  defaultValue: '2',
  filter: (amount) => Math.sign(+amount) !== -1 && +amount < 10_000,
});

export const changedAmount = createEvent<{ amount: string; type: 'percent' | 'amount' }>();
export const $amount = createStore<{ amount: string; type: 'percent' | 'amount' }>({ amount: '', type: 'amount' });

sample({
  clock: changedAmount,
  filter: ({ amount, type }) => type === 'amount' && Math.sign(+amount) !== -1 && +amount < 10_000,
  target: $amount,
});

sample({
  clock: changedAmount,
  filter: ({ amount, type }) => type === 'percent' && percentRegex.test(amount),
  fn: ({ amount }) => ({ amount, type: 'percent' as const }),
  target: $amount,
});

persist({
  key: 'priorityFee',
  store: $priorityFee,
});

persist({
  key: 'briberyAmount',
  store: $briberyAmount,
});

persist({
  key: 'slippage',
  store: $slippage,
});

persist({
  key: 'speed',
  store: $speed,
});

persist({
  key: 'smartMevProtection',
  store: $smartMevProtection,
});
