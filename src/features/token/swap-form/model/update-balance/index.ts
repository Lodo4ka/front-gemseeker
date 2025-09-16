import { sample } from "effector";
import { $balancesSplTokens } from "entities/token";
import { $walletsBalances } from "entities/wallet";
import { $selectWallet } from "entities/wallet/model";
import { spread } from "patronum";
import { api } from "shared/api";
import { LAMPORTS_PER_TOKEN } from "shared/constants";

sample({
    clock:api.sockets.token.buyTxRawReceived,
    source: {
        walletsBalances: $walletsBalances,
        balancesSplTokens: $balancesSplTokens,
        selectWallet: $selectWallet
    },
    filter: ({balancesSplTokens}, messageBuy) => Boolean(balancesSplTokens?.[messageBuy.token_info.maker ?? '']),
    fn: ({walletsBalances, balancesSplTokens, selectWallet}, messageBuy) => {
        const copyBalancesSol = new Map(walletsBalances);
        const copyBalancesSpl = {...balancesSplTokens};
        const addressWallet = selectWallet?.public_key ?? '';

        const balanceSolWallet = copyBalancesSol.get(addressWallet) ?? 0;
        copyBalancesSol.set(addressWallet, balanceSolWallet - messageBuy.sol_amount);

        
        if (copyBalancesSpl[addressWallet]) {
            copyBalancesSpl[addressWallet] = (copyBalancesSpl[addressWallet] ?? []).map((token) => {
                if(token.address === messageBuy.token_info.address) {
                    return {
                        ...token, 
                        amount: token.amount - (messageBuy.token_amount * LAMPORTS_PER_TOKEN)
                    }
                }
                return token
            })
        }

        
        console.log(copyBalancesSol, copyBalancesSpl)

        return {
            sol: copyBalancesSol,
            spl: copyBalancesSpl
        };
    },
     target: spread({
        sol: $walletsBalances,
        spl: $balancesSplTokens
    })
});

sample({
    clock:api.sockets.token.sellTxRawReceived,
    source: {
        walletsBalances: $walletsBalances,
        balancesSplTokens: $balancesSplTokens,
        selectWallet: $selectWallet
    },
    filter: ({balancesSplTokens}, messageSell) => Boolean(balancesSplTokens?.[messageSell.token_info.maker ?? '']),
    fn: ({walletsBalances, balancesSplTokens, selectWallet}, messageSell) => {
        const copyBalancesSol = new Map(walletsBalances);
        const copyBalancesSpl = {...balancesSplTokens};
        const addressWallet = selectWallet?.public_key ?? '';

        const balanceSolWallet = copyBalancesSol.get(addressWallet) ?? 0;
        copyBalancesSol.set(addressWallet, balanceSolWallet + messageSell.sol_amount);

        if (copyBalancesSpl[addressWallet]) {
            copyBalancesSpl[addressWallet] = (copyBalancesSpl[addressWallet] ?? []).map((token) => {
                if(token.address === messageSell.token_info.address) {
                    return {
                        ...token, 
                        amount: token.amount - (messageSell.token_amount * LAMPORTS_PER_TOKEN)
                    }
                }
                return token
            })
        }

        return {
            sol: copyBalancesSol,
            spl: copyBalancesSpl
        };
    },
    target: spread({
        sol: $walletsBalances,
        spl: $balancesSplTokens
    })
});


