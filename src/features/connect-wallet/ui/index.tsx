import { useUnit } from 'effector-react';
import { Button } from 'shared/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Typography } from 'shared/ui/typography';
import {
  $publicKey,
  getBalanceFx,
  initPublicKey as initPublicKeyEvent,
  initDisconnect as initDisconnectEvent,
  $isAuthenticating,
} from 'entities/wallet';
import { Skeleton } from 'shared/ui/skeleton';
import { openedConnectWalletModal, openedDisconnectWalletModal } from '../model';
import { Icon } from 'shared/ui/icon';
import clsx from 'clsx';
import { $viewer } from 'shared/viewer';
import { Image, ImageHover } from 'shared/ui/image';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import { Link } from 'atomic-router-react';
import { routes } from 'shared/config/router';
import { $totalBalance } from 'entities/wallet';
import { formatter } from 'shared/lib/formatter';

interface ConnectWalletButtonProps {
  classNameAuth?: string;
  classNameLogout?: string;
  classNameConnect?: string;
}

export const ConnectWalletButton = ({ classNameAuth, classNameLogout, classNameConnect }: ConnectWalletButtonProps) => {
  const [initPublicKey, openConnectModal, publicKey, openDisconnectModal, initDisconnect, isAuthenticating] = useUnit([
    initPublicKeyEvent,
    openedConnectWalletModal,
    $publicKey,
    openedDisconnectWalletModal,
    initDisconnectEvent,
    $isAuthenticating,
  ]);
  const [totalBalance, isLoading, viewer] = useUnit([$totalBalance, getBalanceFx.pending, $viewer]);
  const [isMounted, setIsMounted] = useState(false);
  const { publicKey: walletPublicKey, signMessage, disconnect } = useWallet();

  useEffect(() => {
    if (walletPublicKey) {
      initPublicKey({ publicKey: walletPublicKey, signMessage });
    }
  }, [walletPublicKey]);

  useEffect(() => {
    initDisconnect(disconnect);
  }, [disconnect]);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted || isLoading || isAuthenticating)
    return <Skeleton className="h-9 w-[156px] rounded-md lg:w-[110px]" isLoading />;

  if (publicKey && viewer) {
    return (
      <div className={clsx('bg-darkGray-1 relative flex items-center gap-2 rounded-lg px-2 py-[2px]', classNameAuth)}>
        <Link
          to={routes.profile}
          params={{
            id: viewer.user_id.toString(),
          }}
          className="h-[26px] w-[26px] inset-0"
        >
          <ImageHover
            preview={getFullUrlImg(viewer?.photo_hash, viewer.nickname)}
            className="h-full w-full rounded-full"
          />
        </Link>
        <div className="flex flex-col justify-start">
          <Typography icon={{ position: 'right', name: 'solana', size: 10 }} size="captain1">
            {formatter.number.formatSmallNumber(totalBalance)}
          </Typography>
          <Typography color="secondary" className="max-w-[70px] cursor-pointer truncate" size="captain1">
            {viewer.nickname}
          </Typography>
        </div>
        <Icon
          name="logout"
          size={16}
          className={clsx('cursor-pointer', classNameLogout)}
          onClick={openDisconnectModal}
        />
      </div>
    );
  }
  return (
    <Button
      className={{
        button: classNameConnect,
      }}
      icon={{ position: 'left', name: 'wallet' }}
      onClick={openConnectModal}>
      Connect <span className="hidden lg:inline">Wallet</span>
    </Button>
  );
};
