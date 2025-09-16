import { namedLazy } from 'shared/lib/named-lazy';

export const NotFoundPage = namedLazy(async () => await import('./ui'), 'NotFoundPage');
export const SoonPage = namedLazy(async () => await import('./ui'), 'SoonPage');
