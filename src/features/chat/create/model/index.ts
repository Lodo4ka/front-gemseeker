import { createField, createForm } from '@effector-reform/core';
import { zodAdapter } from '@effector-reform/zod';
import { sample } from 'effector';
import { api } from 'shared/api';
import { object, string } from 'zod';

export const $$form = createForm({
  schema: {
    message: createField<string>(''),
  },
  validation: zodAdapter(object({ message: string().min(1, 'Please enter at least 1 character') })),
  validationStrategies: ['change', 'submit'],
});

sample({
  clock: $$form.validatedAndSubmitted,
  fn: (form) => form.message,
  target: api.sockets.chat.messageSent,
});

sample({
  clock: api.sockets.chat.messageSent,
  target: $$form.reset,
});
