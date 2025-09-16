import { createEvent, createStore, sample } from 'effector';
import { api } from 'shared/api';
import { EventsRecentTx, RecentResponse } from 'shared/api/queries/transaction/list';
import { isDesktop } from '../config';
import { invoke } from '@withease/factories';
import { queueFactory } from 'shared/lib/queue-factory';
import { TxReceived } from 'shared/types/token';
import { DonationMessage, StreamCreatedMessage, StreamFinishedMessage } from 'shared/types/stream';
import { routes } from 'shared/config/router';
import { $isNSFWEnabled } from 'features/toggle-nsfw';

export const recentTxLoaded = createEvent();

export const $recentTx = createStore<null | RecentResponse>(null);
export const $recentTxStatus = api.queries.transaction.recent.$status;

// Reset recent transactions when leaving memepad page
sample({
  clock: routes.memepad.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => null,
  target: $recentTx,
});

sample({
  clock: [recentTxLoaded, $isNSFWEnabled],
  source: {
    pending: api.queries.transaction.recent.$pending,
    isDesktop: isDesktop.$matches,
    show_nsfw: $isNSFWEnabled,
  },
  filter: ({ pending }) => !pending,
  fn: ({ isDesktop, show_nsfw }) => ({
    show_events: !isDesktop
      ? ([
          'BUY',
          'SELL',
          'MIGRATION',
          'DEPLOY',
          'STREAM_CREATED',
          'STREAM_FINISHED',
          'DONATION_RECEIVED',
        ] as EventsRecentTx[])
      : undefined,
    show_nsfw,
  }),
  target: api.queries.transaction.recent.start,
});

sample({
  clock: api.queries.transaction.recent.finished.success,
  fn: ({ result }) => result,
  target: $recentTx,
});

const { messageReceived: anyTxReceived, batchMessageReceived: anyTxBatchReceived } = invoke(() =>
  queueFactory<TxReceived>({ rawMessageReceived: api.sockets.token.anyTxRawReceived, pause: 'recent_tx' }),
);

const { messageReceived: buyTxReceived, batchMessageReceived: buyTxBatchReceived } = invoke(() =>
  queueFactory<TxReceived>({ rawMessageReceived: api.sockets.token.buyTxRawReceived, pause: 'recent_tx' }),
);

const { messageReceived: sellTxReceived, batchMessageReceived: sellTxBatchReceived } = invoke(() =>
  queueFactory<TxReceived>({ rawMessageReceived: api.sockets.token.sellTxRawReceived, pause: 'recent_tx' }),
);

const { messageReceived: startedStreamTxReceived, batchMessageReceived: startedStreamTxBatchReceived } = invoke(() =>
  queueFactory<StreamCreatedMessage>({ rawMessageReceived: api.sockets.stream.createdRawReceived, pause: 'recent_tx' }),
);

const { messageReceived: finishedStreamTxReceived, batchMessageReceived: finishedStreamTxBatchReceived } = invoke(() =>
  queueFactory<StreamFinishedMessage>({
    rawMessageReceived: api.sockets.stream.finishedRawReceived,
    pause: 'recent_tx',
  }),
);

const { messageReceived: donationTxReceived, batchMessageReceived: donationTxBatchReceived } = invoke(() =>
  queueFactory<DonationMessage>({ rawMessageReceived: api.sockets.stream.donationRawReceived, pause: 'recent_tx' }),
);

sample({
  clock: [buyTxReceived, sellTxReceived],
  source: {
    recentTx: $recentTx,
    isAllVariantsTxes: isDesktop.$matches,
    show_nsfw: $isNSFWEnabled,
  },
  filter: ({ isAllVariantsTxes }) => isAllVariantsTxes,
  fn: ({ recentTx, show_nsfw }, { user_info, hash, token_amount, sol_amount, type, rate, timestamp, token_info }) => {
    const prev = recentTx !== null ? recentTx : [];

    // Проверяем, нужно ли показывать эту транзакцию
    const shouldShow = show_nsfw || !token_info.is_nsfw;

    if (!shouldShow) {
      return prev; // Не показываем транзакцию
    }

    const currentTx = {
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
    };

    return [currentTx, ...prev].slice(0, 3);
  },
  target: $recentTx,
});

