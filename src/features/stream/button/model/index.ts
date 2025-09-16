import { invoke } from '@withease/factories';
import { createEvent, sample } from 'effector';
import { openedCreateStreamModal } from '../../create';
import { requiredAuthFactory } from 'shared/lib/factories/required-auth';
import { ConnectWalletModalProps } from 'features/connect-wallet';
import { $viewer } from 'shared/viewer';
import { routes } from 'shared/config/router';

export const buttonClicked = createEvent();

const openedStartStreamModal = createEvent();
const triedBackToStream = createEvent();

const navigatedToStream = createEvent();

invoke(requiredAuthFactory, {
  startEvent: openedStartStreamModal,
  finishEvent: openedCreateStreamModal,
  ConnectWalletModalProps,
});

invoke(requiredAuthFactory, {
  startEvent: triedBackToStream,
  finishEvent: navigatedToStream,
  ConnectWalletModalProps,
});

sample({
  clock: buttonClicked,
  source: $viewer,
  filter: (viewer) => viewer?.stream !== null,
  target: triedBackToStream,
});

sample({
  clock: buttonClicked,
  source: $viewer,
  filter: (viewer) => viewer?.stream === null,
  target: openedStartStreamModal,
});

sample({
  clock: navigatedToStream,
  source: $viewer,
  filter: (v) => v?.stream?.type === 'token_stream',
  fn: (v) => ({ address: v?.stream?.slug as string }),
  target: routes.token.open,
});
sample({
  clock: navigatedToStream,
  source: $viewer,
  filter: (v) => v?.stream?.type === 'no_token_stream',
  fn: (v) => ({ slug: v?.stream?.slug as string }),
  target: routes.stream.open,
});
