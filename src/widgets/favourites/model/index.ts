import { createEvent, createStore, sample } from 'effector';
import { $token } from 'entities/token';
import { actionFavourite } from 'features/action-favourite-token';
import { api } from 'shared/api';
import { FavouritesResponse } from 'shared/api/queries/token/favourites';
import { $viewerStatus, ViewerStatus } from 'shared/viewer/model';

const addFavouriteMutation = api.mutations.token.addFavourite;
const removeFavouriteMutation = api.mutations.token.removeFavourite;

export const favourutesQuery = api.queries.token.favourites;

export const $favourites = createStore<FavouritesResponse | null>(null);
export const $isHaveFavourites = $favourites.map((favourites) => favourites && favourites.length > 0);

sample({
  clock: $viewerStatus,
  filter: (viewerStatus) => viewerStatus === ViewerStatus.Authenticated,
  target: favourutesQuery.start,
});

sample({
  clock: favourutesQuery.$data,
  target: $favourites,
});

sample({
  clock: actionFavourite,
  source: { token: $token, favourites: $favourites },
  filter: ({ token }, props) => props && !!token,
  fn: ({ favourites, token }) => {
    const copy = [...(favourites ?? [])];

    copy.push({
      id: (favourites?.length ?? 0) + 1,
      address: token?.address ?? '',
      symbol: token?.symbol ?? '',
      rate: token?.rate ?? 0,
      mcap: token?.mcap ?? 0,
      mcap_diff_24h: token?.mcap_diff_24h ?? 0,
    });

    return copy;
  },
  target: $favourites,
});

sample({
  clock: actionFavourite,
  source: { token: $token, favourites: $favourites },
  filter: ({ token }, props) => !props && !!token,
  fn: ({ token, favourites }) => favourites?.filter((favourite) => favourite?.address !== token?.address) ?? null,
  target: $favourites,
});

sample({
  clock: api.sockets.token.anyTxRawReceived,
  source: $favourites,
  filter: (favourites, message) =>
    !!favourites?.find((favourite) => favourite?.address === message?.token_info.address),
  fn: (favourites, updateToken) => {
    return (
      favourites?.map((favourite) =>
        favourite.address === updateToken?.token_info?.address
          ? {
              id: favourite.id,
              address: favourite.address,
              symbol: favourite.symbol,
              rate: updateToken.token_info.rate,
              mcap: updateToken.token_info.mcap,
              mcap_diff_24h: updateToken.token_info.mcap_diff_24h,
            }
          : favourite,
      ) ?? null
    );
  },
  target: $favourites,
});
