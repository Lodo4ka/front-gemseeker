import { applyBarrier, concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { barriers } from 'shared/api/barriers';
import { formatter } from 'shared/lib/formatter';
import { baseUrl } from 'shared/lib/base-url';

export const balances = createJsonQuery({
  params: declareParams<string[]>(),
  request: {
    method: 'POST',
    url: baseUrl('/rpc'),
    body: (params) => [
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'getMultipleAccounts',
        params: [
          params,
          {
            commitment: 'confirmed',
            encoding: 'base58',
          },
        ],
      },
    ],
  },
  response: {
    contract: zodContract(contracts.wallets.balances),
    mapData: ({ params, result }) => {
      const balances = new Map<string, number>();
      result[0]?.result.value.forEach((data, index) => {
        const lamports = data?.lamports ? data.lamports / 1e9 : 0;
        if (params[index]) {
          balances.set(params[index], formatter.number.round(lamports));
        }
      });
      return balances;
    },
  },
});

applyBarrier(balances, { barrier: barriers.auth });

concurrency(balances, {
  strategy: 'TAKE_LATEST',
});
