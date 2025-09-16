import { applyBarrier, createJsonMutation, declareParams, unknownContract } from "@farfetched/core";
import { invoke } from "@withease/factories";
import { barriers } from "shared/api/barriers";
import { paths } from "shared/client";
import { baseUrl } from "shared/lib/base-url";
import { formatter } from "shared/lib/formatter";
import { handleToastMutationStateFactory } from "shared/lib/toast";

type SwapMutation = paths['/api/token/swap_b_to_exact_a']['post'];
export type SwapMutationParams = Partial<SwapMutation['requestBody']['content']['application/json']> & {
  symbol: string;
  rate?: number;
};
export type SwapMutationResponse = SwapMutation['responses'][200]['content']['application/json'];

export const buyFull = createJsonMutation<SwapMutationParams, SwapMutationResponse>({
    params: declareParams<SwapMutationParams>(),
    request: {
      method: 'POST',
      url: baseUrl(`/token/swap_b_to_exact_a`),
      credentials: 'include',
      body: (body) => body,
    },
    response: {
      contract: unknownContract,
    },
});

invoke(() =>
    handleToastMutationStateFactory<SwapMutationParams, SwapMutationResponse, any>({
        mutation: buyFull,
        succeeded: ({ params }) =>
            `You successfully swapped ${formatter.number.formatSmallNumber(params.max_amount_in ?? 0)} SOL for ${formatter.number.formatSmallNumber(params.rate ?? 0)} ${params.symbol}`,
        pending: ({ params }) =>
            `Swapping ${formatter.number.formatSmallNumber(params.max_amount_in ?? 0)} SOL for ${formatter.number.formatSmallNumber(params.rate ?? 0)} ${params.symbol}..`,
    }),
);

applyBarrier(buyFull, { barrier: barriers.auth });