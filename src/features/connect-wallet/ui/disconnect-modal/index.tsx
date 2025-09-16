import { useUnit } from 'effector-react';
import { ModalId, ModalProps, modalsStore } from 'shared/lib/modal';
import { Button } from 'shared/ui/button';
import { ModalDefault } from 'shared/ui/modal';
import { DISCONNECT_WALLET_MODAL_ID } from '../../config';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback } from 'react';
import { Typography } from 'shared/ui/typography';
import { disconnected } from 'entities/wallet';

const DisconnectWalletModal = ({ id }: ModalId) => {
  const closeModal = useUnit(modalsStore.closeModal);
  const resetStores = useUnit(disconnected);
  const { disconnect } = useWallet();

  const handleDisconnect = useCallback(() => {
    disconnect();
    resetStores();
  }, [disconnect, resetStores]);

  return (
    <ModalDefault
      header={{
        children: 'Log out',
        weight: 'medium',
        size: 'subheadline1',
        color: 'primary',
        className: 'text-primary',
      }}
      classNames={{
        content: 'flex flex-col gap-2 w-full',
        wrapper: '!bg-bg max-w-[340px]',
      }}
      id={id}>
      <Typography size="subheadline2" weight="regular" color="secondary">
        Are you sure you want to log out from Gemseeker?
      </Typography>
      <div className="flex items-center justify-end gap-2">
        <Button className={{ button: 'h-9' }} theme="secondary" onClick={() => closeModal({ id })}>
          Cancel
        </Button>
        <Button onClick={handleDisconnect}>Log out</Button>
      </div>
    </ModalDefault>
  );
};

export const DisconnectWalletModalProps: ModalProps = {
  Modal: DisconnectWalletModal,
  isOpen: false,
  props: {
    id: DISCONNECT_WALLET_MODAL_ID,
  },
};
