import { namedLazy } from 'shared/lib/named-lazy';
import { anonymousRoute, currentRoute } from './model';
import { createRouteView } from 'atomic-router-react';
import { PostsPageFallback } from './ui';
const PostsPage = namedLazy(async () => await import('./ui'), 'PostsPage');

const PostsRouteView = createRouteView({
  route: anonymousRoute,
  view: () => <PostsPage />,
  otherwise: PostsPageFallback,
});

export const PostsRoute = {
  view: PostsRouteView,
  route: currentRoute,
};
