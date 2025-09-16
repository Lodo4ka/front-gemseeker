import { invoke } from '@withease/factories';
import { ConnectWalletModalProps } from 'features/connect-wallet';
import { routes } from 'shared/config/router';
import { chainRequiredAuthFactory } from 'shared/lib/factories/required-auth';
import { chainAnonymous } from 'shared/viewer';

export const currentRoute = routes.create_token;

const otherwise = invoke(chainRequiredAuthFactory, {
  currentRoute,
  ConnectWalletModalProps
});

export const anonymousRoute = chainAnonymous(currentRoute, {
  otherwise,
});
