import { api } from 'shared/api';
import { attach, createStore, Effect, sample } from 'effector';
import { spread } from 'patronum';
import { Wallets } from '../../types';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { invoke } from '@withease/factories';


export const paginationWallet = invoke(paginationFactory, { limit: 20 });


export const $wallets = createStore<Wallets>([]);
export const $archivedWallets = createStore<Wallets>([]);

sample({
  clock: $wallets,
  fn: () => true,
  target: paginationWallet.$isEndReached,
})

const updateWalletsFx: Effect<number, { newWallets: Wallets; newArchivedWallets: Wallets }, Error> = attach({
  source: {
    wallets: $wallets,
    archivedWallets: $archivedWallets,
  },
  async effect({ wallets, archivedWallets }, id) {
    const foundWallet = wallets.find((wallet) => wallet.id === id);

    if (foundWallet?.is_active) {
      return { newWallets: wallets, newArchivedWallets: archivedWallets };
    }

    const newWallets = wallets.filter((wallet) => wallet.id !== id);
    const newArchivedWallets = foundWallet ? [...archivedWallets, foundWallet] : archivedWallets;
    return { newWallets, newArchivedWallets };
  },
});

const updateArchivedWalletsFx: Effect<number, { newWallets: Wallets; newArchivedWallets: Wallets }, Error> = attach({
  source: {
    wallets: $wallets,
    archivedWallets: $archivedWallets,
  },
  async effect({ wallets, archivedWallets }, id) {
    const foundArchivedWallet = archivedWallets.find((wallet) => wallet.id === id);
    const newArchivedWallets = archivedWallets.filter((wallet) => wallet.id !== id);
    const newWallets = foundArchivedWallet ? [...wallets, foundArchivedWallet] : wallets;

    return { newWallets, newArchivedWallets };
  },
});
const updateActiveWallets: Effect<number, { newWallets: Wallets; newArchivedWallets: Wallets }, Error> = attach({
  source: {
    wallets: $wallets,
    archivedWallets: $archivedWallets,
  },
  async effect({ wallets, archivedWallets }, id) {
    // Меняем только активные кошельки!
    const newWallets = wallets.map((wallet) => ({
      ...wallet,
      is_active: wallet.id === id,
    }));
    // Архивные не трогаем
    return { newWallets, newArchivedWallets: archivedWallets };
  },
});

const updateNameWallets: Effect<
  { id: number; name: string },
  { newWallets: Wallets; newArchivedWallets: Wallets },
  Error
> = attach({
  source: {
    wallets: $wallets,
    archivedWallets: $archivedWallets,
  },
  async effect({ wallets, archivedWallets }, { id, name }) {
    const newWallets: Wallets = [];
    const newArchivedWallets: Wallets = [];

    [...wallets, ...archivedWallets].forEach((wallet) => {
      if (wallet.id === id) {
        wallet = { ...wallet, name };
      }

      if (wallet.is_archived) {
        newArchivedWallets.push(wallet);
      } else {
        newWallets.push(wallet);
      }
    });

    return { newWallets, newArchivedWallets };
  },
});

sample({
  clock: api.queries.wallets.all.finished.success,
  fn: ({ result }) => result.filter((wallet) => wallet.is_archived === false),
  target: $wallets,
});

sample({
  clock: api.queries.wallets.all.finished.success,
  fn: ({ result }) => result.filter((wallet) => wallet.is_archived === true),
  target: $archivedWallets,
});

sample({
  clock: api.mutations.wallets.archive.started,
  fn: ({ params }) => params.id,
  target: updateWalletsFx,
});

sample({
  clock: api.mutations.wallets.unarchive.started,
  fn: ({ params }) => params.id,
  target: updateArchivedWalletsFx,
});

sample({
  clock: api.mutations.wallets.rename.started,
  fn: ({ params }) => ({ id: params.id, name: params.new_name }),
  target: updateNameWallets,
});

sample({
  clock: api.mutations.wallets.setActive.started,
  fn: ({ params }) => params.id,
  target: updateActiveWallets,
});

sample({
  clock: [
    updateWalletsFx.doneData,
    updateActiveWallets.doneData,
    updateArchivedWalletsFx.doneData,
    updateNameWallets.doneData,
  ],
  target: spread({
    newWallets: $wallets,
    newArchivedWallets: $archivedWallets,
  }),
});

sample({
  clock: api.queries.wallets.all.finished.success,
  fn: ({ result }) => result.map(({ public_key }) => public_key),
  target: api.queries.wallets.balances.start,
});
