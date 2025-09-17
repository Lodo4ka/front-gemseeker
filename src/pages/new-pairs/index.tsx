import { authenticatedRoute, currentRoute } from './model';
import { Suspense } from 'react';
import { createRouteView } from 'atomic-router-react';
import { SoonPage } from 'pages/not-found';
import { NewPairsRoot } from 'pages/new-pairs/root.tsx';
// const MemescopePage = namedLazy(async () => await import('./ui'), 'MemescopePage');

const NewPairsRouteView = createRouteView({
  route: authenticatedRoute,
  view: () => (
    <Suspense fallback={<SoonPage />}>
      <NewPairsRoot />
    </Suspense>
  ),
  otherwise: () => <SoonPage />,
});

export const NewPairsRoute = {
  view: NewPairsRouteView,
  route: currentRoute,
};
