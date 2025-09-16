import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { $userPostsIds } from 'entities/post';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { $viewer } from 'shared/viewer';

export const limit = 10;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {limit});
export const $id = routes.profile.$params.map(({ id }) => +id);

sample({
  clock: $id,
  target: [$userPostsIds.reinit, onLoadedFirst],
});

sample({
  clock: api.queries.post.byUser.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

sample({
  clock: loadNextPage,
  source: {
    offset: $currentPage,
    user_id: $id,
    from_id: $viewer.map((viewer) => viewer?.user_id || null),
  },
  fn: ({ from_id, user_id, offset }) => ({ from_id, user_id, offset, limit }),
  target: api.queries.post.byUser.refresh,
});

sample({
  clock: onLoadedFirst,
  source: {
    user_id: $id,
    from_id: $viewer.map((viewer) => viewer?.user_id || null),
  },
  fn: ({ from_id, user_id }) => ({ from_id, user_id, offset: 0, limit }),
  target: api.queries.post.byUser.start,
});

sample({
  clock: api.mutations.post.create.finished.success,
  source: $currentPage,
  fn: (currentPage) => {
    if (currentPage === 0) return 0;
    return currentPage + 1;
  },
  target: $currentPage,
});
