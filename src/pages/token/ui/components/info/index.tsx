import { useUnit } from 'effector-react';

import { Bubblemap, FiltresLimitOrders } from 'entities/token';
import { Trades } from '../../trades';
import { Skeleton } from 'shared/ui/skeleton';
import { TableFallback } from 'shared/ui/table';
import { Tabs } from 'shared/ui/tabs';
import { Threads } from 'widgets/threads';
import { Holders } from '../../holders';
import { $holdersCount } from '../../../model/holders';
import { LimitOrders } from 'widgets/limit-orders';

export const TokenInfo = () => {
  const [holdersCount] = useUnit([$holdersCount]);

  return (
    <Tabs
      className={{
        controllers: {
          wrapper: 'overflow-x-scroll',
        },
        // content: 'max-h-[500px]',
      }}
      controllers={[
        {
          children: 'Trades',
          icon: {
            name: 'trades',
            size: 16,
            position: 'left',
          },
          name: 'trades',
        },
        {
          children: 'Thread',
          icon: {
            name: 'thread',
            size: 16,
            position: 'left',
          },
          className: {
            button: 'max-2lg:!hidden',
          },
          name: 'thread',
        },
        {
          children: `Holders${holdersCount ? `(${holdersCount})` : ''}`,
          icon: {
            name: 'holders',
            size: 16,
            position: 'left',
          },
          name: 'holders',
        },
        {
          children: 'Bubblemaps',
          icon: {
            name: 'bubblemaps',
            size: 16,
            position: 'left',
          },
          name: 'bubblemaps',
        },
        {
          children: 'Orders',
          icon: {
            name: 'orders',
            size: 16,
            position: 'left',
          },
          name: 'orders',
        },
      ]}
      queryParamName="info"
      rightAction={{
        content: <FiltresLimitOrders />,
        tabActive: 4,
      }}
      contents={[<Trades />, <Threads />, <Holders />, <Bubblemap />, <LimitOrders />]}
    />
  );
};

export const TokenInfoFallback = () => {
  return (
    <div className="flex w-full flex-col gap-3 overflow-auto">
      <div className="border-separator flex w-fit overflow-x-scroll rounded-lg border-[0.5px] whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[1, 2, 3, 4, 5].map((key) => (
          <div
            key={key}
            className="border-r-separator flex items-center gap-2 border-r-[0.5px] px-3 py-2 last:border-r-0">
            <Skeleton isLoading className="h-5 w-16" />
          </div>
        ))}
      </div>
      <TableFallback columnsCount={6} rowsCount={10} />
    </div>
  );
};
