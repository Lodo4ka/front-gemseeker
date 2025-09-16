import { namedLazy } from 'shared/lib/named-lazy';
import { authenticatedRoute, currentRoute } from './model';
import { createRouteView } from 'atomic-router-react';
import { RouteInstance, RouteParams } from 'atomic-router';
import { ProfilePageFallback } from './ui';
import { Suspense } from 'react';
const ProfilePage = namedLazy(async () => await import('./ui'), 'ProfilePage');

const ProfileRouteView = createRouteView({
  route: authenticatedRoute as unknown as RouteInstance<RouteParams>,
  view: () => (
    <Suspense fallback={<ProfilePageFallback />}>
      <ProfilePage />
    </Suspense>
  ),
  otherwise: ProfilePageFallback,
});

export const ProfileRoute = {
  view: ProfileRouteView,
  route: currentRoute,
};
