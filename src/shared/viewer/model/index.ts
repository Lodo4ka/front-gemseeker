import { combine, createStore, sample } from 'effector';
import { infer as types } from 'zod';

import { $publicKey } from 'entities/wallet';
import { api } from 'shared/api';
import { sockets } from 'shared/api/sockets';
import { once } from 'patronum';
import { appStarted } from 'shared/config/init';

export type Viewer = types<typeof api.contracts.user.me>;

export enum ViewerStatus {
  Initial,
  Pending,
  ConnectedWallets,
  Authenticated,
  AuthenticatedWithNoWallets,
  Anonymous,
}

export const $viewerStatus = createStore(ViewerStatus.Initial);
export const $viewer = createStore<null | Viewer>(null);

sample({
  clock: api.queries.user.me.finished.success,
  fn: ({ result }) => result,
  target: $viewer,
});

$viewerStatus.on($publicKey, (_, public_key) => {
  if (public_key) return ViewerStatus.ConnectedWallets;
  return ViewerStatus.Anonymous;
});

$viewerStatus.on(api.queries.wallets.all.$pending, (status) => {
  if (status === ViewerStatus.Initial) return ViewerStatus.Pending;
  return status;
});

sample({
  clock: api.queries.wallets.all.finished.success,
  fn: ({ result }) => {
    if (result.length === 0) return ViewerStatus.AuthenticatedWithNoWallets;
    return ViewerStatus.Authenticated;
  },
  target: $viewerStatus,
});

$viewerStatus.on(combine(api.queries.wallets.all.$failed, $publicKey), (status, [isFailed, public_key]) => {
  if (public_key) return ViewerStatus.ConnectedWallets;
  if (isFailed) return ViewerStatus.Anonymous;
  if (status === ViewerStatus.Pending) return ViewerStatus.Anonymous;
  return status;
});

sample({
  clock: appStarted,
  target: [sockets.token.connectSocketFx, sockets.stream.connectSocketFx],
});
