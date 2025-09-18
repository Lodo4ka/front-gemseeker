import { HeadPause } from 'shared/ui/head-pause';
import { Filters } from 'widgets/markets/ui/filters';
import { ToggleAnimations } from 'features/toggle-animations';
import { ToggleNSFW } from 'features/toggle-nsfw';
import { ToggleView } from 'features/toggle-view';
import { QuickBuyInput } from 'features/quick-buy';
import { ContentMarket } from 'widgets/markets/ui/content';
import { TokenMarket } from 'entities/token';
import { LoadedData } from 'shared/ui/loaded-data';
import { onLoadedFirst } from 'widgets/markets/model';
import { Tabs } from 'shared/ui/tabs';
import { useUnit } from 'effector-react';
import { $publicKey } from 'entities/wallet';

export const TrendingPage = () => {
  const publicKey = useUnit($publicKey);

  return (
    <div className="relative mx-auto mt-2 flex w-full max-w-[1920px] flex-col gap-2 sm:mt-4 md:gap-4">
      <LoadedData className="absolute inset-0 h-full w-full" loadedData={onLoadedFirst} />

      <div className="flex w-full items-center justify-between">
        <HeadPause title="Trending" pauseVariant="trending" iconName="trending" />
        {/* Быстрый ввод покупки справа как в макете */}
        <div className="flex items-center gap-[10px] max-lg:w-auto">
          <QuickBuyInput />
        </div>
      </div>

      {/* Фильтры и табы периодов */}
      <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-3">
          <Filters />
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

        <div className="flex items-center gap-[10px] max-lg:w-full max-sm:flex-col-reverse">
          {/* В Trending не показываем SelectWallet согласно макету, оставим только QuickBuy */}
          <div className="flex flex-row flex-wrap items-center gap-[5px] max-lg:w-full sm:gap-[10px]">
            {publicKey && null}
            <QuickBuyInput />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <ToggleAnimations />
        <ToggleNSFW />
        <ToggleView />
      </div>

      {/* Контент списка/таблицы переиспользуем общий компонент рынков */}
      <ContentMarket TokenMarket={TokenMarket} />
    </div>
  );
};
