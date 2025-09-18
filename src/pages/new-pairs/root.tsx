import { Tabs } from 'shared/ui/tabs';
import { InputQuickBuy } from 'features/input-quick-buy';
import { Platform, platformVariant } from 'pages/new-pairs/ui/platform';
import { useState } from 'react';
import { NewPairsMarket } from 'widgets/new-pairs/ui/index.tsx';
import { HeadPause } from 'shared/ui/head-pause';
import { NewPairsNewPair } from './NewPairsNewPair';
import { NewPairsFilter } from 'widgets/new-pairs-filter/ui';

const tabs = [
  {
    name: 'Dashboard',
    symbol: 'dashboard',
  },
  {
    name: 'New Pair',
    symbol: 'new_pair',
  },
];

export const NewPairsRoot = () => {
  const [activeTab, setActiveTab] = useState<platformVariant>('dashboard');
  return (
    <div className="flex w-full flex-col">
      <HeadPause className="mb-[16px]" title="New Pairs" pauseVariant="market" iconName="newPairs" />
      <Platform className="mb-[16px]" activePlatform={activeTab} changePlatform={setActiveTab} />
      <div className="relative z-2 flex w-full flex-col gap-4">
        <div className="mb-[20px] flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <NewPairsFilter />
        </div>
      </div>
      {activeTab === 'dashboard' && <NewPairsMarket />}
      {activeTab === 'new_pair' && <NewPairsNewPair />}
    </div>
  );
};
