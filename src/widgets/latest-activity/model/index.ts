import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { api } from 'shared/api';
import { RecentResponse } from 'shared/api/queries/transaction/list';
import { queueFactory } from 'shared/lib/queue-factory';
import { DonationMessage, StreamCreatedMessage, StreamFinishedMessage } from 'shared/types/stream';
import { TxReceived } from 'shared/types/token';
import { routes } from 'shared/config/router';
import { $isNSFWEnabled } from 'features/toggle-nsfw';

export const activityTxLoaded = createEvent();

export const $activityTx = createStore<null | RecentResponse>(null);

// Reset activity transactions when leaving memepad page
sample({
  clock: routes.memepad.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => null,
  target: $activityTx,
});

sample({
  clock: [activityTxLoaded, $isNSFWEnabled],
  source: {
    pending: api.queries.transaction.activity.$pending,
    show_nsfw: $isNSFWEnabled,
  },
  filter: ({ pending }) => !pending,
  fn: ({ show_nsfw }) => ({
    show_nsfw,
  }),
  target: api.queries.transaction.activity.start,
});

sample({
  clock: api.queries.transaction.activity.finished.success,
  fn: ({ result }) => result,
  target: $activityTx,
});

const { messageReceived: deployTxReceived, batchMessageReceived: deployTxBatchReceived } = invoke(() =>
  queueFactory<TxReceived>({ rawMessageReceived: api.sockets.token.deployTxRawReceived, pause: 'activity' }),
);

const { messageReceived: migrationTxReceived, batchMessageReceived: migrationTxBatchReceived } = invoke(() =>
  queueFactory<TxReceived>({ rawMessageReceived: api.sockets.token.migrationTxRawReceived, pause: 'activity' }),
);

const { messageReceived: donationTxReceived, batchMessageReceived: donationTxBatchReceived } = invoke(() =>
  queueFactory<DonationMessage>({ rawMessageReceived: api.sockets.stream.donationRawReceived, pause: 'activity' }),
);

const { messageReceived: finishedTxReceived, batchMessageReceived: finishedTxBatchReceived } = invoke(() =>
  queueFactory<StreamFinishedMessage>({
    rawMessageReceived: api.sockets.stream.finishedRawReceived,
    pause: 'activity',
  }),
);

const { messageReceived: startedStreamTxReceived, batchMessageReceived: startedStreamTxBatchReceived } = invoke(() =>
  queueFactory<StreamCreatedMessage>({
    rawMessageReceived: api.sockets.stream.createdRawReceived,
    pause: 'activity',
  }),
);

sample({
  clock: finishedTxReceived,
  source: $activityTx,
  filter: (activityTxes) => Boolean(activityTxes),
  fn: (activityTxes, { info }) => {
    const prev = activityTxes !== null ? activityTxes.slice(0, -1) : [];

    return [
      {
        user_name: info.creator.user_nickname,
        user_photo_hash: info.creator.user_photo_hash,
        sol_amount: info.donation_sum,
        token_amount: null,
        type: 'STREAM_FINISHED',

        token_address: info.stream_tokens[0]?.address,
        token_name: info.stream_tokens[0]?.name,
        token_symbol: info.stream_tokens[0]?.symbol,
        token_photo_hash: info.stream_tokens[0]?.photo_hash,
        user_info: info.creator,
        hash: null,
        rate: null,
        timestamp: Math.floor(Date.now() / 1000),
        slug: info.slug,
      },
      ...prev,
    ];
  },
  target: $activityTx,
});

sample({
  clock: donationTxReceived,
  source: $activityTx,
  filter: (activityTxes) => Boolean(activityTxes),
  fn: (activityTxes, { donation, info }) => {
    const prev = activityTxes !== null ? activityTxes.slice(0, -1) : [];

    return [
      {
        user_name: info.creator.user_nickname,
        user_photo_hash: info.creator.user_photo_hash,
        sol_amount: donation.amount,
        token_amount: null,
        type: 'DONATION_RECEIVED',
        user_info: info.creator,
        token_address: info.stream_tokens[0]?.address ?? null,
        token_name: info.stream_tokens[0]?.name ?? null,
        token_symbol: info.stream_tokens[0]?.symbol ?? null,
        token_photo_hash: info.stream_tokens[0]?.photo_hash ?? null,
        hash: donation.signature,
        rate: null,
        timestamp: donation.timestamp,
        slug: info.slug,
      },
      ...prev,
    ];
  },
  target: $activityTx,
});

sample({
  clock: startedStreamTxReceived,
  source: $activityTx,
  filter: (activityTxes) => Boolean(activityTxes),
  fn: (activityTxes, { info }) => {
    const prev = activityTxes !== null ? activityTxes.slice(0, -1) : [];

    return [
      {
        user_name: info.creator.user_nickname,
        user_photo_hash: info.creator.user_photo_hash,
        sol_amount: null,
        token_amount: null,
        type: 'STREAM_CREATED',
        user_info: info.creator,
        token_address: info.stream_tokens[0]?.address ?? null,
        token_name: info.stream_tokens[0]?.name ?? null,
        token_symbol: info.stream_tokens[0]?.symbol ?? null,
        token_photo_hash: info.stream_tokens[0]?.photo_hash ?? null,
        hash: null,
        rate: null,
        timestamp: info.created_at,
        slug: info.slug,
      },
      ...prev,
    ];
  },
  target: $activityTx,
});

