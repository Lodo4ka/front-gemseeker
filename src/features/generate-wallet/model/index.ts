import { createEvent, createStore, sample } from 'effector';
import { modalsStore } from 'shared/lib/modal';
import { GenerateWalletModalProps } from '../ui/modal';
import { GENERATE_WALLET_MODAL_ID } from '../config';
import { invoke } from '@withease/factories';
import { copyFactory } from 'shared/lib/copy';
import { delay } from 'patronum';
import { api } from 'shared/api';
import { infer as types } from 'zod';

export const { copied } = invoke(copyFactory, 'Address copied to clipboard');

export const $step = createStore<number>(1).reset(delay(modalsStore.closeModal, 1000));

export const previousStepPressed = createEvent();
export const nextStepPressed = createEvent();
sample({
  clock: previousStepPressed,
  source: $step,
  fn: (step) => step - 1,
  target: $step,
});

sample({
  clock: nextStepPressed,
  source: $step,
  fn: (step) => step + 1,
  target: $step,
});

export const generateWalletPressed = createEvent();
export const $generatedWallet = createStore<types<typeof api.contracts.wallets.create> | null>(null);

sample({
  clock: generateWalletPressed,
  target: nextStepPressed,
});
sample({
  clock: generateWalletPressed,
  target: api.mutations.wallets.create.start,
});
sample({
  clock: api.mutations.wallets.create.finished.success,
  fn: ({ result }) => result,
  target: $generatedWallet,
});

export const openedModal = createEvent();
export const closedModal = createEvent();

sample({
  clock: openedModal,
  fn: () => GenerateWalletModalProps,
  target: modalsStore.openModal,
});

sample({
  clock: closedModal,
  fn: () => ({ id: GENERATE_WALLET_MODAL_ID }),
  target: modalsStore.closeModal,
});
