import { useUnit } from 'effector-react';
import { onFirstLoaded } from '../../model/volume';
import { LoadedData } from 'shared/ui/loaded-data';
import { Skeleton } from 'shared/ui/skeleton';
import { Tabs } from 'shared/ui/tabs';
import { VolumeController } from './controller';
import { $token } from 'entities/token';
import { VolumeContent } from './content';

export const Volume = () => {
  const token = useUnit($token);
  // const [activeTab, changeActiveTab] = useUnit([$activeTab, changedActiveTab]);

  return (
    <div className='relative'>
      <LoadedData loadedData={onFirstLoaded} />
      <Tabs
        // activeTab={activeTab}
        // onTabChange={changeActiveTab}
        className={{
          controllers: {
            wrapper: 'w-full !gap-[10px] !rounded-none !border-none',
            controller: {
              default:
                'hover:bg-darkGray-2 flex w-full flex-col items-center justify-center !gap-1 !rounded-lg !border-none px-3 py-2',
              active: 'hover:!bg-darkGray-2 !bg-darkGray-2 !border-none',
            },
          },
        }}
        controllers={[
          {
            theme: 'outline',
            children: <VolumeController label="5m" value={token?.mcap_diff_5m ?? 0} />,
            name: '5m'
          },
          {
            theme: 'outline',
            children: <VolumeController label="1h" value={token?.mcap_diff_1h ?? 0} />,
            name: '1h'
          },
          {
            theme: 'outline',
            children: <VolumeController label="6h" value={token?.mcap_diff_6h ?? 0} />,
            name: '6h'
          },
          {
            theme: 'outline',
            children: <VolumeController label="24h" value={token?.mcap_diff_24h ?? 0} />,
            name: '24h'
          },
        ]}
        queryParamName='variant_volume'
        contents={[
          <VolumeContent index={0} />,
          <VolumeContent index={1} />,
          <VolumeContent index={2} />,
          <VolumeContent index={3} />,
        ]}
      />
    </div>
  );
};

export const VolumeFallback = () => {
  return (
    <div className="flex w-full flex-col gap-[10px]">
      <LoadedData loadedData={onFirstLoaded} />
      <div className="flex w-full gap-[10px]">
        <div className="hover:bg-darkGray-2 bg-darkGray-1 flex w-full flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-all duration-300 ease-in-out">
          <Skeleton className="h-5 w-7 rounded-sm" isLoading />
          <Skeleton className="h-5 w-12 rounded-sm" isLoading />
        </div>
        <div className="hover:bg-darkGray-2 bg-darkGray-1 flex w-full flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-all duration-300 ease-in-out">
          <Skeleton className="h-5 w-7 rounded-sm" isLoading />
          <Skeleton className="h-5 w-12 rounded-sm" isLoading />
        </div>
        <div className="hover:bg-darkGray-2 bg-darkGray-1 flex w-full flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-all duration-300 ease-in-out">
          <Skeleton className="h-5 w-7 rounded-sm" isLoading />
          <Skeleton className="h-5 w-12 rounded-sm" isLoading />
        </div>
        <div className="hover:bg-darkGray-2 bg-darkGray-1 flex w-full flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-all duration-300 ease-in-out">
          <Skeleton className="h-5 w-7 rounded-sm" isLoading />
          <Skeleton className="h-5 w-12 rounded-sm" isLoading />
        </div>
      </div>
      <VolumeContent isFallback />
    </div>
  );
};
