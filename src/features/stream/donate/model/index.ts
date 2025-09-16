import { createEvent, sample } from 'effector';
import { DONATE_MODAL } from '../config';
import { modalsStore } from 'shared/lib/modal';
import { DonateModalProps } from '../ui/modal';
import { createForm, createField } from '@effector-reform/core';
import { zodAdapter } from '@effector-reform/zod';
import { formSchema } from '../config';
import { $slug } from 'entities/stream';
import { api } from 'shared/api';

export const openedModal = createEvent();

sample({
  clock: openedModal,
  fn: () => DonateModalProps,
  target: modalsStore.openModal,
});

export const $$form = createForm({
  schema: {
    amount: createField<string>(''),
  },
  validation: zodAdapter(formSchema),
  validationStrategies: ['change', 'submit'],
});

sample({
  clock: $$form.validatedAndSubmitted,
  source: $slug,
  filter: Boolean,
  fn: (slug, { amount }) => ({ slug, amount: Number(amount) }),
  target: api.mutations.stream.donate.start,
});

sample({
  clock: api.mutations.stream.donate.finished.success,
  fn: () => ({ id: DONATE_MODAL }),
  target: modalsStore.closeModal,
});
