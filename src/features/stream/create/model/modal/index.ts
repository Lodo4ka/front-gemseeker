import { createEvent, sample } from 'effector';
import { CreateStreamModalProps } from '../../ui/modal';
import { modalsStore } from 'shared/lib/modal';

export const openedCreateStreamModal = createEvent<string | null>();

sample({
  clock: openedCreateStreamModal,
  fn: (address) => {
    if (address) {
      return CreateStreamModalProps(address);
    }
    return CreateStreamModalProps(null);
  },
  target: modalsStore.openModal,
});
