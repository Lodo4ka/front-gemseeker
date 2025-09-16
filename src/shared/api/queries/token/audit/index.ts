import { concurrency, createJsonQuery, declareParams, unknownContract } from '@farfetched/core';
import { paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';

type TokenAuditQuery = paths['/api/token/audit/{token_address}']['get']
export type TokenAuditQueryParams = {
    address:string
}
export type TokenAuditQueryResponse = TokenAuditQuery['responses']['200']['content']['application/json']

export const audit = createJsonQuery({
  params: declareParams<TokenAuditQueryParams>(),
  request: {
    method: 'GET',
    url: ({address}) => baseUrl(`/token/audit/${address}`),
  },
  response: {
    contract: unknownContract,
  },
});

concurrency(audit, {
  strategy: 'TAKE_EVERY'
});
