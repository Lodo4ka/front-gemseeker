import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { hrefUrl } from '../../config';
import { spread } from 'patronum';
import { copyFactory } from 'shared/lib/copy';

export const { copied } = invoke(() => copyFactory('You have successfully copied the link'));

export const $isOpen = createStore(false);
export const toggled = createEvent();
export const closed = createEvent();

export const shared = createEvent();

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

sample({
  clock: shared,
  source: $isOpen,
  fn: (_) => ({
    isOpen: false,
    copy: hrefUrl,
  }),
  target: spread({
    isOpen: $isOpen,
    copy: copied,
  }),
});
