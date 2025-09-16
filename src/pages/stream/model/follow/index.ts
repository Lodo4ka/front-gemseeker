import { invoke } from "@withease/factories";
import { createFactory } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { $streamInfo } from 'entities/stream';
import { spread } from 'patronum';
import { api } from 'shared/api'; 

const subscribeFactory = createFactory(() => {
  const followMutation = api.mutations.user.follow;
  const unfollowMutation = api.mutations.user.unfollow;

  const clickedFollow = createEvent();
  const startedMutation = createEvent<boolean>();
  const subscribed = createEvent();
  const unsubscribed = createEvent();

  const $isFollow = createStore<boolean | null>(null);
  const $countSubscribers = createStore<number>(0)
    .on(subscribed, (state) => state + 1)
    .on(unsubscribed, (state) => (state > 0 ? state - 1 : 0));

  sample({
    clock: $streamInfo,
    fn: (streamInfo) => Boolean(streamInfo?.creator?.subscribed),
    target: $isFollow,
  });

  sample({
    clock: $streamInfo,
    fn: (streamInfo) => streamInfo?.creator.subscribers ?? 0,
    target: $countSubscribers,
  });

  sample({
    clock: clickedFollow,
    source: $isFollow,
    fn: (isFollow) => !isFollow,
    target: [$isFollow, startedMutation],
  });

  sample({
    clock: startedMutation,
    source: { isFollow: $isFollow, streamInfo: $streamInfo },
    filter: (_, isFollow) => !!isFollow,
    fn: ({ streamInfo }) => streamInfo?.creator.user_id ?? 0,
    target: [followMutation.start, subscribed],
  });

  sample({
    clock: startedMutation,
    source: { isFollow: $isFollow, streamInfo: $streamInfo },
    filter: (_, isFollow) => !isFollow,
    fn: ({ streamInfo }) => streamInfo?.creator.user_id ?? 0,
    target: [unfollowMutation.start, unsubscribed],
  });

  sample({
    clock: [followMutation.finished.failure, unfollowMutation.finished.failure],
    source: {
      isFollow: $isFollow,
      countSubscribers: $countSubscribers,
    },
    fn: ({ isFollow, countSubscribers }) => ({
      isFollow: !isFollow,
      countSubscribers: isFollow ? countSubscribers - 1 : countSubscribers + 1,
    }),
    target: spread({
      isFollow: $isFollow,
      countSubscribers: $countSubscribers,
    }),
  })

  return {
    clickedFollow,
    startedMutation,
    $isFollow,
    $countSubscribers,
  };
});


export const subscribeInStream = invoke(subscribeFactory);

sample({
    clock: $streamInfo,
    filter: Boolean,
    fn: (stream) => stream.creator.subscribers,
    target: subscribeInStream.$countSubscribers
})