import { HashTable, TableFallback } from 'shared/ui/table';
import { $list, $tokens, $isEndReached, dataRanedOut, onLoadedFirst } from 'widgets/markets/model';
import { $rate } from 'features/exchange-rate';
import { routes } from 'shared/config/router';
import { $isAnimationsEnabled } from 'features/toggle-animations';
import { animations } from 'shared/config/animations';
import type { Variants } from 'framer-motion';
import { Token } from 'entities/token';
import { LoadedData } from 'shared/ui/loaded-data';
import { useUnit } from 'effector-react';
import { useColumns } from 'widgets/markets/ui/table';

// Use full markets table columns

export const MemescopeCompeting = () => {
  const [list, tokens, rate, isAnimationEnabled] = useUnit([$list, $tokens, $rate, $isAnimationsEnabled]);
  const columns = useColumns();
  const navigate = useUnit(routes.token.open);
  const isLoading = list === null;

  if (isLoading)
    return (
      <>
        <LoadedData isOnce loadedData={onLoadedFirst} />
        <TableFallback rowsCount={30} columnsCount={columns.length} />
      </>
    );

  return (
    <HashTable<Token>
      isAnimationsEnabled={isAnimationEnabled}
      isHoverable
      onRowClick={(_, { address }) => navigate({ address })}
      className={{
        row: 'hover:!bg-darkGray-3 cursor-pointer',
      }}
      keys={list as string[]}
      data={tokens}
      animation={{
        first: animations.table.flashAndShake as unknown as Variants,
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
};
