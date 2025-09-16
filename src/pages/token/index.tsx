import { namedLazy } from 'shared/lib/named-lazy';
import { authenticatedRoute, currentRoute } from './model';
import { createRouteView } from 'atomic-router-react';
import { RouteInstance, RouteParams } from 'atomic-router';
import { Suspense } from 'react';
import { TokenPageFallback } from './ui';

const TokenPage = namedLazy(async () => await import('./ui'), 'TokenPage');

const TokenRouteView = createRouteView({
  route: authenticatedRoute as unknown as RouteInstance<RouteParams>,
  view: () => (
    <Suspense fallback={<TokenPageFallback />}>
      <TokenPage />
    </Suspense>
  ),
  otherwise: TokenPageFallback,
});

export const TokenRoute = {
  view: TokenRouteView,
  route: currentRoute,
};
