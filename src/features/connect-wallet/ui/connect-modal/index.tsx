import { useUnit } from 'effector-react';
import { ModalId, ModalProps, modalsStore } from 'shared/lib/modal';
import { Button } from 'shared/ui/button';
import { ModalDefault } from 'shared/ui/modal';
import { CONNECT_WALLET_MODAL_ID } from '../../config';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { useCallback, useMemo } from 'react';
import { Typography } from 'shared/ui/typography';

const ConnectWalletModal = ({ id }: ModalId) => {
  const [closeModal] = useUnit([modalsStore.closeModal]);
  const { wallets, select } = useWallet();

  const sortedWallets = useMemo(() => {
    return [...wallets].sort((a, b) => {
      if (a.readyState === WalletReadyState.Installed && b.readyState !== WalletReadyState.Installed) {
        return -1;
      }
      if (a.readyState !== WalletReadyState.Installed && b.readyState === WalletReadyState.Installed) {
        return 1;
      }
      return 0;
    });
  }, [wallets]);

  const handleWalletClick = useCallback(
    (walletName: WalletName) => {
      select(walletName);
      closeModal({ id });
    },
    [select, closeModal, id],
  );

  return (
    <ModalDefault
      header={{
        children: 'Connect Solana Wallet',
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
      {sortedWallets.map(({ adapter }) => (
        <Button
          theme="secondary"
          className={{ button: 'flex h-11 items-center !justify-between !py-2 !pr-3 !pl-2' }}
          key={adapter.name}
          onClick={() => handleWalletClick(adapter.name)}>
          <div className="flex items-center gap-2">
            <img src={adapter.icon} alt={adapter.name} className="h-7 w-7 rounded-[4px]" />
            <Typography>{adapter.name}</Typography>
          </div>
          {adapter.readyState === WalletReadyState.Installed && (
            <div className="flex items-center gap-2">
              <div className="bg-green h-1 w-1 rounded-full" />
              <Typography color="secondary" size="subheadline2">
                Installed
              </Typography>
            </div>
          )}
        </Button>
      ))}
    </ModalDefault>
  );
};

export const ConnectWalletModalProps: ModalProps = {
  Modal: ConnectWalletModal,
  isOpen: false,
  props: {
    id: CONNECT_WALLET_MODAL_ID,
  },
};
