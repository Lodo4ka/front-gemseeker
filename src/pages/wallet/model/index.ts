import { createEvent, createStore, sample } from 'effector';
import { routes } from 'shared/config/router';
import { api } from 'shared/api';
import { chainAnonymous } from 'shared/viewer';
import { chainRequiredAuthFactory } from 'shared/lib/factories/required-auth';
import { invoke } from '@withease/factories';
import { ConnectWalletModalProps } from 'features/connect-wallet';

export const currentRoute = routes.wallet;

const otherwise = invoke(chainRequiredAuthFactory, {
  currentRoute,
  ConnectWalletModalProps,
});

export const anonymousRoute = chainAnonymous(currentRoute, {
  otherwise,
});

sample({
  clock: api.mutations.wallets.create.finished.success,
  target: api.queries.wallets.all.refresh,
});

export const $activeTab = createStore(0);
export const changedActiveTab = createEvent<number>();

sample({
  clock: changedActiveTab,
  target: $activeTab,
});
