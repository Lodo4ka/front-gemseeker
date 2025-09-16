import { createJsonMutation, declareParams, unknownContract } from '@farfetched/core';
import { paths } from 'shared/client';
import { baseUrl } from 'shared/lib/base-url';

type AuthenticateMutation = paths['/api/user/auth']['post'];
export type AuthenticateMutationParams = Partial<AuthenticateMutation['requestBody']['content']['application/json']>;
export type AuthenticateMutationResponse = AuthenticateMutation['responses'][200]['content']['application/json'];

export const authenticate = createJsonMutation({
  params: declareParams<AuthenticateMutationParams>(),
  request: {
    method: 'POST',
    url: baseUrl('/user/auth'),
    credentials: 'include',
    body: (data) => data,
  },
  response: {
    contract: unknownContract,
  },
});
