import { namedLazy } from 'shared/lib/named-lazy';
import { authenticatedRoute, currentRoute } from './model';
import { createRouteView } from 'atomic-router-react';
import { LeaderboardPageFallback } from './ui';
import { Suspense } from 'react';

const LeaderboardPage = namedLazy(async () => await import('./ui'), 'LeaderboardPage');

const LeaderboardRouteView = createRouteView({
  route: authenticatedRoute,
  // view: LeaderboardPage,
  view: () => (
    <Suspense fallback={<LeaderboardPageFallback />}>
      <LeaderboardPage />
    </Suspense>
  ),
  otherwise: () => <LeaderboardPageFallback />
  // otherwise: WalletPageFallback,
});

export const LeaderboardRoute = {
  view: LeaderboardRouteView,
  route: currentRoute,
};
