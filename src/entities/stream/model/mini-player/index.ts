import { concurrency } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { Stream, StreamInfo } from '../../types';
import { invoke } from '@withease/factories';
import { $viewer } from 'shared/viewer';
import { api } from 'shared/api';
import { $allStreams } from '../list';
import { toRoomListResponse } from '../../lib/to-room-list-response';

const join = invoke(api.mutations.stream.join);
const wsUrl = invoke(api.queries.streams.wsUrl);
const info = invoke(api.queries.streams.info);

export const $stream = createStore<Stream | null>(null);
export const $streamInfo = createStore<StreamInfo | null>(null);

export const startedStream = createEvent<{ slug: string; creator: number }>();
export const finishedStream = createEvent();

sample({
  clock: startedStream,
  fn: ({ slug }) => slug,
  target: info.start,
});

sample({
  clock: info.finished.success,
  fn: ({ result }) => result,
  target: $streamInfo,
});

sample({
  clock: info.finished.success,
  source: $allStreams,
  fn: (allStreams, { result }) => {
    const prev = allStreams[result.slug];
    return {
      ...allStreams,
      [result.slug]: toRoomListResponse(result, prev),
    };
  },
  target: $allStreams,
});

sample({
  clock: info.finished.success,
  source: $viewer,
  filter: (viewer, { result }) => viewer?.user_id != result.creator.user_id,
  fn: (_, { result }) => result.slug,
  target: wsUrl.start,
});

sample({
  clock: wsUrl.finished.success,
  fn: ({ result, params }) => ({ ws_url: result, slug: params }),
  target: join.start,
});

sample({
  clock: join.finished.success,
  fn: ({ result }) => result,
  target: $stream,
});

sample({
  clock: finishedStream,
  fn: () => null,
  target: [$stream, $streamInfo],
});

concurrency(join, { abortAll: finishedStream });
concurrency(wsUrl, { abortAll: finishedStream });
concurrency(info, { abortAll: finishedStream });
