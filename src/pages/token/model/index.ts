import { sample } from 'effector';
import { $slug, $stream, $isHost, $streamInfo } from 'entities/stream';
import { $address } from 'entities/token';
import { openedGenerateWalletModal } from 'features/generate-wallet';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { chainAuthenticated } from 'shared/viewer';

export const currentRoute = routes.token;

export const authenticatedRoute = chainAuthenticated(currentRoute, {
  otherwise: openedGenerateWalletModal,
});

sample({
  clock: $address,
  target: [$slug.reinit, $stream.reinit, $isHost.reinit, $streamInfo.reinit],
});

sample({
  clock: $address,
  filter: Boolean,
  target: api.queries.token.single.start,
});

sample({
  clock: authenticatedRoute.closed,
  source: api.sockets.chat.$socket,
  filter: Boolean,
  fn: (socket) => socket.close(),
});
