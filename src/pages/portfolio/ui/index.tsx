import { Skeleton } from 'shared/ui/skeleton';
import { Tabs } from 'shared/ui/tabs';
import { Typography } from 'shared/ui/typography';
import { MostProfitableTrades } from './most-profitable-trades';
import { ActivePositions } from './active-positions';
import { TradesHistory } from './trade-history';
import { useUnit } from 'effector-react';
import { $activeTab, tabChanged } from '../model';
import { Pnl } from './pnl';
import { SelectWallet } from './select-wallet';
import { Checkbox } from 'shared/ui/checkbox';
import { $isChecked, toggled } from '../model/checkbox';

export const UserTabs = () => {
  const [activeTab, onTabChange] = useUnit([$activeTab, tabChanged]);
  return (
    <Tabs
      activeTab={activeTab}
      onTabChange={onTabChange}
      controllers={[
        {
          children: 'Most Profitable',
          icon: { position: 'left', name: 'most_profitable', size: 20 },
          name: 'most_profitable',
        },
        {
          children: 'Active Positions',
          icon: { position: 'left', name: 'portfolio', size: 20 },
          name: 'active_positions',
        },
        {
          children: 'Trade History',
          icon: { position: 'left', name: 'history', size: 20 },
          name: 'trade',
        },
      ]}
      queryParamName="table"
      contents={[<MostProfitableTrades />, <ActivePositions />, <TradesHistory />]}
    />
  );
};

export const PortfolioPage = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full gap-3">
          <Typography size="headline4" icon={{ position: 'left', name: 'portfolio', size: 20 }} className="!gap-2">
            Portfolio
          </Typography>
          <SelectWallet />
        </div>
        <Checkbox
          checkedIcon={{ name: 'usdt', className: 'text-darkGray-3' }}
          uncheckedIcon={{ name: 'solana', className: 'text-darkGray-3' }}
          variant="switch"
          $isChecked={$isChecked}
          toggled={toggled}
        />
      </div>
      <Pnl />

      <UserTabs />
    </div>
  );
};

export const PortfolioPageFallback = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <Skeleton isLoading className="h-5 w-5 rounded-lg" />
        <Skeleton isLoading className="h-5 w-[66px] rounded-lg" />
      </div>
      <Pnl fallback />
      <div className="flex w-full flex-col gap-5">
        <div className="border-separator flex w-[446px] overflow-x-scroll rounded-lg border-[0.5px] whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[1, 2, 3, 4, 5, 6, 7].map((key) => (
            <div
              key={key}
              className="border-r-separator flex items-center gap-2 border-r-[0.5px] px-3 py-2 last:border-r-0">
              <Skeleton isLoading className="h-5 w-16" />
            </div>
          ))}
        </div>
        <MostProfitableTrades />
      </div>
    </div>
  );
};
