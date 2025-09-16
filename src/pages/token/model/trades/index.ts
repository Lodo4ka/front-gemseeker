import { invoke } from '@withease/factories';
import { createStore, sample } from 'effector';
import { $address, $token } from 'entities/token';

import { api } from 'shared/api';
import { TxTradesQueryResponse } from 'shared/api/queries/transaction/trades';
import { paginationFactory } from 'shared/lib/pagination-factory';

const limit = 20;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {
  limit,
});

export const $trades = createStore<TxTradesQueryResponse | null>(null);

sample({
  clock: $address,
  target: [$trades.reinit, $currentPage.reinit, $isEndReached.reinit],
});

sample({
  clock: onLoadedFirst,
  source: $address,
  filter: Boolean,
  fn: (address) => ({ token_id_address: address }),
  target: api.queries.transaction.trades.start,
});

sample({
  clock: api.queries.transaction.trades.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

sample({
  clock: api.queries.transaction.trades.finished.success,
  source: $trades,
  fn: (trades, { result }) => {
    if (trades === null) return result;
    return Array.from(new Set([...trades, ...result])).filter((trade) => trade.type !== 'DEPLOY');
  },
  target: $trades,
});

sample({
  clock: loadNextPage,
  source: {
    currentPage: $currentPage,
    address: $address,
  },
  filter: ({ address }) => Boolean(address),
  fn: ({ currentPage, address }) => ({ offset: currentPage, limit, token_id_address: address as string }),
  target: api.queries.transaction.trades.start,
});

sample({
  clock: [api.sockets.token.sellTxRawReceived, api.sockets.token.buyTxRawReceived],
  source: {
    trades: $trades,
    token: $token,
  },
  filter: ({ token }, tx) => token?.address === tx.token_info.address,
  fn: ({ trades }, trade) => {
    const currentTrade = {
      user_info: trade.user_info,
      hash: trade.hash,
      token_amount: trade.token_amount,
      sol_amount: trade.sol_amount,
      type: trade.type,
      rate: trade.rate,
      timestamp: trade.timestamp,
      pnl: trade.pnl,
      maker: trade.token_info.maker,
    };
    if (trades === null) return [currentTrade];
    return [currentTrade, ...trades];
  },
  target: $trades,
});

sample({
  clock: [api.sockets.token.sellTxRawReceived, api.sockets.token.buyTxRawReceived],
  source: {
    currentPage: $currentPage,
    token: $token,
  },
  filter: ({ token }, tx) => token?.address === tx.token_info.address,
  fn: ({ currentPage }) => currentPage + 1,
  target: $currentPage,
});
