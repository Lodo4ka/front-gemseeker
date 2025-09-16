import { createEvent, sample, createStore } from 'effector';
import { invoke } from '@withease/factories';
import { copyFactory } from 'shared/lib/copy';
import { $publicKey } from 'entities/wallet';
import { ConnectWalletModalProps } from 'features/connect-wallet';
import { routes } from 'shared/config/router';
import { modalsStore } from 'shared/lib/modal';
import { api } from 'shared/api';
import { $isNSFWEnabled } from 'features/toggle-nsfw';
import { SortingFilter } from 'shared/api/queries/token/tokens-factory';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { TokensObject, Token } from 'entities/token';
import { queueSingleFactory } from 'shared/lib/queue-factory';
import { TxReceived } from 'shared/types/token';

export const $tokens = createStore<TokensObject>({});

export const $tokenAdresses = createStore<string[]>([]);
const limit = 15;

export const navigatedToCreateToken = createEvent();

sample({
  clock: navigatedToCreateToken,
  source: $publicKey,
  filter: (v) => v === null,
  fn: () => ConnectWalletModalProps,
  target: modalsStore.openModal,
});

sample({
  clock: navigatedToCreateToken,
  source: $publicKey,
  filter: Boolean,
  target: routes.create_token.open,
});

export const { copied: copiedTable } = invoke(copyFactory, 'Address copied to clipboard');

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {
  limit,
});

export const changedSortingFilter = createEvent<SortingFilter>();
export const $sortingFilter = createStore<SortingFilter>('last_order').on(
  changedSortingFilter,
  (_, payload) => payload,
);

export const $list = createStore<string[] | null>(null);

// Reset markets data when leaving memepad page
sample({
  clock: routes.memepad.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => ({}),
  target: $tokens,
});

sample({
  clock: routes.memepad.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => [],
  target: $tokenAdresses,
});

// Reset list and pagination state when leaving memepad page
sample({
  clock: routes.memepad.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => null,
  target: $list,
});

sample({
  clock: routes.memepad.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => 0,
  target: $currentPage,
});

sample({
  clock: routes.memepad.$isOpened,
  filter: (isOpened) => !isOpened,
  fn: () => false,
  target: $isEndReached,
});

$currentPage.reset([changedSortingFilter, $isNSFWEnabled]);
$list.reset([changedSortingFilter, $isNSFWEnabled]);

sample({
  clock: api.queries.token.list.finished.success,
  source: $tokens,
  fn: (tokens, { result }) => ({
    ...tokens,
    ...Object.fromEntries(result.map((t) => [t.address, t as Token])),
  }),
  target: $tokens,
});

sample({
  clock: [api.queries.token.single.finished.success, api.queries.token.rocket.finished.success],
  source: $tokens,
  fn: (tokens, { result }) => ({ ...tokens, ...Object.fromEntries([[result.address, result]]) }),
  target: $tokens,
});

sample({
  clock: api.queries.streams.list.finished.success,
  source: $tokens,
  fn: (tokens, { result }) => ({
    ...tokens,
    ...Object.fromEntries(result.map((t) => [t.stream_tokens[0]?.address, t.stream_tokens[0]])),
  }),
  target: $tokens,
});

sample({
  clock: [onLoadedFirst, changedSortingFilter, $isNSFWEnabled, loadNextPage],
  source: {
    show_nsfw: $isNSFWEnabled,
    sorting_filter: $sortingFilter,
    offset: $currentPage,
    tokenList: $list,
    pending: api.queries.token.list.$pending,
  },
  filter: ({ pending }) => !pending,
  fn: ({ show_nsfw, sorting_filter, offset }) => ({
    show_nsfw,
    sorting_filter,
    offset,
    limit,
  }),
  target: api.queries.token.list.start,
});
sample({
  clock: api.queries.token.list.finished.success,
  source: $list,
  fn: (list, { result }) => {
    const newList = result.map((token) => token.address);
    if (list === null) return newList;
    return Array.from(new Set([...list, ...newList]));
  },
  target: $list,
});

sample({
  clock: api.queries.token.list.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

const messageReceived = invoke(() =>
  queueSingleFactory<TxReceived>({
    rawMessageReceived: api.sockets.token.anyTxRawReceived,
    pause: 'market',
  }),
);

sample({
  clock: messageReceived,
  source: $tokens,
  fn: (tokens, { token_info }) => ({ ...tokens, ...Object.fromEntries([[token_info?.address, token_info]]) }),
  target: $tokens,
});

sample({
  clock: messageReceived,
  source: {
    list: $list,
    show_nsfw: $isNSFWEnabled,
  },
  fn: ({ list, show_nsfw }, { token_info }) => {
    if (list === null) return [token_info?.address];
    if (!show_nsfw && token_info.is_nsfw) {
      return list;
    }
    const newList = list.filter((address) => address !== token_info?.address);
    return Array.from(new Set([token_info?.address, ...newList]));
  },
  target: $list,
});
