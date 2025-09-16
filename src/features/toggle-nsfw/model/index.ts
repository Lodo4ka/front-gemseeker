import { checkboxFactory } from 'shared/lib/checkbox';

import { invoke } from '@withease/factories';
import { createEvent, sample } from 'effector';
import { ModalProps, modalsStore } from 'shared/lib/modal';
import { ToggleNSFWModal } from '../ui/approve-modal';
import { TOGGLE_NSFW_MODAL_ID } from '../config';
import { persist } from 'effector-storage/local';

export const { $isChecked: $isNSFWEnabled, toggled, toggledChecked, toggledUnchecked } = invoke(checkboxFactory, {});

export const handleToggled = createEvent();

const ToggleNSFWModalProps: ModalProps = {
  Modal: ToggleNSFWModal,
  isOpen: false,
  props: {
    id: TOGGLE_NSFW_MODAL_ID,
    onClose: toggledUnchecked,
  },
};

sample({
  clock: handleToggled,
  source: $isNSFWEnabled,
  filter: Boolean,
  target: toggledUnchecked,
});

sample({
  clock: handleToggled,
  source: $isNSFWEnabled,
  filter: (isNSFWEnabled) => !isNSFWEnabled,
  fn: () => ToggleNSFWModalProps,
  target: modalsStore.openModal,
});

sample({
  clock: [toggledChecked, toggledUnchecked],
  fn: () => ({ id: TOGGLE_NSFW_MODAL_ID }),
  target: modalsStore.closeModal,
});

persist({
  store: $isNSFWEnabled,
  key: 'isNSFWEnabled',
});
