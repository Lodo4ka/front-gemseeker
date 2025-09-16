import { applyBarrier, createJsonMutation, declareParams, unknownContract } from '@farfetched/core';
import { baseUrl } from 'shared/lib/base-url';
import { barriers } from 'shared/api/barriers';
import { paths } from 'shared/client';
import { handleToastMutationStateFactory } from 'shared/lib/toast';
import { createFactory, invoke } from '@withease/factories';
import { formatter } from 'shared/lib/formatter';

type SwapMutation = paths['/api/token/swap_exact_a_to_b']['post'];
export type SwapMutationParams = Partial<SwapMutation['requestBody']['content']['application/json']> & {
  symbol: string;
  rate?: number;
};
export type SwapMutationResponse = SwapMutation['responses'][200]['content']['application/json'];

interface swapExactToFactoryProps {
  variant: 'sell' | 'buy';
}

export const swapExactToFactory = createFactory(({ variant }: swapExactToFactoryProps) => {
  const apiUrl = variant === 'buy' ? 'swap_exact_b_to_a' : 'swap_exact_a_to_b';

  const swap_exact_to = createJsonMutation<SwapMutationParams, SwapMutationResponse>({
    params: declareParams<SwapMutationParams>(),
    request: {
      method: 'POST',
      url: baseUrl(`/token/${apiUrl}`),
      credentials: 'include',
      body: (body) => body,
    },
    response: {
      contract: unknownContract,
    },
  });

  invoke(() =>
    handleToastMutationStateFactory<SwapMutationParams, SwapMutationResponse, any>({
      mutation: swap_exact_to,
      succeeded: ({ params }) =>
        `You successfully swapped ${formatter.number.formatSmallNumber(params.exact_amount_in ?? 0)} ${variant === 'buy' ? 'SOL' : params.symbol} for ${formatter.number.formatSmallNumber(params.rate ?? 0)} ${variant === 'buy' ? params.symbol : 'SOL'}`,
      pending: ({ params }) =>
        `Swapping ${formatter.number.formatSmallNumber(params.exact_amount_in ?? 0)} ${variant === 'buy' ? 'SOL' : params.symbol} for ${formatter.number.formatSmallNumber(params.rate ?? 0)} ${variant === 'buy' ? params.symbol : 'SOL'}..`,
    }),
  );

  applyBarrier(swap_exact_to, { barrier: barriers.auth });

  return swap_exact_to;
});
