import { createEvent, createStore, sample } from 'effector';
import { $address } from 'entities/token';
import { api } from 'shared/api';
import { debug, once } from 'patronum';

export const onFirstLoaded = createEvent();

// export const changedActiveTab = createEvent<number>();
// export const $activeTab = createStore(0);

// debug(changedActiveTab)

sample({
  clock: once(onFirstLoaded),
  source: $address,
  filter: Boolean,
  target: api.queries.token.mcap.start,
});
