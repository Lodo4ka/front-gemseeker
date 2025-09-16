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
import { WalletParams, BaseExtensionProvider } from '../../types';

const solflareFactory = createFactory(({ link, name }: WalletParams) => {
  const $icon = createStore<string>(
    'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgNTAgNTAiIHdpZHRoPSI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmMxMGIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmYjNmMmUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI2LjQ3ODM1IiB4Mj0iMzQuOTEwNyIgeGxpbms6aHJlZj0iI2EiIHkxPSI3LjkyIiB5Mj0iMzMuNjU5MyIvPjxyYWRpYWxHcmFkaWVudCBpZD0iYyIgY3g9IjAiIGN5PSIwIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDQuOTkyMTg4MzIgMTIuMDYzODc5NjMgLTEyLjE4MTEzNjU1IDUuMDQwNzEwNzQgMjIuNTIwMiAyMC42MTgzKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHI9IjEiIHhsaW5rOmhyZWY9IiNhIi8+PHBhdGggZD0ibTI1LjE3MDggNDcuOTEwNGMuNTI1IDAgLjk1MDcuNDIxLjk1MDcuOTQwM3MtLjQyNTcuOTQwMi0uOTUwNy45NDAyLS45NTA3LS40MjA5LS45NTA3LS45NDAyLjQyNTctLjk0MDMuOTUwNy0uOTQwM3ptLTEuMDMyOC00NC45MTU2NWMuNDY0Ni4wMzgzNi44Mzk4LjM5MDQuOTAyNy44NDY4MWwxLjEzMDcgOC4yMTU3NGMuMzc5OCAyLjcxNDMgMy42NTM1IDMuODkwNCA1LjY3NDMgMi4wNDU5bDExLjMyOTEtMTAuMzExNThjLjI3MzMtLjI0ODczLjY5ODktLjIzMTQ5Ljk1MDcuMDM4NTEuMjMwOS4yNDc3Mi4yMzc5LjYyNjk3LjAxNjEuODgyNzdsLTkuODc5MSAxMS4zOTU4Yy0xLjgxODcgMi4wOTQyLS40NzY4IDUuMzY0MyAyLjI5NTYgNS41OTc4bDguNzE2OC44NDAzYy40MzQxLjA0MTguNzUxNy40MjM0LjcwOTMuODUyNC0uMDM0OS4zNTM3LS4zMDc0LjYzOTUtLjY2MjguNjk0OWwtOS4xNTk0IDEuNDMwMmMtMi42NTkzLjM2MjUtMy44NjM2IDMuNTExNy0yLjEzMzkgNS41NTc2bDMuMjIgMy43OTYxYy4yNTk0LjMwNTguMjE4OC43NjE1LS4wOTA4IDEuMDE3OC0uMjYyMi4yMTcyLS42NDE5LjIyNTYtLjkxMzguMDIwM2wtMy45Njk0LTIuOTk3OGMtMi4xNDIxLTEuNjEwOS01LjIyOTctLjI0MTctNS40NTYxIDIuNDI0M2wtLjg3NDcgMTAuMzk3NmMtLjAzNjIuNDI5NS0uNDE3OC43NDg3LS44NTI1LjcxMy0uMzY5LS4wMzAzLS42NjcxLS4zMDk3LS43MTcxLS42NzIxbC0xLjM4NzEtMTAuMDQzN2MtLjM3MTctMi43MTQ0LTMuNjQ1NC0zLjg5MDQtNS42NzQzLTIuMDQ1OWwtMTIuMDUxOTUgMTAuOTc0Yy0uMjQ5NDcuMjI3MS0uNjM4MDkuMjExNC0uODY4LS4wMzUtLjIxMDk0LS4yMjYyLS4yMTczNS0uNTcyNC0uMDE0OTMtLjgwNmwxMC41MTgxOC0xMi4xMzg1YzEuODE4Ny0yLjA5NDIuNDg0OS01LjM2NDQtMi4yODc2LTUuNTk3OGwtOC43MTg3Mi0uODQwNWMtLjQzNDEzLS4wNDE4LS43NTE3Mi0uNDIzNS0uNzA5MzYtLjg1MjQuMDM0OTMtLjM1MzcuMzA3MzktLjYzOTQuNjYyNy0uNjk1bDkuMTUzMzgtMS40Mjk5YzIuNjU5NC0uMzYyNSAzLjg3MTgtMy41MTE3IDIuMTQyMS01LjU1NzZsLTIuMTkyLTIuNTg0MWMtLjMyMTctLjM3OTItLjI3MTMtLjk0NDMuMTEyNi0xLjI2MjEuMzI1My0uMjY5NC43OTYzLS4yNzk3IDEuMTMzNC0uMDI0OWwyLjY5MTggMi4wMzQ3YzIuMTQyMSAxLjYxMDkgNS4yMjk3LjI0MTcgNS40NTYxLTIuNDI0M2wuNzI0MS04LjU1OTk4Yy4wNDU3LS41NDA4LjUyNjUtLjk0MjU3IDEuMDczOS0uODk3Mzd6bS0yMy4xODczMyAyMC40Mzk2NWMuNTI1MDQgMCAuOTUwNjcuNDIxLjk1MDY3Ljk0MDNzLS40MjU2My45NDAzLS45NTA2Ny45NDAzYy0uNTI1MDQxIDAtLjk1MDY3LS40MjEtLjk1MDY3LS45NDAzcy40MjU2MjktLjk0MDMuOTUwNjctLjk0MDN6bTQ3LjY3OTczLS45NTQ3Yy41MjUgMCAuOTUwNy40MjEuOTUwNy45NDAzcy0uNDI1Ny45NDAyLS45NTA3Ljk0MDItLjk1MDctLjQyMDktLjk1MDctLjk0MDIuNDI1Ny0uOTQwMy45NTA3LS45NDAzem0tMjQuNjI5Ni0yMi40Nzk3Yy41MjUgMCAuOTUwNi40MjA5NzMuOTUwNi45NDAyNyAwIC41MTkzLS40MjU2Ljk0MDI3LS45NTA2Ljk0MDI3LS41MjUxIDAtLjk1MDctLjQyMDk3LS45NTA3LS45NDAyNyAwLS41MTkyOTcuNDI1Ni0uOTQwMjcuOTUwNy0uOTQwMjd6IiBmaWxsPSJ1cmwoI2IpIi8+PHBhdGggZD0ibTI0LjU3MSAzMi43NzkyYzQuOTU5NiAwIDguOTgwMi0zLjk3NjUgOC45ODAyLTguODgxOSAwLTQuOTA1My00LjAyMDYtOC44ODE5LTguOTgwMi04Ljg4MTlzLTguOTgwMiAzLjk3NjYtOC45ODAyIDguODgxOWMwIDQuOTA1NCA0LjAyMDYgOC44ODE5IDguOTgwMiA4Ljg4MTl6IiBmaWxsPSJ1cmwoI2MpIi8+PC9zdmc+',
  );
  const $name = createStore<'Solflare' | 'Phantom'>(name);
  const $isInstalled = createStore<boolean>(window?.solflare ? true : false);
  const onConnected = createEvent();
  const onDisconnected = createEvent();

  const $provider = createStore<BaseExtensionProvider | null>(window?.solflare ? window.solflare : null).reset(
    onDisconnected,
  );
  const $publicKey = createStore<PublicKey | null>(window?.solflare?.publicKey ?? null).reset(onDisconnected);
  const $isConnected = createStore<boolean>(window?.solflare?.isConnected ?? false).reset(onDisconnected);
  const $dappEncryptionPublicKey = createStore<Uint8Array | null>(null).reset(onDisconnected);
  const $solflareEncryptionPublicKey = createStore<Uint8Array | null>(null).reset(onDisconnected);
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
      $solflareEncryptionPublicKey,
      (dappEncryptionPublicKey, dappEncryptionPrivateKey, session, solflareEncryptionPublicKey) => ({
        dappEncryptionPublicKey,
        dappEncryptionPrivateKey,
        session,
        solflareEncryptionPublicKey,
      }),
    ),
    async effect(
      { dappEncryptionPublicKey, dappEncryptionPrivateKey, session, solflareEncryptionPublicKey },
      { transaction, options },
    ) {
      if (
        dappEncryptionPublicKey === null ||
        dappEncryptionPrivateKey === null ||
        session === null ||
        solflareEncryptionPublicKey === null
      )
        throw new Error('Dapp encryption key pair is not found');
      try {
        const searchParams = new URLSearchParams({ type: 'transaction' }).toString();
        const payload = {
          session,
          options,
          transaction: bs58.encode(transaction.serialize({ requireAllSignatures: false })),
        };
        const sharedSecretDapp = nacl.box.before(solflareEncryptionPublicKey, dappEncryptionPrivateKey);
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
      solflareEncryptionPublicKey: $solflareEncryptionPublicKey,
    },
    async effect({ dappEncryptionPrivateKey, solflareEncryptionPublicKey }) {
      if (solflareEncryptionPublicKey === null || dappEncryptionPrivateKey === null) return null;
      const url = new URL(fixUrlParams(window.location.href));
      const params = new URLSearchParams(url.search);
      const type = params.get('type');
      if (type === 'transaction') {
        const nonce = params.get('nonce');
        const encodedData = params.get('data');
        const error = params.get('errorMessage');

        if (error) throw error;

        const sharedSecretDapp = nacl.box.before(solflareEncryptionPublicKey, dappEncryptionPrivateKey);
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
      solflareEncryptionPublicKey: $solflareEncryptionPublicKey,
    },
    async effect({ dappEncryptionPrivateKey, solflareEncryptionPublicKey }) {
      if (solflareEncryptionPublicKey === null || dappEncryptionPrivateKey === null) return null;

      const url = new URL(fixUrlParams(window.location.href));
      const params = new URLSearchParams(url.search);
      const type = params.get('type');

      if (type === 'message') {
        const nonce = params.get('nonce');
        const encodedData = params.get('data');
        const error = params.get('errorMessage');

        if (error) throw error;

        const sharedSecretDapp = nacl.box.before(solflareEncryptionPublicKey, dappEncryptionPrivateKey);
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
      solflareEncryptionPublicKeyStorage: $solflareEncryptionPublicKey,
      sessionStore: $session,
      publicKeyStorage: $publicKey,
    },
    async effect({
      dappEncryptionPublicKeyStorage,
      dappEncryptionPrivateKeyStorage,
      solflareEncryptionPublicKeyStorage,
      sessionStore,
      publicKeyStorage,
    }) {
      if (solflareEncryptionPublicKeyStorage !== null && publicKeyStorage !== null && sessionStore !== null)
        return {
          public_key: publicKeyStorage,
          session: sessionStore,
          solflareEncryptionPublicKey: solflareEncryptionPublicKeyStorage,
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

        const solflareEncryptionPublicKey = params.get('solflare_encryption_public_key') as string;
        const nonce = params.get('nonce');
        const encodedData = params.get('data');
        const error = params.get('errorMessage');

        if (dappEncryptionPublicKey === null || dappEncryptionPrivateKey === null)
          return {
            public_key: null,
            session: null,
            solflareEncryptionPublicKey: null,
          };
        if (error) throw new Error(error);

        const sharedSecretDapp = nacl.box.before(bs58.decode(solflareEncryptionPublicKey), dappEncryptionPrivateKey);
        const { public_key, session } = decryptPayload(encodedData, nonce, sharedSecretDapp) as {
          public_key: string;
          session: string;
        };
        return {
          public_key: new PublicKey(public_key),
          session,
          solflareEncryptionPublicKey: bs58.decode(solflareEncryptionPublicKey),
        };
      }
      return {
        public_key: null,
        session: null,
        solflareEncryptionPublicKey: null,
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
      solflareEncryptionPublicKey: $solflareEncryptionPublicKey,
      dappEncryptionPrivateKey: $dappEncryptionPrivateKey,
    },
    async effect({ dappEncryptionPublicKey, session, solflareEncryptionPublicKey, dappEncryptionPrivateKey }, message) {
      if (
        dappEncryptionPublicKey === null ||
        session === null ||
        solflareEncryptionPublicKey === null ||
        dappEncryptionPrivateKey === null
      )
        throw new Error('Dapp encryption public key is not found');
      const payload = {
        session,
        message: bs58.encode(message),
      };

      const sharedSecretDapp = nacl.box.before(solflareEncryptionPublicKey, dappEncryptionPrivateKey);
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
    store: $solflareEncryptionPublicKey,
    serialize: (value) => bs58.encode(value),
    deserialize: (value) => bs58.decode(value),
    key: 'solflareEncryptionPublicKey',
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
      solflareEncryptionPublicKey: $solflareEncryptionPublicKey,
    }),
  });

  sample({
    source: $provider,
    clock: [onConnected, onDisconnected],
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
    $icon,
    signMessageFx,
    connected,
    subscribeMessageDeeplinkFx,
    subscribeTransactionDeeplinkFx,
    disconnected,
    onConnected,
    $name,
    $isInstalled,
    onDisconnected,
  };
});

export const solflare = invoke(solflareFactory, {
  link: 'https://solflare.com/ul/v1/',
  name: 'Solflare',
});
