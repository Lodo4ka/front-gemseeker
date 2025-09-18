import { ColumnTitle } from '../columns-title';
import { ContentMarket } from 'widgets/markets/ui/content/index.tsx';
import { MemescopeMarket } from 'entities/token/ui/memescope-market';
import { FiltersButton } from 'features/filter-btn/ui';

interface ColumnProps {
  idx: number;
}

export const Column = ({ idx }: ColumnProps) => {
  return (
    <div className="flex w-full flex-col gap-[12px]">
      <div className="flex w-full justify-between gap-[5px]">
        <ColumnTitle idx={idx} />
        <FiltersButton />
      </div>
      <div className="flex w-full flex-col rounded-xl">
        <ContentMarket TokenMarket={MemescopeMarket} />
      </div>
    </div>
  );
};
