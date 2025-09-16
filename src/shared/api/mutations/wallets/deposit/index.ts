import { applyBarrier, createJsonMutation, declareParams } from '@farfetched/core';

import { baseUrl } from 'shared/lib/base-url';
import { barriers } from 'shared/api/barriers';
import { contracts } from 'shared/api/contracts';
import { zodContract } from '@farfetched/zod';
import { paths } from 'shared/client';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

type DepositMutation = paths['/api/wallets/deposit']['post'];
export type DepositMutationParams = DepositMutation['requestBody']['content']['application/json']['items'];
export type DepositMutationResponse = DepositMutation['responses'][200]['content']['application/json'];

export const deposit = createJsonMutation({
  params: declareParams<DepositMutationParams>(),
  request: {
    method: 'POST',
    url: baseUrl('/wallets/deposit'),
    credentials: 'include',
    body: (items) => ({
      items: items.map((props) => ({
        ...props,
        amount: props.amount * LAMPORTS_PER_SOL,
        spl_token_address: 'native',
      })),
    }),
  },
  response: {
    contract: zodContract(contracts.wallets.deposit),
  },
});

applyBarrier(deposit, { barrier: barriers.auth });
