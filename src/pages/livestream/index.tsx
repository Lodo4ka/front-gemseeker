import { createRouteView } from 'atomic-router-react';
import { Suspense } from 'react';

import { namedLazy } from 'shared/lib/named-lazy';
import { authenticatedRoute, currentRoute } from './model';

const LivestreamPage = namedLazy(async () => await import('./ui'), 'LivestreamPage');

const LivestreamRouteView = createRouteView({
  route: authenticatedRoute,
  view: () => (
    <Suspense fallback={<LivestreamPage />}>
      <LivestreamPage />
    </Suspense>
  ),
  otherwise: () => <LivestreamPage />
});

export const LivestreamRoute = {
  view: LivestreamRouteView,
  route: currentRoute,
};
