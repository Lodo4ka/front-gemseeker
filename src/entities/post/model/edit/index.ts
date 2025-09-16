import { createEvent, createStore, sample } from 'effector';

export const $isOpen = createStore(false);
export const toggled = createEvent();
export const closed = createEvent();

sample({
  clock: toggled,
  source: $isOpen,
  fn: (isOpen) => !isOpen,
  target: $isOpen,
});

sample({
  clock: closed,
  source: $isOpen,
  fn: () => false,
  target: $isOpen,
});
