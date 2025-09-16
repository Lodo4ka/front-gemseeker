import { Icon } from 'shared/ui/icon';
import { Button } from 'shared/ui/button';
import { $sortingFilter, changedSortingFilter } from '../../model';
import { markets } from '../../config';
import { useUnit } from 'effector-react';
import clsx from 'clsx';

export const Filters = () => {
  const activeFilter = useUnit($sortingFilter);
  const changeSortingFilter = useUnit(changedSortingFilter);

  return (
    <div className="border-separator flex overflow-x-scroll rounded-lg border-[0.5px] whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {markets.map(({ name, icon, symbol }) => (
        <Button
          key={symbol}
          onClick={() => symbol !== activeFilter ? changeSortingFilter(symbol) : undefined}
          theme="tertiary"
          className={{
            button: clsx(
              '!border-r-separator hover:bg-darkGray-1 !flex !gap-2 !rounded-none !border-r-[0.5px] !px-3 !py-2 transition-all duration-300 ease-in-out last:!border-r-0',
              { '!bg-darkGray-1': symbol === activeFilter },
            ),
          }}>
          {icon && <Icon name={icon} className="text-green" size={4} />}
          {name}
        </Button>
      ))}
    </div>
  );
};
