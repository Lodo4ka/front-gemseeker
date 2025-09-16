import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';
import { contracts } from 'shared/api/contracts';
import { zodContract } from '@farfetched/zod';

type TxTradesQuery = paths['/api/tx']['get'];
export type TxTradesQueryParams = TxTradesQuery['parameters']['query'];
export type TxTradesQueryResponse = TxTradesQuery['responses']['200']['content']['application/json'];

export const trades = createJsonQuery({
  params: declareParams<TxTradesQueryParams>(),
  request: {
    method: 'GET',
    url: baseUrl(`/tx`),
    query: ({ token_id_address, limit, offset }) => ({
      limit: limit ?? 20,
      offset: offset ?? 0,
      token_id_address,
    }),
  },
  response: {
    contract: zodContract(contracts.transaction.chart),
  },
});

concurrency(trades, {
  strategy: 'TAKE_LATEST',
});
