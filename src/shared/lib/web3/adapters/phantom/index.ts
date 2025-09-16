import { SendOptions, Transaction } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { createFactory, invoke } from '@withease/factories';
import { attach, combine, createEffect, createEvent, createStore, Effect, sample, split } from 'effector';
import { condition, empty, not, spread } from 'patronum';
import { appStarted } from 'shared/config/init';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { persist } from 'effector-storage/local';
import { decryptPayload, encryptPayload, fixUrlParams, buildUrl, getKeyFromParams } from '../../utils';
import { WalletParams, BaseExtensionProvider, Wallet } from '../../types';

const phantomFactory = createFactory(({ link, name }: WalletParams) => {
  const $icon = createStore<string>(
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiB2aWV3Qm94PSIwIDAgMTA4IDEwOCIgZmlsbD0ibm9uZSI+CjxyZWN0IHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiByeD0iMjYiIGZpbGw9IiNBQjlGRjIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ni41MjY3IDY5LjkyMjlDNDIuMDA1NCA3Ni44NTA5IDM0LjQyOTIgODUuNjE4MiAyNC4zNDggODUuNjE4MkMxOS41ODI0IDg1LjYxODIgMTUgODMuNjU2MyAxNSA3NS4xMzQyQzE1IDUzLjQzMDUgNDQuNjMyNiAxOS44MzI3IDcyLjEyNjggMTkuODMyN0M4Ny43NjggMTkuODMyNyA5NCAzMC42ODQ2IDk0IDQzLjAwNzlDOTQgNTguODI1OCA4My43MzU1IDc2LjkxMjIgNzMuNTMyMSA3Ni45MTIyQzcwLjI5MzkgNzYuOTEyMiA2OC43MDUzIDc1LjEzNDIgNjguNzA1MyA3Mi4zMTRDNjguNzA1MyA3MS41NzgzIDY4LjgyNzUgNzAuNzgxMiA2OS4wNzE5IDY5LjkyMjlDNjUuNTg5MyA3NS44Njk5IDU4Ljg2ODUgODEuMzg3OCA1Mi41NzU0IDgxLjM4NzhDNDcuOTkzIDgxLjM4NzggNDUuNjcxMyA3OC41MDYzIDQ1LjY3MTMgNzQuNDU5OEM0NS42NzEzIDcyLjk4ODQgNDUuOTc2OCA3MS40NTU2IDQ2LjUyNjcgNjkuOTIyOVpNODMuNjc2MSA0Mi41Nzk0QzgzLjY3NjEgNDYuMTcwNCA4MS41NTc1IDQ3Ljk2NTggNzkuMTg3NSA0Ny45NjU4Qzc2Ljc4MTYgNDcuOTY1OCA3NC42OTg5IDQ2LjE3MDQgNzQuNjk4OSA0Mi41Nzk0Qzc0LjY5ODkgMzguOTg4NSA3Ni43ODE2IDM3LjE5MzEgNzkuMTg3NSAzNy4xOTMxQzgxLjU1NzUgMzcuMTkzMSA4My42NzYxIDM4Ljk4ODUgODMuNjc2MSA0Mi41Nzk0Wk03MC4yMTAzIDQyLjU3OTVDNzAuMjEwMyA0Ni4xNzA0IDY4LjA5MTYgNDcuOTY1OCA2NS43MjE2IDQ3Ljk2NThDNjMuMzE1NyA0Ny45NjU4IDYxLjIzMyA0Ni4xNzA0IDYxLjIzMyA0Mi41Nzk1QzYxLjIzMyAzOC45ODg1IDYzLjMxNTcgMzcuMTkzMSA2NS43MjE2IDM3LjE5MzFDNjguMDkxNiAzNy4xOTMxIDcwLjIxMDMgMzguOTg4NSA3MC4yMTAzIDQyLjU3OTVaIiBmaWxsPSIjRkZGREY4Ii8+Cjwvc3ZnPg==',
  );
  const $name = createStore<'Phantom' | 'Solflare'>(name);
  const $isInstalled = createStore<boolean>(window?.phantom?.solana ? true : false);
  const onConnected = createEvent();
  const onDisconnected = createEvent();
  const accountChanged = createEvent();
  const $provider = createStore<BaseExtensionProvider | null>(
    window?.phantom?.solana ? window.phantom.solana : null,
  ).reset(onDisconnected);
  const $publicKey = createStore<PublicKey | null>(window?.phantom?.solana?.publicKey ?? null).reset(onDisconnected);
  const $isConnected = createStore<boolean>(window?.phantom?.solana?.isConnected ?? false).reset(onDisconnected);
  const $dappEncryptionPublicKey = createStore<Uint8Array | null>(null).reset(onDisconnected);
  const $phantomEncryptionPublicKey = createStore<Uint8Array | null>(null).reset(onDisconnected);
  const $session = createStore<string | null>(null).reset(onDisconnected);
  const $dappEncryptionPrivateKey = createStore<Uint8Array | null>(null).reset(onDisconnected);

  const connected = createEvent();
  const disconnected = createEvent();

  const subscribeWalletEventsFx = attach({
    source: $provider,
    async effect(provider) {
      if (provider === null) throw new Error('Solflare Extension not found');
      provider.on('connect', onConnected);
      provider.on('disconnect', onDisconnected);
      provider.on('accountChanged', accountChanged);
    },
  });

  const sendTransactionExtensionFx: Effect<{ transaction: Transaction; options?: SendOptions }, string, Error> = attach(
    {
      source: $provider,
      async effect(provider, { transaction, options }) {
        if (provider === null) throw new Error('Solflare Extension not found');
        return await provider.signAndSendTransaction(transaction, options);
      },
    },
  );
  const sendTransactionDeeplinkFx: Effect<{ transaction: Transaction; options?: SendOptions }, void, Error> = attach({
    source: combine(
      $dappEncryptionPublicKey,
      $dappEncryptionPrivateKey,
      $session,
      $phantomEncryptionPublicKey,
      (dappEncryptionPublicKey, dappEncryptionPrivateKey, session, phantomEncryptionPublicKey) => ({
        dappEncryptionPublicKey,
        dappEncryptionPrivateKey,
        session,
        phantomEncryptionPublicKey,
      }),
    ),
    async effect(
      { dappEncryptionPublicKey, dappEncryptionPrivateKey, session, phantomEncryptionPublicKey },
      { transaction, options },
    ) {
      if (
        dappEncryptionPublicKey === null ||
        dappEncryptionPrivateKey === null ||
        session === null ||
        phantomEncryptionPublicKey === null
      )
        throw new Error('Dapp encryption key pair is not found');
      try {
        const searchParams = new URLSearchParams({ type: 'transaction' }).toString();
        const payload = {
          session,
          sendOptions: options,
          transaction: bs58.encode(transaction.serialize({ requireAllSignatures: false })),
        };
        const sharedSecretDapp = nacl.box.before(phantomEncryptionPublicKey, dappEncryptionPrivateKey);
        const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecretDapp);
        const params = new URLSearchParams({
          dapp_encryption_public_key: bs58.encode(dappEncryptionPublicKey),
          nonce: bs58.encode(nonce),
          payload: bs58.encode(encryptedPayload),
          redirect_link: `${window.location.origin}?${searchParams}`,
        });

        const url = buildUrl(link, 'signAndSendTransaction', params);
        window.location.href = url;
      } catch (error) {
        throw error;
      }
    },
  });

  const sendTransactionFx: Effect<{ transaction: Transaction; options?: SendOptions }, string | null, Error> = attach({
    source: $provider,
    async effect(provider, { transaction, options }) {
      if (provider !== null) return await sendTransactionExtensionFx({ transaction, options });
      await sendTransactionDeeplinkFx({ transaction, options });
      return null;
    },
  });

  const signMessageFx: Effect<Uint8Array, string | null, Error> = attach({
    source: $provider,
    async effect(provider, message) {
      if (provider !== null) return await signExtensionMessageFx(message);
      await signDeeplinkMessageFx(message);
      return null;
    },
  });

  const subscribeTransactionDeeplinkFx = attach({
    source: {
      dappEncryptionPrivateKey: $dappEncryptionPrivateKey,
      phantomEncryptionPublicKey: $phantomEncryptionPublicKey,
    },
    async effect({ dappEncryptionPrivateKey, phantomEncryptionPublicKey }) {
      if (phantomEncryptionPublicKey === null || dappEncryptionPrivateKey === null) return null;
      const url = new URL(fixUrlParams(window.location.href));
      const params = new URLSearchParams(url.search);
      const type = params.get('type');
      if (type === 'transaction') {
        const nonce = params.get('nonce');
        const encodedData = params.get('data');
        const error = params.get('errorMessage');

        if (error) throw error;

        const sharedSecretDapp = nacl.box.before(phantomEncryptionPublicKey, dappEncryptionPrivateKey);
        const { signature } = decryptPayload(encodedData, nonce, sharedSecretDapp) as {
          signature: string;
        };
        return signature;
      }
      return null;
    },
  });

  const subscribeMessageDeeplinkFx = attach({
    source: {
      dappEncryptionPrivateKey: $dappEncryptionPrivateKey,
      phantomEncryptionPublicKey: $phantomEncryptionPublicKey,
    },
    async effect({ dappEncryptionPrivateKey, phantomEncryptionPublicKey }) {
      if (phantomEncryptionPublicKey === null || dappEncryptionPrivateKey === null) return null;

      const url = new URL(fixUrlParams(window.location.href));
      const params = new URLSearchParams(url.search);
      const type = params.get('type');

      if (type === 'message') {
        const nonce = params.get('nonce');
        const encodedData = params.get('data');
        const error = params.get('errorMessage');

        if (error) throw error;

        const sharedSecretDapp = nacl.box.before(phantomEncryptionPublicKey, dappEncryptionPrivateKey);
        const { signature } = decryptPayload(encodedData, nonce, sharedSecretDapp) as {
          signature: Uint8Array;
        };

        return bs58.encode(signature);
      }
      return null;
    },
  });

  const subscribeConnectionDeeplinkFx = attach({
    source: {
      dappEncryptionPublicKeyStorage: $dappEncryptionPublicKey,
      dappEncryptionPrivateKeyStorage: $dappEncryptionPrivateKey,
      phantomEncryptionPublicKeyStorage: $phantomEncryptionPublicKey,
      sessionStore: $session,
      publicKeyStorage: $publicKey,
    },
    async effect({
      dappEncryptionPublicKeyStorage,
      dappEncryptionPrivateKeyStorage,
      phantomEncryptionPublicKeyStorage,
      sessionStore,
      publicKeyStorage,
    }) {
      if (phantomEncryptionPublicKeyStorage !== null && publicKeyStorage !== null && sessionStore !== null)
        return {
          public_key: publicKeyStorage,
          session: sessionStore,
          phantomEncryptionPublicKey: phantomEncryptionPublicKeyStorage,
        };

      const url = new URL(fixUrlParams(window.location.href));
      const params = new URLSearchParams(url.search);
      const type = params.get('type');
      if (type === 'connect') {
        const dappEncryptionPublicKey = getKeyFromParams('dapp_encryption_public_key', dappEncryptionPublicKeyStorage);
        const dappEncryptionPrivateKey = getKeyFromParams(
          'dapp_encryption_private_key',
          dappEncryptionPrivateKeyStorage,
        );

        const phantomEncryptionPublicKey = params.get('phantom_encryption_public_key') as string;
        const nonce = params.get('nonce');
        const encodedData = params.get('data');
        const error = params.get('errorMessage');

        if (dappEncryptionPublicKey === null || dappEncryptionPrivateKey === null)
          return {
            public_key: null,
            session: null,
            phantomEncryptionPublicKey: null,
          };
        if (error) throw new Error(error);

        const sharedSecretDapp = nacl.box.before(bs58.decode(phantomEncryptionPublicKey), dappEncryptionPrivateKey);
        const { public_key, session } = decryptPayload(encodedData, nonce, sharedSecretDapp) as {
          public_key: string;
          session: string;
        };
        return {
          public_key: new PublicKey(public_key),
          session,
          phantomEncryptionPublicKey: bs58.decode(phantomEncryptionPublicKey),
        };
      }
      return {
        public_key: null,
        session: null,
        phantomEncryptionPublicKey: null,
      };
    },
  });

  const generateDappEncryptionKeyPairFx = createEffect(() => {
    const keyPair = nacl.box.keyPair();

    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.secretKey,
    };
  });

  const connectExtensionFx = attach({
    source: $provider,
    async effect(provider): Promise<boolean> {
      if (provider === null) return false;
      return await provider.connect();
    },
  });

  const connectDeeplinkFx = attach({
    source: {
      publicKey: $dappEncryptionPublicKey,
      privateKey: $dappEncryptionPrivateKey,
    },
    async effect({ publicKey, privateKey }) {
      if (publicKey === null || privateKey === null) throw new Error('Dapp encryption public key is not found');
      const searchParams = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(publicKey),
        dapp_encryption_private_key: bs58.encode(privateKey),
        type: 'connect',
      }).toString();
      const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(publicKey),
        app_url: window.location.origin,
        redirect_link: `${window.location.origin}?${searchParams}`,
      });
      const url = buildUrl(link, 'connect', params);
      window.location.href = url;
    },
  });

  const signExtensionMessageFx: Effect<Uint8Array, string, Error> = attach({
    source: $provider,
    async effect(provider, message) {
      if (provider === null) throw new Error('Solflare Extension not found');
      const { signature } = await provider.signMessage(message);

      return bs58.encode(signature);
    },
  });
  const signDeeplinkMessageFx: Effect<Uint8Array, void, Error> = attach({
    source: {
      dappEncryptionPublicKey: $dappEncryptionPublicKey,
      session: $session,
      phantomEncryptionPublicKey: $phantomEncryptionPublicKey,
      dappEncryptionPrivateKey: $dappEncryptionPrivateKey,
    },
    async effect({ dappEncryptionPublicKey, session, phantomEncryptionPublicKey, dappEncryptionPrivateKey }, message) {
      if (
        dappEncryptionPublicKey === null ||
        session === null ||
        phantomEncryptionPublicKey === null ||
        dappEncryptionPrivateKey === null
      )
        throw new Error('Dapp encryption public key is not found');
      const payload = {
        session,
        message: bs58.encode(message),
      };

      const sharedSecretDapp = nacl.box.before(phantomEncryptionPublicKey, dappEncryptionPrivateKey);
      const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecretDapp);
      const searchParams = new URLSearchParams({ type: 'message' }).toString();
      const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(dappEncryptionPublicKey),
        nonce: bs58.encode(nonce),
        payload: bs58.encode(encryptedPayload),
        redirect_link: `${window.location.origin}?${searchParams}`,
      });
      const url = buildUrl(link, 'signMessage', params);
      window.location.href = url;
    },
  });

  const disconnectExtensionFx = attach({
    source: $provider,
    async effect(provider): Promise<boolean> {
      if (provider === null) return false;
      return await provider.disconnect();
    },
  });

  persist({
    store: $dappEncryptionPublicKey,
    serialize: (value) => bs58.encode(value),
    deserialize: (value) => bs58.decode(value),
    key: 'dappEncryptionPublicKey',
  });

  persist({
    store: $dappEncryptionPrivateKey,
    serialize: (value) => bs58.encode(value),
    deserialize: (value) => bs58.decode(value),
    key: 'dappEncryptionPrivateKey',
  });

  persist({
    store: $phantomEncryptionPublicKey,
    serialize: (value) => bs58.encode(value),
    deserialize: (value) => bs58.decode(value),
    key: 'phantomEncryptionPublicKey',
  });

  persist({
    store: $session,
    key: 'session',
  });

  persist({
    store: $publicKey,
    serialize: (value) => value?.toBase58(),
    deserialize: (value) => new PublicKey(value),
    key: 'publicKey',
  });

  sample({
    clock: subscribeConnectionDeeplinkFx.done,
    fn: () => true,
    target: $isConnected,
  });
  sample({
    clock: connectDeeplinkFx.fail,
    target: generateDappEncryptionKeyPairFx,
  });
  sample({
    clock: connectDeeplinkFx.done,
    target: [subscribeConnectionDeeplinkFx, onConnected],
  });

  sample({
    clock: subscribeConnectionDeeplinkFx.doneData,
    target: spread({
      public_key: $publicKey,
      session: $session,
      phantomEncryptionPublicKey: $phantomEncryptionPublicKey,
    }),
  });

  sample({
    source: $provider,
    clock: [onConnected, onDisconnected, accountChanged],
    filter: Boolean,
    fn: (provider) => ({
      publicKey: provider.publicKey,
      isConnected: provider.isConnected,
    }),
    target: spread({
      publicKey: $publicKey,
      isConnected: $isConnected,
    }),
  });

  sample({
    clock: generateDappEncryptionKeyPairFx.doneData,
    target: spread({
      publicKey: $dappEncryptionPublicKey,
      privateKey: $dappEncryptionPrivateKey,
    }),
  });

  sample({
    clock: generateDappEncryptionKeyPairFx.done,
    target: connectDeeplinkFx,
  });

  sample({
    clock: disconnected,
    fn: () => false,
    target: $isConnected,
  });

  split({
    source: appStarted,
    match: {
      empty: empty($provider),
      provider: not(empty($provider)),
    },
    cases: {
      empty: [subscribeConnectionDeeplinkFx, subscribeTransactionDeeplinkFx, subscribeMessageDeeplinkFx],
      provider: subscribeWalletEventsFx,
    },
  });

  condition({
    source: connected,
    if: empty($provider),
    then: connectDeeplinkFx,
    else: connectExtensionFx,
  });

  condition({
    source: disconnected,
    if: empty($provider),
    then: onDisconnected,
    else: disconnectExtensionFx,
  });

  return {
    $publicKey,
    $isConnected,
    sendTransactionFx,
    signMessageFx,
    $icon,
    connected,
    subscribeMessageDeeplinkFx,
    subscribeTransactionDeeplinkFx,
    disconnected,
    onConnected,
    onDisconnected,
    $name,
    $isInstalled,
  };
});

export const phantom = invoke(phantomFactory, {
  link: 'https://phantom.app/ul/v1/',
  name: 'Phantom',
});
