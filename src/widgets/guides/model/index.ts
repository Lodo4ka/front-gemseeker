import { persist } from 'effector-storage/session';
import { combine, createEvent, createStore, sample } from 'effector';
import { $publicKey } from 'entities/wallet';
import { ConnectWalletModalProps } from 'features/connect-wallet';
import { modalsStore } from 'shared/lib/modal';
import { routes } from 'shared/config/router';
import { createFactory, invoke } from '@withease/factories';

const guideFactory = createFactory(({key}: {key: string}) => {
  const closedGuide = createEvent();
  const $isGuideOpen = createStore<boolean>(true);

  sample({
    clock: closedGuide,
    fn: () => false,
    target: $isGuideOpen,
  });

  persist({
    store: $isGuideOpen,
    key, // 'isGuideOpen',
  });

  return {
    closedGuide,
    $isGuideOpen
  }
})

export const guideLaunchToken = invoke(guideFactory, {
  key:'isOpenGuideLaunch'
});

export const guideLaunchHowItWork = invoke(guideFactory, {
  key:'isOpenGuideHowitWork'
});

export const $isVisibleSlider = combine(
  guideLaunchToken.$isGuideOpen,
  guideLaunchHowItWork.$isGuideOpen,
  (isLaunch, isHowItWork) => isLaunch || isHowItWork
);

export const navigatedToCreateToken = createEvent();

sample({
  clock: navigatedToCreateToken,
  source: $publicKey,
  filter: (v) => v === null,
  fn: () => ConnectWalletModalProps,
  target: modalsStore.openModal,
});

sample({
  clock: navigatedToCreateToken,
  source: $publicKey,
  filter: Boolean,
  target: routes.create_token.open,
});