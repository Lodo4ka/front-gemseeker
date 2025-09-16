import { namedLazy } from 'shared/lib/named-lazy';

import { authenticatedRoute, currentRoute } from './model';
import { MemescopeFallback } from './ui';
import { Suspense } from 'react';
import { createRouteView } from 'atomic-router-react';
import { SoonPage } from 'pages/not-found';

// const MemescopePage = namedLazy(async () => await import('./ui'), 'MemescopePage');

const MemepadRouteView = createRouteView({
  route: authenticatedRoute,
  view: () => (
    <Suspense fallback={<SoonPage />}>
      <SoonPage />
      {/* <MemescopePage /> */}
    </Suspense>
  ),
  otherwise: () => <SoonPage />
});

export const MemescopeRoute = {
  view: MemepadRouteView,
  route: currentRoute,
};
