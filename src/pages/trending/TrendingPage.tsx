import { HeadPause } from 'shared/ui/head-pause';
import { $isAnimationsEnabled } from 'features/toggle-animations';
import { Token } from 'entities/token';
import { LoadedData } from 'shared/ui/loaded-data';
import { $list, $tokens, onLoadedFirst } from 'widgets/markets/model';
import { Tabs } from 'shared/ui/tabs';
import { useUnit } from 'effector-react';
import { $isEndReached, dataRanedOut } from 'widgets/markets/model';
import { animations } from 'shared/config/animations';
import { HashTable, TableFallback } from 'shared/ui/table';
import { Variants } from 'framer-motion';
import { $rate } from 'features/exchange-rate';
import { useColumns } from 'widgets/markets/ui/table';
import { FiltersButton } from 'features/filter-btn/ui';
import { TrendingBar } from 'features/trending-bar/ui';
import { InputQuickBuy } from 'features/input-quick-buy';

export const TrendingPage = () => {
  const columns = useColumns();
  const [list, tokens, rate, isAnimationEnabled] = useUnit([$list, $tokens, $rate, $isAnimationsEnabled]);
  const isLoading = list === null;

  return (
    <div className="relative mx-auto !-mt-[16px] flex w-full max-w-[1920px] flex-col gap-2 sm:mt-4 md:gap-4">
      <LoadedData className="absolute inset-0 -z-1 h-full w-full" loadedData={onLoadedFirst} />
      <TrendingBar />
      <div className="flex w-full items-center justify-between">
        <HeadPause title="Trending" pauseVariant="trending" iconName="trending" color="primary" />
      </div>
      <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-3">
          <FiltersButton />
          <Tabs
            className={{
              wrapper: 'border-separator h-9 rounded-lg border-[0.5px]',
              controllers: {
                wrapper: 'gap-0',
                controller: {
                  default:
                    '!border-r-separator hover:!bg-darkGray-1 !h-9 !rounded-none border-r-[0.5px] !px-3 !py-2 !text-[12px]',
                  active: '!bg-darkGray-1',
                },
              },
            }}
            controllers={[
              { children: '1m', name: '1m' },
              { children: '5m', name: '5m' },
              { children: '15m', name: '15m' },
              { children: '1h', name: '1h' },
              { children: '24h', name: '24h' },
            ]}
            queryParamName="trending_period"
            contents={[<div />, <div />, <div />, <div />, <div />]}
          />
        </div>
        <InputQuickBuy className="ml-auto" />
      </div>
      {isLoading ? (
        <>
          <LoadedData isOnce loadedData={onLoadedFirst} />
          <TableFallback rowsCount={30} columnsCount={columns.length} />
        </>
      ) : (
        <HashTable<Token>
          isAnimationsEnabled={isAnimationEnabled}
          isHoverable
          className={{
            row: 'hover:!bg-darkGray-3 cursor-pointer',
          }}
          keys={list as string[]}
          data={tokens}
          animation={{
            first: animations.table.flashAndShake as unknown as Variants,
          }}
          columns={columns}
          reachedEndOfList={dataRanedOut}
          $isDataRanedOut={$isEndReached}
          rowsCount={30}
          additionalInfo={{
            rateUsd: rate,
          }}
        />
      )}
    </div>
  );
};
