import { createFactory } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { debounce } from 'patronum';

const DEBOUNCE_TIMEOUT_IN_MS = 300;

interface createInputProps {
  defaultValue?: string;
  filter?: (clk: string) => boolean;
}

export const inputFactory = createFactory(({
  defaultValue,
  filter
}:createInputProps) => {
  const fieldUpdated = createEvent<string>();
  const debouncedValue = debounce(fieldUpdated, DEBOUNCE_TIMEOUT_IN_MS);

  const $value = createStore<string>(defaultValue ?? '');
  const $debouncedValue = createStore<string>(defaultValue ?? '');

  sample({
    clock: fieldUpdated,
    filter: filter ?? (() => true),
    target: $value
  });

  sample({
    clock: debouncedValue,
    target: $debouncedValue
  });

  return {
    $value,
    $debouncedValue,
    fieldUpdated,
    debouncedValue
  };
});