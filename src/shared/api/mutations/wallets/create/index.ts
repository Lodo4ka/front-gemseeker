import { applyBarrier, createJsonMutation } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { sample } from 'effector';
import { contracts } from 'shared/api/contracts';
import { ShowToastParams } from 'shared/lib/toast';
import { baseUrl } from 'shared/lib/base-url';
import { ErrorWithResponse } from 'shared/lib/isErrorResponse';
import { showToastFx } from 'shared/lib/toast';
import { barriers } from 'shared/api/barriers';

export const create = createJsonMutation({
  request: {
    method: 'POST',
    url: baseUrl('/wallets/create'),
    credentials: 'include',
    body: () => ({ name: 'Wallet 1' }),
  },
  response: {
    contract: zodContract(contracts.wallets.create),
  },
});

sample({
  clock: create.finished.failure,
  fn: ({ error }) => {
    const message = `${(error as ErrorWithResponse).response?.detail || error.explanation}`;
    return { message, options: { type: 'error' } } as ShowToastParams;
  },
  target: showToastFx,
});

applyBarrier(create, { barrier: barriers.auth });
