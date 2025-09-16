import { sample } from 'effector';
import { $slug } from 'entities/stream';
import { openedGenerateWalletModal } from 'features/generate-wallet';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { chainAuthenticated } from 'shared/viewer';

export const currentRoute = routes.stream;

export const authenticatedRoute = chainAuthenticated(currentRoute, {
  otherwise: openedGenerateWalletModal,
});

export const $routeSlug = authenticatedRoute.$params.map((params) => params.slug ?? null);

sample({
  clock: $routeSlug,
  filter: (slug) => slug === null,
  // fn: () => {console.log('open memepad')},
  target: routes.memepad.open,
});

sample({
  clock: $routeSlug,
  target: $slug,
});

sample({
  clock: $slug,
  filter: Boolean,
  fn: (slug) => ({ offset: 0, limit: 10, slug }),
  target: api.queries.streams.donations.start,
});

sample({
  clock: authenticatedRoute.closed,
  source: api.sockets.chat.$socket,
  filter: Boolean,
  fn: (socket) => socket.close(),
});
