import { applyBarrier, createMutation, onAbort } from '@farfetched/core';
import { contracts } from 'shared/api/contracts';
import { handleToastMutationStateFactory } from 'shared/lib/toast';
import { baseUrl } from 'shared/lib/base-url';

import { infer as types } from 'zod';
import { barriers } from 'shared/api/barriers';
import { invoke } from '@withease/factories';

type CreatePostParams = {
  files?: FormData | null;
  text: string;
  title: string;
};

type CreatePostResponse = types<typeof contracts.post.default>;

export const create = createMutation<CreatePostParams, CreatePostResponse>({
  handler: async ({ files, text, title }) => {
    const abortController = new AbortController();

    onAbort(() => abortController.abort());

    const url = baseUrl(`/posts/create?text=${text}&title=${title}`);

    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: files ?? null,
      signal: abortController.signal,
    }).then(async (res) => await res.json());
  },
});

invoke(() =>
  handleToastMutationStateFactory<CreatePostParams, CreatePostResponse, any>({
    mutation: create,
    succeeded: () => `You have successfully created a post`,
    pending: () => `Creating a post...`,
  }),
);

applyBarrier(create, { barrier: barriers.auth });
