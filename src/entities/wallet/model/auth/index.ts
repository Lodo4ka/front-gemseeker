import { attach, combine, createEffect, createEvent, Effect, sample } from 'effector';

import { PublicKey } from '@solana/web3.js';
import { createStore } from 'effector';
import { spread } from 'patronum';
import { api } from 'shared/api';
import { bytesToHex } from 'shared/lib/bytes-to-hex';
import { openedGenerateWalletModal } from 'features/generate-wallet';
import { router } from 'shared/config/router';

export const initPublicKey = createEvent<{
  publicKey: PublicKey;
  signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined;
}>();

export const initDisconnect = createEvent<() => Promise<void>>();
export const $isAuthenticating = createStore(true);
export const disconnected = createEvent();

export const resetPublicKey = createEvent();
export const $publicKey = createStore<PublicKey | null>(null);

export const $signMessage = createStore<((message: Uint8Array) => Promise<Uint8Array>) | null>(null);
export const $disconnect = createStore<(() => Promise<void>) | null>(null);

export const authenticated = createEvent();
export const generateNonceFailed = createStore(false);
const $message = createStore<Uint8Array | null>(null);

const generateMessageFx = createEffect<string, Uint8Array, Error>((nonce) => {
  return new TextEncoder().encode(`Sign in to Gemseeker.fun: ${nonce}`);
});

export const generateNonceFx: Effect<Uint8Array, Uint8Array, Error> = attach({
  source: $signMessage,
  async effect(signMessage, message) {
    return await signMessage!(message);
  },
});

const disconnectFx: Effect<void, void, Error> = attach({
  source: $disconnect,
  async effect(disconnect) {
    if (disconnect) {
      return await disconnect();
    }
  },
});

sample({
  clock: initPublicKey,
  target: spread({
    publicKey: $publicKey,
    signMessage: $signMessage,
  }),
});

sample({
  clock: initDisconnect,
  target: $disconnect,
});

sample({
  clock: authenticated,
  target: api.queries.user.generateNonce.start,
});

sample({
  clock: generateNonceFx.fail,
  target: [resetPublicKey, disconnectFx],
});

sample({
  clock: generateNonceFx.fail,
  fn: () => false,
  target: $isAuthenticating,
});

sample({
  clock: api.queries.user.generateNonce.finished.success,
  fn: ({ result }) => result,
  target: generateMessageFx,
});

sample({
  clock: generateMessageFx.doneData,
  source: $signMessage,
  filter: Boolean,
  fn: (_, message) => message,
  target: generateNonceFx,
});

sample({
  clock: generateMessageFx.doneData,
  target: $message,
});

sample({
  clock: generateNonceFx.doneData,
  source: combine(
    $publicKey,
    $message,
    router.$query.map((query) => +query.ref_id),
    (publicKey, message, ref_id) =>
      publicKey !== null && message !== null
        ? {
            publicKey,
            message,
            ref_id,
          }
        : null,
  ),
  filter: Boolean,
  fn: ({ publicKey, message, ref_id }, signature) => ({
    public_key: bytesToHex(publicKey.toBytes()),
    signature: bytesToHex(signature),
    signed_message: bytesToHex(message),
    ref_id: ref_id ?? 0,
  }),
  target: api.mutations.user.authenticate.start,
});

sample({
  clock: api.mutations.user.authenticate.finished.success,
  target: api.queries.wallets.all.refresh,
});

sample({
  clock: api.queries.wallets.all.finished.success,
  filter: ({ result }) => result.length === 0,
  target: openedGenerateWalletModal,
});

sample({
  clock: api.mutations.user.refreshToken.finished.failure,
  source: $publicKey,
  filter: (publicKey) => publicKey !== null,
  target: authenticated,
});

sample({
  clock: $publicKey,
  source: api.mutations.user.refreshToken.$failed,
  filter: Boolean,
  target: authenticated,
});

sample({
  clock: [api.mutations.user.authenticate.finished.success, api.mutations.user.logout.finished.success],
  target: [api.queries.user.me.refresh, api.queries.wallets.all.refresh],
});

sample({
  clock: [
    api.mutations.user.authenticate.finished.success,
    api.queries.user.me.finished.success,
    api.mutations.user.logout.finished.success,
  ],
  fn: () => false,
  target: $isAuthenticating,
});
