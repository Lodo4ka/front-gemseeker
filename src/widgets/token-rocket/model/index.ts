import { invoke } from '@withease/factories';
import { combine, createEvent, createStore, sample } from 'effector';
import { loadedToken } from 'entities/token';
import { $rate } from 'features/exchange-rate';
import { api } from 'shared/api';
import { RocketResponse } from 'shared/api/queries/token/rocket';
import { copyFactory } from 'shared/lib/copy';
import { TxReceived } from 'shared/types/token';
import { queueFactory } from 'shared/lib/queue-factory';
import { routes } from 'shared/config/router';
import { $isNSFWEnabled } from 'features/toggle-nsfw';

export const { copied } = invoke(copyFactory, 'Address copied to clipboard');

export const rocketQuery = api.queries.token.rocket;

export const rocketLoaded = createEvent();

export const $rocket = createStore<null | RocketResponse>(null);

export const $rocketStatus = rocketQuery.$pending;
const $rocketMcap = $rocket.map((rocket) => rocket?.mcap ?? 0);
export const $mcapUsd = combine($rocketMcap, $rate, (mcap, rate) => mcap * rate);

const { messageReceived, batchMessageReceived } = invoke(() =>
  queueFactory<TxReceived>({ rawMessageReceived: api.sockets.token.anyTxRawReceived, pause: 'rocket' }),
);

sample({
  clock: routes.memepad.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => null,
  target: $rocket,
});

// Handle rocket loading - only when no data exists
sample({
  clock: rocketLoaded,
  source: {
    rocket: $rocket,
    pending: rocketQuery.$pending,
    show_nsfw: $isNSFWEnabled,
  },
  filter: ({ rocket, pending }) => !rocket && !pending,
  fn: ({ show_nsfw }) => ({
    show_nsfw,
  }),
  target: rocketQuery.start,
});

// Handle rocket loading - only when no data exists
sample({
  clock: $isNSFWEnabled,
  source: rocketQuery.$pending,
  filter: (pending) => !pending,
  fn: (_, show_nsfw) => ({
    show_nsfw,
  }),
  target: rocketQuery.start,
});

sample({
  clock: rocketQuery.$data,
  target: $rocket,
});

sample({
  clock: $rocket,
  filter: Boolean,
  fn: ({ address, deployer_wallet }) => {
    return {
      address,
      creator: deployer_wallet as string,
    };
  },
  target: loadedToken,
});

sample({
  clock: messageReceived,
  source: {
    rocket: $rocket,
    show_nsfw: $isNSFWEnabled,
  },
  filter: ({ rocket, show_nsfw }, { token_info }) => {
    const addressMatch = Boolean(rocket && rocket.address === token_info?.address);
    const nsfwCheck = show_nsfw || !token_info?.is_nsfw;
    return addressMatch && nsfwCheck;
  },
  fn: ({ show_nsfw }, { token_info }) => token_info,
  target: $rocket,
});

sample({
  clock: messageReceived,
  source: {
    rocket: $rocket,
    show_nsfw: $isNSFWEnabled,
  },
  filter: ({ rocket, show_nsfw }, { token_info }) => {
    const mcapCheck = Boolean(token_info?.mcap > (rocket?.mcap ?? 0));
    const nsfwCheck = show_nsfw || !token_info?.is_nsfw;
    return mcapCheck && nsfwCheck;
  },
  fn: (_, { token_info }) => token_info,
  target: $rocket,
});

sample({
  clock: batchMessageReceived,
  source: {
    rocket: $rocket,
    show_nsfw: $isNSFWEnabled,
  },
  filter: ({ rocket, show_nsfw }, txs) => {
    const mcapCheck = Boolean(rocket && txs.some((tx) => tx.token_info?.mcap > (rocket?.mcap ?? 0)));
    const nsfwCheck = txs.some((tx) => show_nsfw || !tx.token_info?.is_nsfw);
    return mcapCheck && nsfwCheck;
  },
  fn: ({ show_nsfw }, txs) => {
    // Фильтруем транзакции по NSFW перед выбором максимальной
    const filteredTxs = txs.filter((tx) => show_nsfw || !tx.token_info?.is_nsfw);
    return filteredTxs.reduce((max, tx) => ((tx.token_info?.mcap ?? 0) > (max.token_info?.mcap ?? 0) ? tx : max))
      .token_info;
  },
  target: $rocket,
});
