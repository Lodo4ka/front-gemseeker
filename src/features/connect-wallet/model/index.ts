import { createEvent, sample } from 'effector';

import { modalsStore } from 'shared/lib/modal';
import { ConnectWalletModalProps } from '../ui/connect-modal';
import { $isAuthenticating, $publicKey, disconnected, resetPublicKey } from 'entities/wallet';
import { DisconnectWalletModalProps } from '../ui/disconnect-modal';
import { api } from 'shared/api';
import { DISCONNECT_WALLET_MODAL_ID } from '../config';
import { $viewer } from 'shared/viewer';

export const openedConnectWalletModal = createEvent();
export const openedDisconnectWalletModal = createEvent();

sample({
  clock: openedConnectWalletModal,
  fn: () => ConnectWalletModalProps,
  target: modalsStore.openModal,
});

sample({
  clock: openedDisconnectWalletModal,
  fn: () => DisconnectWalletModalProps,
  target: modalsStore.openModal,
});

sample({
  clock: disconnected,
  target: api.mutations.user.logout.start,
});
sample({
  clock: api.mutations.user.logout.finished.success,
  target: resetPublicKey,
});

sample({
  clock: api.mutations.user.logout.finished.success,
  fn: () => null,
  target: $viewer,
});

sample({
  clock: $viewer,
  source: $publicKey,
  filter: (publicKey, viewer) => publicKey != null && viewer != null,
  target: $isAuthenticating,
  fn: () => false,
});

sample({
  clock: api.queries.user.me.finished.failure,
  target: $isAuthenticating,
  fn: () => false,
});

sample({
  clock: resetPublicKey,
  fn: () => ({ id: DISCONNECT_WALLET_MODAL_ID }),
  target: modalsStore.closeModal,
});
