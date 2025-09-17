import { useUnit } from 'effector-react';

import { tabs } from '../config';
import { $platform } from '../model';
import { Typography } from 'shared/ui/typography';
import { Tabs } from 'shared/ui/tabs';
import { Platform } from './platform';
import { MemescopePump } from 'widgets/memescope-pump';
import { MemescopeNewCreation } from 'widgets/memescope-new-creation';
import { MemescopeSoaring } from 'widgets/memescope-soaring';
import { MemescopeCompleted } from 'widgets/memescope-completed';
import { MemescopeCompeting } from 'widgets/memescope-competing';
import { InputQuickBuy } from 'features/input-quick-buy/index.tsx';
import { NewPairsMarket } from 'widgets/new-pairs/ui';

export const MemescopePage = () => {
  const [activePlatform] = useUnit([$platform]);

  return (
    <div className="flex w-full flex-col">
      <Typography size="headline4" color="secondary" icon={{ name: 'gemescope', position: 'left', size: 20 }}>
        Memescope
      </Typography>
      <Platform />
      <Tabs
        className={{
          wrapper: 'mt-[16px]',
        }}
        controllers={tabs.map((tab, idx) => ({
          children: idx === 0 ? activePlatform : tab.name,
          theme: 'tertiary',
        }))}
        rightAction={{
          content: <InputQuickBuy />,
          tabActive: 0,
        }}
        contents={[
          <MemescopePump />,
          <MemescopeNewCreation />,
          <MemescopeCompeting />,
          <MemescopeSoaring />,
          <MemescopeCompleted />,
        ]}
      />
    </div>
  );
};

export const MemescopeFallback = () => {
  return <div className="flex w-full flex-col"></div>;
};
