import { createFactory, invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';

import type { ModalProps, ModalId } from './index.type';

const modalsState = createFactory(() => {
  const openModal = createEvent<ModalProps>();
  const closeModal = createEvent<ModalId>();

  const $modals = createStore<ModalProps[]>([]);

  $modals.on(closeModal, (modals, { id }) =>
    modals.map((modal) => (modal.props.id === id ? { ...modal, isOpen: false } : modal)),
  );

  sample({
    clock: openModal,
    source: { modals: $modals },
    fn: ({ modals }, newModal: ModalProps) => {
      const oldModals = [...modals];
      const modalIndex = oldModals.findIndex((modal) => modal.props.id === newModal.props.id);

      const modalToAdd = { ...newModal, isOpen: true };

      if (modalIndex === -1) {
        return [...oldModals, modalToAdd];
      }

      return oldModals.map((modal, index) => (index === modalIndex ? modalToAdd : modal));
    },
    target: $modals,
  });

  return { openModal, closeModal, $modals };
});

export const modalsStore = invoke(modalsState);

export { ModalId, ModalProps };
