import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { ConnectWalletModalProps } from 'features/connect-wallet';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { chainRequiredAuthFactory } from 'shared/lib/factories/required-auth';
import { chainAnonymous } from 'shared/viewer';

export const currentRoute = routes.refer;

const otherwise = invoke(chainRequiredAuthFactory, {
  currentRoute,
  ConnectWalletModalProps
});

export const anonymousRoute = chainAnonymous(currentRoute, {
  otherwise,
});

sample({
  clock: anonymousRoute.opened,
  target: api.queries.user.me.refresh,
});
