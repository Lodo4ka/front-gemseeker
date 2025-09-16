import { applyBarrier, createJsonMutation, declareParams, unknownContract } from '@farfetched/core';
import { sample } from 'effector';
import { ShowToastParams } from 'shared/lib/toast';
import { baseUrl } from 'shared/lib/base-url';
import { showToastFx } from 'shared/lib/toast';
import { barriers } from 'shared/api/barriers';
import { paths } from 'shared/client';

type RemoveFavouriteMutation = paths['/api/token/favourite/{token_address}']['delete'];
export type RemoveFavouriteMutationParams = Partial<RemoveFavouriteMutation['parameters']['path']>;
export type RemoveFavouriteMutationResponse = RemoveFavouriteMutation['responses'][200]['content']['application/json'];

export const removeFavourite = createJsonMutation<RemoveFavouriteMutationParams, RemoveFavouriteMutationResponse>({
    params: declareParams<RemoveFavouriteMutationParams>(),
    request: {
      method: 'DELETE',
      url: ({token_address}) => baseUrl(`/token/favourite/${token_address}`),
      credentials: 'include',
    },
    response: {
      contract: (unknownContract),
    },
});

sample({
  clock: removeFavourite.finished.failure,
  fn: ({ error }) => {
    const message = JSON.stringify(error);
    return { message, options: { type: 'error' } } as ShowToastParams;
  },
  target: showToastFx,
});

applyBarrier(removeFavourite, { barrier: barriers.auth });
