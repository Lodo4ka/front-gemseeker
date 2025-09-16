import { createJsonMutation, declareParams, JsonApiRequestError } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { contracts } from 'shared/api/contracts';
import { zodContract } from '@farfetched/zod';
import { handleToastMutationStateFactory } from 'shared/lib/toast';
import { invoke } from '@withease/factories';
import { infer as types } from 'zod';
import { ErrorResponse } from 'shared/types/error';
type DonateParams = {
  slug: string;
  amount: number;
};

export const donate = createJsonMutation({
  params: declareParams<DonateParams>(),
  request: {
    method: 'POST',
    url: baseUrl('/room/donate'),
    credentials: 'include',
    body: ({ slug, amount }) => ({
      slug,
      amount,
      text: 'no text',
    }),
  },
  response: {
    contract: zodContract(contracts.stream.donate),
  },
});

invoke(() =>
  handleToastMutationStateFactory<DonateParams, types<typeof contracts.stream.donate>, JsonApiRequestError>({
    mutation: donate,
    succeeded: ({ params }) => `You successfully donated ${params.amount} SOL to the streamer`,
    pending: ({ params }) => `Donating ${params.amount} SOL to the streamer..`,
  }),
);
