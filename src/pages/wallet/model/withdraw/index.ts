import { combine, createEvent, createStore, sample } from 'effector';
import { $wallets, $balanceCastodial } from 'entities/wallet';
import { invoke } from '@withease/factories';
import { selectFactory } from 'shared/lib/select';
import { api } from 'shared/api';
import { infer as types } from 'zod';
import { keepFresh } from '@farfetched/core';

const $firstWallet = combine($wallets, (wallets) =>
  wallets.length > 0
    ? (wallets.find(({ is_active }) => is_active === true) as types<typeof api.contracts.wallets.wallet>)
    : null,
);
export const { $value: $fromWallet, selected: selectedFromWallet } = invoke(() =>
  selectFactory({ defaultValue: $firstWallet }),
);
export const changedMaxBalance = createEvent();
export const toggledFromWalletPopover = createEvent();
export const closedFromWalletPopover = createEvent();
export const $isOpenFromWalletPopover = createStore<boolean>(false);
export const withdrawed = createEvent();
export const withdrawedToExternalWallet = createEvent();

$isOpenFromWalletPopover.on(toggledFromWalletPopover, (state) => !state);
$isOpenFromWalletPopover.on(closedFromWalletPopover, () => false);
sample({
  clock: selectedFromWallet,
  target: toggledFromWalletPopover,
});

export const $amount = createStore<string>('');
export const changedAmount = createEvent<string>();
export const $toWalletWithdraw = createStore<string>('');
export const changedToWalletWithdraw = createEvent<string>();

$amount.on(changedAmount, (_, amount) => amount);
$toWalletWithdraw.on(changedToWalletWithdraw, (_, toWallet) => toWallet);

export const { $value: $toWallet, selected: selectedToWallet } = invoke(() =>
  selectFactory({ defaultValue: $firstWallet }),
);
export const toggledToWalletPopover = createEvent();
export const closedToWalletPopover = createEvent();
export const $isOpenToWalletPopover = createStore<boolean>(false);

$isOpenToWalletPopover.on(toggledToWalletPopover, (state) => !state);
$isOpenToWalletPopover.on(closedToWalletPopover, () => false);

sample({
  clock: selectedToWallet,
  target: toggledToWalletPopover,
});

sample({
  clock: changedMaxBalance,
  source: $balanceCastodial,
  fn: (balance) => balance.toString(),
  target: $amount,
});

sample({
  clock: withdrawed,
  source: combine($fromWallet, $toWallet, $amount, (fromWallet, toWallet, amount) =>
    fromWallet !== null && toWallet !== null ? { fromWallet, toWallet, amount } : null,
  ),
  filter: Boolean,
  fn: ({ fromWallet, toWallet, amount }) => ({
    wallet_id: fromWallet.id,
    amount: Number(amount),
    destination: toWallet.public_key,
    spl_token_address: 'native',
  }),
  target: api.mutations.wallets.withdraw.start,
});

sample({
  clock: withdrawedToExternalWallet,
  source: combine($fromWallet, $toWalletWithdraw, $amount, (fromWallet, toWallet, amount) =>
    fromWallet !== null ? { fromWallet, toWallet, amount } : null,
  ),
  filter: Boolean,
  fn: ({ fromWallet, toWallet, amount }) => ({
    wallet_id: fromWallet.id,
    amount: Number(amount),
    destination: toWallet,
    spl_token_address: 'native',
  }),
  target: api.mutations.wallets.withdraw.start,
});

sample({
  clock: api.mutations.wallets.withdraw.finished.success,
  target: [$amount.reinit, $toWalletWithdraw.reinit],
});

keepFresh(api.queries.wallets.all, {
  automatically: true,
  triggers: [api.mutations.wallets.withdraw.finished.success],
});
