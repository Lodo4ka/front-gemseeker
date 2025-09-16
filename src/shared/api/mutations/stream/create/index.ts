import { applyBarrier, createJsonMutation, declareParams, JsonApiRequestError } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { contracts } from 'shared/api/contracts';
import { zodContract } from '@farfetched/zod';
import { barriers } from 'shared/api/barriers';
import { handleToastMutationStateFactory } from 'shared/lib/toast';
import { invoke } from '@withease/factories';
export type CreateStreamParams = {
  name: string;
  tasks: {
    description: string;
    donation_target: number | null;
    mcap_target: number | null;
    token_address: string | null;
  }[];
  show_stream_on: string[];
};

export const create = createJsonMutation({
  params: declareParams<CreateStreamParams>(),
  request: {
    method: 'POST',
    url: baseUrl('/room/create'),
    credentials: 'include',
    body: (params) => ({
      ...params,
      is_nsfw: false,
      tasks: params.tasks.map((task) => ({
        ...task,
        donation_target: task.donation_target,
        mcap_target: task.mcap_target,
        token_address: task.token_address,
      })),
    }),
  },
  response: {
    contract: zodContract(contracts.stream.create),
    mapData: ({ result }) => result.slug,
  },
});

applyBarrier(create, { barrier: barriers.auth });

invoke(() =>
  handleToastMutationStateFactory<CreateStreamParams, string, JsonApiRequestError>({
    mutation: create,
    succeeded: ({ params }) => `You successfully launched a stream ${params.name}`,
    pending: () => `Launching a stream..`,
  }),
);
