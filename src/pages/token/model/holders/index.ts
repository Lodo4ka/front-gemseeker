import { invoke } from '@withease/factories';
import { createStore, sample } from 'effector';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { $address } from 'entities/token';
import { Holder } from '../../types/holders';
import { routes } from 'shared/config/router';

const limit = 10;

export const $holders = createStore<Holder[] | null>(null);
export const $holdersCount = $holders.map((holders) => holders?.length ?? 0);
export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {limit});

sample({
  clock: routes.token.updated,
  target: $holders.reinit,
})

sample({
  clock: onLoadedFirst,
  source: $address,
  filter: Boolean,
  fn: (address) => ({ address, offset: 0, limit }),
  target: api.queries.token.holders.refresh,
});

sample({
  clock: api.queries.token.holders.finished.success,
  source: $holders,
  fn: (holders, { result }) => {
    if (holders === null) return result;

    return [...holders, ...result];
  },
  target: $holders,
});

sample({
  clock: api.queries.token.holders.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: {
    address: $address,
    offset: $currentPage,
  },
  filter: ({ address }) => Boolean(address),
  fn: ({ address, offset }) => ({ address: address!, offset, limit }),
  target: api.queries.token.holders.refresh,
});

sample({
  clock: api.sockets.token.buyTxRawReceived,
  source: $holders,
  fn: (holders, { token_amount, user_info, token_info }) => {
    if (holders === null) return null;

    const updatedHolders = [...holders];
    const holderIndex = updatedHolders.findIndex(
      h => h?.user.user_id === user_info.user_id
    );

    console.log(holderIndex)

    if (holderIndex !== -1) {
      const holder = updatedHolders[holderIndex];
      if (!holder) return updatedHolders;

      const newAmount = holder.amount + token_amount;
      const newPercentage = (newAmount / +__ALL_SUPPLY_TOKEN__) * 100;
      
      updatedHolders[holderIndex] = {
        ...holder,
        amount: newAmount,
        percentage: newPercentage
      };
    } else {
      const newPercentage = (token_amount / +__ALL_SUPPLY_TOKEN__) * 100;
      console.log(newPercentage)
      
      updatedHolders.push({
        address: token_info.maker ?? '',
        user: user_info,
        amount: token_amount,
        percentage: newPercentage
      });
    }

    return updatedHolders;
  },
  target: $holders,
});

sample({
  clock: api.sockets.token.sellTxRawReceived,
  source: $holders,
  fn: (holders, { token_amount, user_info }) => {
    if (holders === null) return null;

    const updatedHolders = [...holders];
    const holderIndex = updatedHolders.findIndex(
      h => h?.user.user_id === user_info.user_id
    );

    if (holderIndex !== -1) {
      const holder = updatedHolders[holderIndex];
      if (!holder) return updatedHolders;

      const newAmount = holder.amount - token_amount;
      const newPercentage = (newAmount / +__ALL_SUPPLY_TOKEN__) * 100;

      if (newAmount <= 0.001) {
        updatedHolders.splice(holderIndex, 1);
      } else {
        updatedHolders[holderIndex] = {
          ...holder,
          amount: newAmount,
          percentage: newPercentage
        };
      }
    }
    
    return updatedHolders;
  },
  target: $holders,
});
