import { applyBarrier, createJsonMutation, declareParams, unknownContract } from '@farfetched/core';

import { baseUrl } from 'shared/lib/base-url';
import { handleToastMutationStateFactory } from 'shared/lib/toast';
import { barriers } from 'shared/api/barriers';
import { invoke } from '@withease/factories';

type WithdrawParams = {
  wallet_id: number;
  amount: number;
  destination: string;
  spl_token_address: string | 'native';
};

export const withdraw = createJsonMutation({
  params: declareParams<WithdrawParams>(),
  request: {
    method: 'POST',
    url: baseUrl('/wallets/withdraw'),
    credentials: 'include',
    query: (params) => params,
  },
  response: {
    contract: unknownContract,
  },
});

invoke(() =>
  handleToastMutationStateFactory<WithdrawParams, unknown, any>({
    mutation: withdraw,
    succeeded: ({ params }) => `You have successfully sent ${params.amount} SOL to ${params.destination}`,
    pending: ({ params }) => `Sending ${params.amount} SOL to ${params.destination}...`,
  }),
);

applyBarrier(withdraw, { barrier: barriers.auth });
