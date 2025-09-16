import { createFactory } from '@withease/factories';
import { createEffect, createEvent, sample } from 'effector';
import { ShowToastParams } from '../toast';
import { showToastFx } from '../toast';

export const copyFactory = createFactory((message: string) => {
  const copied = createEvent<string | null | undefined>();
  const copyFx = createEffect<string, void>({
    handler: async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        throw new Error(`Copy failed: ${error}`);
      }
    },
  });

  sample({
    clock: copyFx.done,
    fn: () => ({ message, options: { type: 'success' } }) as ShowToastParams,
    target: showToastFx,
  });
  sample({
    clock: copied,
    filter: Boolean,
    target: copyFx,
  });
  return { copied };
});
