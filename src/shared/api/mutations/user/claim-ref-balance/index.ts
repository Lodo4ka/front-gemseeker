import { applyBarrier, createMutation, onAbort } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { barriers } from 'shared/api/barriers';
import { paths } from 'shared/client';
import { handleToastMutationStateFactory } from 'shared/lib/toast';
import { invoke } from '@withease/factories';

type ClaimRefBalanceMutation = paths['/api/user/claim_ref_balance']['post'];
export type ClaimRefBalanceMutationParams = Partial<ClaimRefBalanceMutation['requestBody']>;
export type ClaimRefBalanceMutationResponse = ClaimRefBalanceMutation['responses'][200]['content']['application/json'];

export const claimRefBalance = createMutation<ClaimRefBalanceMutationParams, ClaimRefBalanceMutationResponse>({
  handler: async () => {
    const abortController = new AbortController();

    onAbort(() => abortController.abort());

    try {
      const response = await fetch(baseUrl('/user/claim_ref_balance'), {
        method: 'POST',
        credentials: 'include',
        signal: abortController.signal,
      });

      if (!response.ok) throw await response.json();

      return response.json();
    } catch (error) {
      throw error;
    }
  },
});

invoke(() =>
  handleToastMutationStateFactory<ClaimRefBalanceMutationParams, ClaimRefBalanceMutationResponse, any>({
    mutation: claimRefBalance,
    succeeded: () => `You have successfully claimed referral balance`,
    pending: () => `Claiming referral balance...`,
  }),
);

applyBarrier(claimRefBalance, { barrier: barriers.auth });
