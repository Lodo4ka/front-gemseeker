import { Button } from 'shared/ui/button';
import { Skeleton } from 'shared/ui/skeleton';
import { openedModal } from '../model';
import { useUnit } from 'effector-react';

export const GenerateWallet = () => {
  const openModal = useUnit(openedModal);
  return <Button onClick={openModal}>+ Generate Wallet</Button>;
};

export const GenerateWalletFallback = () => {
  return <Skeleton isLoading className="h-9 w-[128px] rounded-lg" />;
};
