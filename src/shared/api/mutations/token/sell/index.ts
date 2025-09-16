import { paths } from 'shared/client';
import { invoke } from '@withease/factories';
import { swapExactToFactory } from '../swap-exact-to';
import { applyBarrier } from '@farfetched/core';
import { barriers } from 'shared/api/barriers';

type SellTokenMutation = paths['/api/token/swap_exact_a_to_b']['post'];
export type SellTokenMutationParams = Partial<SellTokenMutation['requestBody']['content']['application/json']>;
export type SellTokenMutationResponse = SellTokenMutation['responses'][200]['content']['application/json'];

export const sell = invoke(swapExactToFactory, {
  variant: 'sell'
});

applyBarrier(sell, { barrier: barriers.auth });
