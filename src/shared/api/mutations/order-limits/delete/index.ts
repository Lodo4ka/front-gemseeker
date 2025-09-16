import { applyBarrier, createJsonMutation, declareParams, unknownContract } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { barriers } from 'shared/api/barriers';
import { paths } from 'shared/client';
import { handleToastMutationStateFactory } from 'shared/lib/toast';
import { invoke } from '@withease/factories';

type DeleteOrderMutation = paths['/api/limit-orders/{order_pubkey}/cancel']['post'];
export type DeleteOrderMutationParams = Partial<DeleteOrderMutation['parameters']['path']>;
export type DeleteOrderMutationResponse = DeleteOrderMutation['responses'][200]['content']['application/json'];

export const deleteOrder = createJsonMutation<DeleteOrderMutationParams, DeleteOrderMutationResponse>({
  params: declareParams<DeleteOrderMutationParams>(),
  request: {
    method: 'POST',
    url: ({order_pubkey}) => baseUrl(`/limit-orders/${order_pubkey}/cancel`),
    credentials: 'include',
  },
  response: {
    contract: unknownContract,
  },
});

invoke(() =>
  handleToastMutationStateFactory<DeleteOrderMutationParams, any, any>({
    mutation: deleteOrder,
    succeeded: () => `Limit order successfully deleted`,
    pending: () => `Order limit removal..`,
    failed: (payload) => 'Unable to delete a limit order'
  }),
);

applyBarrier(deleteOrder, { barrier: barriers.auth });
