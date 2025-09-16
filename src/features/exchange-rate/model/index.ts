import { createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';
import { interval } from 'patronum';
import { api } from 'shared/api';
import { appStarted } from 'shared/config/init';

export const $rate = createStore<number>(0);

persist({
  store: $rate,
  key: 'rate',
});

sample({
  clock: api.queries.rate.finished.success,
  fn: ({ result }) => Number(result),
  target: $rate,
});
const { tick } = interval({
  timeout: 60000,
  start: appStarted,
});

sample({
  clock: tick,
  target: api.queries.rate.start,
});

sample({
  clock: appStarted,
  target: api.queries.rate.start,
});
