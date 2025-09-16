import { useUnit } from 'effector-react';
import { $wallets } from '../../model/wallets';
import { $value, selected } from '../../model/select-wallet';
import { SelectWalletBase } from './base';
import { EventCallable, StoreWritable } from 'effector';
import { infer as types } from 'zod';
import { contracts } from 'shared/api/contracts';
import { useEffect, useState } from 'react';

export type SelectWalletUniqueProps = {
  toggledPopover: EventCallable<void>;
  closedPopover: EventCallable<void>;
  $isOpenPopover: StoreWritable<boolean>;
  $value: StoreWritable<types<typeof contracts.wallets.wallet> | null>;
  selected: EventCallable<{ option: types<typeof contracts.wallets.wallet> | null }>;
  className?: {
    container?: string;
    children?: string;
    button?: string;
    text?: string;
  };
  placement?: 'top' | 'bottom' | 'left' | 'right';
  isVisibleBalance?: boolean;
  isVisibleAllWallets?: boolean;
};

export type SelectWalletProps = {
  all?: boolean;
  className?: {
    button?: string;
    container?: string;
    children?: string;
    text?: string;
  };
  placement?: 'top' | 'bottom' | 'left' | 'right';
  isVisibleBalance?: boolean;
  isVisibleAllWallets?: boolean;
  stateManagmentAllWallets?: {
    $store: StoreWritable<boolean>,
    toggled: EventCallable<void>
  }
};

export const SelectWallet = ({
  all = true,
  className,
  placement = 'bottom',
  ...other
}: SelectWalletProps) => {
  const wallets = useUnit($wallets);
  const [selectedWallet, selectWallet] = useUnit([$value, selected]);

  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const togglePopover = () => setIsOpenPopover(prev => !prev);
  const closePopover = () => setIsOpenPopover(false);

  useEffect(() => {
    if(selectedWallet) closePopover()
  }, [selectedWallet]);

  return (
    <SelectWalletBase
      selectWallet={selectWallet}
      all={all}
      closePopover={closePopover}
      className={className}
      selectedWallet={selectedWallet}
      wallets={wallets}
      isOpenPopover={isOpenPopover}
      togglePopover={togglePopover}
      placement={placement}
      {...other}
    />
  );
};

export const SelectWalletUnique = ({
  className,
  $isOpenPopover,
  selected,
  $value,
  toggledPopover,
  closedPopover,
  placement = 'bottom',
  ...other
}: SelectWalletUniqueProps) => {
  const wallets = useUnit($wallets);
  const [isOpenPopover, togglePopover, closePopover] = useUnit([$isOpenPopover, toggledPopover, closedPopover]);
  const [selectedWallet, selectWallet] = useUnit([$value, selected]);

  return (
    <SelectWalletBase
      selectWallet={selectWallet}
      all={false}
      className={className}
      closePopover={closePopover}
      selectedWallet={selectedWallet}
      wallets={wallets}
      isOpenPopover={isOpenPopover}
      togglePopover={togglePopover}
      placement={placement}
      {...other}
    />
  );
};
