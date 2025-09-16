import { Mutation, JsonApiRequestError } from '@farfetched/core';
import { createFactory } from '@withease/factories';
import { createStore, sample } from 'effector';
import { Id } from 'react-toastify';
import { showToastFx, ShowToastParams } from '../show-toast';
import { updateToastFx, UpdateToastParams } from '../update-toast';
import { ErrorResponse } from 'shared/types/error';

type HandleToastMutationStateFactoryProps<Params, Data, Error extends JsonApiRequestError> = {
  mutation: Mutation<Params, Data, Error>;
  succeeded?: string | ((payload: { params: Params; result: Data }) => string) | null;
  pending?: string | ((payload: { params: Params }) => string) | null;
  failed?: string | ((payload: string) => string) | null;
};

export const handleToastMutationStateFactory = createFactory(
  <Params, Data, Error extends JsonApiRequestError>({
    mutation,
    succeeded = null,
    pending = null,
    failed = null,
  }: HandleToastMutationStateFactoryProps<Params, Data, Error>) => {
    const $toast = createStore<Id | null>(null);
    const $pending = createStore<typeof pending>(pending);
    const $succeeded = createStore<typeof succeeded>(succeeded);

    sample({
      clock: mutation.started,
      source: $pending,
      filter: (pending): pending is string | ((payload: { params: Params }) => string) => pending !== null,
      fn: (pending, { params }) => {
        const message = typeof pending === 'function' ? pending({ params }) : pending;
        return { message } as ShowToastParams;
      },
      target: showToastFx,
    });

    sample({
      clock: showToastFx.doneData,
      target: $toast,
    });

    sample({
      clock: mutation.finished.success,
      source: { succeeded: $succeeded, toast: $toast },
      filter: ({ succeeded, toast }) => succeeded !== null && toast === null,
      fn: ({ succeeded }, { params, result }) =>
        ({
          message: typeof succeeded === 'function' ? succeeded({ params, result }) : succeeded!,
          options: {
            type: 'success',
            isLoading: false,
            autoClose: 3000,
          },
        }) as ShowToastParams,
      target: showToastFx,
    });

    sample({
      clock: mutation.finished.success,
      source: { toast: $toast, succeeded: $succeeded },
      filter: ({ toast, succeeded }) => toast !== null && succeeded !== null,
      fn: ({ toast, succeeded }, { params, result }) =>
        ({
          id: toast!,
          options: {
            type: 'success',
            render: typeof succeeded === 'function' ? succeeded({ params, result }) : succeeded!,
            isLoading: false,
            autoClose: 3000,
          },
        }) as UpdateToastParams,
      target: updateToastFx,
    });

    sample({
      clock: mutation.finished.failure,
      source: $toast,
      filter: (toast): toast is Id => toast !== null,
      fn: (toast, { error }) =>
        ({
          id: toast,
          options: {
            type: 'error',
            render: failed
              ? typeof failed === 'function'
                ? failed((error as unknown as ErrorResponse).response.detail)
                : failed!
              : (error as unknown as ErrorResponse).response.detail,
            isLoading: false,
            autoClose: 3000,
          },
        }) as UpdateToastParams,
      target: updateToastFx,
    });

    sample({
      clock: mutation.finished.failure,
      source: $toast,
      filter: (toast) => toast === null,
      fn: (_, { error }) =>
        ({
          message: failed
            ? typeof failed === 'function'
              ? failed((error as unknown as ErrorResponse).response.detail)
              : failed!
            : (error as unknown as ErrorResponse).response.detail,
          options: {
            type: 'error',
            autoClose: 3000,
          },
        }) as ShowToastParams,
      target: showToastFx,
    });
  },
);
