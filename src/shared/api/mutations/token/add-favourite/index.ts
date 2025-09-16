import { applyBarrier, createJsonMutation, declareParams, unknownContract } from '@farfetched/core';
import { sample } from 'effector';
import { ShowToastParams } from 'shared/lib/toast';
import { baseUrl } from 'shared/lib/base-url';
import { showToastFx } from 'shared/lib/toast';
import { barriers } from 'shared/api/barriers';
import { paths } from 'shared/client';

type AddFavouriteMutation = paths['/api/token/favourite/{token_address}']['post'];
export type AddFavouriteMutationParams = Partial<AddFavouriteMutation['parameters']['path']>;
export type AddFavouriteMutationResponse = AddFavouriteMutation['responses'][200]['content']['application/json'];

export const addFavourite = createJsonMutation<AddFavouriteMutationParams, AddFavouriteMutationResponse>({
  params: declareParams<AddFavouriteMutationParams>(),
  request: {
    method: 'POST',
    url: ({ token_address }) => baseUrl(`/token/favourite/${token_address}`),
    credentials: 'include',
  },
  response: {
    contract: unknownContract,
  },
});

sample({
  clock: addFavourite.finished.failure,
  fn: ({ error }) => {
    const message = JSON.stringify(error);
    return { message, options: { type: 'error' } } as ShowToastParams;
  },
  target: showToastFx,
});

applyBarrier(addFavourite, { barrier: barriers.auth });
