import { createStore, sample } from 'effector';
import { $selectedWallet } from 'entities/wallet';
import { api } from 'shared/api';
import { amount } from './input';
import './update-balance';

export const buyTokenMutation = api.mutations.token.buy;
export const sellTokenMutation = api.mutations.token.sell;

export const $isProcessingTx = createStore<boolean>(false)
  .on([buyTokenMutation.started, sellTokenMutation.started], () => true)
  .on([buyTokenMutation.finished.finally, sellTokenMutation.finished.finally], () => false);

sample({
  clock: [buyTokenMutation.finished.success, sellTokenMutation.finished.success],
  source: $selectedWallet,
  fn: (wallet: any) => wallet?.public_key ?? '',
  target: [api.queries.wallets.balancesTokens.start, amount.$value.reinit],
});
