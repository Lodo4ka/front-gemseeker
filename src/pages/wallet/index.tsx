import { namedLazy } from 'shared/lib/named-lazy';
import { Suspense } from 'react';
import { anonymousRoute, currentRoute } from './model';
import { WalletPageFallback } from './ui';
import { createRouteView } from 'atomic-router-react';

const WalletPage = namedLazy(async () => await import('./ui'), 'WalletPage');

const WalletRouteView = createRouteView({
  route: anonymousRoute,
  view: () => (
    <Suspense fallback={<WalletPageFallback />}>
      <WalletPage />
    </Suspense>
  ),
  otherwise: WalletPageFallback,
});

export const WalletRoute = {
  view: WalletRouteView,
  route: currentRoute,
};
