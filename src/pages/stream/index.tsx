import { namedLazy } from 'shared/lib/named-lazy';
import { authenticatedRoute, currentRoute } from './model';
import { createRouteView } from 'atomic-router-react';
import { RouteInstance, RouteParams } from 'atomic-router';
import { StreamPageFallback } from './ui';
import { Suspense } from 'react';

const StreamPage = namedLazy(async () => await import('./ui'), 'StreamPage');

const StreamRouteView = createRouteView({
  route: authenticatedRoute as unknown as RouteInstance<RouteParams>,
  view: () => (
    <Suspense fallback={<StreamPageFallback />}>
      <StreamPage />
    </Suspense>
  ),
  otherwise: StreamPageFallback,
});

export const StreamRoute = {
  view: StreamRouteView,
  route: currentRoute,
};
