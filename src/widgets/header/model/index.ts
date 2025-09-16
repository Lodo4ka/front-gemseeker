import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { ConnectWalletModalProps } from 'features/connect-wallet';
import { router, routes } from 'shared/config/router';
import { requiredAuthFactory } from 'shared/lib/factories/required-auth';

export const navigatedToCreateToken = createEvent();

invoke(requiredAuthFactory, {
  startEvent: navigatedToCreateToken,
  finishEvent: routes.create_token.open,
  ConnectWalletModalProps,
});

export const toggledMenu = createEvent();
export const toggledSearch = createEvent();

export const hiddenMenu = createEvent();
export const hiddenSearch = createEvent();

export const $isOpenMenu = createStore<boolean>(false)
  .on(toggledMenu, (state) => !state)
  .on(hiddenMenu, () => false);
export const $isOpenSearch = createStore<boolean>(false)
  .on(toggledSearch, (state) => !state)
  .on(hiddenSearch, () => false);

sample({
  clock: router.$path,
  target: [hiddenMenu, hiddenSearch],
});
