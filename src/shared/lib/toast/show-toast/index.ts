import { createEffect } from 'effector';
import { Id, toast, ToastOptions } from 'react-toastify';

export interface ShowToastParams {
  message: string;
  options?: ToastOptions;
}

export const showToastFx = createEffect<ShowToastParams, Id>({
  handler: ({ message, options }) =>
    toast(message, {
      ...options,
    }),
});
