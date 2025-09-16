import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { api } from 'shared/api';
import { inputFactory } from 'shared/lib/factories';
import { popoverFactory } from 'shared/lib/popover';

// WARNING
import { $isNSFWEnabled } from 'features/toggle-nsfw';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { TokensListTokenResponse } from 'shared/api/queries/token/tokens-factory';

export const limit = 20;

export const { $isOpen, open, close } = invoke(popoverFactory, { defaultValue: false });

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage } = invoke(paginationFactory, { limit });

export const inputSearch = invoke(inputFactory, {
  defaultValue: '',
});

export const changedIsFocused = createEvent();
export const isMobileViewed = createEvent();

export const $isFocused = createStore<boolean>(false).on(changedIsFocused, () => true);

const searchTokenQuery = api.queries.token.search;
export const $searchTokens = createStore<TokensListTokenResponse | null>(null);

// Очистка списка при закрытии popover
sample({
  clock: close,
  fn: () => null,
  target: $searchTokens,
});

sample({
  clock: close,
  target: $currentPage.reinit,
});

sample({
  clock: isMobileViewed,
  source: $isFocused,
  filter: (isFocused) => !isFocused,
  fn: () => true,
  target: $isFocused,
});

sample({
  clock: inputSearch.fieldUpdated,
  target: $currentPage.reinit,
});

sample({
  clock: [inputSearch.$debouncedValue, $isNSFWEnabled, $isFocused, $currentPage, isMobileViewed],
  source: {
    search: inputSearch.$debouncedValue,
    show_nsfw: $isNSFWEnabled,
    currentPage: $currentPage,
  },
  fn: ({ search, show_nsfw, currentPage }) => ({
    limit: 20,
    search: search !== '' ? search : undefined,
    show_nsfw,
    offset: currentPage,
  }),
  target: searchTokenQuery.start,
});

sample({
  clock: searchTokenQuery.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});

sample({
  clock: searchTokenQuery.finished.success,
  source: $searchTokens,
  fn: (tokens, { result, params }) => {
    if (result.length === 0 && params?.offset === 0) return [];
    if (params?.offset !== 0 && tokens !== null) return [...tokens, ...result];

    return result;
  },
  target: $searchTokens,
});

sample({
  clock: dataRanedOut,
  target: loadNextPage,
});
