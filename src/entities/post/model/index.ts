import { createEffect, createEvent, createStore, sample } from 'effector';
import { PostObject, PostsIds } from '../types';
import { api } from 'shared/api';
import { isHttpErrorCode } from '@farfetched/core';
import { debounce } from 'patronum';
import { loadImageSizes } from '../lib/load-size';

export const postViewed = createEvent<{ id: number }>();
const $viewsQueue = createStore<{ ref: Set<number> }>({ ref: new Set() }).on(postViewed, ({ ref }, { id }) => ({
  ref: ref.add(id),
}));

const debouncedPostViewed = debounce({ source: postViewed, timeout: 2000 });

export const $posts = createStore<PostObject>({});

export const $userPostsIds = createStore<PostsIds>(null);
export const $friendsPostsIds = createStore<PostsIds>(null);
export const $globalPostsIds = createStore<PostsIds>(null);

sample({
  clock: debouncedPostViewed,
  source: $viewsQueue,
  filter: (queue) => queue.ref.size > 0,
  fn: ({ ref }) => Array.from(ref.keys()),
  target: api.mutations.post.view.start,
});

sample({
  clock: api.mutations.post.view.finished.success,
  source: $viewsQueue,
  fn: (queue, { result }) => {
    const newQueue = { ref: new Set(queue.ref) };
    result.forEach(({ post_id }) => newQueue.ref.delete(post_id));
    return newQueue;
  },
  target: $viewsQueue,
});

sample({
  clock: api.mutations.post.view.finished.success,
  source: $posts,
  fn: (posts, { result }) => {
    const updatedPosts = { ...posts };

    result.forEach(({ post_id, count }) => {
      if (updatedPosts[post_id]) {
        updatedPosts[post_id] = {
          ...updatedPosts[post_id],
          views: count,
        };
      }
    });

    return updatedPosts;
  },
  target: $posts,
});

sample({
  clock: api.queries.post.byUser.finished.success,
  source: $userPostsIds,
  fn: (posts, { result, params }) => {
    const newPosts = result.map((post) => post.id);
    if (posts === null || params.refresh) return newPosts;
    return Array.from(new Set([...posts, ...newPosts]));
  },
  target: $userPostsIds,
});

sample({
  clock: api.queries.post.byFriends.finished.success,
  source: $friendsPostsIds,
  fn: (posts, { result, params }) => {
    const newPosts = result.map((post) => post.id);
    if (posts === null || params.refresh) return newPosts;
    return Array.from(new Set([...posts, ...newPosts]));
  },
  target: $friendsPostsIds,
});

sample({
  clock: api.queries.post.byFriends.finished.failure,
  filter: isHttpErrorCode(401),
  fn: () => [],
  target: $friendsPostsIds,
});

sample({
  clock: api.queries.post.global.finished.success,
  source: $globalPostsIds,
  fn: (posts, { result, params }) => {
    const newPosts = result.map((post) => post.id);
    if (posts === null || params.refresh) return newPosts;
    return Array.from(new Set([...posts, ...newPosts]));
  },
  target: $globalPostsIds,
});
sample({
  clock: [api.mutations.post.create.finished.success, api.queries.post.byId.finished.success],
  source: $posts,
  fn: (posts, { result }) => ({ ...posts, ...Object.fromEntries([[result.id, result]]) }),
  target: $posts,
});

sample({
  clock: api.mutations.post.create.finished.success,
  source: $globalPostsIds,
  fn: (posts, { result }) => {
    if (posts === null) return [result.id];
    return Array.from(new Set([result.id, ...posts]));
  },
  target: $globalPostsIds,
});

sample({
  clock: api.mutations.post.create.finished.success,
  source: $userPostsIds,
  fn: (posts, { result }) => {
    if (posts === null) return [result.id];
    return Array.from(new Set([result.id, ...posts]));
  },
  target: $userPostsIds,
});

sample({
  clock: [
    api.queries.post.byUser.finished.success,
    api.queries.post.byFriends.finished.success,
    api.queries.post.global.finished.success,
  ],
  source: $posts,
  fn: (posts, { result }) => ({ ...posts, ...Object.fromEntries(result.map((p) => [p.id, p])) }),
  target: $posts,
});

sample({
  clock: api.mutations.post.like.finished.failure,
  source: $posts,
  fn: (posts, { params }) => {
    if (!posts[params]) return posts;
    return {
      ...posts,
      [params]: {
        ...posts[params],
        liked: false,
        likes: posts[params].likes - 1,
      },
    };
  },
  target: $posts,
});

sample({
  clock: api.mutations.post.unlike.finished.failure,
  source: $posts,
  fn: (posts, { params }) => {
    if (!posts[params]) return posts;
    return {
      ...posts,
      [params]: {
        ...posts[params],
        liked: true,
        likes: posts[params].likes + 1,
      },
    };
  },
  target: $posts,
});

sample({
  clock: api.mutations.post.like.started,
  source: $posts,
  fn: (posts, { params }) => {
    if (!posts[params]) return posts;
    return {
      ...posts,
      [params]: {
        ...posts[params],
        liked: true,
        likes: posts[params].likes + 1,
      },
    };
  },
  target: $posts,
});
sample({
  clock: api.mutations.post.unlike.started,
  source: $posts,
  fn: (posts, { params }) => {
    if (!posts[params]) return posts;
    return {
      ...posts,
      [params]: {
        ...posts[params],
        liked: false,
        likes: posts[params].likes - 1,
      },
    };
  },
  target: $posts,
});
