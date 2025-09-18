import { TableFallback } from 'shared/ui/table';
import { TokenMarketFallback } from 'entities/token/ui/components/token-market-fallback';

export interface MarketsFallbackProps {
  isViewTable: boolean;
}

export const MarketsFallback = ({ isViewTable }: MarketsFallbackProps) => {
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
