import { createEffect } from 'effector';
import { Id, UpdateOptions, toast } from 'react-toastify';
import { Flip } from 'react-toastify';

export interface UpdateToastParams {
  id: Id;
  options?: UpdateOptions<unknown> | undefined;
}

export const updateToastFx = createEffect<UpdateToastParams, void>({
  handler: ({ id, options }) =>
    toast.update(id, {
      transition: Flip,
      ...options,
      render: options?.render,
    }),
});
