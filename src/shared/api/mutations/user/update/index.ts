import { applyBarrier, createMutation, onAbort } from '@farfetched/core';
import { sample } from 'effector';
import { contracts } from 'shared/api/contracts';
import { ShowToastParams } from 'shared/lib/toast';
import { baseUrl } from 'shared/lib/base-url';
import { ErrorWithResponse } from 'shared/lib/isErrorResponse';
import { showToastFx } from 'shared/lib/toast';
import { infer as types } from 'zod';
import { barriers } from 'shared/api/barriers';

type UpdateParams = {
  photo?: FormData;
  bio: string;
  nickname: string;
};

type UpdateResponse = types<typeof contracts.user.profile>;

export const update = createMutation<UpdateParams, UpdateResponse>({
  handler: async ({ photo, bio, nickname }) => {
    const abortController = new AbortController();

    onAbort(() => abortController.abort());

    const params = new URLSearchParams({ bio, nickname });
    const url = baseUrl(`/user/update_profile?${params.toString()}`);

    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: photo ?? null,
      signal: abortController.signal,
    }).then(async (res) => await res.json());
  },
});
sample({
  clock: update.finished.failure,
  fn: ({ error }) => {
    const message = `${(error as ErrorWithResponse).response?.detail || JSON.stringify(error)}`;
    return { message, options: { type: 'error' } } as ShowToastParams;
  },
  target: showToastFx,
});

applyBarrier(update, { barrier: barriers.auth });
