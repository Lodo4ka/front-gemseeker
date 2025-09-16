import { authenticatedRoute, currentRoute } from './model';
import { Suspense } from 'react';
import { createRouteView } from 'atomic-router-react';
import { SoonPage } from 'pages/not-found';

// const MemescopePage = namedLazy(async () => await import('./ui'), 'MemescopePage');

const NewPairsRouteView = createRouteView({
  route: authenticatedRoute,
  view: () => (
    <Suspense fallback={<SoonPage />}>
      <SoonPage />
      {/* <MemescopePage /> */}
    </Suspense>
  ),
  otherwise: () => <SoonPage />
});

export const NewPairsRoute = {
  view: NewPairsRouteView,
  route: currentRoute,
};
