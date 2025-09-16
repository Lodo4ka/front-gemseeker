import { createEvent, createStore } from 'effector';
import { openedGenerateWalletModal } from 'features/generate-wallet';
import { routes } from 'shared/config/router';
import { chainAuthenticated } from 'shared/viewer';

export const currentRoute = routes.memescope;

export const authenticatedRoute = chainAuthenticated(currentRoute, {
  otherwise: openedGenerateWalletModal,
});

export type platformVariant = 'Gemseeker' | 'Pump' | 'Moonshot';

export const changedPlatform = createEvent<platformVariant>()

export const $platform = createStore<platformVariant>('Gemseeker')
  .on(changedPlatform, (_, platform) => platform);