sample({
  clock: [deployTxReceived, migrationTxReceived],
  source: $activityTx,
  filter: (activityTx) => Boolean(activityTx),
  fn: (activityTxes, { user_info, hash, token_amount, sol_amount, type, rate, timestamp, token_info }) => {
    const prev = activityTxes !== null ? activityTxes.slice(0, -1) : [];

    return [
      {
        user_name: user_info.user_nickname,
        user_photo_hash: user_info.user_photo_hash,
        hash,
        token_amount,
        sol_amount,
        type,
        rate,
        timestamp,
        token_address: token_info.address,
        token_name: token_info.name,
        token_symbol: token_info.symbol,
        token_photo_hash: token_info.photo_hash,
        user_info,
        slug: token_info.slug,
      },
      ...prev,
    ];
  },
  target: $activityTx,
});

sample({
  clock: [deployTxBatchReceived, migrationTxBatchReceived],
  source: $activityTx,
  filter: (activityTxes) => Boolean(activityTxes),
  fn: (activityTxes, txs) => {
    const prev = activityTxes !== null ? activityTxes.slice(0, -1) : [];

    const updatedTxs = txs.map(({ user_info, hash, token_amount, sol_amount, type, rate, timestamp, token_info }) => ({
      user_name: user_info.user_nickname,
      user_photo_hash: user_info.user_photo_hash,
      hash,
      token_amount,
      sol_amount,
      type,
      rate,
      timestamp,
      token_address: token_info.address,
      token_name: token_info.name,
      token_symbol: token_info.symbol,
      token_photo_hash: token_info.photo_hash,
      user_info,
      slug: token_info.slug,
    }));

    return [...updatedTxs, ...prev].slice(0, 3);
  },
  target: $activityTx,
});

sample({
  clock: startedStreamTxBatchReceived,
  source: $activityTx,
  filter: (activityTxes) => Boolean(activityTxes),
  fn: (activityTxes, streams) => {
    const prev = activityTxes !== null ? activityTxes.slice(0, -1) : [];

    const updatedStreams = streams.map(({ info }) => ({
      user_name: info.creator.user_nickname,
      user_photo_hash: info.creator.user_photo_hash,
      sol_amount: null,
      token_amount: null,
      type: 'STREAM_CREATED',
      user_info: info.creator,
      token_address: info.stream_tokens[0]?.address ?? null,
      token_name: info.stream_tokens[0]?.name ?? null,
      token_symbol: info.stream_tokens[0]?.symbol ?? null,
      token_photo_hash: info.stream_tokens[0]?.photo_hash ?? null,
      hash: null,
      rate: null,
      timestamp: info.created_at,
      slug: info.slug,
    }));

    return [...updatedStreams, ...prev].slice(0, 3);
  },
  target: $activityTx,
});

sample({
  clock: finishedTxBatchReceived,
  source: $activityTx,
  filter: (activityTxes) => Boolean(activityTxes),
  fn: (activityTxes, streams) => {
    const prev = activityTxes !== null ? activityTxes.slice(0, -1) : [];

    const updatedStreams = streams.map(({ info }) => ({
      user_name: info.creator.user_nickname,
      user_photo_hash: info.creator.user_photo_hash,
      sol_amount: info.donation_sum,
      token_amount: null,
      type: 'STREAM_FINISHED',
      token_address: info.stream_tokens[0]?.address,
      token_name: info.stream_tokens[0]?.name,
      token_symbol: info.stream_tokens[0]?.symbol,
      token_photo_hash: info.stream_tokens[0]?.photo_hash,
      user_info: info.creator,
      hash: null,
      rate: null,
      timestamp: Math.floor(Date.now() / 1000),
      slug: info.slug,
    }));

    return [...updatedStreams, ...prev].slice(0, 3);
  },
  target: $activityTx,
});

sample({
  clock: donationTxBatchReceived,
  source: $activityTx,
  filter: (activityTxes) => Boolean(activityTxes),
  fn: (activityTxes, donations) => {
    const prev = activityTxes !== null ? activityTxes.slice(0, -1) : [];

    const updatedDonations = donations.map(({ donation, info }) => ({
      user_name: info.creator.user_nickname,
      user_photo_hash: info.creator.user_photo_hash,
      sol_amount: donation.amount,
      token_amount: null,
      type: 'DONATION_RECEIVED',
      user_info: info.creator,
      token_address: info.stream_tokens[0]?.address ?? null,
      token_name: info.stream_tokens[0]?.name ?? null,
      token_symbol: info.stream_tokens[0]?.symbol ?? null,
      token_photo_hash: info.stream_tokens[0]?.photo_hash ?? null,
      hash: donation.signature,
      rate: null,
      timestamp: donation.timestamp,
      slug: info.slug,
    }));

    return [...updatedDonations, ...prev].slice(0, 3);
  },
  target: $activityTx,
});
