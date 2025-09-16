import { RefCallback, RefObject } from 'react';

export function mergeRefs<T>(...refs: (RefCallback<T> | RefObject<T> | null | undefined)[]): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(value);
      } else {
        // @ts-ignore
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}
