import { combine, createStore, sample } from 'effector';
import { AllStreams, StreamListItem, StreamsIds } from '../../types';
import { api } from 'shared/api';
import { removeKey } from 'shared/lib/remove-key';
import { removeSlugFromList } from '../../lib/remove-slug';
import { spread } from 'patronum';
import { invoke } from '@withease/factories';
import { queueSingleFactory } from 'shared/lib/queue-factory';
import { routes } from 'shared/config/router';
import { $isNSFWEnabled } from 'features/toggle-nsfw';

export const $allStreams = createStore<AllStreams>({});

const $streamUnsortedWithTokensIds = createStore<StreamsIds>(null);
const $streamUnsortedNoTokensIds = createStore<StreamsIds>(null);
const $allUnsortedStreamsIds = createStore<StreamsIds>(null);

// Reset streams data when leaving memepad page
sample({
  clock: routes.memepad.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => ({}),
  target: $allStreams,
});

sample({
  clock: routes.memepad.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => null,
  target: $streamUnsortedWithTokensIds,
});

sample({
  clock: routes.memepad.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => null,
  target: $streamUnsortedNoTokensIds,
});

sample({
  clock: routes.memepad.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => null,
  target: $allUnsortedStreamsIds,
});

export const $streamWithTokensIds = combine([$allStreams, $streamUnsortedWithTokensIds], ([map, ids]) => {
  if (ids === null) return null;
  return [...ids]
    .filter((id): id is string => !!map[id])
    .sort((a, b) => (map[b] as StreamListItem).viewers - (map[a] as StreamListItem).viewers);
});

export const $streamNoTokensIds = combine([$allStreams, $streamUnsortedNoTokensIds], ([map, ids]) => {
  if (ids === null) return null;
  return [...ids]
    .filter((id): id is string => !!map[id])
    .sort((a, b) => (map[b] as StreamListItem).viewers - (map[a] as StreamListItem).viewers);
});

export const $allStreamsIds = combine([$allStreams, $allUnsortedStreamsIds], ([map, ids]) => {
  if (ids === null) return null;
  return [...ids].filter((id): id is string => !!map[id]);
});

sample({
  clock: api.queries.streams.list.finished.success,
  source: $allStreams,
  fn: (streams, { result }) => ({ ...streams, ...Object.fromEntries(result.map((stream) => [stream.slug, stream])) }),
  target: $allStreams,
});

sample({
  clock: api.queries.streams.list.finished.success,
  source: $allUnsortedStreamsIds,
  filter: (_, { params }) => params.sorting_filter === 'all_streams',
  fn: (allStreamsIds, { result, params }) => {
    const newStreams = result.map((stream) => stream.slug);
    if (allStreamsIds === null || params.refresh) return newStreams;
    return Array.from(new Set([...allStreamsIds, ...newStreams]));
  },
  target: $allUnsortedStreamsIds,
});

sample({
  clock: api.queries.streams.list.finished.success,
  source: $streamUnsortedNoTokensIds,
  filter: (_, { params }) => params.sorting_filter === 'no_token_stream',
  fn: (noTokenStreamsIds, { result, params }) => {
    const newStreams = result.map((stream) => stream.slug);
    if (noTokenStreamsIds === null || params.refresh) return newStreams;
    return Array.from(new Set([...noTokenStreamsIds, ...newStreams]));
  },
  target: $streamUnsortedNoTokensIds,
});

sample({
  clock: api.queries.streams.list.finished.success,
  source: $streamUnsortedWithTokensIds,
  filter: (_, { params }) => params.sorting_filter === 'token_stream',
  fn: (withTokenStreamsIds, { result, params }) => {
    const newStreams = result.map((stream) => stream.slug);
    if (withTokenStreamsIds === null || params.refresh) return newStreams;
    return Array.from(new Set([...withTokenStreamsIds, ...newStreams]));
  },
  target: $streamUnsortedWithTokensIds,
});

const finishedReceived = invoke(() =>
  queueSingleFactory({ rawMessageReceived: api.sockets.stream.finishedRawReceived, pause: 'streams' }),
);

const createdReceived = invoke(() =>
  queueSingleFactory({ rawMessageReceived: api.sockets.stream.createdRawReceived, pause: 'streams' }),
);

const donationReceived = invoke(() =>
  queueSingleFactory({ rawMessageReceived: api.sockets.stream.donationRawReceived, pause: 'streams' }),
);

const viewerChangeReceived = invoke(() =>
  queueSingleFactory({ rawMessageReceived: api.sockets.stream.viewerChangedRawReceived, pause: 'streams' }),
);

const tokenTxReceived = invoke(() =>
  queueSingleFactory({ rawMessageReceived: api.sockets.token.anyTxRawReceived, pause: 'streams' }),
);

