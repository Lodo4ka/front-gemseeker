import { HashTable, TableFallback } from 'shared/ui/table';
import { useUnit } from 'effector-react';
import { useColumns } from 'widgets/markets/ui/table';
import { $list, $tokens, $isEndReached, dataRanedOut, onLoadedFirst } from 'widgets/markets/model';
import { $rate } from 'features/exchange-rate';
import { $isAnimationsEnabled } from 'features/toggle-animations';
import { animations } from 'shared/config/animations';
import type { Variants } from 'framer-motion';
import { Token } from 'entities/token';
import { LoadedData } from 'shared/ui/loaded-data';

export const MemescopeCompleted = () => {
  const columns = useColumns();
  const [list, tokens, rate, isAnimationEnabled] = useUnit([$list, $tokens, $rate, $isAnimationsEnabled]);
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