sample({
  clock: [buyTxBatchReceived, sellTxBatchReceived],
  source: {
    recentTx: $recentTx,
    isAllVariantsTxes: isDesktop.$matches,
    show_nsfw: $isNSFWEnabled,
  },
  filter: ({ isAllVariantsTxes }) => isAllVariantsTxes,
  fn: ({ recentTx, show_nsfw }, txs) => {
    const prev = recentTx !== null ? recentTx : [];

    const updatedTxs = txs
      .filter(({ token_info }) => {
        if (show_nsfw) {
          return true; // Показываем все транзакции если NSFW включен
        } else {
          return !token_info.is_nsfw; // Показываем только не-NSFW если NSFW выключен
        }
      })
      .map(({ user_info, hash, token_amount, sol_amount, type, rate, timestamp, token_info }) => ({
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

    const result = [...updatedTxs, ...prev].slice(0, 3);

    return result;
  },
  target: $recentTx,
});

sample({
  clock: anyTxReceived,
  source: {
    recentTx: $recentTx,
    isAllVariantsTxes: isDesktop.$matches,
    show_nsfw: $isNSFWEnabled,
  },
  filter: ({ isAllVariantsTxes }) => !isAllVariantsTxes,
  fn: ({ recentTx, show_nsfw }, { user_info, hash, token_amount, sol_amount, type, rate, timestamp, token_info }) => {
    const prev = recentTx !== null ? recentTx : [];

    // Проверяем, нужно ли показывать эту транзакцию
    const shouldShow = show_nsfw || !token_info.is_nsfw;

    if (!shouldShow) {
      return prev; // Не показываем транзакцию
    }

    const result = [
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
    ].slice(0, 3);

    return result;
  },
  target: $recentTx,
});

sample({
  clock: anyTxBatchReceived,
  source: {
    recentTx: $recentTx,
    isAllVariantsTxes: isDesktop.$matches,
    show_nsfw: $isNSFWEnabled,
  },
  filter: ({ isAllVariantsTxes }) => !isAllVariantsTxes,
  fn: ({ recentTx, show_nsfw }, txs) => {
    const prev = recentTx !== null ? recentTx : [];

    const updatedTxs = txs
      .filter(({ token_info }) => {
        if (show_nsfw) {
          return true; // Показываем все транзакции если NSFW включен
        } else {
          return !token_info.is_nsfw; // Показываем только не-NSFW если NSFW выключен
        }
      })
      .map(({ user_info, hash, token_amount, sol_amount, type, rate, timestamp, token_info }) => ({
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

    const result = [...updatedTxs, ...prev].slice(0, 3);

    return result;
  },
  target: $recentTx,
});

sample({
  clock: startedStreamTxReceived,
  source: {
    recentTx: $recentTx,
    isAllVariantsTxes: isDesktop.$matches,
  },
  filter: ({ isAllVariantsTxes }) => !isAllVariantsTxes,
  fn: ({ recentTx }, { info }) => {
    const prev = recentTx !== null ? recentTx : [];

    const result = [
      {
        user_name: info.creator.user_nickname,
        user_photo_hash: info.creator.user_photo_hash,
        hash: null,
        token_amount: null,
        sol_amount: null,
        type: 'STREAM_CREATED' as const,
        rate: null,
        timestamp: info.created_at,
        token_address: info.stream_tokens[0]?.address ?? null,
        token_name: info.stream_tokens[0]?.name ?? null,
        token_symbol: info.stream_tokens[0]?.symbol ?? null,
        token_photo_hash: info.stream_tokens[0]?.photo_hash ?? null,
        user_info: info.creator,
        slug: info.slug,
      },
      ...prev,
    ].slice(0, 3);

    return result;
  },
  target: $recentTx,
});

sample({
  clock: finishedStreamTxReceived,
  source: {
    recentTx: $recentTx,
    isAllVariantsTxes: isDesktop.$matches,
  },
  filter: ({ isAllVariantsTxes }) => !isAllVariantsTxes,
  fn: ({ recentTx }, { info }) => {
    const prev = recentTx !== null ? recentTx : [];

    const result = [
      {
        user_name: info.creator.user_nickname,
        user_photo_hash: info.creator.user_photo_hash,
        hash: null,
        token_amount: null,
        sol_amount: info.donation_sum,
        type: 'STREAM_FINISHED' as const,
        rate: null,
        timestamp: Math.floor(Date.now() / 1000),
        token_address: info.stream_tokens[0]?.address,
        token_name: info.stream_tokens[0]?.name,
        token_symbol: info.stream_tokens[0]?.symbol,
        token_photo_hash: info.stream_tokens[0]?.photo_hash,
        user_info: info.creator,
        slug: info.slug,
      },
      ...prev,
    ].slice(0, 3);

    return result;
  },
  target: $recentTx,
});

sample({
  clock: donationTxReceived,
  source: {
    recentTx: $recentTx,
    isAllVariantsTxes: isDesktop.$matches,
  },
  filter: ({ isAllVariantsTxes }) => !isAllVariantsTxes,
  fn: ({ recentTx }, { donation, info }) => {
    const prev = recentTx !== null ? recentTx : [];

    const result = [
      {
        user_name: info.creator.user_nickname,
        user_photo_hash: info.creator.user_photo_hash,
        hash: donation.signature,
        token_amount: null,
        sol_amount: donation.amount,
        type: 'DONATION_RECEIVED' as const,
        rate: null,
        timestamp: donation.timestamp,
        token_address: info.stream_tokens[0]?.address ?? null,
        token_name: info.stream_tokens[0]?.name ?? null,
        token_symbol: info.stream_tokens[0]?.symbol ?? null,
        token_photo_hash: info.stream_tokens[0]?.photo_hash ?? null,
        user_info: info.creator,
        slug: info.slug,
      },
      ...prev,
    ].slice(0, 3);

    return result;
  },
  target: $recentTx,
});

sample({
  clock: startedStreamTxBatchReceived,
  source: {
    recentTx: $recentTx,
    isAllVariantsTxes: isDesktop.$matches,
  },
  filter: ({ isAllVariantsTxes }) => !isAllVariantsTxes,
  fn: ({ recentTx }, streams) => {
    const prev = recentTx !== null ? recentTx : [];

    const updatedStreams = streams.map(({ info }) => ({
      user_name: info.creator.user_nickname,
      user_photo_hash: info.creator.user_photo_hash,
      hash: null,
      token_amount: null,
      sol_amount: null,
      type: 'STREAM_CREATED' as const,
      rate: null,
      timestamp: info.created_at,
      token_address: info.stream_tokens[0]?.address ?? null,
      token_name: info.stream_tokens[0]?.name ?? null,
      token_symbol: info.stream_tokens[0]?.symbol ?? null,
      token_photo_hash: info.stream_tokens[0]?.photo_hash ?? null,
      user_info: info.creator,
      slug: info.slug,
    }));

    const result = [...updatedStreams, ...prev].slice(0, 3);
    return result;
  },
  target: $recentTx,
});

sample({
  clock: finishedStreamTxBatchReceived,
  source: {
    recentTx: $recentTx,
    isAllVariantsTxes: isDesktop.$matches,
  },
  filter: ({ isAllVariantsTxes }) => !isAllVariantsTxes,
  fn: ({ recentTx }, streams) => {
    const prev = recentTx !== null ? recentTx : [];

    const updatedStreams = streams.map(({ info }) => ({
      user_name: info.creator.user_nickname,
      user_photo_hash: info.creator.user_photo_hash,
      hash: null,
      token_amount: null,
      sol_amount: info.donation_sum,
      type: 'STREAM_FINISHED' as const,
      rate: null,
      timestamp: Math.floor(Date.now() / 1000),
      token_address: info.stream_tokens[0]?.address,
      token_name: info.stream_tokens[0]?.name,
      token_symbol: info.stream_tokens[0]?.symbol,
      token_photo_hash: info.stream_tokens[0]?.photo_hash,
      user_info: info.creator,
      slug: info.slug,
    }));

    const result = [...updatedStreams, ...prev].slice(0, 3);
    return result;
  },
  target: $recentTx,
});

sample({
  clock: donationTxBatchReceived,
  source: {
    recentTx: $recentTx,
    isAllVariantsTxes: isDesktop.$matches,
  },
  filter: ({ isAllVariantsTxes }) => !isAllVariantsTxes,
  fn: ({ recentTx }, donations) => {
    const prev = recentTx !== null ? recentTx : [];

    const updatedDonations = donations.map(({ donation, info }) => ({
      user_name: info.creator.user_nickname,
      user_photo_hash: info.creator.user_photo_hash,
      hash: donation.signature,
      token_amount: null,
      sol_amount: donation.amount,
      type: 'DONATION_RECEIVED' as const,
      rate: null,
      timestamp: donation.timestamp,
      token_address: info.stream_tokens[0]?.address ?? null,
      token_name: info.stream_tokens[0]?.name ?? null,
      token_symbol: info.stream_tokens[0]?.symbol ?? null,
      token_photo_hash: info.stream_tokens[0]?.photo_hash ?? null,
      user_info: info.creator,
      slug: info.slug,
    }));

    const result = [...updatedDonations, ...prev].slice(0, 3);
    return result;
  },
  target: $recentTx,
});
