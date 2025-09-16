import { SendOptions, PublicKey, Transaction } from '@solana/web3.js';
import { Effect, EventCallable, StoreWritable } from 'effector';

export type WalletParams = {
  link: string;
  name: 'Solflare' | 'Phantom';
};

export type WalletEvent = 'disconnect' | 'connect' | 'accountChanged';

export interface BaseExtensionProvider {
  publicKey: PublicKey | null;
  isConnected: boolean;
  signAndSendTransaction: (transaction: Transaction, options?: SendOptions) => Promise<string>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  signMessage: (message: Uint8Array) => Promise<{ publicKey: PublicKey; signature: Uint8Array }>;
  on: (event: WalletEvent, handler: (args: any) => void) => void;
  off: (event: WalletEvent, handler: (args: any) => void) => void;
}

export type Wallet = {
  $publicKey: StoreWritable<PublicKey | null>;
  $isConnected: StoreWritable<boolean>;
  sendTransactionFx: Effect<{ transaction: Transaction; options?: SendOptions }, string | null, Error>;
  signMessageFx: Effect<Uint8Array, string | null, Error>;
  connected: EventCallable<void>;
  $icon: StoreWritable<string>;
  subscribeMessageDeeplinkFx: Effect<void, string | null, Error>;
  subscribeTransactionDeeplinkFx: Effect<void, string | null, Error>;
  disconnected: EventCallable<void>;
  onConnected: EventCallable<void>;
  $name: StoreWritable<'Solflare' | 'Phantom'>;
  $isInstalled: StoreWritable<boolean>;
  onDisconnected: EventCallable<void>;
};
