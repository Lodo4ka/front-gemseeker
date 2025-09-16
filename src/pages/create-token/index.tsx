import { namedLazy } from 'shared/lib/named-lazy';
import { anonymousRoute, currentRoute } from './model';
import { createRouteView } from 'atomic-router-react';
import { Suspense } from 'react';
import { CreateTokenPageFallback } from './ui';

const CreateTokenPage = namedLazy(async () => await import('./ui'), 'CreateTokenPage');

const CreateTokenRouteView = createRouteView({
  route: anonymousRoute,
  view: () => (
    <Suspense fallback={<CreateTokenPageFallback />}>
      <CreateTokenPage />
    </Suspense>
  ),
  otherwise: CreateTokenPageFallback,
});

export const CreateTokenRoute = {
  view: CreateTokenRouteView,
  route: currentRoute,
};
