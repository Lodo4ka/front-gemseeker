import { useUnit } from 'effector-react';
import { DepositHistory, WithdrawHistory } from './history';
import { Skeleton } from 'shared/ui/skeleton';
import { Tabs } from 'shared/ui/tabs';
import { Typography } from 'shared/ui/typography';
import { TotalBalance, TotalBalanceFallback } from './total-balance';
import { AllWallets } from './all-wallets';
import { ArchivedWallets } from './archived-wallets';
import { TableFallback } from 'shared/ui/table';
import { Deposit } from './deposit';
import { $activeTab, changedActiveTab } from '../model';
import { Withdraw, Transfer } from './withdraw';

export const WalletPage = () => {
  const [activeTab, setActiveTab] = useUnit([$activeTab, changedActiveTab]);

  return (
    <div className="flex w-full flex-col gap-4">
      <Typography size="headline4" className="!gap-2" icon={{ name: 'wallet', size: 20, position: 'left' }}>
        Wallet Management
      </Typography>

      <Tabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        controllers={[
          {
            children: 'My Wallet',
            icon: { name: 'wallet', position: 'left' },
            name: 'my_wallet'
          },
          {
            children: 'Deposit',
            icon: { name: 'deposit', position: 'left' },
            name: 'deposit'
          },
          {
            children: 'Withdraw',
            icon: { name: 'withdraw', position: 'left' },
            name: 'withdraw'
          },
          {
            children: 'Transfer',
            icon: { name: 'withdraw', position: 'left' },
            name: 'transfer'
          },
          {
            children: 'Archived wallets',
            icon: { name: 'archive', position: 'left' },
            name: 'archive'
          },
        ]}
        queryParamName='variant'
        contents={[
          <div className="flex w-full flex-col gap-4">
            <TotalBalance />
            <AllWallets />
          </div>,
          <div className="flex w-full flex-col gap-6">
            <Deposit />
            <DepositHistory />
          </div>,
          <div className="flex w-full flex-col gap-6">
            <Withdraw />
            <WithdrawHistory />
          </div>,
          <div className="flex w-full flex-col gap-6">
            <Transfer />
            <WithdrawHistory />
          </div>,
          <ArchivedWallets />,
        ]}
      />
    </div>
  );
};

export const WalletPageFallback = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <Skeleton isLoading className="h-5 w-[180px]" />
      <div className="flex items-center gap-[10px]">
        <Skeleton isLoading className="h-9 w-[90px] rounded-lg" />
        <Skeleton isLoading className="h-9 w-[100px] rounded-lg" />
        <Skeleton isLoading className="h-9 w-[113px] rounded-lg" />
        <Skeleton isLoading className="h-9 w-[159px] rounded-lg" />
      </div>
      <TotalBalanceFallback />
      <TableFallback rowsCount={5} />
    </div>
  );
};
