import { createEffect } from 'effector';
import { Id, toast } from 'react-toastify';

export const dismissToastFx = createEffect<Id | undefined, void>({
  handler: (id) => toast.dismiss(id)
});