import { applyBarrier, createJsonMutation, declareParams, JsonApiRequestError } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { contracts } from 'shared/api/contracts';
import { zodContract } from '@farfetched/zod';
import { sample } from 'effector';
import { handleToastMutationStateFactory } from 'shared/lib/toast';
import { barriers } from 'shared/api/barriers';
import { invoke } from '@withease/factories';
import { infer as types } from 'zod';
export const create = createJsonMutation({
  params: declareParams<{ text: string; token_id: number }>(),
  request: {
    method: 'POST',
    url: baseUrl('/threads/create'),
    credentials: 'include',
    query: ({ text, token_id }) => ({ text, token_id }),
  },
  response: {
    contract: zodContract(contracts.thread.single),
  },
});

invoke(() =>
  handleToastMutationStateFactory<
    { text: string; token_id: number },
    types<typeof contracts.thread.single>,
    JsonApiRequestError
  >({
    mutation: create,
    succeeded: () => `You successfully created a thread`,
    pending: () => `Creating a thread..`,
  }),
);

applyBarrier(create, { barrier: barriers.auth });
