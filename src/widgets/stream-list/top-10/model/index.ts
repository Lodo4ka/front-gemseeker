import { createEvent, sample } from 'effector';
import { $isNSFWEnabled } from 'features/toggle-nsfw';
import { api } from 'shared/api';

export const onLoadedFirst = createEvent();

sample({
  clock: onLoadedFirst,
  source: $isNSFWEnabled,
  fn: (show_nsfw) => ({ offset: 0, sorting_filter: 'all_streams' as const, show_nsfw }),
  target: api.queries.streams.list.start,
});

sample({
  clock: $isNSFWEnabled,
  fn: (show_nsfw) => ({ offset: 0, sorting_filter: 'all_streams' as const, show_nsfw, refresh: true }),
  target: api.queries.streams.list.refresh,
});
