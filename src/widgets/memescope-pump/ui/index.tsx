import { Column } from './column';
import { useUnit } from 'effector-react';
import { Tabs } from 'shared/ui/tabs';
import { desktop } from '../model';
import { LoadedData } from 'shared/ui/loaded-data';
import { onLoadedFirst } from 'widgets/markets/model';

export const MemescopePump = () => {
  const [isDesktop] = useUnit([desktop.$matches]);

  return (
    <div className="flex w-full gap-[10px]">
      <LoadedData className="absolute inset-0 -z-1 h-full w-full" loadedData={onLoadedFirst} />
      {isDesktop && [1, 2, 3].map((idx) => <Column key={idx} idx={idx} />)}

      {!isDesktop && (
        <Tabs
          className={{
            wrapper: 'h-full w-full flex-col-reverse justify-between border-none',
            content: 'pb-[40px]',
            controllers: {
              controller: {
                default:
                  'hover:text-primary flex-col !gap-[6px] border-none !px-4 !pt-2 !pb-0 !text-[12px] hover:bg-transparent',
                active: '!bg-transparent',
              },
              wrapper:
                'border-t-separator bg-bg fixed bottom-0 left-0 z-60 w-full justify-between overflow-visible rounded-none border-t-[0.5px] border-r-0 border-b-0 border-l-0 px-4 pt-2',
            },
          }}
          controllers={[
            {
              children: 'New Creations',
              icon: { name: 'folder', position: 'left', size: 18 },
              name: 'new_creations',
            },
            {
              children: 'Completing',
              icon: { name: 'hourglass', position: 'left', size: 15 },
              name: 'completing',
            },
            {
              children: 'Completed',
              icon: { name: 'flag', position: 'left', size: 15 },
              name: 'completed',
            },
          ]}
          queryParamName="variant_mobile"
          contents={[<Column idx={1} />, <Column idx={2} />, <Column idx={3} />]}
        />
      )}
    </div>
  );
};
