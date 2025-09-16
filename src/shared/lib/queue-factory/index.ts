import { $isPausedNewData, PauseVariant } from 'features/pause-control';

import { createFactory } from '@withease/factories';
import { createEvent, createStore, EventCallable, sample } from 'effector';

export type QueueParams<T> = {
  rawMessageReceived: EventCallable<T>;
  pause: PauseVariant;
};

export const queueFactory = createFactory(<T>({ rawMessageReceived, pause }: QueueParams<T>) => {
  const queuedMessageReceived = createEvent<T>();
  const messageReceived = createEvent<T>();
  const batchMessageReceived = createEvent<T[]>();
  const removedFromQueue = createEvent();

  const $queue = createStore<T[]>([])
    .on(queuedMessageReceived, (queue, msg) => [...queue, msg])
    .on(removedFromQueue, (queue) => queue.slice(1))
    .reset(batchMessageReceived);

  sample({
    clock: rawMessageReceived,
    source: $isPausedNewData,
    filter: (paused) => paused !== 'all' && paused !== pause,
    fn: (_, msg) => msg,
    target: messageReceived,
  });

  sample({
    clock: rawMessageReceived,
    source: $isPausedNewData,
    filter: (paused) => paused === 'all' || paused === pause,
    fn: (_, msg) => msg,
    target: queuedMessageReceived,
  });

  sample({
    clock: $isPausedNewData.updates,
    source: {
      paused: $isPausedNewData,
      queue: $queue,
    },
    filter: ({ paused, queue }) => {
      return paused !== 'all' && paused !== pause && queue.length === 1;
    },
    fn: ({ queue }) => queue[0] as T,
    target: messageReceived,
  });

  sample({
    clock: $isPausedNewData.updates,
    source: {
      paused: $isPausedNewData,
      queue: $queue,
    },
    filter: ({ paused, queue }) => {
      return paused !== 'all' && paused !== pause && queue.length > 1;
    },
    fn: ({ queue }) => queue,
    target: batchMessageReceived,
  });

  sample({
    clock: messageReceived,
    source: $queue,
    filter: (queue) => queue.length > 0,
    target: removedFromQueue,
  });

  return { messageReceived, batchMessageReceived };
});

export const queueSingleFactory = createFactory(<T>({ rawMessageReceived, pause }: QueueParams<T>) => {
  const queuedMessageReceived = createEvent<T>();
  const messageReceived = createEvent<T>();
  const flushedQueue = createEvent();
  const removedFromQueue = createEvent();
  const $queue = createStore<T[]>([])
    .on(queuedMessageReceived, (queue, msg) => [...queue, msg])
    .on(removedFromQueue, (queue) => queue.slice(1));

  sample({
    clock: rawMessageReceived,
    source: $isPausedNewData,
    filter: (paused) => paused !== 'all' && paused !== pause,
    fn: (_, msg) => msg,
    target: messageReceived,
  });

  sample({
    clock: rawMessageReceived,
    source: $isPausedNewData,
    filter: (paused) => paused === 'all' || paused === pause,
    fn: (_, msg) => msg,
    target: queuedMessageReceived,
  });

  sample({
    clock: flushedQueue,
    source: $queue,
    filter: (queue) => queue.length > 0,
    fn: ([first]) => first as T,
    target: messageReceived,
  });

  sample({
    clock: $isPausedNewData.updates,
    filter: (paused) => !paused,
    target: flushedQueue,
  });

  sample({
    clock: messageReceived,
    source: $queue,
    filter: (queue) => queue.length > 0,
    target: removedFromQueue,
  });

  return messageReceived;
});
