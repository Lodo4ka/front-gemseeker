import { CopyAddress } from 'features/copy-address';
import { toggled, $isChecked, copied } from '../../../model/select-wallet';
import { useUnit } from 'effector-react';
import { Checkbox } from 'shared/ui/checkbox';
import { Icon } from 'shared/ui/icon';
import { Popover } from 'shared/ui/popover';
import { Typography } from 'shared/ui/typography';
import clsx from 'clsx';
import { Skeleton } from 'shared/ui/skeleton';
import { $walletsBalances } from '../../../model/balance';
import { infer as types } from 'zod';
import { contracts } from 'shared/api/contracts';
import { $rate } from 'features/exchange-rate';
import { formatter } from 'shared/lib/formatter';
import { StoreWritable } from 'effector';
import { EventCallable } from 'effector';

type SelectWalletBaseProps = {
  all?: boolean;
  togglePopover: () => void;
  closePopover: () => void;
  isOpenPopover: boolean;
  className?: {
    container?: string;
    children?: string;
    button?: string;
    text?: string;
  };
  wallets: types<typeof contracts.wallets.all>;
  selectedWallet: types<typeof contracts.wallets.wallet> | null;
  selectWallet: ({ option }: { option: types<typeof contracts.wallets.wallet> | null }) => void;
  placement: 'top' | 'bottom' | 'left' | 'right';
  isVisibleBalance?: boolean;
  isVisibleAllWallets?: boolean;
  stateManagmentAllWallets?: {
    $store: StoreWritable<boolean>;
    toggled: EventCallable<void>;
  };
};

export const SelectWalletBase = ({
  all = true,
  togglePopover,
  closePopover,
  isOpenPopover,
  wallets,
  className,
  selectWallet,
  selectedWallet,
  placement,
  isVisibleBalance,
  isVisibleAllWallets,
  stateManagmentAllWallets,
}: SelectWalletBaseProps) => {
  const [walletsBalances, rate] = useUnit([$walletsBalances, $rate]);
  const checkIsAllWallet = useUnit(stateManagmentAllWallets?.$store ?? $isChecked);

  return (
    <Popover
      onClose={closePopover}
      isOpen={isOpenPopover}
      placement={placement}
      className={{
        container: className?.container,
        children: clsx('bg-darkGray-3 w-[220px] -translate-x-[85px] rounded-lg p-2', className?.children),
      }}
      trigger={
        <button
          onMouseDown={togglePopover}
          type="button"
          className={clsx(
            'border-separator bg-darkGray-1 flex w-full max-w-[140px] cursor-pointer rounded-lg border-[0.5px] sm:max-w-none',
            className?.button,
          )}>
          <div className="border-r-separator flex flex-1 items-center gap-2 border-r-[0.5px] px-1.5 py-2 sm:px-3">
            <Icon name="wallet" className="text-primary" size={18} />
            <Typography className={clsx('w-18 items-end gap-[4px] truncate', className?.text)} size="subheadline2">
              {checkIsAllWallet ? (
                'All wallets'
              ) : (
                <>
                  {selectedWallet?.name}
                  {isVisibleBalance && (
                    <Typography
                      icon={{
                        name: 'dot',
                        size: 5,
                        position: 'left',
                      }}
                      color="secondary"
                      className={className?.text}
                      size="captain1">
                      {formatter.number.round(walletsBalances.get(selectedWallet?.public_key ?? '') || 0)} sol
                    </Typography>
                  )}
                </>
              )}
            </Typography>
          </div>
          <div className="flex items-center justify-center px-1.5 py-[11px] sm:px-3">
            <Icon
              name="arrowLeft"
              className={clsx('text-secondary transform transition-transform duration-300 ease-in-out', {
                '-rotate-90': isOpenPopover,
                'rotate-90': !isOpenPopover,
              })}
              size={16}
            />
          </div>
        </button>
      }>
      <div className="flex w-full flex-col gap-2">
        {isVisibleAllWallets && (
          <div className={clsx('border-b-separator flex w-full border-b-[0.5px] pb-2', { hidden: !all })}>
            <Checkbox
              label={{ text: 'All Wallets' }}
              variant="square"
              $isChecked={stateManagmentAllWallets?.$store ?? $isChecked}
              toggled={stateManagmentAllWallets?.toggled ?? toggled}
            />
          </div>
        )}
        <div className="flex max-h-[300px] w-full flex-col overflow-auto">
          {wallets?.map((wallet) => (
            <div
              onClick={() => selectedWallet?.id !== wallet.id && selectWallet({ option: wallet })}
              key={wallet.id}
              className={clsx(
                'hover:bg-darkGray-2 flex w-full cursor-pointer items-center justify-between rounded-lg p-2 transition-all duration-300 ease-in-out',
                {
                  'bg-darkGray-2': !checkIsAllWallet && selectedWallet?.id === wallet.id,
                },
              )}>
              <div className="flex flex-col justify-start">
                <Typography size="captain1">{wallet.name}</Typography>
                <CopyAddress
                  className={{ text: '!text-[12px]' }}
                  copied={copied}
                  address={wallet.public_key}
                  start={3}
                  end={3}
                />
              </div>
              <div className="flex min-w-[35px] flex-col justify-start">
                <Typography size="captain1" className="!gap-1" icon={{ position: 'left', name: 'solana', size: 12 }}>
                  {formatter.number.round(walletsBalances.get(wallet.public_key) || 0)}
                </Typography>
                <Typography size="captain1" className="" color="secondary">
                  ${formatter.number.round((walletsBalances.get(wallet.public_key) || 0) * rate)}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Popover>
  );
};

export const SelectWalletFallback = () => {
  return (
    <button className="border-separator bg-darkGray-1 flex cursor-pointer rounded-lg border-[0.5px]">
      <div className="border-r-separator flex items-center gap-2 border-r-[0.5px] px-3 py-2">
        <Skeleton isLoading className="h-[18px] w-[18px]" />
        <Skeleton isLoading className="h-5 w-18" />
      </div>
      <div className="flex items-center justify-center px-3 py-[11px]">
        <Skeleton isLoading className="h-4 w-4" />
      </div>
    </button>
  );
};
