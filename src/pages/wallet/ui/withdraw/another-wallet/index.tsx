import { Typography } from 'shared/ui/typography';
import { SelectWalletUnique } from 'entities/wallet';
import { Input } from 'shared/ui/input';
import { Button } from 'shared/ui/button';
import {
  $fromWallet,
  $isOpenFromWalletPopover,
  selectedFromWallet,
  toggledFromWalletPopover,
  withdrawedToExternalWallet,
  $amount,
  changedAmount,
  changedToWalletWithdraw,
  $toWalletWithdraw,
  closedFromWalletPopover,
  changedMaxBalance,
} from '../../../model/withdraw';
import { useUnit } from 'effector-react';
import { api } from 'shared/api';

export const Withdraw = () => {
  const withdraw = useUnit(withdrawedToExternalWallet);
  const [amount, changeAmount] = useUnit([$amount, changedAmount]);
  const [toWallet, changeToWallet] = useUnit([$toWalletWithdraw, changedToWalletWithdraw]);
  const changeMaxBalance = useUnit(changedMaxBalance);
  const pending = useUnit(api.mutations.wallets.withdraw.$pending);

  return (
    <div className="bg-darkGray-1 flex w-full flex-col gap-4 rounded-xl p-4">
      <Typography size="subheadline1" weight="regular">
        Withdraw funds from the Gemseeker trading wallet to the wallet of your choice.
      </Typography>
      <div className="flex w-full items-end gap-4 max-lg:flex-col max-lg:items-start">
        <div className="flex flex-col gap-3">
          <Typography size="subheadline2" weight="regular" color="secondary">
            Withdraw from
          </Typography>

          <SelectWalletUnique
            className={{
              container: 'w-[220px]',
              button: '!max-w-[280px]',
              text: '!w-full',
            }}
            closedPopover={closedFromWalletPopover}
            selected={selectedFromWallet}
            $isOpenPopover={$isOpenFromWalletPopover}
            toggledPopover={toggledFromWalletPopover}
            $value={$fromWallet}
            isVisibleBalance
          />
        </div>
        <div className="flex w-full items-end gap-[5px]">
          <Input
            label="Amount"
            value={amount}
            onValue={changeAmount}
            classNames={{ flex: '!bg-darkGray-3', container: '!gap-3 w-full', label: '!text-secondary' }}
            placeholder="Enter the amount"
          />

          <Button onClick={changeMaxBalance} theme="outline" className={{ button: '!h-[40.5px] !w-[60.5px]' }}>
            Max
          </Button>
        </div>
        <Button
          disabled
          theme="outline"
          className={{ button: '!h-9 !min-w-9 !rounded-full !p-0 max-lg:hidden', icon: 'text-secondary' }}
          icon={{ position: 'center', size: 16, name: 'arrow_to' }}
        />
        <Input
          value={toWallet}
          onValue={changeToWallet}
          label="Withdraw to"
          classNames={{ flex: '!bg-darkGray-3', container: '!gap-3 w-full', label: '!text-secondary' }}
          placeholder="Enter the wallet address"
        />
        <Button disabled={pending} onClick={withdraw}>
          {pending ? 'Withdrawing...' : 'Withdraw'}
        </Button>
      </div>
    </div>
  );
};
