import { Typography } from 'shared/ui/typography';
import { SelectWalletUnique } from 'entities/wallet';
import { Input } from 'shared/ui/input';
import { Button } from 'shared/ui/button';
import {
  $fromWallet,
  $isOpenFromWalletPopover,
  $isOpenToWalletPopover,
  selectedFromWallet,
  selectedToWallet,
  toggledToWalletPopover,
  toggledFromWalletPopover,
  $toWallet,
  withdrawed,
  $amount,
  changedAmount,
  closedFromWalletPopover,
  closedToWalletPopover,
} from '../../../model/withdraw';
import { useUnit } from 'effector-react';
import { api } from 'shared/api';

export const Transfer = () => {
  const withdraw = useUnit(withdrawed);
  const [amount, changeAmount] = useUnit([$amount, changedAmount]);
  const pending = useUnit(api.mutations.wallets.withdraw.$pending);

  return (
    <div className="bg-darkGray-1 flex w-full flex-col gap-4 rounded-xl p-4">
      <Typography size="subheadline1" weight="regular">
        Transfer funds between the Gemseeker trading wallets.
      </Typography>
      <div className="flex w-full items-end gap-4 max-lg:flex-col max-lg:items-start">
        <div className="flex flex-col gap-3">
          <Typography size="subheadline2" weight="regular" color="secondary">
            Transfer from
          </Typography>
          <SelectWalletUnique
            closedPopover={closedFromWalletPopover}
            selected={selectedFromWallet}
            $isOpenPopover={$isOpenFromWalletPopover}
            toggledPopover={toggledFromWalletPopover}
            className={{ container: 'min-w-[220px]', text: 'w-full', button: 'w-full max-w-none' }}
            $value={$fromWallet}
            isVisibleBalance
          />
        </div>
        <Input
          label="Amount"
          value={amount}
          onValue={changeAmount}
          classNames={{ flex: '!bg-darkGray-3', container: '!gap-3 w-full', label: '!text-secondary' }}
          placeholder="Enter the amount"
        />
        <Button
          theme="outline"
          className={{ button: '!h-9 !min-w-9 !rounded-full !p-0 max-lg:hidden', icon: 'text-secondary' }}
          icon={{ position: 'center', size: 16, name: 'arrow_to' }}
        />
        <div className="flex flex-col gap-3">
          <Typography size="subheadline2" weight="regular" color="secondary">
            Transfer to
          </Typography>
          <SelectWalletUnique
            closedPopover={closedToWalletPopover}
            selected={selectedToWallet}
            $isOpenPopover={$isOpenToWalletPopover}
            toggledPopover={toggledToWalletPopover}
            className={{ container: 'min-w-[220px]', text: 'w-full', button: 'w-full max-w-none' }}
            $value={$toWallet}
            isVisibleBalance
          />{' '}
        </div>
        <Input
          label="Priority Fee (min)"
          classNames={{ flex: '!bg-darkGray-3', container: '!gap-3 w-full', label: '!text-secondary' }}
          placeholder="0.0001"
        />
        <Button disabled={pending} onClick={withdraw}>
          {pending ? 'Transferring...' : 'Transfer'}
        </Button>
      </div>
    </div>
  );
};
