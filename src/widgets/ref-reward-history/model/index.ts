import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';

import { api } from 'shared/api';
import { RefRewardHistoryResponse } from 'shared/api/queries/user/ref-reward-history';
import { paginationFactory } from 'shared/lib/pagination-factory';

const limit = 10;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage } = invoke(paginationFactory, {limit});

export const refRewardHistoryQuery = api.queries.user.refRewardHistory
export const refRewardHistoryLoadded = createEvent();

export const $refRewardHistory = createStore<null | RefRewardHistoryResponse>(null);
export const $refRewardHistoryStatus = refRewardHistoryQuery.$pending

sample({
    clock: refRewardHistoryLoadded,
    fn: () => ({
      limit,
      offset: 0
    }),
    target: refRewardHistoryQuery.refresh
});

sample({
  clock: $currentPage,
  fn: (offset) => ({ offset, limit }),
  target: refRewardHistoryQuery.refresh,
});

sample({
  clock: api.queries.user.followers.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

sample({
  clock: refRewardHistoryQuery.finished.success,
  source: $refRewardHistory,
  fn: (history, { result }) => {
    if(history === null) return result;

    return [...history, ...result]
  },
  target: $refRewardHistory
});

sample({
  clock: dataRanedOut,
  target: loadNextPage,
});

