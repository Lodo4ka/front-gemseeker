import { namedLazy } from 'shared/lib/named-lazy';
import { anonymousRoute, currentRoute } from './model';
import { createRouteView } from 'atomic-router-react';
import { Suspense } from 'react';
import { PortfolioPageFallback } from './ui';
const PortfolioPage = namedLazy(async () => await import('./ui'), 'PortfolioPage');

const PortfolioRouteView = createRouteView({
  route: anonymousRoute,
  view: () => (
    <Suspense fallback={<PortfolioPageFallback />}>
      <PortfolioPage />
    </Suspense>
  ),
  otherwise: PortfolioPageFallback,
});

export const PortfolioRoute = {
  view: PortfolioRouteView,
  route: currentRoute,
};
