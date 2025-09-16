import { Filters } from './filters';
import { QuickBuyInput } from 'features/quick-buy';
import { SelectWallet } from 'entities/wallet';
import { ToggleAnimations } from 'features/toggle-animations';
import { ToggleNSFW } from 'features/toggle-nsfw';
import { ToggleView } from 'features/toggle-view';
import { useUnit } from 'effector-react';
import { $publicKey } from 'entities/wallet';
import { onLoadedFirst } from '../model';
import { LoadedData } from 'shared/ui/loaded-data';
import { HeadPause } from 'shared/ui/head-pause';
import { ContentMarket } from './content';

export const Markets = () => {
  const publicKey = useUnit($publicKey);

  return (
    <div className="relative mx-auto mt-2 flex w-full max-w-[1920px] flex-col gap-2 sm:mt-4 md:gap-4">
      {/* Always render LoadedData for refresh functionality */}
      <LoadedData className="absolute inset-0 h-full w-full" loadedData={onLoadedFirst} />

      <HeadPause title="Markets" pauseVariant="market" iconName="memepad" />

      <div className="relative z-2 flex w-full flex-col gap-4">
        <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <Filters />
          <div className="flex items-center gap-[10px] max-lg:w-full max-sm:flex-col-reverse">
            <div className="flex flex-row flex-wrap items-center gap-[5px] max-lg:w-full sm:gap-[10px]">
              {publicKey && (
                <SelectWallet
                  className={{
                    container: 'max-lg:w-full',
                    button: 'max-lg:max-w-full',
                    text: 'w-auto',
                  }}
                  isVisibleBalance
                />
              )}
              <QuickBuyInput />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <ToggleAnimations />
          <ToggleNSFW />
          <ToggleView />
        </div>
      </div>

      <ContentMarket />
    </div>
  );
};
