import { invoke } from '@withease/factories';
import { createEvent } from 'effector';
import { ConnectWalletModalProps } from 'features/connect-wallet';
import { routes } from 'shared/config/router';
import { requiredAuthFactory } from 'shared/lib/factories/required-auth';

export const openedStartStreamModal = createEvent();

invoke(requiredAuthFactory, {
  startEvent: openedStartStreamModal,
  finishEvent: routes.create_token.open,
  ConnectWalletModalProps,
});
