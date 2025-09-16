import { createFactory, invoke } from '@withease/factories';
import { createEvent, sample } from 'effector';
import { createStore } from 'effector';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { infer as types } from 'zod';

const txTableQueries = {
  DEPOSIT: api.queries.wallets.txHistory.deposit,
  WITHDRAW: api.queries.wallets.txHistory.withdraw,
};

export const limit = 10;

const tableTxFactory = createFactory(({ type }: { type: 'DEPOSIT' | 'WITHDRAW' }) => {
  const txTableQuery = txTableQueries[type];
  const resetHistory = createEvent();
  const startLoading = createEvent();
  const finishLoading = createEvent();
  const loadedList = createEvent();

  const $isLoadingFirstPage = createStore(true)
    .on(startLoading, () => true)
    .on(finishLoading, () => false)
    .on(resetHistory, () => true);

  const $history = createStore<types<typeof api.contracts.wallets.txHistory>>([]).reset(resetHistory);
  const pagination = invoke(paginationFactory, { limit });

  pagination.$isEndReached.reset(resetHistory);
  pagination.$currentPage.reset(resetHistory);

  sample({
    clock: txTableQuery.finished.success,
    source: $history,
    fn: (history, { result, params }) => {
      const map = new Map();
      if (!params.refresh) {
        [...result.filter(({ type: typeTx }) => typeTx === type), ...history].forEach((item) =>
          map.set(item.signature, item),
        );
      } else {
        result.filter(({ type: typeTx }) => typeTx === type).forEach((item) => map.set(item.signature, item));
      }
      return Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
    },
    target: $history,
  });

  sample({
    clock: [resetHistory],
    target: startLoading,
  });

  sample({
    clock: txTableQuery.finished.success,
    target: finishLoading,
  });
  sample({
    clock: txTableQuery.finished.success,
    fn: ({ result }) => result.filter(({ type: typeTx }) => typeTx === type).length < limit,
    target: pagination.$isEndReached,
  });

  sample({
    clock: loadedList,
    source: pagination.$currentPage,
    fn: (currentPage) => ({ offset: currentPage, limit }),
    target: txTableQuery.refresh,
  });

  sample({
    clock: [api.mutations.wallets.withdraw.finished.success, api.mutations.wallets.deposit.finished.success],
    source: pagination.$currentPage,
    fn: (currentPage) => ({ offset: currentPage, limit }),
    target: txTableQuery.refresh,
  });

  sample({
    clock: api.mutations.wallets.addDepositTransaction.finished.success,
    source: pagination.$currentPage,
    fn: (offset) => ({ offset }),
    target: txTableQuery.start,
  });

  sample({
    clock: pagination.$currentPage,
    fn: (offset) => ({ offset: 0, limit: offset + 10, refresh: true }),
    target: txTableQuery.refresh,
  });

  return {
    pagination,
    $history,
    $isLoadingFirstPage,
    resetHistory,
    startLoading,
    finishLoading,
    loadedList,
  };
});

export const tableDeposit = invoke(tableTxFactory, { type: 'DEPOSIT' });
export const tableWithdraw = invoke(tableTxFactory, { type: 'WITHDRAW' });
