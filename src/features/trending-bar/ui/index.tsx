import { Typography } from 'shared/ui/typography';

export const TrendingBar = () => {
  return (
    <div className="border-separator mr-[-20px] ml-[-20px] flex h-[44px] w-[calc(100%+40px)] items-center gap-1 border-b px-[20px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Typography color="secondary" icon={{ name: 'star_secondary', size: 17, position: 'left' }}>
        Watching
      </Typography>

      <div className="ml-[16px] flex h-full w-full items-center overflow-auto">
        {[
          { symbol: 'Exe', price: '$00.000' },
          { symbol: 'Exe', price: '$00.000' },
        ].map(({ symbol, price }, idx, arr) => (
          <div key={`${symbol}-${idx}`} className={idx !== 0 ? 'ml-[16px]' : ''}>
            <div className="flex items-center gap-[16px]">
              <div className="flex items-center gap-[8px]">
                <Typography>{symbol}</Typography>
                <Typography color="secondary">{price}</Typography>
              </div>
              {idx !== arr.length - 1 && <div className="bg-separatorп h-[17px] w-[1px]" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