sample({
  clock: tokenTxReceived,
  source: $allStreams,
  fn: (allStreams, { token_info }) => {
    const stream = Object.values(allStreams).find((stream) =>
      stream.stream_tokens.some((token) => token.address === token_info.address),
    );
    if (!stream) return allStreams;
    return {
      ...allStreams,
      [stream.slug]: {
        ...stream,
        stream_tokens: stream.stream_tokens.map((token) =>
          token.address === token_info.address
            ? {
                last_tx_timestamp: token_info.last_tx_timestamp,
                alltime_buy_txes: token_info.alltime_buy_txes,
                alltime_sell_txes: token_info.alltime_sell_txes,
                bounding_curve: token_info.bounding_curve,
                trade_started: token_info.trade_started,
                symbol: token_info.symbol,
                photo_hash: token_info.photo_hash,
                name: token_info.name,
                real_tokens: token_info.real_tokens,
                real_sol: token_info.real_sol,
                address: token_info.address,
                youtube: token_info.youtube,
                telegram: token_info.telegram,
                website: token_info.website,
                twitter: token_info.twitter,
                description: token_info.description,
                deployer_wallet: token_info.deployer_wallet,
                created_by: token_info.created_by,
                is_nsfw: token_info.is_nsfw,
                trade_finished: token_info.trade_finished,
                messages: token_info.messages,
                holders: token_info.holders,
                mcap: token_info.mcap,
                rate: token_info.rate,
                id: token_info.id,
                volume_24h: token_info.volume_24h,
                creation_date: token_info.creation_date,
                mcap_diff_24h: token_info.mcap_diff_24h,
                is_streaming: token_info.is_streaming,
                virtual_tokens: token_info.virtual_tokens,
                virtual_sol: token_info.virtual_sol,
              }
            : token,
        ),
      },
    };
  },
  target: $allStreams,
});

sample({
  clock: finishedReceived,
  source: {
    withTokensIds: $streamUnsortedWithTokensIds,
    noTokensIds: $streamUnsortedNoTokensIds,
    allIds: $allUnsortedStreamsIds,
    allStreams: $allStreams,
  },
  fn: ({ withTokensIds, noTokensIds, allIds, allStreams }, { info }) => ({
    withTokensIds: removeSlugFromList(withTokensIds, info.slug),
    noTokensIds: removeSlugFromList(noTokensIds, info.slug),
    allIds: removeSlugFromList(allIds, info.slug),
    allStreams: removeKey(allStreams, info.slug),
  }),
  target: spread({
    withTokensIds: $streamUnsortedWithTokensIds,
    noTokensIds: $streamUnsortedNoTokensIds,
    allIds: $allUnsortedStreamsIds,
    allStreams: $allStreams,
  }),
});

sample({
  clock: createdReceived,
  source: $allStreams,
  fn: (allStreams, { info }) => ({ ...allStreams, [info.slug]: info }),
  target: $allStreams,
});

sample({
  clock: createdReceived,
  source: {
    withTokensIds: $streamUnsortedWithTokensIds,
    show_nsfw: $isNSFWEnabled,
  },
  filter: (_, { info }) => info.stream_tokens.length > 0,
  fn: ({ withTokensIds, show_nsfw }, { info }) => {
    // Проверяем NSFW для токенов в стриме
    const hasNsfwTokens = info.stream_tokens.some((token) => token.is_nsfw);
    const shouldAdd = show_nsfw || !hasNsfwTokens;

    if (!shouldAdd) {
      return withTokensIds; // Не добавляем в список
    }

    if (withTokensIds === null) return [info.slug];
    return Array.from(new Set([...withTokensIds, info.slug]));
  },
  target: $streamUnsortedWithTokensIds,
});

sample({
  clock: createdReceived,
  source: $allUnsortedStreamsIds,
  fn: (ids, { info }) => {
    if (ids === null) return [info.slug];
    return Array.from(new Set([...ids, info.slug]));
  },
  target: $allUnsortedStreamsIds,
});

sample({
  clock: createdReceived,
  source: {
    noTokensIds: $streamUnsortedNoTokensIds,
    show_nsfw: $isNSFWEnabled,
  },
  filter: (_, { info }) => info.stream_tokens.length === 0,
  fn: ({ noTokensIds, show_nsfw }, { info }) => {
    // Проверяем NSFW для токенов в стриме (хотя их нет, но для консистентности)
    const hasNsfwTokens = info.stream_tokens.some((token) => token.is_nsfw);
    const shouldAdd = show_nsfw || !hasNsfwTokens;

    if (!shouldAdd) {
      return noTokensIds; // Не добавляем в список
    }

    if (noTokensIds === null) return [info.slug];
    return Array.from(new Set([...noTokensIds, info.slug]));
  },
  target: $streamUnsortedNoTokensIds,
});

sample({
  clock: viewerChangeReceived,
  source: $allStreams,
  fn: (allStreams, { info }) => ({ ...allStreams, [info.slug]: info }),
  target: $allStreams,
});

sample({
  clock: donationReceived,
  source: $allStreams,
  fn: (allStreams, { info }) => ({ ...allStreams, [info.slug]: info }),
  target: $allStreams,
});
