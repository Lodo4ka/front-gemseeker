import { TokensListTokenResponse } from 'shared/api/queries/token/tokens-factory';

export type TokenList = (TokensListTokenResponse[0] & {
  isUpdated?: boolean;
})[];
export type TokenListState = TokenList | null;
