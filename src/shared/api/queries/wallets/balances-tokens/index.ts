import { applyBarrier, concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { barriers } from 'shared/api/barriers';
import { baseUrl } from 'shared/lib/base-url';
import { array, infer as types } from 'zod';
export const balancesTokens = createJsonQuery({
  params: declareParams<string>(),
  request: {
    method: 'POST',
    url: baseUrl('/rpc'),
    body: (owner) => ({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccounts',
      params: {
        owner,
      },
    }),
  },
  response: {
    contract: zodContract(contracts.wallets.balancesTokens),
    mapData: ({ params, result }) => {
      const balanceHash: Record<string, number> = {};
      const updResult = result as types<typeof contracts.wallets.balancesTokens>;
      updResult.result.token_accounts.forEach((token) => {
        balanceHash[token.mint] = token.amount;
      });

      return { [params]: updResult.result.token_accounts };
    },
  },
});

applyBarrier(balancesTokens, { barrier: barriers.auth });

concurrency(balancesTokens, {
  strategy: 'TAKE_LATEST',
});

balancesTokens.finished.failure.watch(({ params, error }) => {
  console.log(params, error);
});
