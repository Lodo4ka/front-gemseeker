import { createFactory } from '@withease/factories';
import { RouteInstance } from 'atomic-router';
import { Event, Effect, sample, createEvent } from 'effector';
import { $publicKey } from 'entities/wallet';
import { routes } from 'shared/config/router';
import { ModalProps, modalsStore } from 'shared/lib/modal';

interface requiredAuthFactoryProps {
  startEvent: Event<any>;
  finishEvent: Event<any> | Effect<any, any>;
  ConnectWalletModalProps: ModalProps
}

export const requiredAuthFactory = createFactory(({ 
  startEvent, 
  finishEvent, 
  ConnectWalletModalProps 
}: requiredAuthFactoryProps) => {
  sample({
    clock: startEvent,
    source: $publicKey,
    filter: (v) => v === null,
    fn: () => ConnectWalletModalProps,
    target: modalsStore.openModal,
  });

  // @ts-ignore
  sample({
    clock: startEvent,
    source: $publicKey,
    filter: Boolean,
    fn: () => null,
    target: finishEvent,
  });
});

interface chainRequiredAuthFactoryProps {
  currentRoute:  RouteInstance<any>,
  ConnectWalletModalProps: ModalProps
}

export const chainRequiredAuthFactory = createFactory(({ currentRoute, ConnectWalletModalProps }: chainRequiredAuthFactoryProps) => {
  const otherwise = createEvent();

  sample({
    clock: otherwise,
    fn: () => ConnectWalletModalProps,
    target: modalsStore.openModal
  });

  sample({
    clock: modalsStore.closeModal,
    source: currentRoute.$isOpened,
    filter: (isOpenPage, props) => isOpenPage && props.id === ConnectWalletModalProps.props.id,
    target: routes.memepad.open
  });

  return otherwise
});
