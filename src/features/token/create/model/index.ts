import { createField, createForm } from '@effector-reform/core';
import { zodAdapter } from '@effector-reform/zod';
import { invoke } from '@withease/factories';
import { combine, createEffect, sample } from 'effector';
import { api } from 'shared/api';
import { routes } from 'shared/config/router';
import { ErrorWithResponse } from 'shared/lib/isErrorResponse';
import { multistepFactory } from 'shared/lib/multistep';
import { showToastFx, ShowToastParams } from 'shared/lib/toast';
import { CREATE_TOKEN_MODAL, formSchema } from '../config';
import { CreateTokenParams } from '../types';
import { exactBtoA } from 'shared/lib/rate-token';
import { toggledToken, $currentToken } from './buy-input';
import { modalsStore } from 'shared/lib/modal';

export const { $currentStep, nextStep, prevStep } = invoke(multistepFactory);

export const createTokenFx = createEffect<CreateTokenParams, FormData, ErrorWithResponse>(
  ({ token_name, ticker, description, image, nsfw, socials, amount_to_buy, currentToken }) => {
    const formData = new FormData();

    formData.append('name', token_name);
    formData.append('symbol', ticker);

    formData.append('description', description);
    formData.append('is_nsfw', String(nsfw));
    formData.append('twitter', socials.twitter ?? '');
    formData.append('telegram', socials.telegram ?? '');
    formData.append('website', socials.website ?? '');

    let buy = '0';

    if (currentToken === 'SOL') {
      buy = exactBtoA({ value: +amount_to_buy }).toString();
    }

    buy = exactBtoA({ value: +amount_to_buy }).toString();

    if(Number.isFinite(Number(buy))) {
      formData.append('buy', buy);
    }

    if (image) {
      formData.append('photo', image);
    }

    return formData;
  },
);

export const $$tokenForm = createForm({
  validationStrategies: ['submit'],
  schema: {
    token_name: createField<string>(''),
    ticker: createField<string>(''),
    description: createField<string>(''),
    image: createField<File | null>(null),
    amount_to_buy: createField<string>(''),
    socials: {
      twitter: createField<string>(''),
      telegram: createField<string>(''),
      website: createField<string>(''),
    },
    preview: createField<string>(''),
    nsfw: createField<boolean>(false),
    livestream: createField<boolean>(false),
  },
  validation: zodAdapter(formSchema),
});

export const $rateBuyTokens = combine($$tokenForm.fields.amount_to_buy.$value, $currentToken, (value, currentToken) => {
  if (currentToken === 'SOL') {
    return exactBtoA({ value: +value });
  }

  return exactBtoA({ value: +value });
});

sample({
  clock: $$tokenForm.validationFailed,
  fn: (errors) => {
    const message = Object.values(errors).filter(Boolean).join(' ');
    return { message, options: { type: 'error' } } as ShowToastParams;
  },
  target: showToastFx,
});

sample({
  clock: $$tokenForm.validatedAndSubmitted,
  source: $currentToken,
  filter: (_, { livestream }) => livestream === false,
  fn: (currentToken, tokenForm) => ({
    currentToken,
    ...tokenForm,
  }),
  target: createTokenFx,
});

sample({
  clock: $$tokenForm.validatedAndSubmitted,
  filter: ({ livestream }) => livestream === true,
  target: nextStep,
});

sample({
  clock: createTokenFx.doneData,
  target: api.mutations.token.create.start,
});

sample({
  clock: api.mutations.token.create.finished.success,
  source: $$tokenForm.$values.map(({ livestream }) => livestream),
  filter: (livestream) => livestream === false,
  fn: (_, { result }) => ({ address: result.address }),
  target: [routes.token.open, $$tokenForm.reset],
});

// sample({
//   clock: api.mutations.token.create.finished.failure,
//   fn: ({ error }) => {
//     let message = 'Some error occurred, try again later';
//     const lamportsRegex = /Transfer: insufficient lamports (\d+), need (\d+)/;
//     const match = (error as any).detail.match(lamportsRegex);

//     if (match) {
//       const available = parseInt(match[1], 10);
//       const required = parseInt(match[2], 10);
//       message = `Not enough balance. Available: ${(available / LAMPORTS_PER_SOL).toFixed(5)} SOL, Required: ${(required / LAMPORTS_PER_SOL).toFixed(5)} SOL`;
//     }

//     return { message, options: { type: 'error' } } as ShowToastParams;
//   },
//   target: showToastFx,
// });

sample({
  clock: api.mutations.token.create.finished.success,
  fn: () => ({ id: CREATE_TOKEN_MODAL }),
  target: modalsStore.closeModal,
});
export { toggledToken, $currentToken };
