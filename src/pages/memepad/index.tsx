import { namedLazy } from 'shared/lib/named-lazy';

import { authenticatedRoute, currentRoute } from './model';
import { MemepadFallback } from './ui';
import { Suspense } from 'react';
import { createRouteView } from 'atomic-router-react';

const MemepadPage = namedLazy(async () => await import('./ui'), 'MemepadPage');

const MemepadRouteView = createRouteView({
  route: authenticatedRoute,
  view: () => (
    <Suspense fallback={<MemepadFallback />}>
      <MemepadPage />
    </Suspense>
  ),
  otherwise: () => <MemepadFallback />
});

export const MemepadRoute = {
  view: MemepadRouteView,
  route: currentRoute,
};
