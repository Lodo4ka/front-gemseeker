import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { createFactory } from '@withease/factories';
import { contracts } from 'shared/api/contracts';
import { paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';

type TokensListQuery = paths['/api/token/list']['get'];
export type TokensListTokenResponse = TokensListQuery['responses'][200]['content']['application/json'];
export type SortingFilter = 'new' | 'last_order' | 'gain' | 'mcap' | 'raydium' | 'user' | 'live_stream';
export type TokenListParams = {
  limit?: number;
  offset?: number;
  show_nsfw?: boolean;
  sorting_filter?: SortingFilter;
  sorting_order?: 'desc' | 'asc';
  search?: string;
};

export const tokensFactory = createFactory(() => {
  const query = createJsonQuery({
    params: declareParams<TokenListParams>(),
    request: {
      url: baseUrl('/token/list'),
      credentials: 'include',
      method: 'GET',
      query: (props) => ({
        limit: props?.limit || 10,
        offset: props?.offset || 0,
        show_nsfw: props?.show_nsfw || false,
        sorting_filter: props?.sorting_filter || 'new',
        sorting_order: props?.sorting_order || 'desc',
        search: props?.search,
      }),
    },
    response: {
      contract: zodContract(contracts.token.list),
      mapData: ({ result }) => result,
    },
  });
  concurrency(query, {
    strategy: 'TAKE_EVERY',
  });

  return query;
});
