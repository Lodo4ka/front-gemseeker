import { combine, sample } from 'effector';
import { $posts } from 'entities/post';
import { openedGenerateWalletModal } from 'features/generate-wallet';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { $viewer, chainAuthenticated } from 'shared/viewer';

export const currentRoute = routes.post;

export const anonymousRoute = chainAuthenticated(currentRoute, {
  otherwise: openedGenerateWalletModal,
});

const $postId = anonymousRoute.$params.map(({ id }) => Number(id));

export const $post = combine($posts, $postId, (posts, id) => posts[id] ?? null);

sample({
  clock: $postId,
  source: $viewer,
  fn: (viewer, id) => ({ from_id: viewer?.user_id, post_id: id }),
  target: api.queries.post.byId.start,
});
