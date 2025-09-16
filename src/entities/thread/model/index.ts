import { createStore, sample } from 'effector';
import { ThreadIds, ThreadObject } from '../types';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';

export const $threads = createStore<ThreadObject>({});

export const $tokenThreadsIds = createStore<ThreadIds>(null);

sample({
  clock: routes.token.updated,
  target: $tokenThreadsIds.reinit,
})

sample({
  clock: api.queries.thread.byToken.finished.success,
  source: $tokenThreadsIds,
  fn: (threads, { result }) => {
    const newThreads = Array.from(new Set(result.map((thread) => thread.id)));
    if (threads === null) return newThreads;

    return [...threads, ...newThreads];
  },
  target: $tokenThreadsIds,
});

sample({
  clock: api.mutations.thread.create.finished.success,
  source: $threads,
  fn: (threads, { result, params }) => ({
    ...threads,
    [params.token_id]: {
      ...threads[params.token_id],
      ...Object.fromEntries([[result.id, result]]),
    },
  }),
  target: $threads,
});

sample({
  clock: api.mutations.thread.create.finished.success,
  source: $tokenThreadsIds,
  fn: (threads, { result }) => {
    if (threads === null) return [result.id];
    return Array.from(new Set([result.id, ...threads]));
  },
  target: $tokenThreadsIds,
});

sample({
  clock: api.queries.thread.byToken.finished.success,
  source: $threads,
  fn: (threads, { result, params }) => ({
    ...threads,
    [params.token_id]: {
      ...threads[params.token_id],
      ...Object.fromEntries(result.map((thread) => [thread.id, thread])),
    },
  }),
  target: $threads,
});

sample({
  clock: api.mutations.thread.like.finished.failure,
  source: $threads,
  fn: (threads, { params }) => {
    const thread = threads[params.token_id]?.[params.id];
    if (!thread) return threads;
    return {
      ...threads,
      [params.token_id]: {
        ...threads[params.token_id],
        [params.id]: {
          ...thread,
          liked: false,
          likes: thread.likes - 1,
        },
      },
    };
  },
  target: $threads,
});

sample({
  clock: api.mutations.thread.unlike.finished.failure,
  source: $threads,
  fn: (threads, { params }) => {
    const thread = threads[params.token_id]?.[params.id];
    if (!thread) return threads;
    return {
      ...threads,
      [params.token_id]: {
        ...threads[params.token_id],
        [params.id]: {
          ...thread,
          liked: true,
          likes: thread.likes + 1,
        },
      },
    };
  },
  target: $threads,
});

sample({
  clock: api.mutations.thread.like.started,
  source: $threads,
  fn: (threads, { params }) => {
    const thread = threads[params.token_id]?.[params.id];
    if (!thread) return threads;
    return {
      ...threads,
      [params.token_id]: {
        ...threads[params.token_id],
        [params.id]: {
          ...thread,
          liked: true,
          likes: thread.likes + 1,
        },
      },
    };
  },
  target: $threads,
});
sample({
  clock: api.mutations.thread.unlike.started,
  source: $threads,
  fn: (threads, { params }) => {
    const thread = threads[params.token_id]?.[params.id];
    if (!thread) return threads;
    return {
      ...threads,
      [params.token_id]: {
        ...threads[params.token_id],
        [params.id]: {
          ...thread,
          liked: false,
          likes: thread.likes - 1,
        },
      },
    };
  },
  target: $threads,
});
