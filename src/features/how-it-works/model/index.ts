import { createEvent, sample } from 'effector';
import { modalsStore } from 'shared/lib/modal';
import { HowItWorksModalProps } from '../ui';
import { $publicKey } from 'entities/wallet';
import { ConnectWalletModalProps } from 'features/connect-wallet';
import { routes } from 'shared/config/router';
import { HOW_IT_WORKS_MODAL_ID } from '../config';

export const openedHowItWorksModal = createEvent();
export const navigatedToCreateToken = createEvent();

sample({
  clock: openedHowItWorksModal,
  fn: () => HowItWorksModalProps,
  target: modalsStore.openModal,
});


sample({
  clock: navigatedToCreateToken,
  source: $publicKey,
  filter: (v) => v === null,
  fn: () => ConnectWalletModalProps,
  target: modalsStore.openModal,
});

sample({
  clock: navigatedToCreateToken,
  source: $publicKey,
  filter: Boolean,
  target: routes.create_token.open,
});

sample({
  clock: navigatedToCreateToken,
  fn: () => ({
    id: HOW_IT_WORKS_MODAL_ID
  }),
  target: modalsStore.closeModal
})