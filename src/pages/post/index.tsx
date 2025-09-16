import { namedLazy } from 'shared/lib/named-lazy';
import { anonymousRoute, currentRoute } from './model';
import { createRouteView } from 'atomic-router-react';
import { Suspense } from 'react';
import { RouteParams, RouteInstance } from 'atomic-router';
import { PostPageFallback } from './ui';

const PostPage = namedLazy(async () => await import('./ui'), 'PostPage');

const PostRouteView = createRouteView({
  route: anonymousRoute as unknown as RouteInstance<RouteParams>,
  view: () => (
    <Suspense fallback={<PostPageFallback />}>
      <PostPage />
    </Suspense>
  ),
  otherwise: PostPageFallback,
});

export const PostRoute = {
  view: PostRouteView,
  route: currentRoute,
};
