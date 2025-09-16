import { useUnit } from 'effector-react';
import { defaultMQ } from 'shared/lib/use-media';
import { Tabs } from 'shared/ui/tabs';
import { Chart } from 'entities/token/chart';
import { $isStreamMobileVisible } from 'entities/token';
import { MenuInfo } from '../components/menu-info';
import { StreamBlock } from 'widgets/stream';
import { $address } from 'entities/token';
import { StreamPanel } from 'features/stream/create';
import { SwapForm } from 'features/token';
import { Threads } from 'widgets/threads';
import { MenuAnalytics } from '../components/menu-analytics';

export const MenuMobile = () => {
  const [lg2, isStreamMobileVisible] = useUnit([defaultMQ.lg2.$matches, $isStreamMobileVisible]);

  return (
    <Tabs
      defaultActiveTab={1}
      className={{
        wrapper: '2lg:hidden h-auto w-full flex-col-reverse items-start border-none',
        content: 'pb-[40px]',
        controllers: {
          controller: {
            default:
              'hover:text-primary flex-col !gap-[6px] border-none !px-4 !pt-2 !pb-0 !text-[12px] hover:bg-transparent',
            active: '!bg-transparent',
          },
          wrapper:
            'border-t-separator bg-bg fixed bottom-0 left-0 z-10 w-full justify-between overflow-visible rounded-none border-t-[0.5px] border-r-0 border-b-0 border-l-0 px-4 pt-2 pb-3',
        },
      }}
      controllers={[
        {
          children: 'Stream',
          icon: {
            name: 'camera',
            size: 20,
            position: 'left',
          },
          disabled: !isStreamMobileVisible,
          name: 'stream'
        },
        {
          children: 'Trades',
          icon: {
            name: 'trade',
            size: 20,
            position: 'left',
          },
          name: 'trade'
        },
        {
          children: 'Chat',
          icon: {
            name: 'chat',
            size: 20,
            position: 'left',
          },
          name: 'chat'
        },
        {
          children: 'Analytics',
          icon: {
            name: 'analytics',
            size: 20,
            position: 'left',
          },
          name: 'analytics'
        },
        {
          children: 'Info',
          icon: {
            name: 'info',
            size: 20,
            position: 'left',
          },
          name: 'info'
        },
      ]}
      queryParamName='info_mobile'
      contents={[
        <div className="flex-col">
          {lg2 && <StreamBlock />}
          <StreamPanel $address={$address} />
        </div>,
        <div className="flex w-full flex-col gap-3">
          <Chart />
          <SwapForm />
        </div>,
        <Threads />,
        <MenuAnalytics />,
        <MenuInfo />,
      ]}
    />
  );
};
