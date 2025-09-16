import { createJsonMutation, declareParams } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { contracts } from 'shared/api/contracts';
import { zodContract } from '@farfetched/zod';
import { createFactory } from '@withease/factories';

type JoinStreamParams = {
  ws_url: string;
  slug: string;
};

export const join = createFactory(() => {
  const mutation = createJsonMutation({
    params: declareParams<JoinStreamParams>(),
    request: {
      method: 'POST',
      url: baseUrl('/room/join'),
      credentials: 'include',
      body: (params) => params,
    },
    response: {
      contract: zodContract(contracts.stream.join),
    },
  });

  return mutation;
});
