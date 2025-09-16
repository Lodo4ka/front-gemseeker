import { createEvent, sample } from 'effector';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';

export const deletedStream = createEvent();

sample({
  clock: deletedStream,
  target: api.mutations.stream.delete.start,
});

sample({
  clock: api.mutations.stream.delete.finished.success,
  source: routes.stream.$isOpened,
  filter: Boolean,
  target: routes.memepad.open,
});
