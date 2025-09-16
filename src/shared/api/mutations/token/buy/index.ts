import { paths } from 'shared/client';
import { invoke } from '@withease/factories';
import { swapExactToFactory } from '../swap-exact-to';
import { applyBarrier } from '@farfetched/core';
import { barriers } from 'shared/api/barriers';

type BuyTokenMutation = paths['/api/token/swap_exact_a_to_b']['post'];
export type BuyTokenMutationParams = Partial<BuyTokenMutation['requestBody']['content']['application/json']>;
export type BuyTokenMutationResponse = BuyTokenMutation['responses'][200]['content']['application/json'];

export const buy = invoke(swapExactToFactory, {
  variant: 'buy'
});

applyBarrier(buy, { barrier: barriers.auth });