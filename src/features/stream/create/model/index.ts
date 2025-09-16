import { createEvent, createEffect, createStore, sample } from 'effector';
import { CREATE_STREAM_MODAL } from '../config';
import { api } from 'shared/api';
import { modalsStore } from 'shared/lib/modal';
import { spread } from 'patronum';
import { $slug } from 'entities/stream';
import { routes } from 'shared/config/router';
import { createArrayField, createField, createForm } from '@effector-reform/core';
import { Task } from '../types/tasks';
import { formSchema } from '../config';
import { zodAdapter } from '@effector-reform/zod';
import { $$tokenForm, createTokenFx } from 'features/token/create';
import { CreateStreamFxParams } from '../types';
import { CreateStreamParams } from 'shared/api/mutations/stream/create';

export const taskAdded = createEvent();
export const taskRemoved = createEvent<number>();

export const $address = createStore<string | null>(null);
export const changedAddress = createEvent<string | null>();

export const $$form = createForm({
  validationStrategies: ['submit'],
  schema: {
    name: createField<string>(''),
    tasks: createArrayField<Task>([]),
  },
  validation: zodAdapter(formSchema),
});

export const createStreamFx = createEffect<CreateStreamFxParams, CreateStreamParams, Error>(
  ({ name, tasks, address }) => {
    const newTasks = tasks.map((task) => ({
      description: task.title,
      token_address: address,
      donation_target: !address ? Number(task.target) : null,
      mcap_target: address ? Number(task.target) : null,
    }));
    return {
      name,
      tasks: newTasks,
      show_stream_on: address ? [address] : [],
    };
  },
);

sample({
  clock: taskAdded,
  fn: () => ({
    title: '',
    target: '',
  }),
  target: $$form.fields.tasks.push,
});

sample({
  clock: changedAddress,
  target: $address,
});

sample({
  clock: $$form.validatedAndSubmitted,
  source: {
    address: $address,
    tokenForm: $$tokenForm.$values,
  },
  filter: ({ tokenForm }) => tokenForm.livestream === false,
  fn: ({ address }, { name, tasks }) => ({ name, tasks, address }),
  target: createStreamFx,
});

sample({
  clock: api.mutations.stream.create.finished.success,
  target: $$form.reset,
});

sample({
  clock: createStreamFx.doneData,
  target: api.mutations.stream.create.start,
});

sample({
  clock: $$form.validatedAndSubmitted,
  source: $$tokenForm.$values,
  filter: ({ livestream }) => livestream === true,
  fn: (tokenForm) => tokenForm,
  target: createTokenFx,
});

sample({
  clock: api.mutations.token.create.finished.success,
  source: {
    values: $$form.$values,
    isValid: $$form.$isValid,
  },
  filter: ({ isValid }) => isValid,
  fn: ({ values }, { result }) => {
    return {
      tasks: values.tasks,
      name: values.name,
      address: result.address,
    };
  },
  target: createStreamFx,
});

sample({
  clock: api.mutations.stream.create.finished.success,
  source: $address,
  filter: Boolean,
  fn: (address, { result }) => ({
    address: { id: CREATE_STREAM_MODAL },
    slug: result,
    route: { address },
  }),
  target: spread({
    address: modalsStore.closeModal,
    slug: $slug,
    route: routes.token.open,
  }),
});

sample({
  clock: api.mutations.stream.create.finished.success,
  source: $address,
  filter: (address) => address === null,
  fn: (_, { result }) => ({
    address: { id: CREATE_STREAM_MODAL },
    slug: result,
    route: { slug: result },
  }),
  target: spread({
    address: modalsStore.closeModal,
    slug: $slug,
    route: routes.stream.open,
  }),
});

sample({
  clock: api.mutations.token.create.finished.success,
  source: $$tokenForm.$values,
  filter: ({ livestream }) => livestream === true,
  fn: (_, { result }) => result.address,
  target: changedAddress,
});
