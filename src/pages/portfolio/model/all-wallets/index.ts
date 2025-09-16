import { createEvent, createStore } from "effector";
import { selectedWallet } from "entities/wallet";

export const togglesAllWallets = createEvent();

export const $selectAllWallets = createStore<boolean>(true)
    .on(togglesAllWallets, (state) => !state)
    .on(selectedWallet, () => false)
