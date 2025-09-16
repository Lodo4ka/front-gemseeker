import { clsx } from 'clsx';
import { tooltipSizes } from '../../../config/pnl';
import { $pnl } from 'entities/user';
import { useUnit } from 'effector-react';
import { $tooltip, initChart } from '../../../model/pnl/chart';
import { memo, useEffect } from 'react';
import { Typography } from 'shared/ui/typography';
import { formatter } from 'shared/lib/formatter';
import { $isChecked } from '../../../model/checkbox';

export const PnlChart = memo(() => {
  const [tooltip, pnl, isSolana] = useUnit([$tooltip, $pnl, $isChecked]);
  const render = useUnit(initChart);

  useEffect(() => {
    if (pnl) render(document.getElementById('pnl'));
  }, [pnl]);

  return (
    <div className="relative h-[312px] w-full border-b-[0.5px] border-b-[#282E3E] pb-1">
      {pnl?.pnl_by_days.length === 0 && (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Typography size="headline3" weight="medium" color="secondary">
            No data for this period
          </Typography>
        </div>
      )}
      {pnl?.pnl_by_days.length !== 0 && <div id="pnl" className="h-full w-full" />}
      <div
        style={{
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          width: tooltipSizes.width,
          height: tooltipSizes.height,
          display: tooltip.display ? 'flex' : 'none',
        }}
        className={clsx('bg-darkGray-3 absolute z-[10] flex flex-col rounded-lg p-2')}>
        <Typography size="captain1" weight="regular" color="secondary">
          Pnl
        </Typography>
        {!isSolana ? (
          <Typography size="subheadline2">{formatter.number.uiDefaultWithDollar(tooltip.pnl)}</Typography>
        ) : (
          <Typography size="subheadline2" icon={{ name: 'solana', size: 18, position: 'left' }}>
            {formatter.number.uiDefault(tooltip.sol_value)}
          </Typography>
        )}
        <Typography color="secondary" size="subheadline2">
          {formatter.number.uiDefault(tooltip.percentage)}%
        </Typography>
      </div>
    </div>
  );
});
