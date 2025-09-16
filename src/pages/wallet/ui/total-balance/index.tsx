import { useUnit } from 'effector-react';
import { $totalBalance } from 'entities/wallet';
import { GenerateWallet, GenerateWalletFallback } from 'features/generate-wallet';
import { Skeleton } from 'shared/ui/skeleton';
import { Typography } from 'shared/ui/typography';
import { formatter } from 'shared/lib/formatter';
import { $rate } from 'features/exchange-rate';
export const TotalBalance = () => {
  const [totalBalance, rate] = useUnit([$totalBalance, $rate]);

  return (
    <div className="bg-darkGray-1 flex w-full items-center justify-between rounded-xl p-4">
      <div className="flex flex-col gap-1">
        <Typography color="secondary" weight="regular" size="subheadline2">
          Total Balance
        </Typography>
        <div className="flex items-end gap-1">
          <Typography icon={{ position: 'left', name: 'solana' }} className="items-center !gap-2" size="headline3">
            {formatter.number.round(totalBalance)}
          </Typography>
          <Typography color="secondary" size="captain1" weight="regular">
            / {formatter.number.round(totalBalance * rate)}$
          </Typography>
        </div>
      </div>
      <GenerateWallet />
    </div>
  );
};

export const TotalBalanceFallback = () => {
  return (
    <div className="bg-darkGray-1 flex w-full items-center justify-between rounded-xl p-4">
      <div className="flex flex-col gap-1">
        <Skeleton isLoading className="h-[20px] w-[130px] rounded-sm" />
        <div className="flex items-center gap-1">
          <div className="flex items-center !gap-2">
            <Skeleton isLoading className="h-4 w-4 rounded-sm" />
            <Skeleton isLoading className="h-[22px] w-[50px] rounded-sm" />
          </div>
          <Skeleton isLoading className="h-[16px] w-[50px] rounded-sm" />
        </div>
      </div>
      <GenerateWalletFallback />
    </div>
  );
};
