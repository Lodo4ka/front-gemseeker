import { createEvent, sample } from 'effector';
import { modalsStore } from 'shared/lib/modal';
import { CreateTokenModalProps } from '../../ui/modal';

export const openedModal = createEvent();

sample({
  clock: openedModal,
  fn: () => CreateTokenModalProps,
  target: modalsStore.openModal,
});
