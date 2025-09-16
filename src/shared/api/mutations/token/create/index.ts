import { applyBarrier, createMutation, onAbort } from '@farfetched/core';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { infer as types } from 'zod';
import { barriers } from 'shared/api/barriers';
import { handleToastMutationStateFactory } from 'shared/lib/toast';
import { invoke } from '@withease/factories';

type CreateTokenResponse = types<typeof contracts.token.create>;

export const create = createMutation<FormData, CreateTokenResponse>({
  handler: async (data) => {
    const abortController = new AbortController();

    onAbort(() => abortController.abort());

    try {
      const response = await fetch(baseUrl('/token/create'), {
        method: 'POST',
        credentials: 'include',
        body: data,
        signal: abortController.signal,
      });

      if (!response.ok) throw await response.json();

      return response.json();
    } catch (error) {
      throw error;
    }
  },
});

applyBarrier(create, { barrier: barriers.auth });

invoke(() =>
  handleToastMutationStateFactory<FormData, CreateTokenResponse, any>({
    mutation: create,
    succeeded: ({ params }) => `You successfully created a ${params.get('name')} token`,
    pending: ({ params }) => `Creating a ${params.get('name')} token..`,
  }),
);
