import { useUnit } from 'effector-react';
import { memo } from 'react';
import { $rate } from 'features/exchange-rate';
import { HashTable, TableFallback } from 'shared/ui/table';
import { routes } from 'shared/config/router';

import { $list, dataRanedOut, $isEndReached, $tokens } from '../../model';
import { columns } from '../table';
import { ListWithPagination } from 'shared/ui/list-with-pagination';
import { $isChecked } from 'features/toggle-view';
import { Token, TokenMarket, TokenMarketFallback } from 'entities/token';
import { animations } from 'shared/config/animations';
import { $isAnimationsEnabled } from 'features/toggle-animations';

export const ContentMarket = memo(() => {
  const isAnimationEnabled = useUnit($isAnimationsEnabled);
  const tokens = useUnit($tokens);
  const [list, rate, isViewTable] = useUnit([$list, $rate, $isChecked]);
  const navigate = useUnit(routes.token.open);
  const isLoading = list === null;

  if (isLoading) return <MarketsFallback isViewTable={isViewTable} />;

  if (isViewTable)
    return (
      <HashTable<Token>
        isAnimationsEnabled={isAnimationEnabled}
        isHoverable
        onRowClick={(_, { address }) => navigate({ address })}
        className={{
          row: 'hover:!bg-darkGray-3 cursor-pointer',
        }}
        keys={list}
        data={tokens}
        animation={{
          first: animations.table.flashAndShake,
        }}
        columns={columns}
        reachedEndOfList={dataRanedOut}
        $isDataRanedOut={$isEndReached}
        rowsCount={30}
        additionalInfo={{
          rateUsd: rate,
        }}
      />
    );

  return (
    <ListWithPagination
      layout="grid"
      list={list}
      className={{
        list: 'xs:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] grid w-full grid-cols-[repeat(auto-fill,minmax(100%,1fr))] gap-[10px]',
      }}
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
});

interface MarketsFallbackProps {
  isViewTable: boolean;
}

const MarketsFallback = ({ isViewTable }: MarketsFallbackProps) => {
  if (isViewTable) {
    return <TableFallback rowsCount={30} columnsCount={9} />;
  }

  return (
    <div className="xs:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] grid w-full grid-cols-[repeat(auto-fill,minmax(100%,1fr))] gap-[10px]">
      {Array(14)
        .fill(null)
        .map((_, index) => (
          <TokenMarketFallback key={index} />
        ))}
    </div>
  );
};
