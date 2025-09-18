import { authenticatedRoute, currentRoute } from './model';
import { Suspense } from 'react';
import { createRouteView } from 'atomic-router-react';
import { SoonPage } from 'pages/not-found';
import { TrendingPage } from './TrendingPage';

const TrendingRouteView = createRouteView({
  route: authenticatedRoute,
  view: () => (
    <Suspense fallback={<SoonPage />}>
      <TrendingPage />
    </Suspense>
  ),
  otherwise: () => <SoonPage />,
});

export const TrendingRoute = {
  view: TrendingRouteView,
  route: currentRoute,
};
