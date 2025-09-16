import { EventCallable } from 'effector';

import { ModalId, modalsStore } from 'shared/lib/modal';
import { Button } from 'shared/ui/button';
import { ModalDefault } from 'shared/ui/modal';
import { Typography } from 'shared/ui/typography';
import { useUnit } from 'effector-react';
export const INSTA_MODAL_ID = 'insta-modal';

type InstaModalProps = ModalId & { type: 'Buy' | 'Sell'; toggled: EventCallable<void> };
export const InstaModal = ({ id, type, toggled }: InstaModalProps) => {
  const toggle = useUnit(toggled);
  const closeModal = useUnit(modalsStore.closeModal);

  const handleClose = () => closeModal({ id: INSTA_MODAL_ID });

  const handleConfirm = () => {
    toggle();
    handleClose();
  };

  return (
    <ModalDefault
      header={{ children: `Enable Insta ${type}`, size: 'headline4', weight: 'regular' }}
      id={id}
      classNames={{
        wrapper: 'max-w-[380px] !gap-2',
        content: 'flex flex-col gap-8',
      }}>
      <Typography color="secondary" size="subheadline2" weight="regular">
        Once enabled, the default {type} amount will be based on your last transaction.
      </Typography>
      <div className="flex items-center gap-3">
        <Button className={{ button: 'w-full' }} onClick={handleClose} theme="quaternary">
          Cancel
        </Button>
        <Button className={{ button: 'w-full' }} onClick={handleConfirm}>
          Confirm
        </Button>
      </div>
    </ModalDefault>
  );
};
