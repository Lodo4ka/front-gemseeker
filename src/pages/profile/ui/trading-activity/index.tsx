import { useUnit } from 'effector-react';
import { $tradingActivity } from 'entities/user';
import { Heatmap } from 'shared/ui/heatmap';
import { Typography } from 'shared/ui/typography';
import { onLoadedFirst, dataRanedOut, $isEndReached } from '../../model/trading-activity';

export const TradingActivity = () => {
  const tradingActivity = useUnit($tradingActivity);

  return (
    <div className="bg-darkGray-3 max-2lg:bg-darkGray-1 flex flex-col gap-[30px] rounded-xl px-4 pt-4 pb-6">
      <Heatmap
        onLoaded={onLoadedFirst}
        $isDataRanedOut={$isEndReached}
        reachedEndOfList={dataRanedOut}
        values={tradingActivity}
      />

      <div className="flex w-full items-center justify-between max-sm:flex-col max-sm:gap-7">
        <Typography weight="regular" size="subheadline2" color="secondary">
          Track your consistency and PnL
        </Typography>
        <div className="flex items-center gap-3">
          <Typography weight="regular" size="subheadline2" color="secondary">
            Less
          </Typography>
          <div className="flex items-center gap-1">
            <div className="bg-darkGray-2 h-6 w-6 rounded-[2px]" />
            <div className="h-6 w-6 rounded-[2px] bg-[#23504A]" />
            <div className="h-6 w-6 rounded-[2px] bg-[#2D8F71]" />
            <div className="h-6 w-6 rounded-[2px] bg-[#34D399]" />
          </div>
          <Typography weight="regular" size="subheadline2" color="secondary">
            More
          </Typography>
        </div>
      </div>
    </div>
  );
};
