import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';

export type ProfileParams = {
  user_id: number;
  from_id?: number | null;
};
export const profile = createJsonQuery({
  params: declareParams<ProfileParams>(),
  request: {
    method: 'GET',
    query: ({ user_id, from_id }) => ({ user_id, from_id: from_id || null }),
    url: baseUrl('/user/profile'),
  },
  response: {
    contract: zodContract(contracts.user.profile),
  },
});

concurrency(profile, {
  strategy: 'TAKE_LATEST',
});
