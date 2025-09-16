import { createFactory } from '@withease/factories';
import { createEvent, createStore } from 'effector';

interface popoverFactoryProps {
  defaultValue?: boolean;
}

export const popoverFactory = createFactory(({ defaultValue = false }: popoverFactoryProps) => {
  const open = createEvent();
  const close = createEvent();
  const $isOpen = createStore<boolean>(defaultValue);

  $isOpen.on(close, () => false);
  $isOpen.on(open, () => true);

  return {
    $isOpen,
    open,
    close,
  };
});
