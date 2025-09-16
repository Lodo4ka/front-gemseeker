import { routes } from 'shared/config/router';
import { chainAuthenticated } from 'shared/viewer';
import { openedGenerateWalletModal } from 'features/generate-wallet';

export const currentRoute = routes.livestream;

export const authenticatedRoute = chainAuthenticated(currentRoute, {
  otherwise: openedGenerateWalletModal,
});
