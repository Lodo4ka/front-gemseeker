import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { throttle } from 'patronum/throttle';

import { api } from 'shared/api';
import { LeaderboardTop100Response } from 'shared/api/queries/leaderboard/top100';
import { routes } from 'shared/config/router';
import { paginationFactory } from 'shared/lib/pagination-factory';

const limit = 15;

export const { $isEndReached, dataRanedOut, loadNextPage } = invoke(paginationFactory, { limit });

export const leaderBoardQuery = api.queries.leaderboard.top100;

export type sortingFilterParams = 'volume' | 'pnl' | null;

export const changedSortingFilter = createEvent<sortingFilterParams>();
export const loaddedLeaderBoard = createEvent();
export const refreshLeaderBoard = createEvent();

export const $sortingFilter = createStore<sortingFilterParams>(null).on(changedSortingFilter, (_, payload) => payload);
export const $leaderboard = createStore<LeaderboardTop100Response | null>(null)
  .on(leaderBoardQuery.$data, (_, payload) => payload)

sample({
  clock: [loaddedLeaderBoard, changedSortingFilter],
  source: {
    sort_field: $sortingFilter,
    leaderboard: $leaderboard,
    isPending: leaderBoardQuery.$pending,
  },
  filter: (
  {
    leaderboard,
    isPending,
  }: {
    leaderboard: LeaderboardTop100Response | null;
    isPending: boolean;
  },
    params: sortingFilterParams,
  ) => Boolean((!leaderboard && !isPending) || params),
  fn: ({ sort_field }: { sort_field: sortingFilterParams }) => ({
    sort_field,
  }),
  target: leaderBoardQuery.start,
});

sample({
  clock: routes.leaderboard.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => null,
  target: $leaderboard
})

$isEndReached
  .on($leaderboard, () => true)

throttle(refreshLeaderBoard, 300 * 1000);

sample({
  clock: refreshLeaderBoard,
  source: $sortingFilter,
  fn: ({ sort_field }: { sort_field: sortingFilterParams }) => ({
    sort_field,
  }),
  target: leaderBoardQuery.refresh,
});
