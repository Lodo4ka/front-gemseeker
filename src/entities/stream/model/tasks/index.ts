import { createStore, sample } from 'effector';
import { Task } from '../../types';
import { api } from 'shared/api';

export const $tasks = createStore<Task[]>([]);
export const $pending = createStore<boolean>(true);

sample({
  clock: api.queries.streams.tasks.finished.success,
  fn: ({ result }) => result,
  target: $tasks,
});

sample({
  clock: api.queries.streams.tasks.finished.finally,
  fn: () => false,
  target: $pending,
});
