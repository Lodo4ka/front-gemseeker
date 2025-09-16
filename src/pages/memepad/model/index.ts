import { openedGenerateWalletModal } from 'features/generate-wallet';
import { routes } from 'shared/config/router';
import { chainAuthenticated } from 'shared/viewer';

export const currentRoute = routes.memepad;

export const authenticatedRoute = chainAuthenticated(currentRoute, {
  otherwise: openedGenerateWalletModal,
});