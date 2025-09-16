import { applyBarrier, createJsonMutation, declareParams, unknownContract } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { barriers } from 'shared/api/barriers';
import { paths } from 'shared/client';
import { handleToastMutationStateFactory } from 'shared/lib/toast';
import { invoke } from '@withease/factories';

type CreateOrderMutation = paths['/api/limit-orders']['post'];
export type CreateOrderMutationParams = Partial<CreateOrderMutation['requestBody']['content']['application/json']>;
export type CreateOrderMutationResponse = CreateOrderMutation['responses'][201]['content']['application/json'];

export const create = createJsonMutation<CreateOrderMutationParams, CreateOrderMutationResponse>({
  params: declareParams<CreateOrderMutationParams>(),
  request: {
    method: 'POST',
    url: baseUrl('/limit-orders'),
    body: (body) => body,
    credentials: 'include',
  },
  response: {
    contract: unknownContract,
  },
});

invoke(() =>
  handleToastMutationStateFactory<CreateOrderMutationParams, any, any>({
    mutation: create,
    succeeded: () => `You successfully created a limit order`,
    pending: () => `Creating a limit order..`,
    failed: (payload) => {
      console.log(payload);
      if(payload.includes('5 USD')) {
        return 'Order size must be at least 5 USD'
      }
      return 'Unable to create a limit order'
    }
  }),
);

applyBarrier(create, { barrier: barriers.auth });
