import { createFactory } from '@withease/factories';
import { createEvent, createStore } from 'effector';

interface checkboxFactoryProps {
  defaultState?: boolean
}

export const checkboxFactory = createFactory(({
  defaultState = false
}: checkboxFactoryProps) => {
  const toggled = createEvent();
  const toggledChecked = createEvent();
  const toggledUnchecked = createEvent();
  const $isChecked = createStore<boolean>(defaultState);

  $isChecked.on(toggled, (state) => !state);
  $isChecked.on(toggledChecked, () => true);
  $isChecked.on(toggledUnchecked, () => false);

  return {
    $isChecked,
    toggled,
    toggledChecked,
    toggledUnchecked,
  };
});
