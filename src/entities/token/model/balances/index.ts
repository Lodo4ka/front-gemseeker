import { combine, createStore, sample } from "effector";
import { api } from "shared/api";
import { $selectedWallet } from "entities/wallet";
import { $token } from "..";
import { LAMPORTS_PER_TOKEN } from "shared/constants";

type balancesSplTokens = Record<string, {
    address: string;
    amount: number;
    mint: string;
    owner: string;
    delegated_amount: number;
    frozen: boolean;
    burnt?: any;
}[]>

const balancesTokensQuery = api.queries.wallets.balancesTokens

export const $balancesSplTokens = createStore<balancesSplTokens>({});
export const $balanceToken = combine($balancesSplTokens, $selectedWallet, $token, (balances, wallet, token) => (
    (balances[wallet?.public_key ?? '']?.find((balance) => balance.mint === token?.address)?.amount ?? 0)
    /
    LAMPORTS_PER_TOKEN
))

sample({
    clock: $selectedWallet,
    filter: Boolean, 
    fn: (wallet) => wallet?.public_key,
    target: balancesTokensQuery.start
});

sample({
    clock: balancesTokensQuery.$data,
    source: $balancesSplTokens,
    fn: (balances, data) => {
        return ({
            ...balances,
            ...data,
        })
    },
    target: $balancesSplTokens
});


