import { invoke } from '@withease/factories';
import { combine, createStore, sample } from 'effector';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { copyFactory } from 'shared/lib/copy';
import { TokenVolume } from '../types/volume';
import { $viewer } from 'shared/viewer';
import { $slug } from 'entities/stream';
import type { Token } from '../types';
import { loadedToken } from './dop-info';
import { $rate } from 'features/exchange-rate';

// Export filters
export * from './filtres-limit-orders';

export const { copied } = invoke(copyFactory, 'Address copied to clipboard');

export const $address = routes.token.$params.map(({ address }) => address || null);
export const $token = createStore<Token | null>(null);
export const $isNotFoundToken = createStore<boolean | null>(null);
export const $tokenTicket = $token.map((token) => token?.symbol ?? '');
export const $tokenPreview = $token.map((token) => token?.photo_hash ?? '');
// export const $tokenHolders = createStore<Token | null>(null);
export const $tokenMCAP = combine($token, $rate, (token, rate) => {
  if (!token || !rate) return null;
  return token.mcap * rate;
});
export const $tokenIsFavourite = createStore<boolean>(false);
export const $holdersStatus = createStore<Record<string, 'whale' | 'fish'> | null>(null);


sample({
  clock: $token,
  filter: Boolean,
  fn: (token) => ({ address: token.address, creator: token.deployer_wallet as string }),
  target: loadedToken,
});

export const $isStreamCreationAllowed = combine($token, $viewer, $slug, (token, viewer, slug) => {
  if (!token || !viewer || slug) return false;
  if (token.slug) return false;
  return token.created_by.user_id === viewer.user_id;
});

export const $isStreamMobileVisible = combine($token, $viewer, $slug, (token, viewer, slug) => {
  if (!token) return false;
  if (slug) return true;
  if (token.slug) return true;
  return token.created_by.user_id === viewer?.user_id;
});

export const $tokenId = $token.map((token) => token?.id || null);

export const $tokenVolume = createStore<TokenVolume[] | null>(null);
export const $isLoading = createStore(true);

sample({
  clock: api.queries.token.single.finished.success,
  fn: ({ result }) => result,
  target: $token,
});

sample({
  clock: api.queries.token.single.finished.failure,
  filter: ({error}) => (error as any).response.detail === 'SPLToken not found',
  fn: () => true,
  target: $isNotFoundToken,
});

sample({
  clock: $token,
  fn: (token) => !!token?.is_favourite,
  target: $tokenIsFavourite,
});

sample({
  clock: api.queries.token.mcap.finished.success,
  fn: ({ result }) => Object.values(result) as TokenVolume[],
  target: $tokenVolume,
});

sample({
  clock: api.sockets.token.anyTxRawReceived,
  source: $token,
  filter: (token, { token_info }) => token?.address === token_info.address,
  fn: (_, tok) => {
    return Object.values(tok.token_stats) as TokenVolume[];
  },
  target: $tokenVolume,
});

sample({
  clock: api.sockets.token.anyTxRawReceived,
  source: $token,
  filter: (token, { token_info }) => token?.address === token_info.address,
  fn: (_, { token_info }) => token_info,
  target: $token,
});

sample({
  clock: api.queries.token.single.finished.success,
  fn: () => false,
  target: $isLoading,
});

sample({
  clock: api.sockets.token.anyTxRawReceived,
  source: $token,
  filter: (token, { token_info }) => token?.address === token_info.address,
  fn: (tokenPrev, { token_info }) => ({
    ...tokenPrev,
    ...token_info,
  }),
  target: $token,
});

sample({
  clock: api.mutations.stream.delete.finished.success,
  source: $token,
  filter: Boolean,
  fn: (token) => ({ ...token, slug: null }),
  target: $token,
});

sample({
  clock: $token,
  filter: Boolean,
  fn: ({ address }) => address,
  target: api.queries.token.holdersStatus.start,
});

sample({
  clock: api.queries.token.holdersStatus.finished.success,
  fn: ({ result }) => {
    const holders: Record<string, 'whale' | 'fish'> = {};

    result.forEach((holder) => {
      holders[holder.user.user_id] = holder.category;
    });

    return holders;
  },
  target: $holdersStatus,
});
