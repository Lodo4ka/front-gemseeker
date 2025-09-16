import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { createEvent } from 'effector';
import { createStore } from 'effector';
import { ConnectWalletModalProps } from 'features/connect-wallet';
import { routes } from 'shared/config/router';
import { chainRequiredAuthFactory } from 'shared/lib/factories/required-auth';
import { chainAnonymous } from 'shared/viewer';

export const currentRoute = routes.portfolio;

const otherwise = invoke(chainRequiredAuthFactory, {
  currentRoute,
  ConnectWalletModalProps
});

export const anonymousRoute = chainAnonymous(currentRoute, {
  otherwise,
});

export const $activeTab = createStore<number>(0);
export const tabChanged = createEvent<number>();

sample({
  clock: tabChanged,
  target: $activeTab,
});