import { ContentMarket } from 'widgets/markets/ui/content/index.tsx';
import { LoadedData } from 'shared/ui/loaded-data';
import { onLoadedFirst } from 'widgets/markets/model';
import { NewPairsFilter } from 'widgets/new-pairs-filter/ui/index.tsx';

export const NewPairsMarket = () => {
  return (
    <div className="relative mx-auto mt-2 flex w-full max-w-[1920px] flex-col gap-2 sm:mt-4 md:gap-4">
      {/* Always render LoadedData for refresh functionality */}
      <LoadedData className="absolute inset-0 h-full w-full" loadedData={onLoadedFirst} />

      <ContentMarket />
    </div>
  );
};
