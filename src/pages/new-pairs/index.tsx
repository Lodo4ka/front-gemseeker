import { authenticatedRoute, currentRoute } from './model';
import { Suspense } from 'react';
import { createRouteView } from 'atomic-router-react';
import { SoonPage } from 'pages/not-found';
import { NewPairsPage } from 'pages/new-pairs/NewPairsPage';

const NewPairsRouteView = createRouteView({
  route: authenticatedRoute,
  view: () => (
    <Suspense fallback={<SoonPage />}>
      <NewPairsPage />
    </Suspense>
  ),
  otherwise: () => <SoonPage />,
});

export const NewPairsRoute = {
  view: NewPairsRouteView,
  route: currentRoute,
};
