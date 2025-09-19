import { useUnit } from 'effector-react';
import { memo } from 'react';
import { $rate } from 'features/exchange-rate';
import { HashTable } from 'shared/ui/table';
import { routes } from 'shared/config/router';
import { $list, dataRanedOut, $isEndReached, $tokens } from '../../model';
import { useColumns } from '../table';
import { ListWithPagination } from 'shared/ui/list-with-pagination';
import { $isChecked } from 'features/toggle-view';
import { Token, TokenMarketFallback } from 'entities/token';
import { animations } from 'shared/config/animations';
import { $isAnimationsEnabled } from 'features/toggle-animations';
import type { Variants } from 'framer-motion';
import { MarketsFallback } from './MarketsFallback';
import clsx from 'clsx';

export const ContentMarket = memo(
  ({ TokenMarket, className }: { TokenMarket: React.ElementType; className?: string }) => {
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
            first: animations.table.flashAndShake as unknown as Variants,
          }}
          columns={useColumns()}
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
          list: clsx(
            'xs:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] grid w-full grid-cols-[repeat(auto-fill,minmax(100%,1fr))] gap-[10px]',
            className,
          ),
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
  },
);
