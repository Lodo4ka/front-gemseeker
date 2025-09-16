import { LazyExoticComponent, ComponentType, lazy } from 'react';

export const namedLazy = <T extends Record<string, ComponentType<unknown>>>(
  loader: () => Promise<T>,
  name: keyof T
): LazyExoticComponent<T[typeof name]> => lazy(async () => {
  const module = await loader();
  return { default: module[name] };
});