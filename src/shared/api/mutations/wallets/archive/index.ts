import { applyBarrier, createJsonMutation, declareParams, unknownContract } from '@farfetched/core';
import { sample } from 'effector';

import { baseUrl } from 'shared/lib/base-url';
import { showToastFx, ShowToastParams } from 'shared/lib/toast';
import { ErrorWithResponse } from 'shared/lib/isErrorResponse';
import { barriers } from 'shared/api/barriers';

export const archive = createJsonMutation({
  params: declareParams<{ id: number }>(),
  request: {
    method: 'POST',
    url: baseUrl('/wallets/archive'),
    credentials: 'include',
    query: ({ id }) => ({ wallet_id: id }),
  },
  response: {
    contract: unknownContract,
  },
});

sample({
  clock: archive.finished.failure,
  fn: ({ error }) => {
    const message = `${(error as ErrorWithResponse).response?.detail || error.explanation}`;
    return { message, options: { type: 'error' } } as ShowToastParams;
  },
  target: showToastFx,
});

applyBarrier(archive, { barrier: barriers.auth });
