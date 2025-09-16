import { namedLazy } from 'shared/lib/named-lazy';
import { anonymousRoute, currentRoute } from './model';
import { createRouteView } from 'atomic-router-react';

const ReferPage = namedLazy(async () => await import('./ui'), 'ReferPage');

const ReferRouteView = createRouteView({
  route: anonymousRoute,
  view: ReferPage,
  // otherwise: WalletPageFallback,
});

export const ReferRoute = {
  view: ReferRouteView,
  route: currentRoute,
};
