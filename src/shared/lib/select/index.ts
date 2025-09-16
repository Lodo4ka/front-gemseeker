import { createFactory } from '@withease/factories';
import { combine, createEvent, createStore, sample, Store, StoreWritable } from 'effector';
interface SelectFactoryProps<T> {
  defaultValue: Store<T> | StoreWritable<T>;
}

export const selectFactory = createFactory(<T>({ defaultValue }: SelectFactoryProps<T>) => {
  const selected = createEvent<{ option: T }>();
  const $defaultValue = combine(defaultValue, (defaultValue) => defaultValue || null);
  const $value = createStore<T | null>(null);

  $value.on(selected, (_, { option }) => option);

  sample({
    clock: $defaultValue,
    target: $value,
  });

  return {
    $value,
    selected,
  };
});
