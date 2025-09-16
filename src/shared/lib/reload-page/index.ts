import { createEffect } from 'effector';

export const reloadPageFx = createEffect(() => window.location.reload());