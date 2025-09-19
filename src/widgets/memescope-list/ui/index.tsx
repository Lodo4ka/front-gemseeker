import { useUnit } from 'effector-react';
import { desktop } from 'widgets/memescope-pump/model';
import { TokenMarket, TokenMarketFallback } from 'entities/token/ui/market';
import { ListWithPagination } from 'shared/ui/list-with-pagination';
import { $rate } from 'features/exchange-rate';
import { $list, $tokens, onLoadedFirst } from 'widgets/markets/model';
import { $isChecked } from 'features/toggle-view';
import { $isEndReached } from 'widgets/markets/model';
import { dataRanedOut } from 'widgets/markets/model';

export const MemescopeList = () => {
  const [isDesktop] = useUnit([desktop.$matches]);
  const [list, rate, isViewTable] = useUnit([$list, $rate, $isChecked]);
  const tokens = useUnit($tokens);

  return (
    <ListWithPagination
      layout="grid"
      list={list}
      className={{
        list: 'xs:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] grid w-full grid-cols-[repeat(auto-fill,minmax(100%,1fr))] gap-x-[10px]',
      }}
      onLoaded={onLoadedFirst}
      $isDataRanedOut={$isEndReached}
      reachedEndOfList={dataRanedOut}
      skeleton={{ Element: <TokenMarketFallback />, count: 30 }}
      uniqueKey={(address) => address}
      renderItem={(id) => {
        const token = tokens[id];
        if (!token) return null;
        return <TokenMarket token={token} />;
      }}
    />
  );
};
