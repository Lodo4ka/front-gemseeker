import { createEvent, createStore, sample, createEffect, split, combine } from 'effector';
import { solflare, phantom } from '../adapters';
import { BaseExtensionProvider, Wallet } from '../types';
import { PublicKey } from '@solana/web3.js';

const $currentWallet = createStore<'Phantom' | 'Solflare' | null>(null);
export const selectedWallet = createEvent<'Phantom' | 'Solflare'>();
sample({
  clock: selectedWallet,
  target: $currentWallet,
});

type AdapterModel = {
  provider?: BaseExtensionProvider;
  name: 'Solflare' | 'Phantom';
  publicKey?: PublicKey;
};

const createAdapterModel = ({ provider, publicKey }: AdapterModel) => {
  const onConnected = createEvent();
  const onDisconnected = createEvent();

  const $isInstalled = createStore<boolean>(provider ? true : false);
  const $provider = createStore<BaseExtensionProvider | null>(provider ? provider : null).reset(onDisconnected);
  const $publicKey = createStore<PublicKey | null>(publicKey ?? null).reset(onDisconnected);
  const $isConnected = createStore<boolean>(provider?.isConnected ?? false).reset(onDisconnected);
  return {
    $provider,
    $isInstalled,
  };
};

const solflareAdapter = createAdapterModel({
  provider: window?.solflare,
  publicKey: window?.solflare?.publicKey,
  name: 'Solflare',
});

const phantomAdapter = createAdapterModel({
  provider: window?.phantom?.solana,
  publicKey: window?.phantom?.solana?.publicKey,
  name: 'Phantom',
});

const adaptersMap: Record<'Solflare' | 'Phantom', ReturnType<typeof createAdapterModel>> = {
  Solflare: solflareAdapter,
  Phantom: phantomAdapter,
};

export const $globalProvider = combine($currentWallet, (wallet) => (wallet ? adaptersMap[wallet].$provider : null));
